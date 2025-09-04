import axios from 'axios'
import { BASE_URL } from '../../config.js'

const adminAds = {
  list: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/advertisement`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  create: async (token, values) => {
    const form = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v)
    })
    const res = await axios.post(`${BASE_URL}/api/admin/advertisement`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  remove: async (token, id) => {
    const res = await axios.delete(`${BASE_URL}/api/admin/advertisement/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  activate: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/advertisement/${id}/activate`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  deactivate: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/advertisement/${id}/deactivate`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  update: async (token, id, values) => {
    const form = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v)
    })
    const res = await axios.post(`${BASE_URL}/api/admin/advertisement/update/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

}

export default adminAds
