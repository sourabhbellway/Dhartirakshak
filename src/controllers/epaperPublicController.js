import axios from 'axios'
import { BASE_URL } from '../config.js'

const epaperPublic = {
  list: async () => {
    const res = await axios.get(`${BASE_URL}/api/all-epapers`)
    return res.data
  },
  get: async (id) => {
    const res = await axios.get(`${BASE_URL}/api/all-epapers/${id}`)
    return res.data
  }
}

export default epaperPublic
