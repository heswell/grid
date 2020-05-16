import React from "react";
import cx from 'classnames';

import useStyles from './use-styles';

const columnType = column =>
  !column.type ? null
    : typeof column.type === 'string' ? column.type
    : column.type.name;

// TODO we want to allow css class to be determined by value
function useGridCellClassName(column){
  const {GridCell} = useStyles();
  return cx(
      GridCell,
      column.className,
      columnType(column),
      column.resizing ? 'resizing' : null,
      column.moving ? 'moving' : null
  );
}

/** @type {CellType} */
const GridCell = React.memo(({ column, row }) => {
  const className = useGridCellClassName(column);
  return (
    <div className={className} style={{ width: column.width }}>
      {row[column.key]}
    </div>
  );
});
export default GridCell;