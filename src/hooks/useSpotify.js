import { useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'

const spotify = new SpotifyWebApi()

export default function useSpotify() {
  const [isConnected, setIsConnected] = useState(false)

  const connect = () => {
    window.location.href = 'http://127.0.0.1:3001/auth/login'
  }

  const init = () => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token')
    if (token) {
      spotify.setAccessToken(token)
      setIsConnected(true)
      window.history.replaceState({}, document.title, '/')
      console.log('✅ Spotify connected')
      return true
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