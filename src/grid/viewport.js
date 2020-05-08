import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Canvas from "./canvas";
import cx from "classnames";

const Viewport = forwardRef(
  (
    {
      columnHeaders,
      contentHeight,
      gridModel,
      headerHeight,
      onVerticalScroll,
      onHorizontalScroll
    },
    ref
  ) => {
    const viewportEl = useRef(null);
    const scrollingEl = useRef(null);
    const fixedCanvas = useRef(null);
    const scrollableCanvas = useRef(null);

    console.log(`Viewport render`, fixedCanvas.current);

    useImperativeHandle(ref, () => ({
      beginVerticalScroll: () => {
        fixedCanvas.current.beginVerticalScroll();
        scrollableCanvas.current.beginVerticalScroll();
      },
      endVerticalScroll: () => {
        const scrollTop = viewportEl.current.scrollTop;
        fixedCanvas.current.endVerticalScroll(scrollTop);
        scrollableCanvas.current.endVerticalScroll(scrollTop);
      },
      beginHorizontalScroll: () => {
        const scrollTop = viewportEl.current.scrollTop;
        scrollingEl.current.style.height = `${contentHeight + headerHeight}px`;
        fixedCanvas.current.beginHorizontalScroll(scrollTop, headerHeight);
        scrollableCanvas.current.beginHorizontalScroll(scrollTop, headerHeight);
      },
      endHorizontalScroll: () => {
        const scrollTop = viewportEl.current.scrollTop;
        fixedCanvas.current.endHorizontalScroll(scrollTop, headerHeight);
        scrollableCanvas.current.endHorizontalScroll(scrollTop, headerHeight);
        scrollingEl.current.style.height = `${contentHeight}px`;
      }
    }));

    return (
      <div
        className={cx("Viewport")}
        ref={viewportEl}
        style={{ top: headerHeight }}
        onScroll={onVerticalScroll}
      >
        <div
          className="scrolling-canvas-container"
          ref={scrollingEl}
          style={{ height: contentHeight }}
        >
          {gridModel.columnGroups.map((columnGroup, idx) => (
            <Canvas
              columnGroup={columnGroup}
              columnHeader={columnHeaders[idx]}
              contentHeight={1200}
              height={568}
              key={idx}
              onScroll={onHorizontalScroll}
              ref={columnGroup.locked ? fixedCanvas : scrollableCanvas}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default Viewport;
