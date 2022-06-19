import { useState, useEffect } from 'react'
import axios from 'axios'

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { access_token, refresh_token, expires_in }
        } = await axios.post('http://localhost:3001/login', {
          code
        })
        console.log('this is acces', access_token)
        setAccessToken(access_token)
        setRefreshToken(refresh_token)
        setExpiresIn(expires_in)
        window.history.pushState({}, null, '/')
      } catch (error) {
        console.log(' his im am client this is error: ', error)
        window.location = '/'
      }
    })()
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(async () => {
      try {
        const {
          data: { access_token, expires_in }
        } = await axios.post('http://localhost:3001/refresh', {
          refreshToken
        })
        setAccessToken(access_token)
        setExpiresIn(expires_in)
      } catch {
        window.location = '/'
      }
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}

export default useAuth