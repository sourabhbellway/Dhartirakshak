import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import adminNews from '../controllers/adminNewsController.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { toast } from 'react-toastify'
import FileDropzone from '../components/FileDropzone.jsx'

const News = () => {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewSrc, setPreviewSrc] = useState(null)
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(null) // { id, currentImage } or null
  const [openDescription, setOpenDescription] = useState(null)
  const [createValues, setCreateValues] = useState({ title: '', heading: '', description: '', image: null })
  const [updateValues, setUpdateValues] = useState({ title: '', heading: '', description: '', image: null })
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const res = await adminNews.list(token)
      const data = res?.data || []
      setRows(data)
    } catch (e) {
      setError('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    }
  }, [imagePreviewUrl])

  // Update image preview URL for update modal
  useEffect(() => {
    if (updateValues.image) {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(URL.createObjectURL(updateValues.image))
    } else if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(null)
    }
  }, [updateValues.image])

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'heading', title: 'Heading' },
    { key: 'description', title: 'Description', render: (val, row) => (
      <div className="max-w-xs">
        {val && val.length > 50 ? (
          <div>
            <p className="text-sm text-gray-700 line-clamp-2">{val.substring(0, 50)}...</p>
            <button onClick={() => setOpenDescription(row)} className="text-xs text-blue-600 hover:text-blue-800 underline">Read more</button>
          </div>
        ) : (
          <span className="text-sm text-gray-700">{val || '-'}</span>
        )}
      </div>
    ) },
    { key: 'read_time', title: 'Reads' },
  
    { key: 'is_active', title: 'Status', render: (val) => (
      <span className={`px-3 py-1 rounded-full text-xs ${val ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>{val ? 'Active' : 'Inactive'}</span>
    ) },
    { key: 'created_at', title: 'Created' },
  ]

  const handleDelete = async (id) => {
    if (!confirm('Delete this news item?')) return
    try {
      await adminNews.remove(token, id)
      toast.success('News deleted')
      fetchData()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  const handleActivate = async (id) => {
    try {
      await adminNews.activate(token, id)
      toast.success('Activated')
      fetchData()
    } catch (e) {
      toast.error('Activate failed')
    }
  }

  const handleDeactivate = async (id) => {
    try {
      await adminNews.deactivate(token, id)
      toast.success('Deactivated')
      fetchData()
    } catch (e) {
      toast.error('Deactivate failed')
    }
  }

  const handleCreateChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setCreateValues(v => ({ ...v, [name]: files[0] }))
    } else {
      setCreateValues(v => ({ ...v, [name]: value }))
    }
  }

  const handleOpenUpdate = (row) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(null)
    }
    setUpdateValues({
      title: row.title || '',
      heading: row.heading || '',
      description: row.description || '',
      image: null
    })
    setOpenUpdate({ id: row.id, currentImage: row.image })
  }

  const handleUpdateChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setUpdateValues(v => ({ ...v, [name]: files[0] }))
    } else {
      setUpdateValues(v => ({ ...v, [name]: value }))
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!updateValues.title || !updateValues.heading) {
      toast.error('Title and Heading are required')
      return
    }
    try {
      await adminNews.update(token, openUpdate.id, updateValues)
      toast.success('News updated')
      setOpenUpdate(null)
      setUpdateValues({ title: '', heading: '', description: '', image: null })
      if (imagePreviewUrl) { URL.revokeObjectURL(imagePreviewUrl); setImagePreviewUrl(null) }
      fetchData()
    } catch (e) {
      toast.error(e.message || 'Update failed')
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!createValues.title || !createValues.image) {
      toast.error('Title and Image are required')
      return
    }
    try {
      await adminNews.create(token, createValues)
      toast.success('News created')
      setOpenCreate(false)
      setCreateValues({ title: '', heading: '', description: '', image: null })
      fetchData()
    } catch (e) {
      toast.error(e.message || 'Create failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-dark-green text-xl font-semibold">Agriculture News</h2>
        <button onClick={() => setOpenCreate(true)} className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm">Create News</button>
      </div>

      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button onClick={() => handleOpenUpdate(row)} className="px-3 py-1 rounded-full text-xs bg-blue-600 text-white hover:bg-blue-700">Update</button>
            {row.is_active ? (
              <button onClick={() => handleDeactivate(row.id)} className="px-3 py-1 rounded-full text-xs bg-amber-500 text-white hover:bg-amber-600">Deactivate</button>
            ) : (
              <button onClick={() => handleActivate(row.id)} className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white hover:bg-emerald-700">Activate</button>
            )}
            <button onClick={() => handleDelete(row.id)} className="px-3 py-1 rounded-full text-xs bg-rose-600 text-white hover:bg-rose-700">Delete</button>
          </div>
        )}
      />

     

      {openCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenCreate(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Create News</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={createValues.title} onChange={handleCreateChange} required />
                <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="heading" placeholder="Heading" value={createValues.heading} onChange={handleCreateChange} required />
              </div>
              <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={createValues.description} onChange={handleCreateChange} />
              <FileDropzone label="Image" accept="image/*" value={createValues.image} onChange={(file) => setCreateValues(v => ({ ...v, image: file }))} required heightClass="h-44" />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenCreate(false)} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-emerald-700 text-white">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openUpdate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => {
          setOpenUpdate(null)
          if (imagePreviewUrl) { URL.revokeObjectURL(imagePreviewUrl); setImagePreviewUrl(null) }
        }}>
          <div className="bg-white rounded-2xl p-5 max-w-2xl w-[92%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Update News</h3>
            {/* Image Section */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {openUpdate.currentImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                  <div className="text-center">
                    <img src={openUpdate.currentImage} alt="Current" className="h-50 rounded-lg mx-auto border border-gray-200" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Image</label>
                <FileDropzone label="Choose Image" accept="image/*" value={updateValues.image} onChange={(file) => setUpdateValues(v => ({ ...v, image: file }))} heightClass="h-32" />
              </div>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={updateValues.title} onChange={handleUpdateChange} required />
                <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="heading" placeholder="Heading" value={updateValues.heading} onChange={handleUpdateChange} required />
              </div>
              <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={updateValues.description} onChange={handleUpdateChange} rows={3} />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => {
                  setOpenUpdate(null)
                  if (imagePreviewUrl) { URL.revokeObjectURL(imagePreviewUrl); setImagePreviewUrl(null) }
                }} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-blue-600 text-white">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openDescription && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenDescription(null)}>
          <div className="bg-white rounded-2xl p-5 max-w-2xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">News Details</h3>
            <div className="space-y-4">
              {openDescription.image && (
                <div className="text-center">
                  <img src={openDescription.image} alt={openDescription.title || 'news'} className="w-full max-w-md h-auto rounded-lg mx-auto" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-sm text-gray-900">{openDescription.title || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                  <p className="text-sm text-gray-900">{openDescription.heading || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{openDescription.description || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                  <p className="text-sm text-gray-900">{openDescription.read_time ? `${openDescription.read_time} min` : '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm text-gray-900">{openDescription.created_at ? new Date(openDescription.created_at).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs ${openDescription.is_active ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>{openDescription.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
            <div className="text-right mt-4">
              <button onClick={() => setOpenDescription(null)} className="px-4 py-2 rounded-full bg-emerald-600 text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default News
