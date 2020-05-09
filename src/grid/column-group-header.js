import React, { forwardRef, useImperativeHandle, useRef } from "react";
import HeaderCell from "./header-cell";
import useStyles from './use-styles';

export default forwardRef(function ColumnGroupHeader(
  { columnGroup, height, width },
  ref
) {
  const headerCells = useRef(null);

  useImperativeHandle(ref, () => ({
    endHorizontalScroll: scrollLeft => {
      headerCells.current.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
    }
  }));

  const { columns, contentWidth } = columnGroup;
  const classes = useStyles();

  return (
    <div className={classes.ColumnGroupHeader} style={{ height, width }}>
      <div
        className={classes.headerCells}
        ref={headerCells}
        style={{ width: contentWidth }}
      >
        {columns.map(column => (
          <HeaderCell key={column.key} column={column} />
        ))}
      </div>
    </div>
  );
});
