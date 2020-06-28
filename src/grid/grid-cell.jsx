import React from "react";
import cx from 'classnames';

import useStyles from './use-styles';
import getInstanceCount from './use-instance-counter';

const columnType = column =>
  !column.type ? null
    : typeof column.type === 'string' ? column.type
    : column.type.name;

// TODO we want to allow css class to be determined by value
function useGridCellClassName(column){
  const classes = useStyles();

  const count = getInstanceCount(classes);
  console.log(`instance count = ${JSON.stringify(count)}`)

  const {GridCell} = classes;
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
    <div className={className} style={{ marginLeft: column.marginLeft, width: column.width }}>
      {row[column.key]}
    </div>
  );
});
export default GridCell;