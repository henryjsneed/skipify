import { Form, Button, Modal, ModalBody, ModalFooter } from 'react-bootstrap'
import { useState } from 'react'
import style from './songselector.module.css'
import { MatchText, SearchProvider } from 'react-ctrl-f'

import { withTheme } from '@emotion/react'

export default function Songs ({ songs }) {
  /* <Form.Check
          className={style.song_checks}
          name='song_line'
          value={JSON.stringify(song.track)}
          key={song.track.name} type='checkbox'
          label={song.track.name + ' by ' + song.track.artists[0].name}
        /> */

  return songs.map(song => {
    return (
      // <div key={song.track.name}>
      //   <input key={song.track.name + 'I'} name='song_line' type='checkbox' className={style.song_checks} value={JSON.stringify(song.track)} />
      //   <MatchText id={song.track.name}>{song.track.name + ' by ' + song.track.artists[0].name}</MatchText>
      // </div>
      <Form.Check
        className={style.song_checks}
        name='song_line'
        value={JSON.stringify(song.track)}
        key={song.track.name} type='checkbox'
        label={<MatchText id={song.track.name}>{song.track.name + ' by ' + song.track.artists[0].name}</MatchText>}
      />
    )
  }
  )
}
