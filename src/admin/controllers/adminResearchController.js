import axios from 'axios'
import { BASE_URL } from '../../config.js'

const adminResearchController = {
  listApproved: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/researches`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  listPending: async (token) => {
    const res = await axios.get(`${BASE_URL}/api/admin/researches/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  approve: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/researches/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  reject: async (token, id) => {
    const res = await axios.post(`${BASE_URL}/api/admin/researches/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

export default adminResearchController


