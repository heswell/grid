import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef
} from "react";
import useScroll from "./use-scroll";
import useUpdate from "./use-update";
import useStyles from './use-styles';
import dataReducer, { initialData } from "./grid-data-reducer";
import {getColumnGroup} from './grid-model-utils.js';

import Canvas from "./canvas";
import ColumnBearer from './column-bearer';

/** @type {ViewportType} */
const Viewport = forwardRef(function Viewport(
  { columnHeaders, dataSource, draggedColumn, gridModel, onColumnDrag },
  ref
) {
  const viewportEl = useRef(null);
  const scrollingEl = useRef(null);
  const fixedCanvas = useRef(null);
  /** @type {CanvasRef} */
  const scrollableCanvas = useRef(null);
  const contentHeight = useRef(0);
  const horizontalScrollbarHeight = useRef(gridModel.horizontalScrollbarHeight);
  const verticalScrollbarWidth = useRef(0);
  const firstVisibleRow = useRef(0);

  const showColumnBearer = useRef(draggedColumn !== null);
  showColumnBearer.current = draggedColumn !== null;  


  useImperativeHandle(ref, () => ({
    beginHorizontalScroll: () => {
      if (!showColumnBearer.current){
        const scrollTop = viewportEl.current.scrollTop;
        scrollingEl.current.style.height = `${contentHeight.current +
          (gridModel.headerHeight * gridModel.headingDepth) + horizontalScrollbarHeight.current}px`;
        fixedCanvas.current.beginHorizontalScroll( scrollTop );
        scrollableCanvas.current.beginHorizontalScroll( scrollTop );
      }
    },
    endHorizontalScroll: () => {
      if (!showColumnBearer.current){
        const scrollTop = viewportEl.current.scrollTop;
        fixedCanvas.current.endHorizontalScroll(scrollTop);
        scrollableCanvas.current.endHorizontalScroll(scrollTop);
        scrollingEl.current.style.height = `${contentHeight.current + horizontalScrollbarHeight.current}px`;
        return scrollableCanvas.current.scrollLeft;
      }
    }
  }));

  const [data, dispatchData] = useReducer(dataReducer(gridModel), initialData);

  const setRange = useCallback(
    (lo, hi) => {
      dispatchData({ type: "range", range: { lo, hi } });
      dataSource.setRange(lo, hi);
    },
    [dataSource]
  );

  const handleColumnBearerScroll = (scrollDistance) =>
      scrollableCanvas.current.scrollBy(scrollDistance);

        // TODO useCallback
  const handleColumnDrag = (dragPhase, draggedColumn, targetColumn) => {
    const columnGroup = getColumnGroup(gridModel, draggedColumn);
    if (dragPhase === 'drag'){ // only called when we cross onto next targetColumn
      // we need the canvas refs in an array
      if (columnGroup.locked){
        fixedCanvas.current.makeSpaceForColumn(draggedColumn, targetColumn)
      } else {
        scrollableCanvas.current.makeSpaceForColumn(draggedColumn, targetColumn)
      }
    } else if (dragPhase === 'drag-end'){
      if (columnGroup.locked){
        fixedCanvas.current.endDrag(draggedColumn, targetColumn)
      } else {
        scrollableCanvas.current.endDrag(draggedColumn, targetColumn)
      }
  
      onColumnDrag(dragPhase, draggedColumn, targetColumn);
    }
  }

  useUpdate(() => {
    setRange(firstVisibleRow.current, firstVisibleRow.current + gridModel.viewportRowCount);
  },[gridModel.viewportRowCount]);

  const scrollCallback = useCallback(
    (scrollEvent, scrollTop) => {
      if (scrollEvent === "scroll") {
        const firstRow = Math.floor(scrollTop / gridModel.rowHeight);
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
    },
    [gridModel.rowHeight, gridModel.viewportRowCount, setRange]
  );

    useLayoutEffect(() => {
      if (draggedColumn){
        // TODO need the indedx here then we can lookup ref bby index
        const columnGroup = getColumnGroup(gridModel, draggedColumn);
        if (columnGroup.locked){
          fixedCanvas.current.hideDraggedColumn(draggedColumn)        
        } else {
          scrollableCanvas.current.hideDraggedColumn(draggedColumn)        
        }
      }
    },[draggedColumn])

  const handleVerticalScroll = useScroll("scrollTop", scrollCallback);

  useEffect(() => {
    dataSource.subscribe(
      {
        columns: gridModel.columns,
        range: { lo: 0, hi: gridModel.viewportRowCount }
      },
      /* postMessageToClient */
      msg => {
        if (msg.size !== undefined){
          if (msg.size >= gridModel.viewportRowCount && verticalScrollbarWidth.current === 0){
            verticalScrollbarWidth.current = 15;
          } else if (msg.size < gridModel.viewportRowCount && verticalScrollbarWidth.current === 15){
            verticalScrollbarWidth.current = 0;
          }
        }
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

    // shouldn't be necessary if range was included in subscribe
    dataSource.setRange(0, gridModel.viewportRowCount);

    return () => dataSource.unsubscribe();
    
  }, [
    dataSource,
    // gridModel.columns,
    // gridModel.rowHeight,
    // gridModel.viewportRowCount
  ]);
  // TODO need a destroy method on dataSource to be called when appropriate

  const classes = useStyles();

  return (
    <>
      <div
        className={classes.Viewport}
        ref={viewportEl}
        style={{ top: gridModel.headerHeight * gridModel.headingDepth }}
        onScroll={handleVerticalScroll}
      >
        <div
          className={classes.scrollingCanvasContainer}
          ref={scrollingEl}
          style={{ height: contentHeight.current + horizontalScrollbarHeight.current }}
        >
          {gridModel.columnGroups.map((columnGroup, idx) => (
            <Canvas
              columnGroup={columnGroup}
              columnHeader={columnHeaders[idx]}
              contentHeight={contentHeight.current}
              firstVisibleRow={firstVisibleRow.current}
              height={gridModel.viewportHeight}
              horizontalScrollbarHeight={horizontalScrollbarHeight.current}
              key={idx}
              meta={gridModel.meta}
              ref={columnGroup.locked ? fixedCanvas : scrollableCanvas}
              rowHeight={gridModel.rowHeight}
              rows={data.rows}
              totalHeaderHeight={gridModel.headerHeight * gridModel.headingDepth}
            />
          ))}
        </div>
      </div>
      {draggedColumn &&
          <ColumnBearer
            column={draggedColumn}
            gridModel={gridModel}
            initialScrollPosition={scrollableCanvas.current.scrollLeft}
            onDrag={handleColumnDrag}
            onScroll={handleColumnBearerScroll}
            rows={data.rows}
          />}
    </>
  
  );
});

export default Viewport;
