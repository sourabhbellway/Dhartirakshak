import axios from 'axios'
import { BASE_URL } from '../config.js'

const categoryPublicController = {
  list: async () => {
    const res = await axios.get(`${BASE_URL}/api/category`)
    return res.data
  }
}

export default categoryPublicController
