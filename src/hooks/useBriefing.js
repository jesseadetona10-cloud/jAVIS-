export default function useBriefing({ getWeather, getNews, getEvents }) {
  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const deliver = async () => {
    try {
      const greeting = getTimeGreeting()
      const time = getTime()

      // Fetch weather and news in parallel
      const [weather, news] = await Promise.all([
        getWeather(),
        getNews('technology'),
      ])

      const schedule = getEvents()

      const briefing = `
        ${greeting} Sir. It is ${time}. 
        ${weather}. 
        ${schedule}. 
        Here is what is happening in tech today. 
        ${news}
      `.trim()

      return briefing
    } catch (e) {
      console.error('Briefing error:', e)
      return 'Good morning Sir. I had trouble fetching your full briefing today.'
    }
  }

  return { deliver }
}