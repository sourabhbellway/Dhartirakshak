import axios from 'axios'
import { BASE_URL } from '../../config.js'

const categoryCtrl = {
  list: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/category`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  create: async (token, category) => {
    const res = await axios.post(`${BASE_URL}/api/admin/category`, { category }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

export default categoryCtrl