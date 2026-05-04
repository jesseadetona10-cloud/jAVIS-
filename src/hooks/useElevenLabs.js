export default function useElevenLabs() {
  const speak = async (text, onStart, onEnd) => {
    try {
      if (onStart) onStart()

      // Cancel any current speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Get available voices and find British one
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices()

        // Try to find a British voice
        const british = voices.find(v =>
          v.lang === 'en-GB' ||
          v.name.includes('British') ||
          v.name.includes('Daniel') ||
          v.name.includes('Arthur') ||
          v.name.includes('Google UK')
        )

        if (british) {
          utterance.voice = british
          console.log('Using voice:', british.name)
        } else {
          // Fall back to first English voice
          const english = voices.find(v => v.lang.startsWith('en'))
          if (english) utterance.voice = english
        }

        utterance.rate  = 0.95
        utterance.pitch = 0.85
        utterance.volume = 1

        utterance.onstart = () => {
          if (onStart) onStart()
        }

        utterance.onend = () => {
          if (onEnd) onEnd()
        }

        utterance.onerror = () => {
          if (onEnd) onEnd()
        }

        window.speechSynthesis.speak(utterance)
      }

      // Voices may not be loaded yet
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true })
      } else {
        setVoice()
      }

      // Return a fake audio object so interrupt works
      return {
        pause: () => window.speechSynthesis.cancel()
      }

    } catch (e) {
      console.error('Speech error:', e)
      if (onEnd) onEnd()
    }
  }

  return { speak }
}