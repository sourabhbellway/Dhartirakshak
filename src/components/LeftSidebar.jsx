import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaNewspaper, 
  FaChartLine, 
  FaFileAlt, 
  FaBookOpen,
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import categoryPublicController from '../controllers/categoryPublicController.js'
import businessSettingsPublicController from '../controllers/businessSettingsPublicController.js'
import weatherPublicController from '../controllers/weatherPublicController.js'
import geocodingPublicController from '../controllers/geocodingPublicController.js'

const LeftSidebar = () => {
  const [categories, setCategories] = React.useState([])
  const [catLoading, setCatLoading] = React.useState(false)
  const [catError, setCatError] = React.useState('')

  // Weather states
  const [weatherApiKey, setWeatherApiKey] = React.useState('')
  const [selectedCity, setSelectedCity] = React.useState(() => {
    try { return localStorage.getItem('weather_city') || 'Indore' } catch { return 'Indore' }
  })
  const [selectedCoords, setSelectedCoords] = React.useState(() => {
    try {
      const raw = localStorage.getItem('weather_city_coords')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })
  const [cityQuery, setCityQuery] = React.useState('')
  const [suggestions, setSuggestions] = React.useState([])
  const [weatherLoading, setWeatherLoading] = React.useState(false)
  const [weatherError, setWeatherError] = React.useState('')
  const [weatherData, setWeatherData] = React.useState(null)

 

  React.useEffect(() => {
    const load = async () => {
      setCatLoading(true); setCatError('')
      try {
        const res = await categoryPublicController.list()
        const data = res?.data || res || []
        const parsed = Array.isArray(data) ? data : []
        setCategories(parsed)
      } catch (e) {
        setCatError('Failed to load categories')
      } finally {
        setCatLoading(false)
      }
    }
    load()
  }, [])

  // Load public business settings for weather key
  React.useEffect(() => {
    const loadConfig = async () => {
      try {
        const settings = await businessSettingsPublicController.list()
        const arr = Array.isArray(settings) ? settings : []
        const weather = arr.find(s => s.key === 'weather_api')
        const key = weather?.value?.api_key || ''
        setWeatherApiKey(key)
      } catch {
        // ignore, will error later if missing
      }
    }
    loadConfig()
  }, [])

  // On first load, if no saved city/coords, try geolocation to set defaults
  React.useEffect(() => {
    const setFromGeolocation = async () => {
      if (!weatherApiKey) return
      if (!('geolocation' in navigator)) return
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 })
        }).then(async (pos) => {
          const { latitude, longitude } = pos.coords
          // reverse geocode
          try {
            const results = await geocodingPublicController.reverseLookup(weatherApiKey, latitude, longitude, 1)
            const first = Array.isArray(results) && results[0] ? results[0] : null
            const name = first?.name || 'My Location'
            setSelectedCity(name)
            setSelectedCoords({ lat: latitude, lon: longitude })
            try {
              localStorage.setItem('weather_city', name)
              localStorage.setItem('weather_city_coords', JSON.stringify({ lat: latitude, lon: longitude }))
            } catch {}
          } catch {
            // fallback to coords without name
            setSelectedCity('My Location')
            setSelectedCoords({ lat: latitude, lon: longitude })
          }
        })
      } catch {
        // ignore permission denied/timeouts
      }
    }
    setFromGeolocation()
  }, [weatherApiKey])

  // Debounced city geocoding suggestions
  React.useEffect(() => {
    let timer
    const run = async () => {
      if (!weatherApiKey || !cityQuery || cityQuery.length < 2) { setSuggestions([]); return }
      try {
        const list = await geocodingPublicController.searchCities(weatherApiKey, cityQuery, 'IN', 8)
        setSuggestions(list)
      } catch {
        setSuggestions([])
      }
    }
    timer = setTimeout(run, 300)
    return () => clearTimeout(timer)
  }, [cityQuery, weatherApiKey])

  // Fetch weather when api key or selection changes
  React.useEffect(() => {
    const fetchWeather = async () => {
      if (!weatherApiKey || !selectedCity) return
      setWeatherLoading(true); setWeatherError('')
      try {
        let data
        if (selectedCoords && typeof selectedCoords.lat === 'number' && typeof selectedCoords.lon === 'number') {
          data = await weatherPublicController.getCurrentByCoords(weatherApiKey, selectedCoords.lat, selectedCoords.lon)
        } else {
          data = await weatherPublicController.getCurrentByCity(weatherApiKey, selectedCity, 'IN')
        }
        setWeatherData(data)
      } catch (e) {
        setWeatherError('Failed to load weather')
      } finally {
        setWeatherLoading(false)
      }
    }
    fetchWeather()
  }, [weatherApiKey, selectedCity, selectedCoords])

  const handlePickSuggestion = (sugg) => {
    const cityName = sugg.name
    setSelectedCity(cityName)
    setSelectedCoords({ lat: sugg.lat, lon: sugg.lon })
    setCityQuery('')
    setSuggestions([])
    try {
      localStorage.setItem('weather_city', cityName)
      localStorage.setItem('weather_city_coords', JSON.stringify({ lat: sugg.lat, lon: sugg.lon }))
    } catch {}
  }

  const getCategoryName = (c) => c?.category || c?.name || c?.title || ''
  const normalize = (s) => (s || '').toString().trim().replace(/^\/+|\/+$/g, '').toLowerCase()

  return (
    <div className="w-full h-full bg-white/95 backdrop-blur-sm border-r lg:border-r border-b lg:border-b-0 border-gray-200 p-3 sm:p-4">
      {/* Logo Section */}
      <div className="mb-4 sm:mb-6 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-dark-green">Quick Access</h2>
        <p className="text-xs sm:text-sm text-gray-600">Navigate & Discover</p>
      </div>

      {/* Navigation (Categories) */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <FaNewspaper className="text-dark-green" />
          Navigation
        </h3>
        {catLoading && (
          <div className="text-sm text-gray-500">Loading categories...</div>
        )}
        {catError && (
          <div className="text-sm text-rose-600">{catError}</div>
        )}
        {!catLoading && !catError && (
          <nav className="space-y-2 max-h-[50vh] lg:max-h-none overflow-auto lg:overflow-visible">
            {categories.map((cat, idx) => {
              const name = getCategoryName(cat)
              const routeName = normalize(name)
              if (!routeName) return null
              return (
                <Link
                  key={cat.id || cat._id || name + idx}
                  to={`/${routeName}`}
                  className="block px-3 py-2 text-sm text-gray-700 capitalize hover:text-dark-green hover:bg-green-50 rounded-lg transition-all duration-200"
                >
                  {name}
                </Link>
              )
            })}
            {categories.length === 0 && (
              <div className="text-sm text-gray-500">No categories available</div>
            )}
          </nav>
        )}
      </div>

      {/* Quick Links */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <FaInfoCircle className="text-dark-green" />
          Quick Links
        </h3>
        <div className="space-y-2">
          {/* {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-3 py-2 text-sm text-gray-600 hover:text-dark-green hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              {link.name}
            </Link>
          ))} */}
        </div>
      </div>


     

      {/* Weather Widget */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Weather Update</h4>
        <div className="mb-2 relative">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder={selectedCity ? `Change city (current: ${selectedCity})` : 'Search city'}
            className="w-full border border-blue-200 rounded-md px-2 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-56 overflow-auto bg-white border border-blue-200 rounded-md shadow">
              {suggestions.map((s, i) => (
                <button
                  key={`${s.name}-${s.lat}-${s.lon}-${i}`}
                  onClick={() => handlePickSuggestion(s)}
                  className="w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-blue-50"
                >
                  {s.name}{s.state ? `, ${s.state}` : ''}{s.country ? `, ${s.country}` : ''}
                </button>
              ))}
            </div>
          )}
        </div>
        {weatherLoading && (
          <div className="text-xs text-blue-700">Loading weather...</div>
        )}
        {weatherError && (
          <div className="text-xs text-rose-600">{weatherError}</div>
        )}
        {!weatherLoading && !weatherError && weatherData && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {weatherData.weather?.[0]?.icon ? (
                <img alt="icon" className="w-8 h-8" src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
              ) : (
                <span className="text-2xl">🌤️</span>
              )}
              <div className="text-blue-800 text-sm sm:text-base font-semibold">
                {Math.round(weatherData.main?.temp)}°C
              </div>
            </div>
            <p className="text-xs sm:text-sm text-blue-700">{selectedCity}</p>
            <p className="text-[11px] sm:text-xs text-blue-600">{weatherData.weather?.[0]?.description || ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
