import axios from 'axios'
import { BASE_URL } from '../config.js'

// Very simple auth functions for login and logout
const adminAuth = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/auth/login`, { email, password })
      // Expected shape:
      // { status, message, data: { user: {...}, token, token_type } }
      const apiData = res?.data?.data || {}
      const token = apiData.token
      const user = apiData.user
      return {
        success: Boolean(token),
        token,
        user,
        message: res?.data?.message || 'Logged in'
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed'
      return { success: false, message: msg }
    }
  },

  // Logout with token
  logout: async (token) => {
    try {
      await axios.post(`${BASE_URL}/api/admin/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { success: true, message: 'Logged out' }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Logout failed'
      return { success: false, message: msg }
    }
  }
}

export default adminAuth
