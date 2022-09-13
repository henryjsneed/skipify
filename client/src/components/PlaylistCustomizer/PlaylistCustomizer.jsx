import React, { useState, useRef, useEffect } from 'react'
import Songs from '../SongSelector/SongSelector'
import SongTabs from '../SongTabs/SongTabs'
import styles from './playlistcustomizer.module.css'
import Player from '../Player/Player'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID
})

/* TODO:
      1. Correct fonts
      2. update for mobile
      3. draggability
      4. slider
      5. unify component style
*/

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

  const [trackProgress, setTrackProgress] = useState(0)

  const [showSavedSongs, setShowSavedSongs] = useState(true)

  const [totalSaved, setTotalSaved] = useState(500)

  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  const [activeTab, setActiveTab] = useState('')

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

  // const onChangeTrackProgress = (e) => {
  //   setTrackProgress(e.target.value)
  //   audioRef.current.currentTime = e.target.value
  // }

  const handleSelectedSongs = (event) => {
    event.preventDefault()
    setShowSavedSongs(false)
    // console.log('event', event.target.song_line._valueTracker._wrapperState.initialValue.track.name)
    setSelectedSongs(selectedSongs => [...selectedSongs, ...Array.from(event.target.song_line).filter(song => song.checked === true).map(song => JSON.parse(song.value))])
  }

  // useEffect(() => {
  //   if (selectedSongs.length > 0) setActiveTab(selectedSongs[currentSongIndex].name)
  // }, [selectedSongs])

  const updateActiveSong = (newSong) => {
    setCurrentSongIndex(selectedSongs.indexOf(newSong))
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

  const handleOnDragEnd = async (passed) => {
    if (!passed.destination) {
      console.log('failed')
      return
    }
    console.log('current song', selectedSongs[currentSongIndex].name)
    const currentSongName = selectedSongs[currentSongIndex].name
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
    setSelectedSongs([...items])

    if (newCurrentSongIndex > 0) {
      console.log('setting current song index to ', newCurrentSongIndex)
      setCurrentSongIndex(newCurrentSongIndex)
    }
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      spotifyApi.getMyCurrentPlaybackState().then(response => {
        setTrackProgress(response.body.progress_ms)
      })
      setTrackProgress()
      setIsPlaying(!isPlaying)
      spotifyApi.pause()
    } else {
      setIsPlaying(!isPlaying)
      const playOptions = {
        uris: [selectedSongs[currentSongIndex].uri],
        position_ms: trackProgress
      }
      await spotifyApi.play(playOptions).then(response => {
        console.log('now playing')
      })
        .catch((err) => {
          console.error(err)
          console.error('ERROR: Error playing song')
        })
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
            {/* TODO: TIME TRACKER PANEL LEFT OF SONGTABS */}
            <SongTabs selectedSongs={selectedSongs} skipToNext={skipToNext} activeSong={selectedSongs[currentSongIndex]} updateActiveSong={updateActiveSong} handleOnDragEnd={handleOnDragEnd} />
            {console.log('selectedSongs ', selectedSongs[currentSongIndex])}
            <Player
              title={selectedSongs[currentSongIndex].name}
              album={selectedSongs[currentSongIndex].album}
              artists={selectedSongs[currentSongIndex].artists}
              duration={selectedSongs[currentSongIndex].duration_ms}
              trackProgress={trackProgress}
              onPlayPause={handlePlayPause}
              isPlaying={isPlaying}
              nextTrack={skipToNext}
              selectedSongs={selectedSongs}
              currentSongIndex={currentSongIndex}
              prevTrack={skipToNext}
            />
          </div>

          )
        : null}
    </div>
  )
}

export default PlaylistCustomizer
