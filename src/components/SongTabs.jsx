import React, { useState, useEffect } from 'react'
import style from './songtabs.module.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Slider from '@mui/material/Slider'
import SongStats from './SongStats'

const minDistance = 10

export default function SongTabs ({ children, handleCustomized, handleOnDragEnd, skipToNext }) {
  const [activeTab, setActiveTab] = useState(children[0].props.label)
  const [staticSongs, setStaticSongs] = useState([])
  const [value2, setValue2] = React.useState([20, 37])

  const handleClick = (e, newActiveTab) => {
    e.preventDefault()
    setActiveTab(newActiveTab)
  }

  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance)
        setValue2([clamped, clamped + minDistance])
      } else {
        const clamped = Math.max(newValue[1], minDistance)
        setValue2([clamped - minDistance, clamped])
      }
    } else {
      setValue2(newValue)
    }
  }

  // useEffect(() => {
  //   if (initialTab.tab) {
  //     setActiveTab(initialTab.tab);
  //     console.log(initialTab);
  //   }
  // }, []);

  useEffect(() => {
    skipToNext(activeTab)
  }, [activeTab])

  return (
    <div className={style.box}>
      <div className={style.dropZone}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId='listItems'>
            {(provided) => (
              <ul className={style.tabs} {...provided.droppableProps} ref={provided.innerRef}>
                {children.map((song, index) => {
                  const label = song.props.label
                  return (
                    <Draggable key={song.props.id} draggableId={label} index={index}>
                      {(provided) => (
                        <li
                          className={label === activeTab ? style.current : ''}
                          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        >
                          <a href='#' className={style.links} onClick={e => handleClick(e, label)}>
                            {label}
                          </a>
                        </li>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <SongStats activeTab={activeTab} value2={value2} handleChange2={handleChange2}>{children}</SongStats>
    </div>
  )
}
