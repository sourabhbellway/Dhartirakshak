import axios from 'axios'

// Uses OpenWeatherMap current weather API by city name
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}&units=metric

const weatherPublicController = {
  getCurrentByCity: async (apiKey, cityName, countryCode = 'IN') => {
    if (!apiKey) throw new Error('Missing weather API key')
    const q = countryCode ? `${encodeURIComponent(cityName)},${countryCode}` : encodeURIComponent(cityName)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric`
    const res = await axios.get(url)
    return res.data
  },
  getCurrentByCoords: async (apiKey, lat, lon) => {
    if (!apiKey) throw new Error('Missing weather API key')
    if (typeof lat !== 'number' || typeof lon !== 'number') throw new Error('Invalid coordinates')
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const res = await axios.get(url)
    return res.data
  }
}

export default weatherPublicController


