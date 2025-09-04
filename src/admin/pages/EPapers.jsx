import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { toast } from 'react-toastify'
import epaperAdmin from '../controllers/epaperAdminController.js'

const EPapers = () => {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [createValues, setCreateValues] = useState({ pdf: null, publish_date: '' })

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const res = await epaperAdmin.list(token)
      const data = res?.data || res || []
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load e-papers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'publish_date', title: 'Publish Date', render: (val) => {
      if (!val) return '-'
      try { return new Date(val).toISOString().slice(0,10) } catch { return val }
    } },
    { key: 'pdf', title: 'PDF', render: (val) => val ? 'Available' : 'Missing' }
  ]

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!createValues.pdf || !createValues.publish_date) {
      toast.error('PDF and publish date are required')
      return
    }
    try {
      await epaperAdmin.create(token, createValues)
      toast.success('E-Paper uploaded')
      setOpenCreate(false)
      setCreateValues({ pdf: null, publish_date: '' })
      fetchData()
    } catch (e) {
      toast.error('Upload failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this e-paper?')) return
    try {
      await epaperAdmin.remove(token, id)
      toast.success('E-Paper deleted')
      fetchData()
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  const actions = (row) => (
    <div className="flex items-center gap-2">
      {row?.pdf && (
        <>
          <a href={row.pdf.startsWith('http') ? row.pdf : `https://dhartirakshak-backend.carnate.in/${row.pdf}`} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full text-xs bg-sky-600 text-white hover:bg-sky-700">Preview</a>
          <a href={row.pdf.startsWith('http') ? row.pdf : `https://dhartirakshak-backend.carnate.in/${row.pdf}`} download className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white hover:bg-emerald-700">Download</a>
        </>
      )}
      <button onClick={() => handleDelete(row.id)} className="px-3 py-1 rounded-full text-xs bg-rose-600 text-white hover:bg-rose-700">Delete</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-dark-green text-xl font-semibold">E-Papers</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenCreate(true)} className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm">Upload E-Paper</button>
        </div>
      </div>

      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}

      <DataTable columns={columns} data={rows} loading={loading} actions={actions} />

      {openCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenCreate(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-md w-[92%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Upload E-Paper</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Publish Date</label>
                <input type="date" className="w-full border border-emerald-200 rounded-lg p-2 text-sm" value={createValues.publish_date} onChange={(e) => setCreateValues(v => ({ ...v, publish_date: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">PDF</label>
                <input type="file" accept="application/pdf" className="w-full border border-emerald-200 rounded-lg p-2 text-sm" onChange={(e) => setCreateValues(v => ({ ...v, pdf: e.target.files?.[0] || null }))} required />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpenCreate(false)} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-900">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-full bg-emerald-700 text-white">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EPapers
