import React, { forwardRef, useImperativeHandle, useRef } from "react";
import cx from "classnames";

const Canvas = forwardRef(
  (
    {
      columnHeader,
      className,
      contentHeight,
      contentWidth,
      height,
      onScroll,
      width
    },
    ref
  ) => {
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

    return (
      <div
        className={cx("Canvas", className)}
        ref={canvasEl}
        style={{ height, width }}
        onScroll={onScroll}
      >
        <div className="canvas-content-wrapper" style={{ width: contentWidth }}>
          <div
            className="canvas-content"
            ref={contentEl}
            style={{ width: contentWidth, height: contentHeight }}
          />
        </div>
        {columnHeader}
      </div>
    );
  }
);

export default Canvas;
