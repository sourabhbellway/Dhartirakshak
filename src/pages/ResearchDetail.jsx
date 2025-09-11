import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import researchPublicController from '../controllers/researchPublicController.js'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'

const ResearchDetail = () => {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated } = useUserAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        const res = await researchPublicController.getById(id)
        const data = res?.data || res || null
        setItem(data)
      } catch (e) {
        setError('Failed to load research')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const handleLoginClick = () => {
    navigate('/', { replace: false, state: { openAuth: true, tab: 'signin' } })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded mb-3">{error}</div>}
      {!loading && !error && item && (
        <article>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h1>
          {item.image && (
            <img src={item.image} alt={item.title || 'research'} className="w-full max-h-[380px] object-cover rounded-lg border mb-4" />
          )}
          <p className="text-gray-800 whitespace-pre-line leading-7">{item.description}</p>
          {/* Gallery images if provided */}
          {Array.isArray(item.images) && item.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {item.images.map((img, i) => (
                <img key={`${img}-${i}`} src={img} alt={`image-${i}`} className="w-full h-32 object-cover rounded-md border" />
              ))}
            </div>
          )}
        </article>
      )}
    </div>
  )
}

export default ResearchDetail
