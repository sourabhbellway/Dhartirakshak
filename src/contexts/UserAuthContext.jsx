import React, { createContext, useContext, useState } from 'react'
import userAuth from '../controllers/userAuthController.js'

const UserAuthContext = createContext()
export const useUserAuth = () => useContext(UserAuthContext)

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('user_token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_profile')
    try { return saved ? JSON.parse(saved) : null } catch { return null }
  })

  const isAuthenticated = Boolean(token)

  const signup = async (values) => {
    const res = await userAuth.signup(values)
    if (res.success && res.token) {
      localStorage.setItem('user_token', res.token)
      localStorage.setItem('user_profile', JSON.stringify(res.user))
      setToken(res.token)
      setUser(res.user)
    }
    return res
  }

  const login = async (email, password) => {
    const res = await userAuth.login(email, password)
    if (res.success && res.token) {
      localStorage.setItem('user_token', res.token)
      localStorage.setItem('user_profile', JSON.stringify(res.user))
      setToken(res.token)
      setUser(res.user)
    }
    return res
  }

  const loadProfile = async () => {
    if (!token) return { success: false, message: 'Not authenticated' }
    const res = await userAuth.profile(token)
    if (res.success && res.user) {
      localStorage.setItem('user_profile', JSON.stringify(res.user))
      setUser(res.user)
    }
    return res
  }

  const logout = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_profile')
    setToken(null)
    setUser(null)
  }

  const value = { token, user, isAuthenticated, signup, login, loadProfile, logout }

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  )
}

export default UserAuthContext
