import { useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'

const spotify = new SpotifyWebApi()

export default function useSpotify() {
  const [isConnected, setIsConnected] = useState(false)

  const connect = () => {
    window.location.href = 'http://127.0.0.1:3001/auth/login'
  }

  const init = () => {
    // Check URL params first (fresh login)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('access_token')

    if (urlToken) {
      spotify.setAccessToken(urlToken)
      setIsConnected(true)
      // Save to localStorage so it persists
      localStorage.setItem('jarvis_spotify_token', urlToken)
      localStorage.setItem('jarvis_spotify_token_time', Date.now().toString())
      window.history.replaceState({}, document.title, '/')
      console.log('✅ Spotify connected from login')
      return true
    }

    // Check localStorage for saved token
    const savedToken = localStorage.getItem('jarvis_spotify_token')
    const savedTime = localStorage.getItem('jarvis_spotify_token_time')

    if (savedToken && savedTime) {
      const age = Date.now() - parseInt(savedTime)
      const oneHour = 60 * 60 * 1000

      if (age < oneHour) {
        spotify.setAccessToken(savedToken)
        setIsConnected(true)
        console.log('✅ Spotify reconnected from storage')
        return true
      } else {
        // Token expired — clear it
        localStorage.removeItem('jarvis_spotify_token')
        localStorage.removeItem('jarvis_spotify_token_time')
        console.log('Spotify token expired — please reconnect')
      }
    }

    return false
  }

  const play = async (query) => {
    if (!isConnected) { console.log('Spotify not connected'); return }
    try {
      const result = await spotify.searchTracks(query, { limit: 1 })
      const track = result.tracks.items[0]
      if (track) {
        await spotify.play({ uris: [track.uri] })
        console.log('Playing:', track.name)
        return track.name
      }
    } catch (e) { console.error('Spotify play error:', e) }
  }

  const pause = async () => {
    try { await spotify.pause() } catch (e) { console.error(e) }
  }

  const next = async () => {
    try { await spotify.skipToNext() } catch (e) { console.error(e) }
  }

  const setVolume = async (percent) => {
    try { await spotify.setVolume(percent) } catch (e) { console.error(e) }
  }

  return { connect, init, play, pause, next, setVolume, isConnected }
}