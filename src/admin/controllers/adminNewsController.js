import axios from 'axios'
import { BASE_URL } from '../../config.js'

const adminNews = {
  list: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/trending-news`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  create: async (token, values) => {
    try {
      const form = new FormData()
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          if (k === 'is_trending') {
            const coerced = v === true || v === 1 || v === '1' ? '1' : '0'
            form.append(k, coerced)
          } else {
            form.append(k, v)
          }
        }
      })
      const res = await axios.post(`${BASE_URL}/api/admin/trending-news`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    } catch (err) {
      const message = err?.response?.data?.message || 'Create failed'
      const errors = err?.response?.data?.errors
      const firstError = errors ? Object.values(errors)[0]?.[0] : null
      throw new Error(firstError || message)
    }
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
  }
}

export default adminNews
