import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useReducer,
  useRef
} from "react";
import GridContext from "./grid-context";
import useScroll from "./use-scroll";
import canvasReducer, { initCanvasReducer } from "./canvas-reducer";
import Row from "./row";
import cx from "classnames";

const byKey = ([key1], [key2]) => key1 - key2;

const Canvas = forwardRef(function Canvas(
  {
    columnGroup,
    columnHeader,
    className,
    contentHeight,
    firstVisibleRow,
    gridModel,
    height,
    rows
  },
  ref
) {
  const canvasEl = useRef(null);
  const contentEl = useRef(null);
  const { dispatchGridAction } = useContext(GridContext);

  const [[columns, cellKeys], dispatchCanvasAction] = useReducer(
    canvasReducer,
    columnGroup,
    initCanvasReducer
  );

  useImperativeHandle(ref, () => ({
    beginVerticalScroll: () => {
      canvasEl.current.style.height = `${contentHeight}px`;
      contentEl.current.style.transform = "translate3d(0px, 0px, 0px)";
    },
    endVerticalScroll: scrollTop => {
      canvasEl.current.style.height = `${height}px`;
      contentEl.current.style.transform = `translate3d(0px, -${scrollTop}px, 0px)`;
    },
    // Should only be invoked on scrollable Canvas
    beginHorizontalScroll: (scrollTop, headerHeight) => {
      canvasEl.current.style.height = `${height + headerHeight}px`;
      scrollTop = -(scrollTop - headerHeight);
      contentEl.current.style.transform = `translate3d(0px, ${scrollTop}px, 0px)`;
    },
    endHorizontalScroll: scrollTop => {
      canvasEl.current.style.height = `${height}px`;
      contentEl.current.style.transform = `translate3d(0px, -${scrollTop}px, 0px)`;
    }
  }));

  const { contentWidth, width } = columnGroup;
  const rootClassName = cx("Canvas", className, {
    fixed: columnGroup.locked,
    scrollable: !columnGroup.locked
  });

  const scrollCallback = useCallback(
    (scrollEvent, scrollLeft) => {
      if (scrollEvent === "scroll") {
        dispatchCanvasAction(scrollLeft);
      } else if (scrollEvent === "scroll-start") {
        dispatchGridAction({ type: "scroll-start-horizontal", scrollLeft });
      } else {
        dispatchGridAction({ type: "scroll-end-horizontal", scrollLeft });
      }
    },
    [dispatchCanvasAction, dispatchGridAction]
  );

  const handleHorizontalScroll = useScroll("scrollLeft", scrollCallback, 100);

  const {
    meta: { RENDER_IDX }
  } = gridModel;
  const rowPositions = rows
    .map((row, idx) => {
      const absIdx = firstVisibleRow + idx;
      return [row[RENDER_IDX], absIdx, row];
    })
    .sort(byKey);

  return (
    <div
      className={rootClassName}
      ref={canvasEl}
      style={{ height, width }}
      onScroll={handleHorizontalScroll}
    >
      <div className="canvas-content-wrapper" style={{ width: contentWidth }}>
        <div
          className="canvas-content"
          ref={contentEl}
          style={{ width: contentWidth, height: contentHeight }}
        >
          {rowPositions.map(([rowKey, absIdx, row]) => {
            return (
              <Row
                key={rowKey}
                columns={columns}
                gridModel={gridModel}
                idx={absIdx}
                keys={cellKeys}
                row={row}
              />
            );
          })}
        </div>
      </div>
      {columnHeader}
    </div>
  );
});

export default Canvas;
