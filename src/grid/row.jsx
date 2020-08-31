import React, { memo, useCallback } from "react";
import cx from 'classnames';
import { metadataKeys } from '@heswell/utils';
import Cell from "./grid-cell";
import GroupCell from "./grid-group-cell";
import useStyles from './use-styles';

const {DEPTH, KEY} = metadataKeys;

/** @type {RowType} */
const Row =  memo(function Row({ columns, height, idx, row, onClick, toggleStrategy }) {
  const isEmptyRow = row[KEY] === undefined;
  const groupLevel = row[DEPTH];
  const isGroup = !isEmptyRow && groupLevel !== 0;

  const {GridRow} = useStyles();  
  const className = cx(GridRow, {
    group: isGroup,
    collapsed: isGroup && groupLevel < 0,
    expanded : isGroup && groupLevel >= 0,
    empty: isEmptyRow
  });

  // better - make a single call to useGridCellComponent here, with columns

  const handleClick = useCallback(e => {
    const rangeSelect = e.shiftKey;
    const keepExistingSelection = e.ctrlKey || e.metaKey /* mac only */;
    onClick(idx, row, rangeSelect, keepExistingSelection);
  },[idx, row])

  return (
    <div
      className={className}
      onClick={handleClick} 
      style={{
        transform: `translate3d(0px, ${idx * height}px, 0px)`,
        height
      }}
    >
      {columns.map(column =>
        column.isGroup
          ? (
            <GroupCell
              column={column} 
              key={column.key} 
              row={row}
              toggleStrategy={toggleStrategy} />
          ) : (
             <Cell
            key={column.key}
            column={column}
            row={row}
          />)
      )}
    </div>
  );
});

export default Row;
