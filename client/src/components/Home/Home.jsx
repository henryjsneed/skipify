import style from './home.module.css'
import { useEffect } from 'react'
import PlaylistCustomizer from '../PlaylistCustomizer/PlaylistCustomizer'
import Login from '../Login/Login'
import authService from '../../services/AuthService'
export default function Home ({ code }) {
  console.log(code)
  const token = authService(code)
  return (
    token ? <PlaylistCustomizer token={token} /> : <></>
  )
}
