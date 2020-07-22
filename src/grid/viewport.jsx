import React, {
  createRef,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef
} from "react";
import useScroll from "./use-scroll";
import useUpdate from "./use-update";
import useStyles from './use-styles';
import GridContext from "./grid-context";
import {getColumnGroupColumnIdx, GridModel} from './grid-model-utils.js';
import dataReducer, { initData } from "./grid-data-reducer";

import Canvas from "./canvas";
import ColumnBearer from './column-bearer';
import InsertIndicator from './insert-indicator';

/** @type {ViewportComponent} */
const Viewport = forwardRef(function Viewport(
  { dataSource, columnDragData, gridModel, onColumnDrag },
  ref
) {
  const viewportEl = useRef(null);
  const scrollingEl = useRef(null);
  /** @type {React.MutableRefObject<any>} */
  const canvasRefs = useRef([]);
  const columnBearer = useRef(null)
  const contentHeight = useRef(0);
  const horizontalScrollbarHeight = useRef(gridModel.horizontalScrollbarHeight);
  const verticalScrollbarWidth = useRef(0);
  const firstVisibleRow = useRef(0);
  const insertIndicator = useRef(null);

  useEffect(() => {
    horizontalScrollbarHeight.current = gridModel.horizontalScrollbarHeight;
  },[gridModel.horizontalScrollbarHeight])

  // TODO we could get gridModel here as well. Or would it be better to split gridModel into it's own context ?
  const { dispatchGridModelAction } = useContext(GridContext);

  const gridModelRef = useRef(gridModel);
  if (gridModelRef.current !== gridModel){
    // Is there a better way to do this - the dataSource effect needs to get the latest gridModel
    // but changes to gridModel should not trigger re-subscription
    gridModelRef.current = gridModel;
  }

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
        scrollingEl.current.style.height = `${contentHeight.current +
          (gridModel.headerHeight * gridModel.headingDepth) + horizontalScrollbarHeight.current}px`;
        canvasRefs.current.forEach(({current}) => current.beginHorizontalScroll());  
      }
    },
    endHorizontalScroll: () => {
      if (!showColumnBearer.current){
        canvasRefs.current.forEach(({current}) => current.endHorizontalScroll());
        scrollingEl.current.style.height = `${contentHeight.current + horizontalScrollbarHeight.current}px`;
        return canvasRefs.current[scrollableCanvasIdx].current.scrollLeft;
      }
    }
  }));

  const [data, dispatchData] = useReducer(dataReducer, {}, initData);
  // I don't think we should need this
  const setRange = useCallback(
    (lo, hi) => {
      dataSource.setRange(lo, hi);
      // dispatchData({ type: "range", range: { lo, hi } });
    },
    [dataSource]
  );

  const handleColumnBearerScroll = scrollDistance =>
    canvasRefs.current[scrollableCanvasIdx].current.scrollBy(scrollDistance);

  const handleColumnDrag = useCallback(async (dragPhase, draggedColumn, insertIdx, insertPos, columnLeft) => {
    const {columnGroupIdx, columnIdx} = columnDragData;
    const {current: canvas} = canvasRefs.current[columnGroupIdx];
    if (dragPhase === 'drag'){ // only called when we cross onto next targetColumn
      insertIndicator.current.style.left = insertPos + 'px';
    } else if (dragPhase === 'drag-end'){
      insertIndicator.current.style.transition = 'left ease .3s';
      if (canvas.isWithinScrollWindow(draggedColumn)){
        if (insertIdx > columnIdx){
          insertIndicator.current.style.left = (insertPos - draggedColumn.width) + 'px';
          columnBearer.current.setFinalPosition(insertPos - draggedColumn.width);
        } else {
          insertIndicator.current.style.left = (insertPos) + 'px';
          columnBearer.current.setFinalPosition(insertPos);
        }
      }
      const groupInsertIdx = getColumnGroupColumnIdx(gridModel, insertIdx);
      await canvas.endDrag(columnDragData, groupInsertIdx, columnLeft);
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
        const columnOffset = canvasRefs.current[columnGroupIdx].current.beginDrag(column);
        const {left} = viewportEl.current.getBoundingClientRect();
        insertIndicator.current.style.left = (columnOffset-left) + 'px';
      }
    },[columnDragData])

  const handleVerticalScroll = useScroll("scrollTop", scrollCallback);

  useEffect(() => {
    dispatchData({type: 'clear'});
    dataSource.subscribe(
      {
        range: { lo: 0, hi: gridModelRef.current.viewportRowCount }
      },
      /* postMessageToClient */
      msg => {
        if (msg.type === 'subscribed'){
          dispatchGridModelAction({type: 'set-columns', columns: msg.columns})
        } else if (msg.size !== undefined){
          // How do we handle this withoput having this dependency on gridModel ?
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
            range: msg.range,
          });
        } else if (msg.updates){
          dispatchData({
            type: 'update',
            updates: msg.updates
          })
        }
      }
    );

    // shouldn't be necessary if range was included in subscribe
    //dataSource.setRange(0, gridModel.viewportRowCount);

    return () => dataSource.unsubscribe();
    
  }, [dataSource]);
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
              columnGroupIdx={idx}
              contentHeight={contentHeight.current}
              firstVisibleRow={firstVisibleRow.current}
              gridModel={gridModel}
              height={gridModel.viewportHeight}
              horizontalScrollbarHeight={horizontalScrollbarHeight.current}
              key={idx}
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
