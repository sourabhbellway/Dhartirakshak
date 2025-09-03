import axios from 'axios'
import { BASE_URL } from '../config.js'

const advertisementPublicController = {
  list: async () => {
    const res = await axios.get(`${BASE_URL}/api/advertisement`)
    return res.data
  }
}

export default advertisementPublicController
