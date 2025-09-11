import axios from 'axios'
import { BASE_URL } from '../config.js'

const researchPublicController = {
  listResearch: async () => {
    const res = await axios.get(`${BASE_URL}/api/researches`, {
      headers: {
        Accept: 'application/json'
      }
    })
    return res.data
  },
 
  getById: async (id) => {
    const res = await axios.get(`${BASE_URL}/api/researches/${id}`, {
      headers: {
        Accept: 'application/json',
        
      }
    })
    return res.data
  },
  create: async (formData, token) => {
    const res = await axios.post(`${BASE_URL}/api/researches`, formData, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data
  }
}

export default researchPublicController
