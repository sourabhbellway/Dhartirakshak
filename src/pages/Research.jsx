import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import researchPublicController from '../controllers/researchPublicController.js'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'

import { BASE_URL } from '../config.js'

const Research = () => {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated,  } = useUserAuth()

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        // Load public research data without any authentication
        const res = await researchPublicController.listResearch()
        const data = res?.data || res || []
        
        setRows(Array.isArray(data) ? data : [])
      } catch {
        setError('Failed to load research')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLoginClick = () => {
    navigate(location.pathname, { replace: false, state: { openAuth: true, tab: 'signin' } })
  }

  const goToDetail = (idOrIdx) => {
    navigate(`/research/${idOrIdx}`)
  }

  const goToCreate = () => {
    if (!isAuthenticated) { handleLoginClick(); return }
    navigate('/research/create')
  }

  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIdx = (page - 1) * pageSize
  const paged = rows.slice(startIdx, startIdx + pageSize)

  const goTo = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-dark-green">Research</h1>
        <button
          type="button"
          onClick={goToCreate}
          className="px-3 py-1.5 rounded-full text-sm bg-dark-green text-white hover:opacity-90"
        >
          Create Research
        </button>
      </div>

      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded mb-3">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1  gap-4">
          {paged.map((item, idx) => (
            <article key={item.id || item._id || idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="flex gap-3 p-3">
                {item.image ? (
                  <img src={item.image} alt={item.title || 'research'} className="w-28 h-28 object-cover rounded-md border" />
                ) : (
                  <div className="w-28 h-28 rounded-md border bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                  {/* Meta badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {item.created_at && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    )}
                    {item.type && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
                        {item.type}
                      </span>
                    )}
                  </div>
                  {/* Posted by */}
                  <p className="text-[13px] text-gray-700 mb-2">
                    <span className="italic capitalize text-dark-green font-semibold">Posted by: {item.author?.name || 'Public'}</span>
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-3 break-words">{item.description}</p>
                  <button
                    type="button"
                    onClick={() => goToDetail(item.id || item._id || idx)}
                    className="mt-2 text-sm text-emerald-700 hover:underline"
                  >
                    Read more
                  </button>
                </div>
              </div>
            </article>
          ))}
          {rows.length === 0 && (
            <div className="text-gray-600">No research found.</div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button onClick={() => goTo(page - 1)} disabled={page === 1} className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50">Prev</button>
        <div className="text-sm">Page {page} of {totalPages}</div>
        <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50">Next</button>
      </div>
    </div>
  )
}

export default Research
