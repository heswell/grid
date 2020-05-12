import React, { memo } from "react";
import Cell from "./grid-cell";
import useStyles from './use-styles';

export const PADDING_CELL = "virtual-padding";

/** @type {RowType} */
const Row =  memo(function Row({ columns, height, idx, meta, row }) {
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
        column.name === PADDING_CELL ? (
          <div
            key="virtual-padding"
            className={classes.virtualPadding}
            style={{ width: column.width }}
          />
        ) : (
          <Cell
            key={column.key}
            column={column}
            meta={meta}
            row={row}
          />
        )
      )}
    </div>
  );
});

export default Row;
