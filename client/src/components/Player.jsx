import style from './player.module.css'
const Player = ({ item, progressMs, isPlaying }) => {
  const backgroundStyles = {
    backgroundImage: `url(${item.album.images[0].url})`
  }

  const progressBarStyles = {
    width: (progressMs * 100 / item.duration_ms) + '%'
  }
  return (
    <div className={style.player__container}>
      <div className={style.now_playing__img}>
        <img src={item.album.images[0].url} />
      </div>
      <div className={style.now_playing__side}>
        <div className={style.now_playing__name}>{item.name}</div>
        <div className={style.now_playing__artist}>
          {item.artists[0].name}
        </div>
        <div className={style.now_playing__status}>
          {isPlaying ? 'Playing' : 'Paused'}
        </div>
        <div className={style.progress}>
          <div
            className={style.progress__bar}
            style={progressBarStyles}
          />
        </div>
      </div>
      <div className={style.background} style={backgroundStyles} />{' '}
    </div>
  )
}

export default Player
