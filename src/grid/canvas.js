import React, { forwardRef, useImperativeHandle, useRef } from "react";
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
    onScroll,
    rows
  },
  ref
) {
  const canvasEl = useRef(null);
  const contentEl = useRef(null);

  useImperativeHandle(ref, () => ({
    beginVerticalScroll: () => {
      canvasEl.current.style.height = `${contentHeight}px`;
      contentEl.current.style.transform = "translate3d(0px, 0px, 0px)";
    },
    endVerticalScroll: scrollTop => {
      canvasEl.current.style.height = `${height}px`;
      contentEl.current.style.transform = `translate3d(0px, -${scrollTop}px, 0px)`;
    },
    beginHorizontalScroll: (scrollTop, headerHeight) => {
      canvasEl.current.style.height = `${height + headerHeight}px`;
      scrollTop = -(scrollTop - headerHeight);
      contentEl.current.style.transform = `translate3d(0px, ${scrollTop}px, 0px)`;
    },
    endHorizontalScroll: (scrollTop, headerHeight) => {
      canvasEl.current.style.height = `${height}px`;
      contentEl.current.style.transform = `translate3d(0px, -${Math.min(
        scrollTop,
        height + 2 * headerHeight
      )}px, 0px)`;
    }
  }));

  const { columns, contentWidth, width } = columnGroup;
  const rootClassName = cx("Canvas", className, {
    fixed: columnGroup.locked,
    scrollable: !columnGroup.locked
  });

  const {
    meta: { RENDER_IDX }
  } = gridModel;
  const rowPositions = rows
    .map((row, idx) => {
      const absIdx = firstVisibleRow + idx;
      return [row[RENDER_IDX], absIdx, row];
    })
    .sort(byKey);

  const cellKeys = useRef([]);

  return (
    <div
      className={rootClassName}
      ref={canvasEl}
      style={{ height, width }}
      onScroll={onScroll}
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
                keys={cellKeys.current}
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
