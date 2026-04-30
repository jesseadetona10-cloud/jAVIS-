const API_KEY = import.meta.env.VITE_NEWS_KEY

export default function useNews() {
  const getNews = async (category = 'technology') => {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=3&apiKey=${API_KEY}`
      )
      const data = await res.json()

      if (data.status === 'error' || !data.articles || data.articles.length === 0) {
        return 'No news available right now Sir.'
      }

      const headlines = data.articles
        .slice(0, 3)
        .map((a, i) => `${i + 1}. ${a.title}`)
        .join('. ')

      return `Here are the top headlines Sir. ${headlines}`
    } catch (e) {
      console.error('News error:', e)
      return 'No news available right now Sir.'
    }
  }

  return { getNews }
}