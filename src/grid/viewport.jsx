import React, {
  createRef,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo
} from "react";
import useScroll from "./use-scroll";
import useUpdate from "./use-update";
import useStyles from './use-styles';
import useDataSource from './use-data-source';
import GridContext from "./grid-context";
import {getColumnGroupColumnIdx, GridModel} from './grid-model-utils.js';

import Canvas from "./canvas";
import ColumnBearer from './column-bearer';
import InsertIndicator from './insert-indicator';

const DEFAULT_TOGGLE_STRATEGY = {};

const getToggleStrategy = dataSource => {
  const {features={}} = dataSource;
  if (features.expand_level_1 === false){
    return {expand_level_1: false}
  } else {
    return DEFAULT_TOGGLE_STRATEGY;
  }
}

/** @type {ViewportComponent} */
const Viewport = forwardRef(function Viewport(
  { columnDragData, gridModel, onColumnDragStart, onColumnDrop },
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
  const { dataSource, dispatchGridModelAction } = useContext(GridContext);

  const gridModelRef = useRef(gridModel);
  if (gridModelRef.current !== gridModel){
    // Is there a better way to do this - the dataSource effect needs to get the latest gridModel
    // but changes to gridModel should not trigger re-subscription
    gridModelRef.current = gridModel;
  }

  const showColumnBearer = useRef(columnDragData !== null);
  showColumnBearer.current = columnDragData !== null;  

  const canvasCount = gridModel.columnGroups ? gridModel.columnGroups.length : 0;
  if (canvasRefs.current.length !== canvasCount) {
    // add or remove refs
    canvasRefs.current = Array(canvasCount).fill(null).map((_, i) => canvasRefs.current[i] || createRef());
  }
  const scrollableCanvasIdx = gridModel.columnGroups ? gridModel.columnGroups.findIndex(group => !group.locked) : -1;

  useImperativeHandle(ref, () => ({
    beginHorizontalScroll: () => {
      if (!showColumnBearer.current){
        const header = gridModel.headerHeight * gridModel.headingDepth + gridModel.customInlineHeaderHeight; 
        scrollingEl.current.style.height = `${header + Math.max(contentHeight.current +
        horizontalScrollbarHeight.current, gridModel.viewportHeight)}px`;
        canvasRefs.current.forEach(({current}) => current.beginHorizontalScroll());  
      }
    },
    endHorizontalScroll: () => {
      if (!showColumnBearer.current){
        canvasRefs.current.forEach(({current}) => current.endHorizontalScroll());
        scrollingEl.current.style.height = `${Math.max(contentHeight.current + horizontalScrollbarHeight.current, gridModel.viewportHeight)}px`;
        return canvasRefs.current[scrollableCanvasIdx].current.scrollLeft;
      }
    }
  }));

  // I don't think we should need this
  const setRange = useCallback(
    (lo, hi) => {
      dataSource.setRange(lo, hi);
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
      onColumnDrop(dragPhase, draggedColumn, insertIdx);
    }
  },[gridModel, onColumnDrop, columnDragData]);

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

    // we should not take columnNames from gridModel - thye will not yet have been recomputed if 
    // dataSOurce has changed
  const subscriptionDetails = {
    columnNames: gridModelRef.current.columnNames,
    range: { lo: 0, hi: gridModelRef.current.viewportRowCount }
  }

  //TODO useCallback for this callback
  const data = useDataSource(dataSource, subscriptionDetails, (type, options) => {
    switch(type){
      case 'subscribed':
        dispatchGridModelAction({type: 'set-available-columns', columns: options})
         break;
      case 'pivot':
          dispatchGridModelAction({type: 'set-pivot-columns', columns: options})
         break;
      case 'size':
          // How do we handle this withoput having this dependency on gridModel ?
          // THis is the important one, it comes with every rowSet
          contentHeight.current = options * gridModel.rowHeight;
          if (options >= gridModel.viewportRowCount && verticalScrollbarWidth.current === 0){
            verticalScrollbarWidth.current = 15;
          } else if (options < gridModel.viewportRowCount && verticalScrollbarWidth.current === 15){
            verticalScrollbarWidth.current = 0;
          }
        break;

      default:
   }
  });

  const classes = useStyles();

  const toggleStrategy = useMemo(() => getToggleStrategy(dataSource), [dataSource]);

  return (
    <>
      <div
        className={classes.Viewport}
        ref={viewportEl}
        style={{ height: gridModel.viewportHeight }}
        onScroll={handleVerticalScroll}
      >
        <div
          className={classes.scrollingCanvasContainer}
          ref={scrollingEl}
          style={{ height: Math.max(contentHeight.current + horizontalScrollbarHeight.current, gridModel.viewportHeight) }}
        >
          {gridModel.columnGroups ? gridModel.columnGroups.map((columnGroup, idx) => (
            <Canvas
              columnGroupIdx={idx}
              contentHeight={contentHeight.current}
              firstVisibleRow={firstVisibleRow.current}
              gridModel={gridModel}
              height={gridModel.viewportHeight}
              horizontalScrollbarHeight={horizontalScrollbarHeight.current}
              key={idx}
              onColumnDragStart={onColumnDragStart}
              ref={canvasRefs.current[idx]}
              rowHeight={gridModel.rowHeight}
              rows={data.rows}
              toggleStrategy={toggleStrategy} // brand new, not well thought out yet
            />
          )) : null}
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
