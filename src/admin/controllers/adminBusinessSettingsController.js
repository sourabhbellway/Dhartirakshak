import axios from 'axios'
import { BASE_URL } from '../../config.js'

const adminBusinessSettings = {
  list: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/business-settings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  save: async (token, key, value) => {
    const payload = { key, value }
    const res = await axios.post(`${BASE_URL}/api/admin/business-settings`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

export default adminBusinessSettings


