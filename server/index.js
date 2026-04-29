const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const app = express()
app.use(cors())
app.use(express.json())

const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = 'http://127.0.0.1:3001/auth/callback'

app.get('/auth/login', (req, res) => {
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'playlist-read-private',
  ].join(' ')

  const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`
  res.redirect(url)
})

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    )
    const { access_token, refresh_token } = response.data
    res.redirect(`http://localhost:5173?access_token=${access_token}&refresh_token=${refresh_token}`)
  } catch (e) {
    console.error('Token error:', e.response?.data)
    res.status(500).json({ error: 'Token exchange failed' })
  }
})

app.listen(3001, () => console.log('✅ Jarvis server running on port 3001'))