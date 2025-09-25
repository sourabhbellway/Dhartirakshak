import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose } from 'react-icons/io5'
import { toast } from 'react-toastify'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
]

const PhoneAuthModal = ({ isOpen, onClose }) => {
  const DUMMY_OTP = '123456'
  const [activeTab, setActiveTab] = useState('login') // 'login' | 'signup'

  // login states
  const [loginPhone, setLoginPhone] = useState('')
  const [loginOtp, setLoginOtp] = useState('')
  const [loginOtpSent, setLoginOtpSent] = useState(false)

  // signup states
  const [name, setName] = useState('')
  const [state, setState] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupOtp, setSignupOtp] = useState('')
  const [signupOtpSent, setSignupOtpSent] = useState(false)

  if (!isOpen) return null

  const sendLoginOtp = () => {
    if (!/^\d{10}$/.test(loginPhone)) {
      toast.error('Enter valid 10-digit mobile number')
      return
    }
    setLoginOtpSent(true)
    toast.success('OTP sent')
  }

  const handleLogin = () => {
    if (!loginOtpSent) {
      toast.error('Please request OTP first')
      return
    }
    if (!/^\d{4,6}$/.test(loginOtp)) {
      toast.error('Enter valid OTP')
      return
    }
    if (loginOtp !== DUMMY_OTP) {
      toast.error('Incorrect OTP')
      return
    }
    toast.success('Logged in successfully')
    onClose()
  }

  const sendSignupOtp = () => {
    if (!name.trim()) {
      toast.error('Enter your name')
      return
    }
    if (!state) {
      toast.error('Select state')
      return
    }
    if (!/^\d{10}$/.test(signupPhone)) {
      toast.error('Enter valid 10-digit mobile number')
      return
    }
    setSignupOtpSent(true)
    toast.success('OTP sent')
  }

  const handleSignup = () => {
    if (!signupOtpSent) {
      toast.error('Please request OTP first')
      return
    }
    if (!/^\d{4,6}$/.test(signupOtp)) {
      toast.error('Enter valid OTP')
      return
    }
    if (signupOtp !== DUMMY_OTP) {
      toast.error('Incorrect OTP')
      return
    }
    toast.success('Account created & logged in successfully')
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[2100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-[2101] w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Secure Login</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <IoClose size={20} />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1 text-sm font-medium">
            <button className={`py-2 rounded-lg transition ${activeTab === 'login' ? 'bg-white shadow text-emerald-700' : 'text-gray-600'}`} onClick={() => setActiveTab('login')}>Login</button>
            <button className={`py-2 rounded-lg transition ${activeTab === 'signup' ? 'bg-white shadow text-emerald-700' : 'text-gray-600'}`} onClick={() => setActiveTab('signup')}>Create Account</button>
          </div>
        </div>

        {activeTab === 'login' ? (
          <div className="px-6 pb-6 pt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Mobile number</label>
              <input value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} type="tel" maxLength={10} className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="10-digit number" />
            </div>
            {loginOtpSent && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">OTP</label>
                <input value={loginOtp} onChange={(e) => setLoginOtp(e.target.value)} type="tel" maxLength={6} className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter OTP" />
                <div className="mt-1 text-[11px] text-gray-600">Dummy OTP: <span className="font-mono font-semibold">{DUMMY_OTP}</span></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={sendLoginOtp} className="px-3 py-2 rounded-lg border text-emerald-700 border-emerald-600 hover:bg-emerald-50">Send OTP</button>
              <button onClick={handleLogin} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Login</button>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6 pt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">State</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Mobile number</label>
              <input value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} type="tel" maxLength={10} className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="10-digit number" />
            </div>
            {signupOtpSent && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">OTP</label>
                <input value={signupOtp} onChange={(e) => setSignupOtp(e.target.value)} type="tel" maxLength={6} className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter OTP" />
                <div className="mt-1 text-[11px] text-gray-600">Dummy OTP: <span className="font-mono font-semibold">{DUMMY_OTP}</span></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={sendSignupOtp} className="px-3 py-2 rounded-lg border text-emerald-700 border-emerald-600 hover:bg-emerald-50">Send OTP</button>
              <button onClick={handleSignup} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Create Account</button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default PhoneAuthModal


