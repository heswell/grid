// @ts-nocheck
import React, { useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {ThemeProvider} from 'react-jss';
import { SET_FILTER_DATA_COLUMNS, extractFilterForColumn } from '@heswell/utils';
import CheckList from '../check-list/check-list';
import {FilterCounts} from '../filter-counts';
import useStyles from '../../inline-filter/use-styles';
import checkboxTheme from './checkbox-theme';
const NO_STYLE = {}

const SET_FILTER_DATA_COLUMNS_NO_COUNT = SET_FILTER_DATA_COLUMNS.filter(col => col.name !== 'count');

const FitContent = ({children}) => {
    const el = useRef(null);
    const [[width, height], setSize] = useState([0,0]);
    useEffect(() => {
        const {width, height} = el.current.getBoundingClientRect();
        console.log(`width = ${width} height=${height}`)
        setSize([width, height])
    },[])
    if (width === 0 && height === 0){
        return <div ref={el} style={{width: '100%', height: '100%'}} />
    } else {
        return children(width, height)
    }
}

export const SetFilter = ({
    className,
    column,
    dataSource,
    filter,
    stats,
    style=NO_STYLE

}) => {


    useEffect(() => {
        console.log('SetFilter MOUNT');
        return () => {
            console.log('SetFilter UNMOUNT');
        }
    },[])

    const classes = useStyles();

    const columnFilter = extractFilterForColumn(filter, column.name);

    // somehow this needs to dispatch model-reducer if it's a change
    const filterColumns = filter === null || columnFilter === filter
        ? SET_FILTER_DATA_COLUMNS_NO_COUNT
        : SET_FILTER_DATA_COLUMNS
    console.log(`SetFilter`, dataSource)
    return (
        <div className={cx(classes.SetFilter, className)} style={style}>
            <ThemeProvider theme={checkboxTheme}>
            <FitContent>
                {(width, height) =>
                <CheckList
                    className={classes.SetList}
                    columnSizing="fill"
                    columns={filterColumns}
                    dataSource={dataSource}
                    height={height}
                    width={width} />}
            </FitContent>
            </ThemeProvider>
            <FilterCounts
                classes={classes}
                column={column}
                style={{ height: 50 }}
                stats={stats} />
        </div>
    );
}
