import React, { forwardRef, useImperativeHandle, useRef } from "react";
import cx from "classnames";

const ColumnGroupHeader = forwardRef(
  ({ className, contentWidth, height, width }, ref) => {
    const cellsEl = useRef(null);

    useImperativeHandle(ref, () => ({
      endHorizontalScroll: scrollLeft => {
        cellsEl.current.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
      }
    }));

    return (
      <div
        className={cx("ColumnGroupHeader", className)}
        style={{ height, width }}
      >
        <div
          className="header-cells"
          ref={cellsEl}
          style={{ width: contentWidth }}
        />
      </div>
    );
  }
);

export default ColumnGroupHeader;
