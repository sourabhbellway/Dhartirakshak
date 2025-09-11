import React, { useEffect, useState } from 'react'
import epaperPublic from '../controllers/epaperPublicController.js'
import { BASE_URL } from '../config.js'
import mockup from '../assets/mockup.png'

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

  const downloadUrl = (id) => `${(BASE_URL || '').replace(/\/$/, '')}/api/all-epapers/${id}/download`

  return (
    <div className="bg-white rounded-xl p-4">
      <h1 className="text-xl font-semibold text-emerald-900 mb-4">E-Papers</h1>
      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded mb-3">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {rows.map((row) => {
            const id = row.id || row._id
            const viewHref = row?.pdf ? fullUrl(row.pdf) : null
            return (
              <article
                key={id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative group overflow-hidden rounded-t-xl">
                  <img
                    src={mockup}
                    alt="Dhartirakshak"
                    className="w-full  object-contain bg-gray-50 p-2 hover:scale-105 transition-all duration-300 ease-in-out"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-2 left-2 bg-dark-green text-white text-[10px] px-2 py-1 rounded-md">
                    Agriculture
                  </span>
                  {/* Download Icon */}
                  
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                  <div className='flex items-center justify-between'>
                  <h3 className="text-lg font-semibold text-emerald-900">Dhartirakshak </h3>
                    <a
                    href={downloadUrl(id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download"
                    className=" bottom-2 right-2 h-9 w-9 rounded-full bg-dark-green hover:brightness-110 flex items-center justify-center text-white shadow-md z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M12 3.75a.75.75 0 01.75.75v8.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0L7.72 11.28a.75.75 0 111.06-1.06l2.47 2.47V4.5a.75.75 0 01.75-.75z" />
                      <path d="M3.75 15.75a.75.75 0 01.75.75v1.5A2.25 2.25 0 006.75 20.25h10.5A2.25 2.25 0 0019.5 18v-1.5a.75.75 0 011.5 0V18a3.75 3.75 0 01-3.75 3.75H6.75A3.75 3.75 0 013 18v-1.5a.75.75 0 01.75-.75z" />
                    </svg>
                  </a>
                  </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {row.publish_date
                        ? new Date(row.publish_date).toISOString().slice(0, 10)
                        : "-"}
                    </p>

                    {/* Short Description */}
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      A glimpse into the latest updates and research from the agriculture
                      sector. Stay updated with Dhartirakshak editions.
                    </p>
                  </div>

                  {/* Action Row (kept minimal for clean look) */}
                  {viewHref && (
                    <div className="mt-4">
                      <a
                        href={viewHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                      >
                        Preview
                      </a>
                    </div>
                  )}
                </div>
              </article>
            
            )
          })}
          {rows.length === 0 && (
            <div className="text-gray-600">No e-papers found.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default EPapers
