import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import adminBanner from '../controllers/adminBannerController.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { toast } from 'react-toastify'

const Banners = () => {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewSrc, setPreviewSrc] = useState(null)
  const [openCreate, setOpenCreate] = useState(false)
  const [createValues, setCreateValues] = useState({ title: '', author: '', heading: '', description: '', image: null })

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const res = await adminBanner.list(token)
      const data = res?.data || []
      setRows(data)
    } catch (e) {
      setError('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'author', title: 'Author' },
    { key: 'heading', title: 'Heading' },
    { key: 'image', title: 'Image', render: (val) => (
      <button onClick={() => setPreviewSrc(val)} className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-900 hover:bg-emerald-200">Preview</button>
    ) },
    { key: 'is_active', title: 'Status', render: (val) => (
      <span className={`px-3 py-1 rounded-full text-xs ${val ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>{val ? 'Active' : 'Inactive'}</span>
    ) },
    { key: 'created_at', title: 'Created' },
  ]

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return
    try {
      await adminBanner.remove(token, id)
      toast.success('Banner deleted')
      fetchData()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  const handleActivate = async (id) => {
    try {
      await adminBanner.activate(token, id)
      toast.success('Activated')
      fetchData()
    } catch (e) {
      toast.error('Activate failed')
    }
  }

  const handleDeactivate = async (id) => {
    try {
      await adminBanner.deactivate(token, id)
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!createValues.title || !createValues.image) {
      toast.error('Title and Image are required')
      return
    }
    try {
      await adminBanner.create(token, createValues)
      toast.success('Banner created')
      setOpenCreate(false)
      setCreateValues({ title: '', author: '', heading: '', description: '', image: null })
      fetchData()
    } catch (e) {
      toast.error('Create failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-dark-green text-xl font-semibold">Banners</h2>
        <button onClick={() => setOpenCreate(true)} className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm">Create Banner</button>
      </div>

      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button onClick={() => handleActivate(row.id)} className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white hover:bg-emerald-700">Activate</button>
            <button onClick={() => handleDeactivate(row.id)} className="px-3 py-1 rounded-full text-xs bg-amber-500 text-white hover:bg-amber-600">Deactivate</button>
            <button onClick={() => handleDelete(row.id)} className="px-3 py-1 rounded-full text-xs bg-rose-600 text-white hover:bg-rose-700">Delete</button>
          </div>
        )}
      />

      {previewSrc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewSrc(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-dark-green text-lg font-semibold">Image Preview</h3>
              <button 
                onClick={() => setPreviewSrc(null)} 
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center">
                <img src={previewSrc} alt="preview" className="w-full h-auto rounded-xl max-h-[60vh] object-contain mx-auto" />
              </div>
            </div>
            
            {/* Footer - Fixed */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button 
                onClick={() => setPreviewSrc(null)} 
                className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpenCreate(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-dark-green text-lg font-semibold">Create Banner</h3>
              <button 
                onClick={() => setOpenCreate(false)} 
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5">
              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={createValues.title} onChange={handleCreateChange} required />
                <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="author" placeholder="Author" value={createValues.author} onChange={handleCreateChange} />
                <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="heading" placeholder="Heading" value={createValues.heading} onChange={handleCreateChange} />
                <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={createValues.description} onChange={handleCreateChange} rows={3} />
                <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="image" type="file" accept="image/*" onChange={handleCreateChange} required />
              </form>
            </div>
            
            {/* Footer - Fixed */}
            <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => setOpenCreate(false)} 
                className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                onClick={handleCreateSubmit}
                className="px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Banners
