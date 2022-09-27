import { Form, Button, Modal, ModalBody, ModalFooter } from 'react-bootstrap'
import { useState } from 'react'
import style from './songselector.module.css'
import { withTheme } from '@emotion/react'

export default function Songs ({ songs, reference, showSavedSongs, handleSelectedSongs }) {
  const [search, setSearch] = useState('')

  const handleChange = e => {
    console.log('handle change call')
    e.preventDefault()
    if (e.keyCode !== 13 && e.key !== 'Enter' && e.key !== 13) setSearch(e.target.value)
  }

  const filteredSongs = songs.filter(song =>
    song.track.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={style.song_modal_parent}>
      <Modal show={showSavedSongs} size='lg' className={style.song_modal}>
        <Form
          onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
          className={style.song_modal_form}
          onSubmit={handleSelectedSongs}
        >
          {/* <Modal.Header size='sm'>
          <center><Form.Label htmlFor='exampleColorInput' style={headerStyle}>Select Songs</Form.Label></center>
        </Modal.Header> */}
          <div className={style.song_search}>
            <h1 className={style.song_search_title}>Choose songs</h1>
            <form className={style.song_search_form}>
              <input
                type='text'
                placeholder='Search'
                className={style.song_search_input_box}
                onChange={handleChange}
                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
              />
            </form>
          </div>
          <ModalBody className={style.song_modal_body} style={{ maxHeight: window.innerHeight * 0.6 }}>

            <Form.Group className={style.song_form_group}>
              {/* <Form.Control
              type='color'
              id='exampleColorInput'
              defaultValue='#563d7c'
              title='Choose your color'
            /> */}
              {filteredSongs.map(song => {
                return (
                  <Form.Check
                    className={style.song_checks}
                    name='song_line'
                    value={JSON.stringify(song.track)}
                    key={song.track.name} type='checkbox'
                    label={song.track.name + ' by ' + song.track.artists[0].name}
                  />
                )
              }
              )}
            </Form.Group>
            <div ref={reference} />

          </ModalBody>
          <ModalFooter className={style.song_modal_footer}>
            <Button type='submit' className={style.modal_submit_button}></Button>
          </ModalFooter>
        </Form>

      </Modal>
    </div>
  )
}
