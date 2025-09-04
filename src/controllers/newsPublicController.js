import axios from 'axios'
import { BASE_URL } from '../config.js'

const newsPublicController = {
  listAgricultureNews: async () => {
    const res = await axios.get(`${BASE_URL}/api/newsagriculture`)
    return res.data
  },
  listTrending: async () => {
    const res = await axios.get(`${BASE_URL}/api/trending-news-only`)
    return res.data
  }
}

export default newsPublicController


