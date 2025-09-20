import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaFire, FaCalendarAlt } from 'react-icons/fa';
import newsPublicController from '../controllers/newsPublicController.js';

const TrendingNewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await newsPublicController.listTrending();
        const data = res?.data || res || [];
        const articles = Array.isArray(data) ? data : [];
        const foundArticle = articles.find(art => (art.id || art._id) === parseInt(id));
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Trending article not found');
        }
      } catch (e) {
        setError('Failed to load trending article');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trending article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Trending Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested trending article could not be found.'}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-dark-green text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Image */}
          {article.image && (
            <div className="w-full h-64 sm:h-80 lg:h-96 relative">
              <img
                src={article.image}
                alt={article.title || 'trending news'}
                className="w-full h-full object-cover"
              />
              {/* Trending Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-rose-100 text-rose-700 text-sm px-3 py-1.5 rounded-full border border-red-200 shadow-lg">
                <FaFire className="text-rose-500" />
                <span className="font-semibold">Trending Now</span>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="p-6 sm:p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <span>{new Date(article.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              {article.read_time && (
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  <span>{article.read_time} read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaFire className="text-rose-500" />
                <span>Trending Article</span>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Article Heading */}
            {article.heading && (
              <h2 className="text-lg sm:text-xl text-gray-700 mb-6 font-medium">
                {article.heading}
              </h2>
            )}

            {/* Article Description */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.description}
              </div>
            </div>

            {/* Additional Content */}
            {article.content && (
              <div className="mt-8 prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </div>
              </div>
            )}

            {/* Article Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Published on {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-4 py-2 bg-dark-green text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TrendingNewsDetail;
