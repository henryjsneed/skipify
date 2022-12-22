import style from './navbar.module.css'
import logo from '../../assets/Spotify_Logo_CMYK_White.png'
import icon from '../../assets/Spotify_Icon_RGB_White.png'

const Navbar = () => {
  return (
    <nav className={style.navbar}>
      <div className={style.navbar__container}>
        <img className={style.navbar__img} src={logo} />
        <h1 className={style.navbar__header}>Skipify</h1>
        <a target='_blank' href={process.env.REACT_APP_SPOTIFY_URL} className={style.button} id='signup' rel='noreferrer'><img className={style.button__img} src={icon} />
          Play on Spotify
        </a>
      </div>
    </nav>
  )
}

export default Navbar
