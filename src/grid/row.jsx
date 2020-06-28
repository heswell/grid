import React, { memo } from "react";
import Cell from "./grid-cell";
import useStyles from './use-styles';

/** @type {RowType} */
const Row =  memo(function Row({ columns, height, idx, row }) {
  const classes = useStyles();  
  return (
    <div
      className={classes.GridRow}
      style={{
        transform: `translate3d(0px, ${idx * height}px, 0px)`,
        height
      }}
    >
      {columns.map(column =>
          <Cell
            key={column.key}
            column={column}
            row={row}
          />
      )}
    </div>
  );
});

export default Row;
