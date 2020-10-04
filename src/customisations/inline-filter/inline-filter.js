// @ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {DataTypes, NOT_IN} from '@heswell/utils';
import {GridContext, ColumnGroupContext} from "@heswell/grid";
import ColumnFilter from './column-filter';

export default function InlineFilter(){
  const {dataSource} = useContext(GridContext);
  const columnGroup = useContext(ColumnGroupContext);

  const [filter, setFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(null);

  useEffect(() => {
    const handleFilterChange = (_, filter) => {
      setFilter(filter);
    }
    dataSource.on('filter', handleFilterChange);
    return () => dataSource.removeListener('filter', handleFilterChange)
  },[dataSource]);

  const handleFilterOpen = column => {
    const { name } = column.isGroup ? column.columns[0] : column;
    if (showFilter !== name){
        setShowFilter(column.name);
    }
  }

  const handleFilterClose = () => {
    setShowFilter(null);
}

  const handleClearFilter = useCallback(column => {
    dataSource.filter({
        type: NOT_IN,
        colName: column.name,
        values: []
    }, DataTypes.ROW_DATA, true);
  },[]);

  return (
    <div className="inline-filter" style={{height: '100%'}}>
        {columnGroup.columns.map((column,idx) => 
          <ColumnFilter
            column={column}
            dataSource={dataSource}
            filter={filter}
            key={column.key}
            onClearFilter={handleClearFilter}
            onFilterClose={handleFilterClose}
            onFilterOpen={handleFilterOpen}
            showFilter={showFilter === column.name}
            style={{
              display: 'inline-block', 
              boxSizing: 'border-box', 
              width: column.width, 
              height: '100%', 
              borderRight: 'solid 1px #ccc',
              borderBottom: 'solid 1px #ccc'
            }}
          />
        )}
      </div>
  )
}