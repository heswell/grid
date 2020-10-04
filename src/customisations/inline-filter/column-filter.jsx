// @ts-nocheck
import React, { useRef, useEffect, useCallback, useState } from 'react';
import cx from 'classnames';
import {DataTypes, getFilterType, includesColumn, STARTS_WITH} from '@heswell/utils'
import {Draggable, useGridStyles} from '@heswell/grid';
import useFilterStyles from './use-styles';

import dataSourceFactory from './data-source-factory';

import {
    // FilterType,
    SetFilter,
    FilterPanel
} from '../filters';

import { PopupService } from '../popup-service/popup-service';
// import { PopupService } from '@heswell/popup';

const NO_COUNT = {}

//TODO do we nedd to tear down the filterSource ?
const ColumnFilter =  ({
    column,
    dataSource,
    filter,
    onClearFilter,
    onFilterOpen,
    onFilterClose,
    showFilter
}) => {

    useEffect(() => {
        console.log('ColumnFilter MOUNT');
        return () => {
            console.log('ColumnFilter UNMOUNT');
        }
    },[])

    const [filterType] = useState(getFilterType(column)); 
    const [stats, setStats] = useState(NO_COUNT);
    const [searchText, setSearchText] = useState('');
    const onDataCount = (_, stats) => {
        console.log(`setStats`, stats)
        setStats(stats);
    }
    const filterSource = useRef(dataSourceFactory(dataSource, filterType, column, onDataCount));
    const rootEl = useRef(null);
    const toggleFilterDisplay = () => {
        onFilterOpen(column);
    }

    const {HeaderCell} = useGridStyles();
    const classes = useFilterStyles();

    // close filter is a user action
    const closeFilter = () => {
        PopupService.hidePopup();
    }

    // hide fires when the filter has been closed
    const hideFilter = useCallback(() => {
        setTimeout(() => {
            // needs delay to ensure firing after ColumnFilter is rerendered with new 
            // clickhandler which would otherwise immediately re-open filter.
            onFilterClose();
        }, 50);
    },[]);

    const handleKeyDown = useCallback(e => {
        // use value directly from element so we have no dependency
        const value = e.target.value;
        if (e.keyCode === 13) { // ENTER
            if (value.trim() === ''){
                onClearFilter(column);
            } else {
                dataSource.filter({
                    type: STARTS_WITH,
                    colName: column.name,
                    value
               });
            }
        }
    },[]);

    const clearFilter = useCallback(() => {
        onClearFilter(column);
        setSearchText('');
    },[])

    const handleFilter = (/*filter*/) => {
        // Do we still need - see Numberfilter and group
    }

    useEffect(() => {
        if (showFilter){
            const component = getFilter();
            const el = rootEl.current;
            const { left, top } = el.getBoundingClientRect();
            // TODO without the timeout, it does not render until next render cycle
            requestAnimationFrame(() => {
                PopupService.showPopup({ left: Math.round(left), top: top - 32, component });
                // const test = <div style={{width: 100, height: 100, backgroundColor: 'yellow'}}/>;
                // PopupService.showPopup({ left: Math.round(left), top: top - 26, component: test });
            })
        }
    },[showFilter/*, filter, stats*/]);

    const moveFilter = (e, deltaX, deltaY) => {
        console.log(`move Filter by ${deltaX} ${deltaY}`)
        PopupService.movePopup(deltaX, deltaY);
    }

    const handleSearchText = value => {
        filterSource.current.filter({type: STARTS_WITH, colName: 'name', value}, DataTypes.FILTER_DATA, true);
    }

    // on unmount only ...
    useEffect(() => closeFilter, []);

    const getFilter = () => {
        // TODO how do we wire up the onMouseDown
        const childFilter = getFilterBody();
        return (
            <Draggable onDrag={moveFilter}>
                <FilterPanel
                classes={classes}
                    column={column}
                    style={{width: 300, height: 350}} 
                    onHide={closeFilter}
                    onSearch={handleSearchText}>
                    {childFilter}
                </FilterPanel>
            </Draggable>

        )
    }

    const getFilterBody = () => {
        if (!column.isGroup || column.columns.length === 1) {
            switch (filterType) {
                // case FilterType.Number:
                //     return (
                //         <NumberFilter
                //             column={column}
                //             style={{flex:1}}
                //             dataView={filterView.current}
                //             filter={filter}
                //             onHide={hideFilter} />
                //     );
                default:
                    return (
                        <SetFilter
                            column={column}
                            filter={filter}
                            dataSource={filterSource.current}
                            stats={stats} />
                    );
            }

        } else {
            // return <MultiColumnFilter
            //     column={column}
            //     height={261}
            //     width={300}
            //     filter={filter}
            //     dataView={dataView}
            //     onHide={hideFilter}
            //     onClose={closeFilter}
            //     onApplyFilter={handleFilter}
            // />;
        }
       
    }

    const isActive = includesColumn(filter, column);
    const className = cx(HeaderCell, classes.filter, { 
        [classes.active]: isActive, 
        'filter-showing': showFilter 
    });

    return (
        // we only need care about opening the filter - the Popup service will close if for us.
        <div ref={rootEl} className={className} style={{ padding: 0, width: column.width }}>
            <div className={classes.filterButton} onClick={toggleFilterDisplay}>
                <i className="material-icons">filter_list</i>
            </div>
            <div className={classes.filterInputContainer}>
                <input className={classes.filterInput} type='text'
                    onChange={e => setSearchText(e.target.value)}
                    onKeyDown={handleKeyDown} value={searchText}/>
            </div>
            {isActive &&
                <div className={classes.filterClearButton} onClick={clearFilter}>
                    <i className="material-icons">cancel</i>
                </div>}
        </div>
    );
}

export default ColumnFilter;