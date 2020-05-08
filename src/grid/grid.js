import React, { useReducer, useRef } from "react";
import useScroll, { SCROLL_START_END } from "./use-scroll";
import ColumnGroupHeader from "./column-group-header";
import modelReducer, { initModel } from "./grid-model-reducer";

import Viewport from "./viewport";

import "./grid.css";

export default function Grid(props) {
  console.log(`[Grid]`);
  const gridEl = useRef(null);
  const viewport = useRef(null);
  const scrollableHeader = useRef(null);

  const handleHorizontalScroll = useScroll(
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
    },
    SCROLL_START_END
  );
  // test

  const [gridModel /*, dispatchGridModel*/] = useReducer(
    modelReducer,
    props,
    initModel
  );

  const { dataSource, headerHeight, height, width } = props;

  const getColumnHeaders = scrollingHeaders => {
    return gridModel.columnGroups.map((columnGroup, idx) => (
      <ColumnGroupHeader
        columnGroup={columnGroup}
        height={headerHeight}
        key={idx}
        ref={scrollingHeaders || columnGroup.locked ? null : scrollableHeader}
        width={scrollingHeaders ? columnGroup.contentWidth : columnGroup.width}
      />
    ));
  };

  return (
    <div className="Grid" ref={gridEl} style={{ width, height }}>
      <div className="header-container" style={{ height: headerHeight }}>
        {getColumnHeaders()}
      </div>
      <Viewport
        columnHeaders={getColumnHeaders(true)}
        dataSource={dataSource}
        gridModel={gridModel}
        onHorizontalScroll={handleHorizontalScroll}
        ref={viewport}
      />
    </div>
  );
}
