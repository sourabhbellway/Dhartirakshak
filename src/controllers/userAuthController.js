import axios from 'axios'
import { BASE_URL } from '../config.js'

const userAuth = {
  signup: async (formValues) => {
    try {
      const form = new FormData()
      Object.entries(formValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Files can be File or File[]; handle both
          if (key === 'image' || key === 'documents') {
            if (Array.isArray(value)) {
              value.forEach((file) => form.append(key, file))
            } else {
              form.append(key, value)
            }
          } else {
            form.append(key, value)
          }
        }
      })

      const res = await axios.post(`${BASE_URL}/api/auth/signup`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const message = res?.data?.message || 'Signup successful'
      const apiData = res?.data?.data || {}
      const token = apiData.token || res?.data?.token
      const user = apiData.user || res?.data?.user
      return { success: true, token, user, message }
    } catch (err) {
      const message = err?.response?.data?.message || 'Signup failed'
      return { success: false, message }
    }
  },

  login: async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password })
      const apiData = res?.data?.data || {}
      const token = apiData.token || res?.data?.token
      const user = apiData.user || res?.data?.user
      const message = res?.data?.message || 'Logged in'
      return { success: Boolean(token), token, user, message }
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed'
      return { success: false, message }
    }
  },

  profile: async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const user = res?.data?.data?.user || res?.data?.user
      return { success: true, user, message: res?.data?.message || 'Profile loaded' }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to load profile'
      return { success: false, message }
    }
  }
}

export default userAuth
