// import { style } from '@mui/system'
import React, { useContext } from 'react'
import { SearchContext, SearchEventContext } from 'react-ctrl-f'
import style from './search.module.css'
export const SearchComponent = () => {
  const { searchValue, activeCount, totalCount } = useContext(SearchContext)
  const { onSearchChange, onPrev, onNext } = useContext(SearchEventContext)

  return (
  // <div style={{ padding: 16 }}>
    <input
      // style={{ width: 200, marginRight: '12px', height: '24px' }}
      value={searchValue}
      placeholder='Search'
      onChange={onSearchChange}
      className={style.song_search_input_box}
      onKeyPress={(e) => { e.key === 'Enter' && onNext() }}

    />
  )
}

export default SearchComponent
