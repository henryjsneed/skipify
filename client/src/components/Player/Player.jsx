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
  onChangeTrackProgress,
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

  const currentProgress = (trackProgress / duration) * 100

  return (
    <div className={style.player__container}>
      <div className={style.now_playing}>
        <img src={album.images[0].url} />
      </div>
      <div className={style.now_playing}>
        <div className={style.now_playing__name}>{title}</div>
        <div className={style.now_playing__artist}>
          {album.name}
        </div>
        <table className={style.stats_table}>
          <thead className={style.stats_table_header}>
            <tr>
              <th style={{ borderRight: '2px solid black', borderBottom: '0px solid black' }}>Artist</th>
              <th style={{ borderRight: '2px solid black' }}>Popularity</th>
              <th style={{ borderBottom: '0px solid black' }}>Duration</th>
            </tr>
          </thead>
          <tbody className={style.stats_table_body}>
            <tr className={style.stats_table_body_row}>
              <td style={{ borderRight: '2px solid black' }}>{selectedSongs[currentSongIndex].artists[0].name}</td>
              <td style={{ borderRight: '2px solid black' }}>{selectedSongs[currentSongIndex].popularity}/100</td>
              <td>{toMinutesAndSeconds(selectedSongs[currentSongIndex].duration_ms)} minutes</td>
            </tr>
          </tbody>
        </table>
        <div className={style.now_playing__status} />

        <div className={style.audio_player_progress}>
          <input
            type='range'
            min='0'
            step='1'
            max={duration || 0}
            value={trackProgress}
            onChange={onChangeTrackProgress}
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
