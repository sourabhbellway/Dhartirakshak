import React, { useState } from 'react'
import { FiEye, FiEyeOff, FiLock, FiMail, FiShield } from 'react-icons/fi'
import logo from '../assets/DR-Logo.png'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        navigate('/admin', { replace: true })
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('An error occurred during login')
      console.error('Login error:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-olive flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-800 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-emerald-700 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-32 left-32 w-20 h-20 bg-emerald-500 rounded-full opacity-15 animate-ping"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-emerald-600 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="logo" className="w-16 " />
            </div>
            <h1 className="text-2xl font-bold text-dark-green mb-2">Admin Panel</h1>
            <p className="text-green text-sm">Access your dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-dark-green">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-green" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 text-dark-green bg-white border border-green/30 rounded-lg focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-all duration-200 placeholder:text-green/50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-dark-green">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-green" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 text-dark-green bg-white border border-green/30 rounded-lg focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 transition-all duration-200 placeholder:text-green/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-green hover:text-dark-green transition-colors duration-200"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green border-green rounded focus:ring-green focus:ring-2"
                />
                <span className="ml-2 text-sm text-dark-green">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-green hover:text-dark-green transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green hover:bg-dark-green text-olive font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
            >
              <div className="flex items-center justify-center">
                <FiShield className="mr-2 h-5 w-5" />
                Sign In
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-green/70">
              Protected by secure authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
