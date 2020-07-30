import React from "react";
import cx from 'classnames';
import useFormatter from './use-cell-formatter';
import useCellComponent from './use-grid-cell-component';

import useStyles from './use-styles';
// import getInstanceCount from './use-instance-counter';

const columnType = column =>
  !column.type ? null
    : typeof column.type === 'string' ? column.type
    : column.type.name;

// TODO we want to allow css class to be determined by value
function useGridCellClassName(column){
  const classes = useStyles();

  // const count = getInstanceCount(classes);
  // console.log(`instance count = ${JSON.stringify(count)}`)
  
  const {GridCell} = classes;
  return cx(
      GridCell,
      column.className,
      columnType(column),
      column.resizing ? 'resizing' : null,
      column.moving ? 'moving' : null
  );
}

const cellValuesAreEqual = (prev, next) => {
  return prev.row[prev.column.key] === next.row[next.column.key];
}


/** @type {CellType} */
const GridCell = React.memo(function GridCell({ column, row }){
  const [format] = useFormatter(column);
  const className = useGridCellClassName(column);
  const Cell = useCellComponent(column);
  if (Cell){
      return (
        <Cell className={className} column={column} row={row}/>
      )
  } else {
    return (
      <div className={className} style={{ marginLeft: column.marginLeft, width: column.width }}>
        {format(row[column.key])}
      </div>
    );
  }


}, cellValuesAreEqual);

export default GridCell;