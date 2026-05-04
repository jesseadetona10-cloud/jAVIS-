import { useState, useEffect, useRef } from 'react'
import Space from './components/Space'
import Stars from './components/Stars'
import Orb from './components/Orb'
import Input from './components/Input'
import useVoice from './hooks/useVoice'
import useSpotify from './hooks/useSpotify'
import useWeather from './hooks/useWeather'
import useNews from './hooks/useNews'
import useEvents from './hooks/useEvents'
import useBriefing from './hooks/useBriefing'
import useElevenLabs from './hooks/useElevenLabs'

export default function App() {
  const [state, setState] = useState('idle')
  const [ready, setReady] = useState(false)
  const currentAudio = useRef(null)

  const { connect, init, play, pause, next, isConnected } = useSpotify()
  const { getWeather } = useWeather()
  const { getNews } = useNews()
  const { addEvent, getEvents } = useEvents()
  const { deliver } = useBriefing({ getWeather, getNews, getEvents })
  const { speak: elevenSpeak } = useElevenLabs()

  useEffect(() => {
    init()
  }, [])

  const unlock = () => {
    if (!ready) {
      window.speechSynthesis.cancel()
      setReady(true)
    }
  }

  // Main speak function — uses ElevenLabs
  const speak = (text) => {
    // Stop any current audio
    if (currentAudio.current) {
      currentAudio.current.pause()
      currentAudio.current = null
    }
    setState('thinking')
    elevenSpeak(
      text,
      () => setState('speaking'),
      () => setState('idle')
    ).then(audio => {
      if (audio) currentAudio.current = audio
    })
  }

  // Interrupt — stops ElevenLabs audio instantly
  const interrupt = () => {
    if (currentAudio.current) {
      currentAudio.current.pause()
      currentAudio.current = null
    }
    window.speechSynthesis.cancel()
    setState('listening')
  }

  const handleWake = () => {
    console.log('Jarvis woke up')
    speak('Yes Sir?')
  }

  const handleCommand = async (text) => {
    console.log('Command received:', text)

    if (text.includes('briefing') || text.includes('good morning') || text.includes('my day')) {
      const briefing = await deliver()
      speak(briefing)
      return
    }

    if (text.includes('weather')) {
      const report = await getWeather()
      speak(report)
      return
    }

    if (text.includes('news') || text.includes('headlines')) {
      const category = text.includes('world') ? 'general' : 'technology'
      const report = await getNews(category)
      speak(report)
      return
    }

    if (text.includes('add') || text.includes('remind')) {
      const event = addEvent(text)
      speak(`Got it Sir. I have added ${event.name} at ${event.time} to your schedule.`)
      return
    }

    if (text.includes('schedule') || text.includes('what do i have')) {
      const schedule = getEvents()
      speak(schedule)
      return
    }

    if (text.includes('play')) {
      const query = text.replace('play', '').trim() || 'focus music'
      speak(`Playing ${query} Sir`)
      await play(query)
      return
    }

    if (text.includes('pause') || text.includes('stop music')) {
      speak('Pausing the music Sir')
      await pause()
      return
    }

    if (text.includes('next') || text.includes('skip')) {
      speak('Skipping Sir')
      await next()
      return
    }

    speak(`I heard you Sir. The full brain is coming in Phase 9.`)
  }

  const { interrupt: voiceInterrupt } = useVoice({
    onWake: handleWake,
    onCommand: handleCommand,
    onStateChange: (s) => {
      // Only update state from voice if not already speaking
      if (s === 'listening' && state !== 'speaking') setState(s)
      if (s === 'thinking') setState(s)
    },
  })

  return (
    <Space>
      <Stars />
      <div
        className="relative z-10 flex items-center justify-center"
        onClick={() => {
          unlock()
          if (state === 'speaking') interrupt()
        }}
      >
        <Orb state={state} />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          connect()
        }}
        className="fixed top-6 right-6 z-50 text-white/30 text-xs tracking-widest border border-white/10 px-4 py-2 hover:text-white/60 hover:border-white/30 transition-all cursor-pointer"
      >
        {isConnected ? 'SPOTIFY CONNECTED' : 'CONNECT SPOTIFY'}
      </button>

      <Input onSend={async (text) => {
        unlock()
        await handleCommand(text)
      }} />
    </Space>
  )
}