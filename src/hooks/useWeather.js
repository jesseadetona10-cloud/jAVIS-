const API_KEY = import.meta.env.VITE_WEATHER_KEY
const CITY = import.meta.env.VITE_CITY

export default function useWeather() {
  const getWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      )
      const data = await res.json()
      const temp = Math.round(data.main.temp)
      const feels = Math.round(data.main.feels_like)
      const desc = data.weather[0].description
      const humidity = data.main.humidity

      return `It's ${temp} degrees in ${CITY}, ${desc}. Feels like ${feels} degrees with ${humidity}% humidity.`
    } catch (e) {
      console.error('Weather error:', e)
      return 'I could not fetch the weather right now Sir.'
    }
  }

  return { getWeather }
}