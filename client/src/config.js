export const authEndpoint = 'https://accounts.spotify.com/authorize'

export const clientId = 'ebe4bf0df999442095fd498562628d05'
// export const redirectUri = encodeURIComponent([window.location.protocol, '//', window.location.host, window.location.pathname].join(''))
// export const redirectUri = 'http://localhost:3000/auth/callback'
export const redirectUri = 'http://localhost:3000'
export const scopes = [
  'user-top-read',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-library-read',
  'playlist-modify-public',
  'streaming',
  'user-read-email',
  'user-read-private'
]
