import React, {useEffect} from 'react';
import {FilterPanelHeader} from './filter-panel-header';
import {FilterToolbar} from '../filter-toolbar/filter-toolbar';

export const FilterPanel = ({
  children,
  classes,
  column,
  style,
  onHide,
  // onMouseDown is injected by Draggable, must be a better way to get this to FilterPanelGHeader - context ?
   onMouseDown = () => undefined,
  onSearch
}) => {

  useEffect(() => {
    console.log('FilterPanel MOUNT');
    return () => {
        console.log('FilterPanel UNMOUNT');
    }
  },[])

    return (
      <div className={classes.FilterPanel} style={style}>
        <FilterPanelHeader column={column} onMouseDown={onMouseDown} />
        <div className='filter-inner' style={{ flex: 1, flexDirection: 'column' }}>
            <FilterToolbar
              classes={classes} 
              inputWidth={column.width - 16}
              style={{ height: 25 }}
                // searchText={searchText}
                onSearchText={onSearch}
                onHide={onHide} />
                {children}
              <div key='footer' className='footer' style={{ height: 26 }}>
                <button className='filter-done-button' onClick={onHide}>Done</button>
            </div>
        </div>
      </div>

    )
}