import React, { useReducer, useRef } from "react";
import cx from "classnames";
import ColumnGroupHeader from "./column-group-header";
import modelReducer, { initModel } from "./grid-model-reducer";

import Viewport from "./viewport";

import "./grid.css";

export function getScrollHandler(scrollPos, callback) {
  let timeoutHandle = null;
  const pos = { current: 0 };
  const onScrollEnd = () => {
    callback("scroll-end", pos.current);
    timeoutHandle = null;
  };
  return e => {
    // important for the horizontal scroll on Canvas
    e.stopPropagation();
    pos.current = e.target[scrollPos];
    if (timeoutHandle === null) {
      callback("scroll-start", pos.current);
    } else {
      clearTimeout(timeoutHandle);
    }
    timeoutHandle = setTimeout(onScrollEnd, 200);
  };
}

export default ({ columns, dataSource, headerHeight, height, width }) => {
  console.log(`[Grid]`);
  const gridEl = useRef(null);
  const viewport = useRef(null);
  const scrollableHeader = useRef(null);

  const handleVerticalScroll = getScrollHandler("scrollTop", scrollEvent => {
    if (scrollEvent === "scroll-start") {
      viewport.current.beginVerticalScroll();
    } else {
      viewport.current.endVerticalScroll();
    }
  });

  const handleHorizontalScroll = getScrollHandler(
    "scrollLeft",
    (scrollEvent, scrollLeft) => {
      if (scrollEvent === "scroll-start") {
        viewport.current.beginHorizontalScroll();
        gridEl.current.classList.add("scrolling-x");
      } else {
        viewport.current.endHorizontalScroll();
        gridEl.current.classList.remove("scrolling-x");
        scrollableHeader.current.endHorizontalScroll(scrollLeft);
      }
    }
  );

  const [gridModel, dispatchGridModel] = useReducer(
    modelReducer,
    {
      columns,
      width
    },
    initModel
  );

  console.log(gridModel);

  const getColumnHeaders = withRef => {
    return gridModel.columnGroups.map((columnGroup, idx) => (
      <ColumnGroupHeader
        columnGroup={columnGroup}
        height={headerHeight}
        key={idx}
        ref={withRef && !columnGroup.fixed ? scrollableHeader : null}
      />
    ));
  };

  return (
    <div className="Grid" ref={gridEl} style={{ width, height }}>
      <div className="header-container" style={{ height: headerHeight }}>
        {getColumnHeaders(true)}
      </div>
      <Viewport
        columnHeaders={getColumnHeaders()}
        gridModel={gridModel}
        ref={viewport}
        headerHeight={headerHeight}
        contentHeight={1200}
        onHorizontalScroll={handleHorizontalScroll}
        onVerticalScroll={handleVerticalScroll}
      />
    </div>
  );
};
