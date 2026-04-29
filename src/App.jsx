import { useState, useEffect } from 'react'
import Space from './components/Space'
import Stars from './components/Stars'
import Orb from './components/Orb'
import Input from './components/Input'
import useVoice from './hooks/useVoice'

export default function App() {
  const [state, setState] = useState('idle')
  const [ready, setReady] = useState(false)

  const handleWake = () => {
    console.log('Jarvis woke up')
    speak('Yes Sir?')
  }

  const handleCommand = (text) => {
    console.log('Command received:', text)
    speak(`You said: ${text}. I am still being built Sir, but I am listening.`)
  }

  const { speak, interrupt } = useVoice({
    onWake: handleWake,
    onCommand: handleCommand,
    onStateChange: setState,
  })

  // Unlock speech synthesis on first click
  const unlock = () => {
    if (!ready) {
      window.speechSynthesis.cancel()
      setReady(true)
      console.log('Speech unlocked')
    }
  }

  return (
    <Space>
      <Stars />
      <div
        className="relative z-10 w-full h-full flex items-center justify-center"
        onClick={() => {
          unlock()
          if (state === 'speaking') interrupt()
        }}
      >
        <Orb state={state} />
      </div>
      <Input onSend={(text) => {
        unlock()
        setState('thinking')
        setTimeout(() => speak(text), 500)
      }} />
    </Space>
  )
}