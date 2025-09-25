import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose } from 'react-icons/io5'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'
import { toast } from 'react-toastify'

const AuthModal = ({ isOpen, onClose, defaultTab = 'signin' }) => {
  const { login, signup } = useUserAuth()
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [signinValues, setSigninValues] = useState({ email: '', password: '' })
  const [signupValues, setSignupValues] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })

  if (!isOpen) return null

  const handleSignin = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await login(signinValues.email, signinValues.password)
    setIsSubmitting(false)
    if (res.success) {
      toast.success(res.message || 'Welcome back!')
      onClose()
    } else {
      toast.error(res.message || 'Sign in failed')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await signup(signupValues)
    setIsSubmitting(false)
    if (res.success) {
      toast.success(res.message || 'Account created!')
      onClose()
    } else {
      toast.error(res.message || 'Sign up failed')
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-[2001] w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center font-semibold">DR</div>
            <h2 className="text-lg font-semibold text-gray-900">Welcome to DhartiRakshak</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <IoClose size={20} />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1 text-sm font-medium">
            <button
              className={`py-2 rounded-lg transition ${activeTab === 'signin' ? 'bg-white shadow text-emerald-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`py-2 rounded-lg transition ${activeTab === 'signup' ? 'bg-white shadow text-emerald-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('signup')}
            >
              Create Account
            </button>
          </div>
        </div>

        {activeTab === 'signin' ? (
          <form onSubmit={handleSignin} className="px-6 pb-6 pt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={signinValues.email}
                onChange={(e) => setSigninValues(v => ({ ...v, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={signinValues.password}
                onChange={(e) => setSigninValues(v => ({ ...v, password: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="px-6 pb-6 pt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={signupValues.name}
                onChange={(e) => setSignupValues(v => ({ ...v, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={signupValues.email}
                onChange={(e) => setSignupValues(v => ({ ...v, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={signupValues.phone}
                onChange={(e) => setSignupValues(v => ({ ...v, phone: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={signupValues.password}
                onChange={(e) => setSignupValues(v => ({ ...v, password: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

export default AuthModal


