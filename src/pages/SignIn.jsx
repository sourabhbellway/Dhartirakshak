import React, { useState } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const { login } = useUserAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login(email, password)
    if (res.success) {
      navigate('/profile', { replace: true })
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen bg-olive p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl border border-green/20 p-6">
        <h2 className="text-dark-green text-xl font-semibold mb-4">User Sign In</h2>
        {error && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="border border-green/30 rounded p-2 w-full" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="border border-green/30 rounded p-2 w-full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full bg-green hover:bg-dark-green text-olive rounded p-2">Sign In</button>
        </form>
      </div>
    </div>
  )
}

export default SignIn
