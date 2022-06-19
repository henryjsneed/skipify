import style from './login.module.css'
import logo from '../assets/Spotify_Logo_RGB_White.png'
import icon from '../assets/Spotify_Icon_RGB_White.png'
import { authEndpoint, scopes } from '../config'

const Login = (token) => {
  const AUTH_URL = `${authEndpoint}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=${scopes.join('%20')}&response_type=code&show_dialog=true`
  return (
    <div className={style.page}>
      <nav className={style.navbar}>
        <div className={style.navbar__container}>
          <img className={style.navbar__img} src={logo} />
          <div className={style.navbar__toggle} id='mobile-menu' />
          <ul className={style.navbar__menu}>
            <li className={style.navbar__btn}>
              <a target='_blank' href={process.env.REACT_APP_SPOTIFY_URL} className={style.button} id='signup' rel='noreferrer'><img className={style.button__img} src={icon} />
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
            <a className={style.main__btn.a} href={AUTH_URL}>
              Login to Spotify
            </a>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
