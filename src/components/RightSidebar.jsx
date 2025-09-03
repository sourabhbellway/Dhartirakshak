import React from 'react';
import { FaStar, FaBookmark, FaShare } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'
import advertisementPublicController from '../controllers/advertisementPublicController.js'
import categoryPublicController from '../controllers/categoryPublicController.js'

const RightSidebar = () => {
  const location = useLocation()
  const [ads, setAds] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        const [adsRes, catRes] = await Promise.all([
          advertisementPublicController.list(),
          categoryPublicController.list()
        ])
        const adsData = adsRes?.data || adsRes || []
        const catData = catRes?.data || catRes || []
        setAds(Array.isArray(adsData) ? adsData : [])
        setCategories(Array.isArray(catData) ? catData : [])
      } catch (e) {
        setError('Failed to load advertisements')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const normalize = (s) => (s || '').toString().trim().replace(/^\/+|\/+$/g, '')
  const currentPath = normalize(location.pathname) // e.g., 'blogs'

  const getCategoryName = (c) => c?.category || c?.name || c?.title || ''
  const categoryIdToName = React.useMemo(() => {
    const map = new Map()
    categories.forEach(c => {
      const id = c.id || c._id
      const name = getCategoryName(c)
      if (id && name) map.set(String(id), name)
    })
    return map
  }, [categories])

  const getValidUrl = (maybeUrl) => {
    if (!maybeUrl || typeof maybeUrl !== 'string') return null
    try {
      const url = new URL(maybeUrl)
      return url.href
    } catch (_) {
      return null
    }
  }

  const resolveAdTargetUrl = (ad) => {
    return getValidUrl(ad?.link) || getValidUrl(ad?.company) || null
  }

  const extractHostname = (urlString) => {
    try {
      const u = new URL(urlString)
      return u.hostname.replace(/^www\./, '')
    } catch (_) {
      return ''
    }
  }

  const filteredAds = React.useMemo(() => {
    // On home route ("/"), show only ads with no category_name
    if (!currentPath) return ads.filter(ad => ad?.category_name == null)
    const currentLower = normalize(currentPath).toLowerCase()
    return ads.filter(ad => {
      // Prefer server-provided category_name if present
      if (ad.category_name) {
        return normalize(ad.category_name).toLowerCase() === currentLower
      }
      // Fallback to mapping via category_id
      const catId = ad.category_id || ad.categoryId || ad.category
      const catName = categoryIdToName.get(String(catId)) || ''
      return normalize(catName).toLowerCase() === currentLower
    })
  }, [ads, currentPath, categoryIdToName])

  if (loading) {
    return (
      <div className="w-full h-full bg-white/95 backdrop-blur-sm border-l lg:border-l border-t lg:border-t-0 border-gray-200 p-3 sm:p-4">
        <div className="text-sm text-gray-500">Loading ads...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white/95 backdrop-blur-sm border-l lg:border-l border-t lg:border-t-0 border-gray-200 p-3 sm:p-4">
        <div className="text-sm text-rose-600">{error}</div>
      </div>
    )
  }

  const advertisements = filteredAds.length ? filteredAds : []

  const formatDate = (iso) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString()
    } catch (_) {
      return ''
    }
  }

  return (
    <div className="w-full h-full bg-white/95 backdrop-blur-sm border-l lg:border-l border-t lg:border-t-0 border-gray-200 p-3 sm:p-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-dark-green">Featured & Ads</h2>
        <p className="text-xs sm:text-sm text-gray-600">Discover & Learn</p>
      </div>

      {/* Advertisements Section - show only if there are matching ads for this route */}
      {advertisements.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Sponsored Content
          </h3>
          <div className="space-y-4">
            {advertisements.map((ad) => {
              const targetUrl = resolveAdTargetUrl(ad)
              const companyUrl = getValidUrl(ad?.company)
              const companyHost = companyUrl ? extractHostname(companyUrl) : (ad?.company || '')
              return (
                <div key={ad.id || ad._id} className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg p-3 sm:p-3 border border-green-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3">
                    {ad.image && (
                      targetUrl ? (
                        <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                          <img src={ad.image} alt={ad.title || 'ad'} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-green-200" />
                        </a>
                      ) : (
                        <img src={ad.image} alt={ad.title || 'ad'} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-green-200 shrink-0" />
                      )
                    )}
                    <div className="flex-1 min-w-0">
                      {ad.title ? (
                        targetUrl ? (
                          <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-dark-green text-sm mb-1 line-clamp-2 block">
                            {ad.title}
                          </a>
                        ) : (
                          <h4 className="font-semibold text-dark-green text-sm mb-1 line-clamp-2">{ad.title}</h4>
                        )
                      ) : null}
                      {ad.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-3 break-words">{ad.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] text-gray-600 truncate">
                          {companyUrl ? (
                            <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-dark-green underline">
                              {companyHost}
                            </a>
                          ) : (
                            companyHost || null
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 ml-2 whitespace-nowrap">
                          {formatDate(ad.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {targetUrl && (
                          <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-dark-green text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors text-center">
                            Visit
                          </a>
                        )}
                        <button className="p-2 text-gray-500 hover:text-dark-green transition-colors">
                          <FaBookmark />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-dark-green transition-colors">
                          <FaShare />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

  
   
    </div>
  );
};

export default RightSidebar;
