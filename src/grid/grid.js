import React, { useRef } from "react";
import ColumnGroupHeader from "./column-group-header";
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

export default ({ width, headerHeight, height }) => {
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

  const getColumnHeaders = withRef => {
    return [
      <ColumnGroupHeader
        className="fixed"
        height={headerHeight}
        key="fixed"
        width={200}
        contentWidth={200}
      />,
      <ColumnGroupHeader
        className="scrollable"
        height={headerHeight}
        key="scrollable"
        ref={withRef ? scrollableHeader : null}
        width={600}
        contentWidth={1270}
      />
    ];
  };

  return (
    <div className="Grid" ref={gridEl} style={{ width, height }}>
      <div className="header-container">{getColumnHeaders(true)}</div>
      <Viewport
        columnHeaders={getColumnHeaders()}
        ref={viewport}
        headerHeight={headerHeight}
        contentHeight={1200}
        onHorizontalScroll={handleHorizontalScroll}
        onVerticalScroll={handleVerticalScroll}
      />
    </div>
  );
};
