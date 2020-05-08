import React from "react";
import cx from "classnames";
import "./row.css";
const Row = ({ gridModel, idx }) => {
  const rootClassName = cx("GridRow");
  return (
    <div
      className={rootClassName}
      style={{
        transform: `translate3d(0px, ${idx * gridModel.rowHeight}px, 0px)`,
        height: gridModel.rowHeight
      }}
    />
  );
};

export default Row;
