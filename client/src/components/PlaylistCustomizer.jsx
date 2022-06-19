import React, { useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import Songs from './SongSelector'
import SongTabs from './SongTabs'
import styles from './playlistcustomizer.module.css'
import Player from './Player'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID
})

const PlaylistCustomizer = ({ token }) => {
  const defaultPlaylistName = 'test'

  const [isLoading, setLoading] = useState(false)

  const [playlistName, setPlaylistName] = useState(defaultPlaylistName)

  const [userId, setUserId] = useState(null)

  const [playlistId, setPlaylistId] = useState(null)

  const [retrievedSongs, setRetrievedSongs] = useState(false)

  const [selectedSongs, setSelectedSongs] = useState([])

  const [savedSongs, setSavedSongs] = useState([])

  const [targetElement, setTargetElement] = useState(null)

  const [showSavedSongs, setShowSavedSongs] = useState(true)

  const [totalSaved, setTotalSaved] = useState(500)

  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  const [item, setItem] = useState(
    {
      album: {
        images: [{ url: '' }]
      },
      name: '',
      artists: [{ name: '' }],
      duration_ms: 0
    })

  const [isPlaying, setIsPlaying] = useState('Paused')
  const [progressMs, setProgressMs] = useState(0)
  const [no_data, setNoData] = useState(false)

  /**
   * infinite scroll: (not useful for current implementation which needs songs to be searchable without delay)
   *
    const prevY = useRef(0) // storing the last intersection y position
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    }
    async function handleObserver (entities, observer) {
      const y = entities[0].boundingClientRect.y
      if (prevY.current > y) {
        await getSavedSongs()
      }
      prevY.current = await y
    }
    const observer = useRef(new IntersectionObserver(handleObserver, options))
*/

  useEffect(() => {
    spotifyApi.setAccessToken(token)
  }, [token])

  useEffect(async function () {
    await getUserId()
    await getSavedSongs()
  }, [token])

  useEffect(() => {
    console.log('PlaylistCustomizer rendered')
  })

  async function getUserId () {
    spotifyApi.getMe()
      .then((response) => {
        setUserId(response.id)
        console.log('Logged in user: ' + response.id)
      })
      .catch((e) => {
        console.error(e)
        console.log('Error retrieving user id')
      })
  }

  async function getSavedSongs () {
    const offset = 50
    for (let i = 0; i < totalSaved; i += offset) {
      await spotifyApi.getMySavedTracks({ limit: offset, offset: i })
        .then((response) => {
          setTotalSaved(response.total)
          setSavedSongs(savedSongs => [...savedSongs, ...response.body.items])
        })
        .catch((err) => {
          console.error(err)
          console.error('ERROR: Error retrieving saved tracks')
        })
    }
    setRetrievedSongs(true)
  }

  const skipToNext = async (songName) => {
    const ind = selectedSongs.findIndex(song => {
      return song.name === songName
    })

    console.log('index of song to skip to', ind)
    console.log('current index recorded', currentSongIndex)
    const index = ind - currentSongIndex
    console.log('skip this many times', index)
    await spotifyApi.setVolume(0.0)
    // const index = numberToSkip - currentSongIndex
    const idx = Math.abs(index)
    if (index > 0) {
      for (let i = 0; i < idx; i++) {
        await spotifyApi.setVolume(0.0)
        await spotifyApi.skipToNext()
      }
    } else {
      for (let i = 0; i < idx; i++) {
        await spotifyApi.setVolume(0.0)
        await spotifyApi.skipToPrevious()
      }
    }
    await spotifyApi.setVolume(100)
    setCurrentSongIndex(ind)
  }

  // useEffect(() => {
  //   if (targetElement) {
  //     observer.current.observe(targetElement)
  //   }
  // }, [targetElement])

  const handleSelectedSongs = (event) => {
    event.preventDefault()
    setShowSavedSongs(false)
    // console.log('event', event.target.song_line._valueTracker._wrapperState.initialValue.track.name)
    setSelectedSongs(selectedSongs => [...selectedSongs, ...Array.from(event.target.song_line).filter(song => song.checked === true).map(song => JSON.parse(song.value))])
  }

  async function createPlaylist () {
    await spotifyApi.createPlaylist(userId,
      {
        name: playlistName,
        description: 'twhatever',
        public: true
      })
      .then((response) => {
        setPlaylistId(response.id)
      })
      .catch((e) => {
        console.error(e)
        console.error('Error creating playlist')
      })
  }

  // async function getPlaybackState () {
  //   await spotifyApi.getMyCurrentPlaybackState()
  //     .then(response => { console.log(response); return (setProgress(response.progress_ms)) })
  // }

  function toMinutesAndSeconds (millis) {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }

  const handleOnDragEnd = async (passed) => {
    if (!passed.destination) {
      console.log('failed')
      return
    }
    console.log('current song', selectedSongs[currentSongIndex].name)
    const currentSongName = selectedSongs[currentSongIndex].name
    console.log('this is the current song name', currentSongName)
    // const ind = selectedSongs.findIndex(song => {
    //   return song.name === songName
    // })

    const items = selectedSongs.slice()
    const [reorderedItem] = items.splice(passed.source.index, 1)
    items.splice(passed.destination.index, 0, reorderedItem)
    const newCurrentSongIndex = items.findIndex(song => {
      return song.name === currentSongName
    })
    // if passed.source.name === selectedSongs.find(currentSongIndex)

    console.log('this is the new current song index', newCurrentSongIndex)
    // if passed.destination.name === selectedSongs.find(currentSong)
    setSelectedSongs([...items])

    // if selected songs is not updating in time setting the current song will mess shit up
    if (newCurrentSongIndex > 0) {
      console.log('setting current song index to ', newCurrentSongIndex)
      setCurrentSongIndex(newCurrentSongIndex)
    }
  }

  // function LoadingButton () {
  //   const handleClick = async () => {
  //     setLoading(true)
  //     await createPlaylist()
  //     setLoading(false)
  //   }

  //   return (

  //     <Button
  //       variant='outline-dark'
  //       disabled={isLoading}
  //       onClick={!isLoading ? handleClick : null}
  //     >
  //       {isLoading ? 'Loading…' : 'Click to load'}
  //     </Button>
  //   )
  // }
  return (
    <div>
      {retrievedSongs ? <Songs showSavedSongs={showSavedSongs} reference={setTargetElement} songs={savedSongs} handleSelectedSongs={handleSelectedSongs} /> : <></>}

      {selectedSongs.length > 0
        ? (
          <div className={styles.container}>
            <SongTabs skipToNext={skipToNext} handleOnDragEnd={handleOnDragEnd}>
              {selectedSongs.map(
                song => {
                  return (
                    <div key={song.id} label={song.name} id={song.id}>
                      <h2 style={{ marginTop: '-16px', paddingBottom: '2px', borderBottom: '0px solid black', borderTop: '2px solid black', borderLeft: '2px solid black', borderRight: '2px solid black' }}>{song.name}</h2>
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
                            <td>{song.artists[0].name}</td>
                            <td style={{ fontWeight: 'bold', color: 'rgb(255, 34, 225)' }}>{song.popularity}/100</td>
                            <td>{toMinutesAndSeconds(song.duration_ms)} minutes</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  )
                }
              )}
            </SongTabs>
            {/* TODO: create custom player to replace spotify player */}
            <Player item={selectedSongs[currentSongIndex]} progressMs='1' isPlaying={false} />
            {/* <SpotifyPlayer
              key={selectedSongs.id}
              token={token}
              uris={selectedSongs.map((song, index) => {
                console.log('current song index', currentSongIndex)
                console.log(`${index}:`, song.name)
                return song.uri
              })}
            /> */}
          </div>

          )
        : null}
    </div>
  )
}

export default PlaylistCustomizer
