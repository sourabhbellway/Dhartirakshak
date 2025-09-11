import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import researchPublicController from '../controllers/researchPublicController.js'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'
import { useDropzone } from 'react-dropzone'

const ResearchCreate = () => {
  const { isAuthenticated, token } = useUserAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('agriculture')
  const [image, setImage] = useState(null)
  const [images, setImages] = useState([])
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handlePickImages = useCallback((files) => {
    const incoming = Array.isArray(files) ? files : []
    setImages((prev) => {
      const merged = [...prev, ...incoming]
      const unique = []
      const seen = new Set()
      for (const f of merged) {
        const key = `${f.name}|${f.size}|${f.lastModified}`
        if (!seen.has(key)) { seen.add(key); unique.push(f) }
      }
      return unique
    })
  }, [])

  const onDropSingle = useCallback((acceptedFiles) => {
    setImage(acceptedFiles?.[0] || null)
  }, [])

  const { getRootProps: getRootSingle, getInputProps: getInputSingle, isDragActive: isDragSingle } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: onDropSingle,
  })

  const onDropMultiple = useCallback((acceptedFiles) => {
    handlePickImages(acceptedFiles || [])
  }, [handlePickImages])

  const { getRootProps: getRootMulti, getInputProps: getInputMulti, isDragActive: isDragMulti } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    onDrop: onDropMultiple,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/', { replace: false, state: { openAuth: true, tab: 'signin' } })
      return
    }
    setSubmitting(true); setError('')
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('type', type)
      if (image) formData.append('image', image)
      images.forEach((file, index) => formData.append(`images[${index + 1}]`, file))
      await researchPublicController.create(formData, token)
      navigate('/research')
    } catch (e) {
      setError('Failed to create research')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-dark-green">Create Research</h1>
      </div>
      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2 text-sm" placeholder="Your Research Title" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">Type</label>
          <input value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2 text-sm" placeholder="agriculture" />
        </div>
      </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2 text-sm" placeholder="Write detailed description" required />
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-1 text-sm text-gray-700 font-medium">Thumbnail (Main Image)</div>
            <div {...getRootSingle()} className={`flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${isDragSingle ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 bg-white'}`}>
              <input {...getInputSingle()} />
              {image ? (
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">{image.name}</div>
                  <div className="text-xs text-gray-500 mb-3">{Math.round((image.size || 0) / 1024)} KB</div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="px-3 py-1.5 rounded-full text-xs bg-emerald-600 text-white" onClick={(e) => { e.stopPropagation(); setImage(null) }}>Remove</button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl mb-2">📤</div>
                  <div className="text-sm text-gray-700">Drag & drop to upload</div>
                  <div className="text-xs text-gray-500 mb-3">or click to browse</div>
                  <div className="px-3 py-1.5 inline-block rounded-full text-xs bg-emerald-600 text-white">Browse Files</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm text-gray-700 font-medium">Blog Images (Gallery)</div>
            <div {...getRootMulti()} className={`flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${isDragMulti ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 bg-white'}`}>
              <input {...getInputMulti()} />
              {Array.isArray(images) && images.length > 0 ? (
                <div className="w-full">
                  <div className="text-sm text-gray-700 mb-2 text-center">{images.length} file{images.length > 1 ? 's' : ''} selected</div>
                  <ul className="max-h-28 overflow-auto text-xs text-gray-600 mb-3 space-y-1">
                    {images.map((file, idx) => (
                      <li key={`${file.name}-${file.size}-${file.lastModified}-${idx}`} className="flex items-center justify-between bg-gray-50 rounded-md px-2 py-1">
                        <span className="truncate mr-2">{file.name}</span>
                        <button type="button" className="text-rose-600" onClick={(e) => {
                          e.stopPropagation()
                          setImages((prev) => prev.filter((_, i) => i !== idx))
                        }}>Remove</button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-center gap-2">
                    <button type="button" className="px-3 py-1.5 rounded-full text-xs bg-rose-600 text-white" onClick={(e) => { e.stopPropagation(); setImages([]) }}>Clear all</button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl mb-2">📤</div>
                  <div className="text-sm text-gray-700">Drag & drop multiple images</div>
                  <div className="text-xs text-gray-500 mb-3">or click to browse</div>
                  <div className="px-3 py-1.5 inline-block rounded-full text-xs bg-emerald-600 text-white">Browse Files</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded-full bg-dark-green text-white disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ResearchCreate
