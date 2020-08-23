import React from 'react';
import ColumnGroupHeader from "./column-group-header";

import useStyles from './use-styles';

export default function GridHeader({gridModel, scrollableHeaderRef, onColumnDrag}){

  const classes = useStyles();
  const {columnGroups, headerHeight, headingDepth} = gridModel;
  
  return (
    <div className={classes.headerContainer} style={{ height: headerHeight * headingDepth }}>
    {columnGroups ? columnGroups.map((columnGroup, idx) => (
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
    )): null}
  </div>

  )
}