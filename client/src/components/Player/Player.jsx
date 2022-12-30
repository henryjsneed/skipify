import style from './player.module.css'
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa'
import classnames from 'classnames'

const Player = ({
  title,
  selectedSongs,
  currentSongIndex,
  album,
  artists,
  duration,
  trackProgress,
  onPlayPause,
  isPlaying,
  nextTrack,
  prevTrack
}) => {
  const backgroundStyles = {
    backgroundImage: `url(${album.images[0].url})`
  }
  const progressBarStyles = {
    width: (trackProgress * 100 / duration) + '%'
  }

  function toMinutesAndSeconds (millis) {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }

  const mySlider = document.getElementById('slider')
  // const sliderValue = document.getElementById('slider-value')

  function onChangeTrackProgress () {
    const valPercent = (mySlider.value / mySlider.max) * 100
    mySlider.style.background = `linear-gradient(to right, #3264fe ${valPercent}%, #d5d5d5 ${valPercent}%)`
    // sliderValue.textContent = mySlider.value
    onPlayPause()
  }

  const currentProgress = (trackProgress / duration) * 100

  return (
    <div className={style.player__container}>
      {/* <img src={album.images[0].url} className={style.now_playing__img} /> */}

      <div className={style.now_playing}>

        <div className={style.now_playing__title}>{title}</div>
        <div className={style.now_playing__album}>{album.name}</div>
        <table cellspacing='10' className={style.stats_table}>
          <thead className={style.stats_table_header}>
            <tr>
              <th>Artist</th>
              <th>Popularity</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody className={style.stats_table_body}>
            <tr className={style.stats_table_body_row}>
              <td>{selectedSongs[currentSongIndex].artists[0].name}</td>
              <td>{selectedSongs[currentSongIndex].popularity}/100</td>
              <td>{toMinutesAndSeconds(selectedSongs[currentSongIndex].duration_ms)} minutes</td>
            </tr>

          </tbody>
          <thead className={style.stats_table_header}>
            <tr>
              <th>Released</th>
              <th>Tack No.</th>
              <th>Explicit</th>
            </tr>
          </thead>
          <tbody>
            <tr className={style.stats_table_body_row}>
              <td>{selectedSongs[currentSongIndex].album.release_date}</td>
              <td>{selectedSongs[currentSongIndex].track_number}</td>
              <td>{selectedSongs[currentSongIndex].explicit === 'true' ? 'maybe' : 'nope'}</td>
            </tr>
          </tbody>
        </table>
        <div className={style.now_playing__status} />

        <div className={style.audio_player_progress}>
          <input
            type='range'
            min='0'
            max={duration || 100}
            value={selectedSongs[currentSongIndex].progress_ms}
            onChange={onChangeTrackProgress}
            id='slider'
          />
        </div>
        <div className={classnames(style.audio_controls)}>
          <button onClick={prevTrack}>
            <FaBackward size={20} />
          </button>
          <div className={style.play_pause_btn}>
            <button onClick={onPlayPause}>
              {isPlaying
                ? (
                  <FaPause />
                  )
                : (<FaPlay />
                  )}
            </button>
          </div>
          <button onClick={nextTrack}>
            <FaForward size={20} />
          </button>
        </div>

      </div>
      <div className={style.background} style={backgroundStyles} />{' '}
    </div>
  )
}

export default Player
