import axios from 'axios'
import { BASE_URL } from '../../config.js'

const adminNews = {
  list: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/newsagriculture`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  create: async (token, values) => {
    try {
      const form = new FormData()
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          form.append(k, v)
        }
      })
      const res = await axios.post(`${BASE_URL}/api/admin/newsagriculture`, form, {
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
    const res = await axios.delete(`${BASE_URL}/api/admin/newsagriculture/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  activate: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/newsagriculture/${id}/activate`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  deactivate: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/newsagriculture/${id}/deactivate`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  update: async (token, id, values) => {
    const form = new FormData()
    // Only send fields the API accepts: title, description, heading, image
    const allowed = ['title', 'description', 'heading', 'image']
    allowed.forEach((key) => {
      if (values[key] !== undefined && values[key] !== null) {
        form.append(key, values[key])
      }
    })
    // Backend expects POST to update/{id} for multipart updates
    const res = await axios.put(`${BASE_URL}/api/admin/newsagriculture/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

export default adminNews
