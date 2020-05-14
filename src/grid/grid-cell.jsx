import React from "react";
import useStyles from './use-styles';

/** @type {CellType} */
const GridCell = React.memo(({ column, row }) => {
  const {GridCell} = useStyles();
  return (
    <div className={GridCell} style={{ width: column.width }}>
      {row[column.key]}
    </div>
  );
});
export default GridCell;