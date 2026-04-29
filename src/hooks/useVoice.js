import { useEffect, useRef } from 'react'

export default function useVoice({ onWake, onCommand, onStateChange }) {
  const recognition = useRef(null)
  const synthesis = useRef(window.speechSynthesis)
  const isAwake = useRef(false)
  const isRunning = useRef(false)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.current = new SpeechRecognition()
    recognition.current.continuous = true
    recognition.current.interimResults = false
    recognition.current.lang = 'en-US'

    const startRecognition = () => {
      if (isRunning.current) return
      try {
        recognition.current.start()
        isRunning.current = true
        console.log('🎙️ Listening...')
      } catch (e) {
        console.log('Start error:', e.message)
      }
    }

    recognition.current.onstart = () => {
      isRunning.current = true
    }

    recognition.current.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase()
      console.log('Heard:', transcript)

      if (transcript.includes('jarvis')) {
        isAwake.current = true
        onStateChange('listening')
        onWake()
        return
      }

      if (isAwake.current) {
        isAwake.current = false
        onStateChange('thinking')
        onCommand(transcript)
      }
    }

    recognition.current.onerror = (e) => {
      console.log('Speech error:', e.error)
      isRunning.current = false
      if (e.error === 'aborted') return
      setTimeout(startRecognition, 1000)
    }

    recognition.current.onend = () => {
      isRunning.current = false
      setTimeout(startRecognition, 300)
    }

    startRecognition()

    return () => {
      isRunning.current = false
      recognition.current.onend = null
      recognition.current.stop()
    }
  }, [])

  const speak = (text, onDone) => {
    synthesis.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 0.9
    utterance.volume = 1
    utterance.onstart = () => onStateChange('speaking')
    utterance.onend = () => {
      onStateChange('idle')
      if (onDone) onDone()
    }
    synthesis.current.speak(utterance)
  }

  const interrupt = () => {
    synthesis.current.cancel()
    onStateChange('listening')
  }

  return { speak, interrupt }
}