import React from 'react'
import PropTypes from 'prop-types'
import Slider from '@mui/material/Slider'
import styles from './songstats.module.css'

function SongStats ({ children, activeTab, value2, handleChange2 }) {
  function valuetext (value) {
    return `${value}°C`
  }

  return (
    <div className={styles.table}>
      {children.map((one, index) => {
        if (one.props.label === activeTab) {
          return (
            <>
              <div key={one.props.label} className={styles.content}>
                {one.props.children}
              </div>
              <Slider
                getAriaLabel={() => 'Minimum distance shift'}
                value={value2}
                onChange={handleChange2}
                valueLabelDisplay='auto'
                sx={{
                  width: '700px',
                  color: '#ff22e1',
                  '& .MuiSlider-thumb': {
                    borderRadius: '1px'
                  }
                }}
                getAriaValueText={valuetext}
                disableSwap
              />
            </>
          )
        } else {
          return null
        }
      })}
    </div>
  )
}

SongStats.propTypes = {}

export default SongStats
