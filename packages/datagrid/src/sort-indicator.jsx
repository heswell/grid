import React from "react";
import cx from "classnames";
import SortIcon, { Direction } from "./sort-icon.jsx";

import "./sort-indicator.css";

export default ({ sorted }) => {
  if (!sorted) {
    return null;
  }

  const direction = sorted < 0 ? Direction.DSC : Direction.ASC;

  return typeof sorted === "number" ? (
    <div className={cx("SortIndicator", "multi-col", direction)}>
      <SortIcon direction={direction} />
      <span className={"SortPosition"}>{Math.abs(sorted)}</span>
    </div>
  ) : (
    <div className={cx("SortIndicator", "single-col")}>
      <SortIcon direction={sorted} />
    </div>
  );
};
