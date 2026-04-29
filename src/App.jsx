import { useState, useEffect } from 'react'
import Space from './components/Space'
import Stars from './components/Stars'
import Orb from './components/Orb'
import Input from './components/Input'
import useVoice from './hooks/useVoice'
import useSpotify from './hooks/useSpotify'

export default function App() {
  const [state, setState] = useState('idle')
  const [ready, setReady] = useState(false)
  const { connect, init, play, pause, next, isConnected } = useSpotify()

  useEffect(() => {
    init()
  }, [])

  const unlock = () => {
    if (!ready) {
      window.speechSynthesis.cancel()
      setReady(true)
    }
  }

  const handleWake = () => {
    console.log('Jarvis woke up')
    speak('Yes Sir?')
  }

  const handleCommand = async (text) => {
    console.log('Command received:', text)

    if (text.includes('play')) {
      const query = text.replace('play', '').trim() || 'focus music'
      speak(`Playing ${query} Sir`)
      await play(query)
      return
    }

    if (text.includes('pause') || text.includes('stop')) {
      speak('Pausing the music Sir')
      await pause()
      return
    }

    if (text.includes('next') || text.includes('skip')) {
      speak('Skipping Sir')
      await next()
      return
    }

    speak(`I heard you Sir. The full brain is coming soon.`)
  }

  const { speak, interrupt } = useVoice({
    onWake: handleWake,
    onCommand: handleCommand,
    onStateChange: setState,
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
        setState('thinking')
        await handleCommand(text)
      }} />
    </Space>
  )
}