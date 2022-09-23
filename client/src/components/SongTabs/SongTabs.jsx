import React, { useState, useEffect } from 'react'
import style from './songtabs.module.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function SongTabs ({ selectedSongs, activeSong, updateActiveSong, handleOnDragEnd, skipToNext }) {
  // const [activeTab, setActiveTab] = useState(children[0].props.label)

  const handleClick = (e, newSong) => {
    e.preventDefault()
    if (JSON.stringify(newSong) !== JSON.stringify(activeSong)) {
      updateActiveSong(newSong)
    }
  }

  // useEffect(() => {
  //   if (initialTab.tab) {
  //     setActiveTab(initialTab.tab);
  //     console.log(initialTab);
  //   }
  // }, []);

  // useEffect(() => {
  //   skipToNext(activeTab)
  // }, [activeTab])

  return (
    <div className={style.box}>
      <div className={style.dropZone}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId='listItems'>
            {(provided) => (
              <>
                <ul className={style.tabs} {...provided.droppableProps} ref={provided.innerRef}>
                  <h1 className={style.tabsTitle}>Lineup</h1>
                  {selectedSongs.map((song, index) => {
                    return (
                      <Draggable key={song.id} draggableId={song.name} index={index}>
                        {(provided) => (
                          <li
                            className={song.name === activeSong.name ? style.current : style.backlog}
                            ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          >
                            <a href='#' className={style.links} onClick={e => handleClick(e, song)}>
                              {song.name}
                            </a>
                          </li>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </ul>
              </>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
