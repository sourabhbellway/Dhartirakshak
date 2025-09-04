import React, { useEffect, useState } from 'react'
import epaperPublic from '../controllers/epaperPublicController.js'
import { BASE_URL } from '../config.js'

const EPapers = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const res = await epaperPublic.list()
      const data = res?.data || res || []
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load e-papers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const fullUrl = (path) => {
    if (!path) return null
    const raw = String(path)
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
    const base = (BASE_URL || '').replace(/\/$/, '')
    const normalized = raw.replace(/\\/g, '/').replace(/^\/+/, '')
    return `${base}/${normalized}`
  }

  return (
    <div className="bg-white rounded-xl p-4">
      <h1 className="text-xl font-semibold text-emerald-900 mb-3">E-Papers</h1>
      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded mb-3">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Publish Date</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id || row._id}>
                  <td className="px-3 py-2">{row.publish_date ? new Date(row.publish_date).toISOString().slice(0,10) : '-'}</td>
                  <td className="px-3 py-2">
                    {row?.pdf ? (
                      <div className="flex items-center gap-2">
                        <a href={fullUrl(row.pdf)} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full text-xs bg-sky-600 text-white hover:bg-sky-700">Preview</a>
                        <a href={fullUrl(row.pdf)} target="_blank" rel="noopener noreferrer" download className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white hover:bg-emerald-700">Download</a>
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-700">No PDF</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EPapers
