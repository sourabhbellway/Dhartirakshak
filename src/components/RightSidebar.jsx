import React from 'react';
import { FaStar, FaTimes, FaFire } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'
import advertisementPublicController from '../controllers/advertisementPublicController.js'
import categoryPublicController from '../controllers/categoryPublicController.js'
import newsPublicController from '../controllers/newsPublicController.js'

const RightSidebar = () => {
  const location = useLocation()
  const [ads, setAds] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [trending, setTrending] = React.useState([])
  const [expandedTrending, setExpandedTrending] = React.useState(() => new Set())
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [dismissedIds, setDismissedIds] = React.useState(() => new Set())

  React.useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        const [adsRes, catRes, trendRes] = await Promise.all([
          advertisementPublicController.list(),
          categoryPublicController.list(),
          newsPublicController.listTrending()
        ])
        const adsData = adsRes?.data || adsRes || []
        const catData = catRes?.data || catRes || []
        const trendData = trendRes?.data || trendRes || []
        setAds(Array.isArray(adsData) ? adsData : [])
        setCategories(Array.isArray(catData) ? catData : [])
        setTrending(Array.isArray(trendData) ? trendData : [])
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
    return getValidUrl(ad?.link) || null
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

  const advertisements = (filteredAds.length ? filteredAds : []).filter(ad => !dismissedIds.has(String(ad.id || ad._id)))

  const formatDate = (iso) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString()
    } catch (_) {
      return ''
    }
  }

  const toggleTrendingExpand = (key) => {
    setExpandedTrending(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

  return (
    <div className="w-full h-full bg-gray-50  border-l lg:border-l border-t lg:border-t-0 border-gray-200 p-3 sm:p-4">
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
              const companyHost = ad?.company || ''
              return (
                <div key={ad.id || ad._id} className="relative bg-white rounded-lg p-3 sm:p-3 border border-gray-200 hover:shadow-md transition-all duration-200">
                  {/* Dismiss (X) */}
                  <button
                    aria-label="Dismiss ad"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setDismissedIds(prev => new Set(prev).add(String(ad.id || ad._id)))}
                  >
                    <FaTimes />
                  </button>
                  {/* Ad badge */}
                  <div className="absolute -top-2 left-3 bg-yellow-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow animate-pulse">Ad</div>
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
                          <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 block hover:underline">
                            {ad.title}
                          </a>
                        ) : (
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{ad.title}</h4>
                        )
                      ) : null}
                      {ad.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-3 break-words">{ad.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] text-gray-600 truncate">
                          {companyHost || null}
                        </div>
                        {targetUrl && (
                          <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-[11px] text-dark-green hover:underline whitespace-nowrap">Visit site</a>
                        )}
                      </div>
                      {/* footer */}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Sponsored</span>
                        <span className="text-[10px] text-gray-400">{formatDate(ad.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trending News */}
      {Array.isArray(trending) && trending.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Trending News</h3>
          <div className="space-y-3">
            {trending.slice(0, 6).map((item, idx) => (
              <article key={item.id || item._id || idx} className="relative bg-white rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                <div className="absolute top-1 right-1 flex items-center gap-1 bg-rose-100 text-rose-700 text-[9px] px-2 py-0.5 rounded-full border border-red-200 shadow-sm animate-pulse">
                  <FaFire className="text-rose-500" />
                  <span className="font-semibold ">Trending Now</span>
                </div>
                <div className="flex items-start gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.title || 'trending'} className="w-16 h-16 object-cover rounded-md border" />
                  ) : (
                    <div className="w-16 h-16 rounded-md border bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
                  )}
                  <div className="flex-1 min-w-0">
                    {item.title && (
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{item.title}</h4>
                    )}
                    {(() => {
                      const key = item.id || item._id || idx
                      const isExpanded = expandedTrending.has(key)
                      return item.description ? (
                        <>
                          <p className={`text-xs text-gray-600 break-words ${isExpanded ? '' : 'line-clamp-3'}`}>{item.description}</p>
                          <button
                            type="button"
                            onClick={() => toggleTrendingExpand(key)}
                            className="mt-1 text-[11px] text-dark-green hover:underline"
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        </>
                      ) : null
                    })()}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
 
    </div>
  );
};

export default RightSidebar;
