import axios from 'axios'
import { BASE_URL } from '../../config.js'

const adminTrendingNews = {
  list: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/trending-news`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  update: async (token, id, values) => {
    const form = new FormData()
    const allowed = ['title', 'description', 'image']
    Object.entries(values || {}).forEach(([k, v]) => {
      if (allowed.includes(k) && v !== undefined && v !== null) form.append(k, v)
    })
    // Use method override to ensure file uploads are handled on backends that don't accept PUT multipart
    form.append('_method', 'PUT')
    const res = await axios.post(`${BASE_URL}/api/admin/trending-news/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  create: async (token, values) => {
    const form = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v)
    })
    const res = await axios.post(`${BASE_URL}/api/admin/trending-news`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  remove: async (token, id) => {
    const res = await axios.delete(`${BASE_URL}/api/admin/trending-news/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  activate: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/trending-news/${id}/activate`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  deactivate: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/trending-news/${id}/deactivate`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  markTrending: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/trending-news/${id}/mark-trending`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  unmarkTrending: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/trending-news/${id}/unmark-trending`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

export default adminTrendingNews



