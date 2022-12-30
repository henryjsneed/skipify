import React, { useState, useContext, useRef, useEffect, useCallback } from 'react'
import Songs from '../SongSelector/SongSelector'
import SongTabs from '../SongTabs/SongTabs'
import styles from './playlistcustomizer.module.css'
import Player from '../Player/Player'
import Search from '../Search/Search'
import Navbar from '../Navbar/Navbar'
import {
  MatchText,
  SearchProvider,
  SearchContext,
  SearchEventContext
} from 'react-ctrl-f'
import { Form, Button } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import style from '../SongSelector/songselector.module.css'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID
})

/* TODO:
      1. Correct fonts
      2. adapt for mobile
      3. Fix dragging glitch
      4. slider
      5. unify component style
      6. Add randomly generated dynamic color scheme
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

  const [isPlaying, setIsPlaying] = useState(false)
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
    // console.log('PlaylistCustomizer rendered')
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

  const playNewSongFromSelected = async (newSongIndex) => {
    setCurrentSongIndex(newSongIndex)
    setTrackProgress(0)
    setIsPlaying(true)
    const playOptions = {
      uris: [selectedSongs[newSongIndex].uri],
      position_ms: 0
    }
    await spotifyApi.play(playOptions).then(response => {
      console.log('now playing')
    })
      .catch((err) => {
        console.error(err)
        console.error('ERROR: Error playing song')
      })
  }

  const skipToNext = async () => {
    let newSongIndex
    if (currentSongIndex === selectedSongs.length - 1) {
      newSongIndex = 0
    } else {
      newSongIndex = currentSongIndex + 1
    }
    playNewSongFromSelected(newSongIndex)
  }

  const skipToPrev = async () => {
    let newSongIndex
    if (currentSongIndex === 0) {
      newSongIndex = selectedSongs.length - 1
    } else {
      newSongIndex = currentSongIndex - 1
    }
    playNewSongFromSelected(newSongIndex)
  }

  const updateActiveSong = async (newSong) => {
    console.log('this is selected songs array:', selectedSongs)
    setIsPlaying(true)

    console.log('active index updated to ', selectedSongs.indexOf(newSong))
    setTrackProgress(0)
    const newSongIndex = selectedSongs.indexOf(newSong)
    playNewSongFromSelected(newSongIndex)
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

  // slider()

  const handleSelectedSongs = (event) => {
    event.preventDefault()
    setShowSavedSongs(false)
    // console.log('event', event.target.song_line._valueTracker._wrapperState.initialValue.track.name)
    setSelectedSongs(selectedSongs => [...Array.from(event.target.song_line).filter(song => song.checked === true).map(song => JSON.parse(song.value))])
  }

  // useEffect(() => {
  //   if (selectedSongs.length > 0) setActiveTab(selectedSongs[currentSongIndex].name)
  // }, [selectedSongs])

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
  const [search, setSearch] = useState('')

  const handleChange = e => {
    console.log('handle change call')
    e.preventDefault()
    if (e.keyCode !== 13 && e.key !== 'Enter' && e.key !== 13) setSearch(e.target.value)
  }

  const handleOnDragEnd = async (passed) => {
    if (!passed.destination) {
      console.log('failed')
      return
    }
    console.log('current song', selectedSongs[currentSongIndex].name)
    const currentSongName = selectedSongs[currentSongIndex].name
    const items = selectedSongs.slice()
    const [reorderedItem] = items.splice(passed.source.index, 1)
    items.splice(passed.destination.index, 0, reorderedItem)
    const newCurrentSongIndex = items.findIndex(song => {
      return song.name === currentSongName
    })
    setSelectedSongs([...items])
    console.log('setting current song index to ', newCurrentSongIndex)
    setCurrentSongIndex(newCurrentSongIndex)
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
  const onCustomScroll = useCallback((id, fixedHeaderHeight) => {
    const dom = document.getElementById(id)
    if (dom) {
      document.getElementById(id).scrollIntoView({ block: 'center' })
    }
  }, [])

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
    <div className={style.container}>
      <Navbar />
      <Form
        style={{ width: window.innerWidth * 0.30 }}
        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
        className={style.song_form}
        onSubmit={handleSelectedSongs}
      >
        <SearchProvider value={{ fixedHeaderHeight: 900, onScroll: onCustomScroll }}>
          {/* <h1 className={style.song_search_title}>________</h1> */}
          <Search />
          <div className={style.song_body}>
            <Form.Group className={style.song_form_group} style={{ maxHeight: window.innerHeight * 0.79 }}>
              <Songs showSavedSongs={showSavedSongs} reference={setTargetElement} songs={savedSongs} handleSelectedSongs={handleSelectedSongs} />
            </Form.Group>
            {/* <div ref={reference} /> */}
          </div>
          <div className={style.song_footer}>
            <Button type='submit' className={style.submit_button} />
          </div>
        </SearchProvider>
      </Form>

      {/* TODO: TIME TRACKER PANEL LEFT OF SONGTABS */}
      {selectedSongs.length > 0
        ? (
          <div style={{ display: 'flex', background: 'grey' }}>
            <img src={selectedSongs[currentSongIndex].album.images[0].url} className={styles.now_playing_img} />

            <SongTabs selectedSongs={selectedSongs} skipToNext={skipToNext} activeSong={selectedSongs[currentSongIndex]} updateActiveSong={updateActiveSong} handleOnDragEnd={handleOnDragEnd} />
            {console.log('selectedSong object: ', selectedSongs[currentSongIndex])}

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
              prevTrack={skipToPrev}
              style={{ float: 'right' }}/// //////////create tab open up
            />
          </div>
          )
        : <></>}
    </div>
  )
}

export default PlaylistCustomizer
