import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import adminNews from '../controllers/adminNewsController.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { toast } from 'react-toastify'

const News = () => {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewSrc, setPreviewSrc] = useState(null)
  const [openCreate, setOpenCreate] = useState(false)
  const [createValues, setCreateValues] = useState({ title: '', description: '', image: null, is_trending: false })

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

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'description', title: 'Description' },
    { key: 'image', title: 'Image', render: (val) => (
      val ? (
        <button onClick={() => setPreviewSrc(val)} className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-900 hover:bg-emerald-200">Preview</button>
      ) : (
        <span className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-700">No Image</span>
      )
    ) },
    { key: 'is_trending', title: 'Trending', render: (val) => (
      <span className={`px-3 py-1 rounded-full text-xs ${val ? 'bg-fuchsia-600 text-white' : 'bg-gray-300 text-gray-800'}`}>{val ? 'Yes' : 'No'}</span>
    ) },
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
    const { name, value, files, type, checked } = e.target
    if (type === 'checkbox') {
      setCreateValues(v => ({ ...v, [name]: checked }))
    } else if (files) {
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
      const payload = { ...createValues, is_trending: createValues.is_trending ? 1 : 0 }
      await adminNews.create(token, payload)
      toast.success('News created')
      setOpenCreate(false)
      setCreateValues({ title: '', description: '', image: null, is_trending: false })
      fetchData()
    } catch (e) {
      toast.error(e.message || 'Create failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-dark-green text-xl font-semibold">Trending News</h2>
        <button onClick={() => setOpenCreate(true)} className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm">Create News</button>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setPreviewSrc(null)}>
          <div className="bg-white rounded-2xl p-3 max-w-3xl w-[90%]" onClick={(e) => e.stopPropagation()}>
            <img src={previewSrc} alt="preview" className="w-full h-auto rounded-xl" />
            <div className="text-right mt-3">
              <button onClick={() => setPreviewSrc(null)} className="px-4 py-1.5 rounded-full bg-emerald-600 text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {openCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenCreate(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Create News</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={createValues.title} onChange={handleCreateChange} required />
              <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={createValues.description} onChange={handleCreateChange} />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-emerald-900">
                  <input type="checkbox" name="is_trending" checked={createValues.is_trending} onChange={handleCreateChange} />
                  Trending
                </label>
              </div>
              <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="image" type="file" accept="image/*" onChange={handleCreateChange} required />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenCreate(false)} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-emerald-700 text-white">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default News
