import React from "react";
import cx from "classnames";
import SortIcon, { Direction } from "./sort-icon.jsx";

import "./sort-indicator.css";

const SortIndicator = ({ sorted }) => {
  if (!sorted) {
    return null;
  }

  const direction = sorted < 0 ? Direction.DSC : Direction.ASC;

  return typeof sorted === "number" ? (
    <div className={cx("vuSortIndicator", "multi-col", direction)}>
      <SortIcon direction={direction} />
      <span className={"vuSortPosition"}>{Math.abs(sorted)}</span>
    </div>
  ) : (
    <div className={cx("vuSortIndicator", "single-col")}>
      <SortIcon direction={sorted} />
    </div>
  );
};

export default SortIndicator;
