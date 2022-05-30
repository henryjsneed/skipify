import Home from './components/Home'
import Login from './components/Login'
import hash from './hash'
import React, { useEffect, useState } from 'react'
export const authEndpoint = 'https://accounts.spotify.com/authorize'

function App () {
  const [token, setToken] = useState(null)
  useEffect(() => {
    document.body.style.background = 'red'
  }, [])

  useEffect(() => {
    const _token = hash.access_token

    if (_token) {
      setToken(_token)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(_token)
      )
    }
    const timeLimitMs = parseInt(hash.expires_in) * 1000
    setTimeout(() => {
      setToken(null)
      window.localStorage.clear()
    }, timeLimitMs)
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const token = JSON.parse(loggedUserJSON)
      setToken(token)
    }
  }, [])

  const handleToken = () => {

  }

  return (
    <>
      {token == null ? <Login handleToken={handleToken} token={token} /> : <Home token={token} />}
    </>
  )
}

export default App
