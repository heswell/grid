import React, { useCallback, useReducer, useRef } from "react";
import ColumnGroupHeader from "./column-group-header";
import GridContext from "./grid-context";
import modelReducer, { initModel } from "./grid-model-reducer";
import actionReducer from "./grid-action-reducer";

import Viewport from "./viewport";

import "./grid.css";

export default function Grid(props) {
  const gridEl = useRef(null);
  const viewport = useRef(null);
  const scrollableHeader = useRef(null);

  const handleHorizontalScrollStart = _scrollLeft => {
    viewport.current.beginHorizontalScroll();
    gridEl.current.classList.add("scrolling-x");
  };

  const handleHorizontalScrollEnd = scrollLeft => {
    viewport.current.endHorizontalScroll();
    gridEl.current.classList.remove("scrolling-x");
    scrollableHeader.current.endHorizontalScroll(scrollLeft);
  };

  const [gridModel /*, dispatchGridModel*/] = useReducer(
    modelReducer,
    props,
    initModel
  );

  const [, dispatchGridAction] = useReducer(
    useCallback(
      actionReducer({
        "scroll-end-horizontal": handleHorizontalScrollEnd,
        "scroll-start-horizontal": handleHorizontalScrollStart
      }),
      []
    ),
    null
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
    <GridContext.Provider value={{ dispatchGridAction }}>
      <div className="Grid" ref={gridEl} style={{ width, height }}>
        <div className="header-container" style={{ height: headerHeight }}>
          {getColumnHeaders()}
        </div>
        <Viewport
          columnHeaders={getColumnHeaders(true)}
          dataSource={dataSource}
          gridModel={gridModel}
          ref={viewport}
        />
      </div>
    </GridContext.Provider>
  );
}
