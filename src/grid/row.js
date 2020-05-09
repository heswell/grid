import React, { memo } from "react";
import Cell from "./grid-cell";
import cx from "classnames";
import "./row.css";

export const PADDING_CELL = "virtual-padding";

export default memo(function Row({ columns, gridModel, idx, row }) {
  const rootClassName = cx("GridRow");
  return (
    <div
      className={rootClassName}
      style={{
        transform: `translate3d(0px, ${idx * gridModel.rowHeight}px, 0px)`,
        height: gridModel.rowHeight
      }}
    >
      {columns.map(column =>
        column.name === PADDING_CELL ? (
          <div
            key="virtual-padding"
            className="virtual-padding"
            style={{ width: column.width }}
          />
        ) : (
          <Cell
            key={column.key}
            column={column}
            meta={gridModel.meta}
            row={row}
          />
        )
      )}
    </div>
  );
});
