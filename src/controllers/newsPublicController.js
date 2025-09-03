import axios from 'axios'
import { BASE_URL } from '../config.js'

const newsPublicController = {
  listTrending: async () => {
    const res = await axios.get(`${BASE_URL}/api/trending-news`)
    return res.data
  }
}

export default newsPublicController


