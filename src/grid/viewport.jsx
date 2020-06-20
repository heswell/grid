import React, {
  createRef,
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
import {getColumnGroupIdx} from './grid-model-utils.js';

import Canvas from "./canvas";
import ColumnBearer from './column-bearer';
import InsertIndicator from './insert-indicator';

/** @type {ViewportComponent} */
const Viewport = forwardRef(function Viewport(
  { columnHeaders, dataSource, columnDragData, gridModel, onColumnDrag },
  ref
) {
  const viewportEl = useRef(null);
  const scrollingEl = useRef(null);
  /** @type {React.MutableRefObject<CanvasRef[]>} */
  const canvasRefs = useRef([]);
  const columnBearer = useRef(null)
  const contentHeight = useRef(0);
  const horizontalScrollbarHeight = useRef(gridModel.horizontalScrollbarHeight);
  const verticalScrollbarWidth = useRef(0);
  const firstVisibleRow = useRef(0);
  const insertIndicator = useRef(null);

  const showColumnBearer = useRef(columnDragData !== null);
  showColumnBearer.current = columnDragData !== null;  

  const canvasCount = gridModel.columnGroups.length;
  if (canvasRefs.current.length !== canvasCount) {
    // add or remove refs
    canvasRefs.current = Array(canvasCount).fill(null).map((_, i) => canvasRefs.current[i] || createRef());
  }
  const scrollableCanvasIdx = gridModel.columnGroups.findIndex(group => !group.locked);

  useImperativeHandle(ref, () => ({
    beginHorizontalScroll: () => {
      if (!showColumnBearer.current){
        const scrollTop = viewportEl.current.scrollTop;
        scrollingEl.current.style.height = `${contentHeight.current +
          (gridModel.headerHeight * gridModel.headingDepth) + horizontalScrollbarHeight.current}px`;
        canvasRefs.current.forEach(({current}) => current.beginHorizontalScroll( scrollTop ));  
      }
    },
    endHorizontalScroll: () => {
      if (!showColumnBearer.current){
        const scrollTop = viewportEl.current.scrollTop;
        canvasRefs.current.forEach(({current}) => current.endHorizontalScroll( scrollTop ));
        scrollingEl.current.style.height = `${contentHeight.current + horizontalScrollbarHeight.current}px`;
        return canvasRefs.current[scrollableCanvasIdx].current.scrollLeft;
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

  const handleColumnBearerScroll = scrollDistance =>
    canvasRefs.current[scrollableCanvasIdx].current.scrollBy(scrollDistance);

  const handleColumnDrag = useCallback(async (dragPhase, draggedColumn, insertIdx, insertPos) => {
    const {columnGroupIdx, columnIdx} = columnDragData;
    const {current: canvas} = canvasRefs.current[columnGroupIdx];
    if (dragPhase === 'drag'){ // only called when we cross onto next targetColumn
      insertIndicator.current.style.left = insertPos + 'px';
    } else if (dragPhase === 'drag-end'){
      insertIndicator.current.style.transition = 'left ease .3s';
      if (insertIdx > columnIdx){
        insertIndicator.current.style.left = (insertPos - draggedColumn.width) + 'px';
        columnBearer.current.setFinalPosition(insertPos - draggedColumn.width);
      } else {
        insertIndicator.current.style.left = (insertPos) + 'px';
        columnBearer.current.setFinalPosition(insertPos);
      }
      await canvas.endDrag(draggedColumn, insertIdx, insertPos);
      onColumnDrag(dragPhase, draggedColumn, insertIdx);
    }
  },[gridModel, onColumnDrag, columnDragData]);

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
        canvasRefs.current.forEach(({current}) => current.beginVerticalScroll( ));
      } else {
        const scrollTop = viewportEl.current.scrollTop;
        canvasRefs.current.forEach(({current}) => current.endVerticalScroll(scrollTop));
      }
    },
    [gridModel.rowHeight, gridModel.viewportRowCount, setRange]
  );

    useLayoutEffect(() => {
      if (columnDragData){
        const {column, columnGroupIdx} = columnDragData;
        const columnOffset = canvasRefs.current[columnGroupIdx].current.hideDraggedColumn(column);
        const {left} = viewportEl.current.getBoundingClientRect();
        insertIndicator.current.style.left = (columnOffset-left) + 'px';
      }
    },[columnDragData])

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
              ref={canvasRefs.current[idx]}
              rowHeight={gridModel.rowHeight}
              rows={data.rows}
              totalHeaderHeight={gridModel.headerHeight * gridModel.headingDepth}
            />
          ))}
        </div>
      </div>
      {columnDragData && <>
          <InsertIndicator ref={insertIndicator}/>
          <ColumnBearer
            columnDragData={columnDragData}
            gridModel={gridModel}
            initialScrollPosition={canvasRefs.current[scrollableCanvasIdx].current.scrollLeft}
            onDrag={handleColumnDrag}
            onScroll={handleColumnBearerScroll}
            ref={columnBearer}
            rows={data.rows}
          />
        </>}
    </>
  
  );
});

export default Viewport;
