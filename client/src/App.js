import Home from './components/Home'
import Login from './components/Login'
// import hash from './hash'
import React, { useEffect, useState } from 'react'

function App () {
  const code = new URLSearchParams(window.location.search).get('code')

  // add the following to save code on refresh in local storage

  // useEffect(() => {
  // const _token = hash.access_token
  //   if (_token) {
  //     setToken(_token)
  //     window.localStorage.setItem(
  //       'loggedUser', JSON.stringify(_token)
  //     )
  //   }
  //   if (hash.expires_in) {
  //     const timeLimitMs = parseInt(hash.expires_in) * 1000
  //     setTimeout(() => {
  //       setToken(null)
  //       console.log('logging out')
  //       window.localStorage.clear()
  //     }, timeLimitMs)
  //   }
  // }, [])

  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem('loggedUser')
  //   if (loggedUserJSON) {
  //     const token = JSON.parse(loggedUserJSON)
  //     setToken(token)
  //   }
  // }, [])

  return (
    <>
      {code ? <Home code={code} /> : <Login />}
    </>
  )
}

export default App
