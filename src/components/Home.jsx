import React from 'react'
import style from './home.module.css'
import PlaylistCustomizer from './PlaylistCustomizer'
export default function Home ({ token }) {
  return (
    <>
      <div className={style.home} id='home'>
        <div className={style.home__container}>
          <h1 className={style.home__heading}>Become a Spotify <span>Disk Jockey</span></h1>
          <p className={style.home__description}>WIP ...</p>
          {/* <button className={style.main__btn}><a className={style.main__btn.a} href='#'>Create Your Playlist</a></button> */}
          <div className={style.main} id='about'>
            <PlaylistCustomizer token={token} />
          </div>
        </div>
      </div>
    </>
  )
}
