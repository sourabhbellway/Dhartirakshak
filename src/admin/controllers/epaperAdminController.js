import axios from 'axios'
import { BASE_URL } from '../../config.js'

const epaperAdmin = {
  list: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/all-epapers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  create: async (token, values) => {
    const form = new FormData()
    if (values?.pdf) form.append('pdf', values.pdf)
    if (values?.publish_date) form.append('publish_date', values.publish_date)
    const res = await axios.post(`${BASE_URL}/api/admin/all-epapers`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  remove: async (token, id) => {
    const res = await axios.delete(`${BASE_URL}/api/admin/all-epapers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

export default epaperAdmin
