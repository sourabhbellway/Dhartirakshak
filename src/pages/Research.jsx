import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import researchPublicController from '../controllers/researchPublicController.js'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'
import axios from 'axios'
import { BASE_URL } from '../config.js'

const Research = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, token } = useUserAuth()

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        // Load public research data without any authentication
        const res = await researchPublicController.listResearch()
        const data = res?.data || res || []
        setRows(Array.isArray(data) ? data : [])
      } catch (e) {
        setError('Failed to load research')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLoginClick = () => {
    navigate('/', { replace: false, state: { openAuth: true, tab: 'signin' } })
  }

  const goToDetail = (idOrIdx) => {
    navigate(`/research/${idOrIdx}`)
  }

  const goToCreate = () => {
    if (!isAuthenticated) { handleLoginClick(); return }
    navigate('/research/create')
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map((item, idx) => (
            <article key={item.id || item._id || idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="flex gap-3 p-3">
                {item.image ? (
                  <img src={item.image} alt={item.title || 'research'} className="w-28 h-28 object-cover rounded-md border" />
                ) : (
                  <div className="w-28 h-28 rounded-md border bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
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
    </div>
  )
}

export default Research
