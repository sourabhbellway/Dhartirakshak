import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import adminTrendingNews from '../controllers/adminTrendingNewsController.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { toast } from 'react-toastify'
import FileDropzone from '../components/FileDropzone.jsx'

const TrendingNews = () => {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(null) // { id, currentImage }
  const [openDescription, setOpenDescription] = useState(null)
  const [createValues, setCreateValues] = useState({ title: '', description: '', image: null })
  const [updateValues, setUpdateValues] = useState({ title: '', description: '', image: null })

  const resolveId = (row) => row?.id || row?._id || row?.trending_news_id || row?.news_id || row?.uuid

  const handleToggleTrending = async (row) => {
    const id = resolveId(row)
    const current = !!row.is_trending
    const next = !current
    // Optimistic update
    setRows(prev => prev.map(r => (resolveId(r) === id ? { ...r, is_trending: next } : r)))
    try {
      if (next) {
        await adminTrendingNews.markTrending(token, id)
        toast.success('Marked as trending')
      } else {
        await adminTrendingNews.unmarkTrending(token, id)
        toast.success('Unmarked trending')
      }
      // Refresh in background to stay in sync
      fetchData()
    } catch (e) {
      // Revert on failure
      setRows(prev => prev.map(r => (resolveId(r) === id ? { ...r, is_trending: current } : r)))
      toast.error('Update trending failed')
    }
  }

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const res = await adminTrendingNews.list(token)
      const data = res?.data || []
      setRows(data)
      try {
        if (Array.isArray(data) && data.length > 0) {
          // Debug: show available keys once
          // eslint-disable-next-line no-console
          console.debug('TrendingNews rows sample keys:', Object.keys(data[0]))
        }
      } catch {}
    } catch (e) {
      setError('Failed to load trending news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'is_trending', title: 'Trending', render: (val, row) => (
      <button
        type="button"
        role="switch"
        aria-checked={!!row.is_trending}
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors  ${row.is_trending ? 'bg-emerald-800' : 'bg-gray-300'}`}
        onClick={() => handleToggleTrending(row)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${row.is_trending ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </button>
    ) },
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
    { key: 'is_active', title: 'Status', render: (val) => (
      <span className={`px-3 py-1 rounded-full text-xs ${val ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>{val ? 'Active' : 'Inactive'}</span>
    ) },
    { key: 'created_at', title: 'Created' },
  ]

  const handleDelete = async (id) => {
    if (!confirm('Delete this trending news?')) return
    try {
      await adminTrendingNews.remove(token, id)
      toast.success('Deleted')
      fetchData()
    } catch (e) { toast.error('Delete failed') }
  }

  const handleActivate = async (id) => {
    try { await adminTrendingNews.activate(token, id); toast.success('Activated'); fetchData() } catch { toast.error('Activate failed') }
  }
  const handleDeactivate = async (id) => {
    try { await adminTrendingNews.deactivate(token, id); toast.success('Deactivated'); fetchData() } catch { toast.error('Deactivate failed') }
  }

  const handleCreateChange = (fileOrEvent) => {
    if (fileOrEvent?.target) {
      const { name, value } = fileOrEvent.target
      setCreateValues(v => ({ ...v, [name]: value }))
    } else {
      setCreateValues(v => ({ ...v, image: fileOrEvent }))
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!createValues.title || !createValues.image) { toast.error('Title and Image are required'); return }
    try { await adminTrendingNews.create(token, createValues); toast.success('Created'); setOpenCreate(false); setCreateValues({ title: '', description: '', image: null }); fetchData() } catch { toast.error('Create failed') }
  }

  const handleOpenUpdate = (row) => {
    setUpdateValues({ title: row.title || '', description: row.description || '', image: null })
    const rid = resolveId(row)
    // eslint-disable-next-line no-console
    // console.log('Open update for row id:', rid, 'row:', row)
    setOpenUpdate({ id: rid, currentImage: row.image })
  }
  const handleUpdateChange = (fileOrEvent) => {
    if (fileOrEvent?.target) {
      const { name, value } = fileOrEvent.target
      setUpdateValues(v => ({ ...v, [name]: value }))
    } else {
      setUpdateValues(v => ({ ...v, image: fileOrEvent }))
    }
  }
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!updateValues.title) { toast.error('Title is required'); return }
    if (!openUpdate?.id) { toast.error('Invalid record id'); return }
    try {
      // eslint-disable-next-line no-console
      // console.log('Submitting update for id:', openUpdate.id)
      await adminTrendingNews.update(token, openUpdate.id, {
        title: updateValues.title,
        description: updateValues.description,
        image: updateValues.image,
      })
      toast.success('Updated')
      setOpenUpdate(null)
      setUpdateValues({ title: '', description: '', image: null })
      fetchData()
    } catch {
      toast.error('Update failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-dark-green text-xl font-semibold">Trending News</h2>
        <button onClick={() => setOpenCreate(true)} className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm">Create News</button>
      </div>

      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}

      <DataTable columns={columns} data={rows} loading={loading} actions={(row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenUpdate(row)} className="px-3 py-1 rounded-full text-xs bg-blue-600 text-white hover:bg-blue-700">Update</button>
          {row.is_active ? (
            <button onClick={() => handleDeactivate(resolveId(row))} className="px-3 py-1 rounded-full text-xs bg-amber-500 text-white hover:bg-amber-600">Deactivate</button>
          ) : (
            <button onClick={() => handleActivate(resolveId(row))} className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white hover:bg-emerald-700">Activate</button>
          )}
          <button onClick={() => handleDelete(resolveId(row))} className="px-3 py-1 rounded-full text-xs bg-rose-600 text-white hover:bg-rose-700">Delete</button>
        </div>
      )} />

      {openCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenCreate(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Create Trending News</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={createValues.title} onChange={handleCreateChange} required />
              <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={createValues.description} onChange={handleCreateChange} />
              <FileDropzone label="Image" accept="image/*" value={createValues.image} onChange={handleCreateChange} required heightClass="h-44" />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenCreate(false)} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-emerald-700 text-white">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openUpdate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenUpdate(null)}>
          <div className="bg-white rounded-2xl p-5 max-w-2xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Update Trending News</h3>
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
                <FileDropzone label="Choose Image" accept="image/*" value={updateValues.image} onChange={handleUpdateChange} heightClass="h-32" />
              </div>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <input className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="title" placeholder="Title" value={updateValues.title} onChange={handleUpdateChange} required />
              <textarea className="w-full border border-emerald-200 rounded-lg p-2 text-sm" name="description" placeholder="Description" value={updateValues.description} onChange={handleUpdateChange} />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenUpdate(null)} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-blue-600 text-white">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openDescription && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenDescription(null)}>
          <div className="bg-white rounded-2xl p-5 max-w-2xl w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Trending News Details</h3>
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{openDescription.description || '-'}</p>
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

export default TrendingNews



