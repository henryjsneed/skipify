import React from 'react'
import style from './login.module.css'
import logo from '../assets/Spotify_Logo_RGB_White.png'
import icon from '../assets/Spotify_Icon_RGB_White.png'
import { authEndpoint, clientId, redirectUri, scopes } from '../config'

const Login = (token) => {
  return (
    <div className={style.page}>
      <nav className={style.navbar}>
        <div className={style.navbar__container}>
          <img className={style.navbar__img} src={logo} />
          <div className={style.navbar__toggle} id='mobile-menu' />
          <ul className={style.navbar__menu}>
            <li className={style.navbar__btn}>
              <a target='_blank' href='https://open.spotify.com' className={style.button} id='signup' rel='noreferrer'><img className={style.button__img} src={icon} />
                Play on Spotify
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className={style.home} id='home'>
        <div className={style.home__container}>
          <h1 className={style.home__heading}>Welcome to <span>Spot Jockey</span></h1>
          <p className={style.home__description}>Create Your First Perfectly Timed Spotify Playlist</p>
          <button className={style.main__btn}>
            {console.log('redirectURI', redirectUri)}
            {console.debug(`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`)}
            <a className={style.main__btn.a} href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`}>
              Login to Spotify
            </a>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
