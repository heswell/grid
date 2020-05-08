import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useReducer,
  useRef
} from "react";
import useScroll from "./use-scroll";
import dataReducer, { initialData } from "./grid-data-reducer";

import Canvas from "./canvas";
import cx from "classnames";

const Viewport = forwardRef(
  ({ columnHeaders, dataSource, gridModel, onHorizontalScroll }, ref) => {
    const viewportEl = useRef(null);
    const scrollingEl = useRef(null);
    const fixedCanvas = useRef(null);
    const scrollableCanvas = useRef(null);
    const contentHeight = useRef(0);
    const firstVisibleRow = useRef(0);

    console.log("[Viewport]");

    useImperativeHandle(ref, () => ({
      beginHorizontalScroll: () => {
        const scrollTop = viewportEl.current.scrollTop;
        scrollingEl.current.style.height = `${contentHeight.current +
          gridModel.headerHeight}px`;
        fixedCanvas.current.beginHorizontalScroll(
          scrollTop,
          gridModel.headerHeight
        );
        scrollableCanvas.current.beginHorizontalScroll(
          scrollTop,
          gridModel.headerHeight
        );
      },
      endHorizontalScroll: () => {
        const scrollTop = viewportEl.current.scrollTop;
        fixedCanvas.current.endHorizontalScroll(
          scrollTop,
          gridModel.headerHeight
        );
        scrollableCanvas.current.endHorizontalScroll(
          scrollTop,
          gridModel.headerHeight
        );
        scrollingEl.current.style.height = `${contentHeight.current}px`;
      }
    }));

    const setRange = (lo, hi) => {
      console.log(`setRange ===>  ${lo} : ${hi}`);
      dispatchData({ type: "range", range: { lo, hi } });
      dataSource.setRange(lo, hi);
    };

    const handleVerticalScroll = useScroll(
      "scrollTop",
      (scrollEvent, scrollTop) => {
        if (scrollEvent === "scroll") {
          const firstRow = Math.floor(scrollTop / gridModel.rowHeight);
          console.log(
            `Vertical scroll scrollTop=${scrollTop} firstRow=${firstRow}`
          );
          if (firstRow !== firstVisibleRow.current) {
            firstVisibleRow.current = firstRow;
            setRange(firstRow, firstRow + gridModel.viewportRowCount);
          }
        } else if (scrollEvent === "scroll-start") {
          fixedCanvas.current.beginVerticalScroll();
          scrollableCanvas.current.beginVerticalScroll();
        } else {
          const scrollTop = viewportEl.current.scrollTop;
          fixedCanvas.current.endVerticalScroll(scrollTop);
          scrollableCanvas.current.endVerticalScroll(scrollTop);
        }
      }
    );

    const [data, dispatchData] = useReducer(
      dataReducer(gridModel),
      initialData
    );

    useEffect(() => {
      console.log(`subscribe to dataSource ${gridModel.viewportRowCount}`);
      dataSource.subscribe(
        {
          columns: gridModel.columns,
          range: { lo: 0, hi: gridModel.viewportRowCount }
        },
        /* postMessageToClient */
        msg => {
          console.log(msg);
          if (msg.rows) {
            contentHeight.current = msg.size * gridModel.rowHeight;
            dispatchData({
              type: "data",
              rows: msg.rows,
              rowCount: msg.size,
              offset: msg.offset,
              range: msg.range
            });
          }
        }
      );

      // shouldn't be necessary
      dataSource.setRange(0, gridModel.viewportRowCount);

      return () => dataSource.unsubscribe();
    }, [
      dataSource,
      // We don't want to tear down the entire data model when these change
      gridModel.columns,
      gridModel.rowHeight,
      gridModel.viewportRowCount
    ]);

    return (
      <div
        className={cx("Viewport")}
        ref={viewportEl}
        style={{ top: gridModel.headerHeight }}
        onScroll={handleVerticalScroll}
      >
        <div
          className="scrolling-canvas-container"
          ref={scrollingEl}
          style={{ height: contentHeight.current }}
        >
          {gridModel.columnGroups.map((columnGroup, idx) => (
            <Canvas
              columnGroup={columnGroup}
              columnHeader={columnHeaders[idx]}
              contentHeight={contentHeight.current}
              firstVisibleRow={firstVisibleRow.current}
              gridModel={gridModel}
              height={568}
              key={idx}
              onScroll={onHorizontalScroll}
              ref={columnGroup.locked ? fixedCanvas : scrollableCanvas}
              rows={data.rows}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default Viewport;
