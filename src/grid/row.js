import React, { memo } from "react";
import Cell from "./grid-cell";
import cx from "classnames";
import "./row.css";
const Row = memo(function Row({ columns, gridModel, idx, row }) {
  const rootClassName = cx("GridRow");
  return (
    <div
      className={rootClassName}
      style={{
        transform: `translate3d(0px, ${idx * gridModel.rowHeight}px, 0px)`,
        height: gridModel.rowHeight
      }}
    >
      {columns.map(column => (
        <Cell
          key={column.key}
          column={column}
          meta={gridModel.meta}
          row={row}
        />
      ))}
    </div>
  );
});

export default Row;
