import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import adminResearch from '../controllers/adminResearchController.js'
import DataTable from '../components/DataTable.jsx'
import { toast } from 'react-toastify'

const Research = () => {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState('approved') // 'approved' | 'pending'
  const [approvedRows, setApprovedRows] = useState([])
  const [pendingRows, setPendingRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openPreview, setOpenPreview] = useState(null) // row or null

  const fetchApproved = async () => {
    try {
      const res = await adminResearch.listApproved(token)
      setApprovedRows(res?.data || res || [])
    } catch (e) {
      toast.error('Failed to load approved research')
    }
  }

  const fetchPending = async () => {
    try {
      const res = await adminResearch.listPending(token)
      setPendingRows(res?.data || res || [])
    } catch (e) {
      toast.error('Failed to load pending research')
    }
  }

  const fetchAll = async () => {
    setLoading(true); setError('')
    await Promise.all([fetchApproved(), fetchPending()])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  // Auto-fetch when switching tabs
  useEffect(() => {
    if (activeTab === 'approved') {
      fetchApproved()
    } else if (activeTab === 'pending') {
      fetchPending()
    }
  }, [activeTab])

  const columns = useMemo(() => ([
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'type', title: 'Type' },
    { key: 'image', title: 'Image', render: (val, row) => (
      val ? <img src={val} alt={row.title || 'image'} className="h-12 w-12 object-cover rounded border border-gray-200" /> : <span className="text-xs text-gray-500">-</span>
    ) },
    { key: 'images', title: 'Images', render: (val, row) => {
      const arr = Array.isArray(val) ? val : []
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{arr.length}</span>
          {arr.length > 0 && (
            <button type="button" className="px-2 py-1 rounded-full text-xs bg-emerald-600 text-white" onClick={() => setOpenPreview(row)}>Preview</button>
          )}
        </div>
      )
    } },
    { key: 'approved_at', title: 'Approved At', render: (val) => val ? new Date(val).toLocaleString() : '-' },
    { key: 'approved_by', title: 'Approved By', render: (val) => val ? String(val) : '-' },
    { key: 'created_at', title: 'Created' },
  ]), [])

  const handleApprove = async (row) => {
    const id = row.id || row._id
    try { await adminResearch.approve(token, id); toast.success('Approved'); fetchAll() } catch { toast.error('Approve failed') }
  }

  const handleReject = async (row) => {
    const id = row.id || row._id
    try { await adminResearch.reject(token, id); toast.success('Rejected'); fetchAll() } catch { toast.error('Reject failed') }
  }

  const rows = activeTab === 'approved' ? approvedRows : pendingRows

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-dark-green text-xl font-semibold">Research</h2>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setActiveTab('approved')} className={`px-4 py-2 rounded-full text-sm ${activeTab === 'approved' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'}`}>Approved</button>
        <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 rounded-full text-sm ${activeTab === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900'}`}>Pending</button>
      </div>

      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}

      <DataTable
        columns={[
          ...columns,
          activeTab === 'approved' ? { key: 'status', title: 'Status', render: () => (<span className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white">Approved</span>) } : { key: 'status', title: 'Status', render: () => (<span className="px-3 py-1 rounded-full text-xs bg-amber-500 text-white">Pending</span>) },
        ]}
        data={rows}
        loading={loading}
        actions={(row) => (
          activeTab === 'approved' ? null : (
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-full text-xs bg-emerald-700 text-white" onClick={() => handleApprove(row)}>Approve</button>
              <button className="px-3 py-1 rounded-full text-xs bg-rose-600 text-white" onClick={() => handleReject(row)}>Reject</button>
            </div>
          )
        )}
      />

      {openPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setOpenPreview(null)}>
          <div className="bg-white rounded-2xl p-5 max-w-3xl w-[92%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dark-green text-lg font-semibold mb-3">Images Preview</h3>
            <div className="space-y-4">
              {openPreview.image && (
                <div>
                  <div className="text-sm text-gray-700 mb-2">Main Image</div>
                  <img src={openPreview.image} alt="main" className="w-full max-h-80 object-contain rounded border border-gray-200" />
                </div>
              )}
              <div>
                <div className="text-sm text-gray-700 mb-2">Gallery Images</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(Array.isArray(openPreview.images) ? openPreview.images : []).map((src, idx) => (
                    <img key={idx} src={src} alt={`img-${idx}`} className="h-28 w-full object-cover rounded border border-gray-200" />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right mt-4">
              <button onClick={() => setOpenPreview(null)} className="px-4 py-2 rounded-full bg-emerald-600 text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Research