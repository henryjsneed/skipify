import SpotifyWebApiNode from 'spotify-web-api-node'

import { clientId } from '../config'

const spotifyApi = new SpotifyWebApiNode({
  clientId: clientId
})

const setAccess = async (token) => {
  spotifyApi.setAccessToken(token)
}

const getUserId = async () => {
  spotifyApi.getMe()
    .then((response) => {
      console.log('Logged in user: ' + response.id)
      return response.id
    })
    .catch((e) => {
      console.error(e)
      console.log('Error retrieving user id')
    })
}

const getSavedSongs = async (totalSaved) => {
  console.log('called getSavedSongs')
  const offset = 50
  for (let i = 0; i < totalSaved; i += offset) {
    spotifyApi.getMySavedTracks({ limit: offset, offset: i })
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.error(err)
        console.error('ERROR: Error retrieving saved tracks')
      })
  }
}

const makePlaylist = async (userId, playlistName) => {
  spotifyApi.createPlaylist(userId,
    {
      name: playlistName,
      description: 'twhatever',
      public: true
    })
    .then((response) => {
      return response
    })
    .catch((e) => {
      console.error(e)
      console.error('Error creating playlist')
    })
}

const functions = {
  setAccess,
  getUserId,
  getSavedSongs,
  makePlaylist
}

export default functions
