import style from './player.module.css'
import { FaPlay, FaPause, FaFastForward, FaFastBackward } from 'react-icons/fa'
import classnames from 'classnames'
import { Table } from 'react-bootstrap'

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
  const trackProgressStyling = `linear-gradient(to right, #ffffff ${currentProgress}%, grey ${currentProgress}%)`

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
        <Table style={{ marginTop: '-10px' }} size='lg' responsive='lg' striped bordered hover variant='light'>
          <thead style={{ borderRight: '2px solid black', borderLeft: '2px solid black' }}>
            <tr>
              <th>Artist</th>
              <th>Popularity</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody style={{ borderRight: '2px solid black', borderLeft: '2px solid black' }}>
            <tr style={{ fontSize: '20px' }}>
              <td>{selectedSongs[currentSongIndex].artists[0].name}</td>
              <td style={{ fontWeight: 'bold', color: 'rgb(255, 34, 225)' }}>{selectedSongs[currentSongIndex].popularity}/100</td>
              <td>{toMinutesAndSeconds(selectedSongs[currentSongIndex].duration_ms)} minutes</td>
            </tr>
          </tbody>
        </Table>
        <div className={style.now_playing__status} />

        <div className={style.audio_player_progress}>
          <input
            type='range'
            min='0'
            step='1'
            max={duration || 0}
            value={trackProgress}
            onChange={onChangeTrackProgress}
            style={{ background: trackProgressStyling }}
          />
        </div>
        <div className={classnames(style.audio_controls)}>
          <button onClick={prevTrack}>
            <FaFastBackward size={20} />
            {/* <img src={prevIcon} /> */}
          </button>
          <div className={style.play_pause_btn}>
            <button onClick={onPlayPause}>
              {isPlaying
                ? (
                  <FaPause />
                  // <img style={{ marginTop: '5px' }} src={pauseBlackIcon} />
                  )
                : (<FaPlay />
                  // <img
                  //   style={{ marginLeft: '5px', marginTop: '5px' }}
                  //   src={playBlackIcon}
                  // />
                  )}
            </button>
          </div>
          <button onClick={nextTrack}>
            <FaFastForward size={20} />
            {/* <img src={nextIcon} /> */}
          </button>
        </div>

      </div>
      <div className={style.background} style={backgroundStyles} />{' '}
    </div>
  )
}

export default Player
