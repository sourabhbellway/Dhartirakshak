import axios from 'axios'
import { BASE_URL } from '../config.js'

const businessSettingsPublicController = {
  list: async () => {
    const res = await axios.get(`${BASE_URL}/api/business-settings`)
    return res.data
  }
}

export default businessSettingsPublicController


