import React, { forwardRef, useImperativeHandle, useRef } from "react";
import HeaderCell from "./header-cell";
import cx from "classnames";

import "./column-group-header.css";

const ColumnGroupHeader = forwardRef(
  ({ className, columnGroup, height }, ref) => {
    const headerCells = useRef(null);

    useImperativeHandle(ref, () => ({
      endHorizontalScroll: scrollLeft => {
        headerCells.current.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
      }
    }));

    const { columns, width, contentWidth } = columnGroup;
    const rootClassName = cx("ColumnGroupHeader", className, {
      fixed: columnGroup.locked,
      scrollable: !columnGroup.locked
    });
    return (
      <div className={rootClassName} style={{ height, width }}>
        <div
          className="header-cells"
          ref={headerCells}
          style={{ width: contentWidth }}
        >
          {columns.map(column => (
            <HeaderCell key={column.key} column={column} />
          ))}
        </div>
      </div>
    );
  }
);

export default ColumnGroupHeader;
