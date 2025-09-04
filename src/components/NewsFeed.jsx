import React, { useState, useEffect } from 'react';
import { FaEye, FaClock } from 'react-icons/fa';
import newsPublicController from '../controllers/newsPublicController.js'

const NewsFeed = () => {
  const [newsArticles, setNewsArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        const res = await newsPublicController.listAgricultureNews()
        const data = res?.data || res || []
        const parsed = Array.isArray(data) ? data : []
        setNewsArticles(parsed)
      } catch (e) {
        setError('Failed to load news')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // UI is read-only per requirements

  return (
    <div className="w-full h-full bg-gray-50 p-3 sm:p-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-green mb-1 sm:mb-2">Latest News & Updates</h2>
        <p className="text-sm sm:text-base text-gray-600">Stay informed with the latest farming news, government schemes, and expert insights</p>
      </div>

      {/* Status states */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-sm text-gray-500">Loading news...</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-rose-600">{error}</div>
      )}

      {/* News Articles */}
      <div className="space-y-4 sm:space-y-6">
        {newsArticles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
            {/* Article Header */}
            <div className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                {article.image ? (
                  <img src={article.image} alt={article.title || 'news'} className="w-full sm:w-24 sm:h-24 h-40 object-cover rounded-md border" />
                ) : (
                  <div className="w-full sm:w-24 sm:h-24 h-40 rounded-md border bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 line-clamp-2">{article.title}</h3>
                  {article.heading && (
                    <p className="text-[13px] sm:text-sm text-gray-700 mb-2 line-clamp-1">{article.heading}</p>
                  )}
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 break-words">
                    {article.description}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEye className="text-gray-400" />
                        <span>{article.read_time || '-'}</span>
                      </div>
                    </div>
                  </div>
                  {/* End minimal meta */}
                </div>
              </div>
            </div>

          </article>
        ))}
      </div>

    </div>
  );
};

export default NewsFeed;
