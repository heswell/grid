import React from 'react';
import ColumnGroupHeader from "./column-group-header";

import useStyles from './use-styles';

export default function GridHeader({gridModel, scrollableHeaderRef, onColumnDrag}){

  const classes = useStyles();
  
  return (
    <div className={classes.headerContainer} style={{ height: gridModel.headerHeight * gridModel.headingDepth }}>
    {gridModel.columnGroups.map((columnGroup, idx) => (
      <ColumnGroupHeader
        columnGroup={columnGroup}
        columnGroupIdx={idx}
        depth={gridModel.headingDepth}
        height={gridModel.headerHeight}
        key={idx}
        onColumnDrag={onColumnDrag}
        ref={columnGroup.locked ? null : scrollableHeaderRef}
        sortColumns={gridModel.sortColumns}
        width={columnGroup.width}
      />
    ))}
  </div>

  )
}