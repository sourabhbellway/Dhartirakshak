import axios from 'axios'

// OpenWeather Geocoding API
// https://api.openweathermap.org/geo/1.0/direct?q={city},{country}&limit={limit}&appid={API key}

const geocodingPublicController = {
  searchCities: async (apiKey, query, countryCode = 'IN', limit = 10) => {
    if (!apiKey) throw new Error('Missing weather API key')
    if (!query) return []
    const q = countryCode ? `${encodeURIComponent(query)},${countryCode}` : encodeURIComponent(query)
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=${limit}&appid=${apiKey}`
    const res = await axios.get(url)
    return Array.isArray(res.data) ? res.data : []
  },
  reverseLookup: async (apiKey, lat, lon, limit = 1) => {
    if (!apiKey) throw new Error('Missing weather API key')
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`
    const res = await axios.get(url)
    return Array.isArray(res.data) ? res.data : []
  }
}

export default geocodingPublicController


