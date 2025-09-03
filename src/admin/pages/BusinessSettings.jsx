import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import adminBusinessSettings from '../controllers/adminBusinessSettingsController.js'

const BusinessSettings = () => {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [googleMapsKey, setGoogleMapsKey] = useState('')
  const [razorpayKeyId, setRazorpayKeyId] = useState('')
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('')
  const [weatherApiKey, setWeatherApiKey] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(''); setSuccess('')
      try {
        const data = await adminBusinessSettings.list(token)
        const arr = Array.isArray(data) ? data : []
        const map = new Map(arr.map(item => [item.key, item.value]))
        const gm = map.get('google_maps') || {}
        const pay = map.get('payment_keys') || {}
        const wt = map.get('weather_api') || {}
        setGoogleMapsKey(gm.api_key || '')
        setRazorpayKeyId(pay.razorpay_key_id || '')
        setRazorpayKeySecret(pay.razorpay_key_secret || '')
        setWeatherApiKey(wt.api_key || '')
      } catch (e) {
        setError('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
  }, [token])

  const handleSaveGoogle = async () => {
    setError(''); setSuccess('')
    try {
      await adminBusinessSettings.save(token, 'google_maps', { api_key: googleMapsKey })
      setSuccess('Google Maps settings saved')
    } catch (e) {
      setError('Failed to save Google Maps settings')
    }
  }

  const handleSavePayment = async () => {
    setError(''); setSuccess('')
    try {
      await adminBusinessSettings.save(token, 'payment_keys', { razorpay_key_id: razorpayKeyId, razorpay_key_secret: razorpayKeySecret })
      setSuccess('Payment settings saved')
    } catch (e) {
      setError('Failed to save payment settings')
    }
  }

  const handleSaveWeather = async () => {
    setError(''); setSuccess('')
    try {
      await adminBusinessSettings.save(token, 'weather_api', { api_key: weatherApiKey })
      setSuccess('Weather API settings saved')
    } catch (e) {
      setError('Failed to save Weather API settings')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-dark-green">Business Settings</h1>
        <p className="text-sm text-gray-600">Manage API keys and integrations</p>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Loading settings...</div>
      )}
      {error && (
        <div className="text-sm text-rose-600 mb-3">{error}</div>
      )}
      {success && (
        <div className="text-sm text-green-700 mb-3">{success}</div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* Google Maps */}
          <section className="border border-gray-200 rounded-lg p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Google Maps</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <label className="text-sm text-gray-700">API Key</label>
              <input
                type="text"
                value={googleMapsKey}
                onChange={e => setGoogleMapsKey(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-green/40"
                placeholder="Enter Google Maps API key"
              />
              <div>
                <button onClick={handleSaveGoogle} className="bg-dark-green text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Save</button>
              </div>
            </div>
          </section>

          {/* Payment Keys */}
          <section className="border border-gray-200 rounded-lg p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Payment (Razorpay)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-700">Razorpay Key ID</label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={e => setRazorpayKeyId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-green/40"
                  placeholder="rzp_..."
                />
              </div>
              <div className="col-span-1">
                <label className="text-sm text-gray-700">Razorpay Key Secret</label>
                <input
                  type="text"
                  value={razorpayKeySecret}
                  onChange={e => setRazorpayKeySecret(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-green/40"
                  placeholder="secret"
                />
              </div>
            </div>
            <div className="mt-3">
              <button onClick={handleSavePayment} className="bg-dark-green text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Save</button>
            </div>
          </section>

          {/* Weather */}
          <section className="border border-gray-200 rounded-lg p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Weather API</h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <label className="text-sm text-gray-700">API Key</label>
              <input
                type="text"
                value={weatherApiKey}
                onChange={e => setWeatherApiKey(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-green/40"
                placeholder="Enter Weather API key"
              />
              <div>
                <button onClick={handleSaveWeather} className="bg-dark-green text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Save</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default BusinessSettings


