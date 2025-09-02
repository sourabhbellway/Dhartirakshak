import React, { createContext, useContext, useState } from 'react'
import adminAuth from '../controllers/adminAuthController.js'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  // Lazy init from localStorage for simplicity
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin_user')
    try { return saved ? JSON.parse(saved) : null } catch { return null }
  })

  const isAuthenticated = Boolean(token)

  const login = async (email, password) => {
    const res = await adminAuth.login(email, password)
    if (res.success && res.token) {
      const userInfo = res.user || { email }
      localStorage.setItem('admin_token', res.token)
      localStorage.setItem('admin_user', JSON.stringify(userInfo))
      setToken(res.token)
      setUser(userInfo)
    }
    return res
  }

  const logout = async () => {
    if (token) {
      await adminAuth.logout(token)
    }
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setToken(null)
    setUser(null)
  }

  const value = { user, token, isAuthenticated, login, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
