import style from './login.module.css'
import { authEndpoint, scopes, clientId, redirectUri } from '../../config'
import Navbar from '../Navbar/Navbar'
const Login = () => {
  const AUTH_URL = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=code&show_dialog=true`
  return (
    <div className={style.page}>
      <Navbar />
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
