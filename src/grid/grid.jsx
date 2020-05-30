import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import ColumnGroupHeader from "./column-group-header";
import GridContext from "./grid-context";
import modelReducer, { initModel } from "./grid-model-reducer";
import actionReducer from "./grid-action-reducer";
import useStyles from './use-styles';
import Viewport from "./viewport";

/** @type {GridComponent} */
const Grid = (props) => {
  const gridEl = useRef(null);
  const viewport = useRef(null);
  const scrollableHeader = useRef(null);
  const initialRender = useRef(true);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const draggingColumn = useRef(false);

  const handleHorizontalScrollStart = _scrollLeft => {
    if (!draggingColumn.current){
      viewport.current.beginHorizontalScroll();
      gridEl.current.classList.add("scrolling-x");
    }
  };

  const handleHorizontalScrollEnd = () => {
    if (!draggingColumn.current){
      const scrollLeft = viewport.current.endHorizontalScroll();
      gridEl.current.classList.remove("scrolling-x");
      scrollableHeader.current.endHorizontalScroll(scrollLeft);
    }
  };

  /** @type {onColumnDragHandler} */
  const handleColumnDrag = useCallback(
      (phase, draggedColumn, targetColumn) => {
    // if (!column.isHeading) {
        if (phase === 'drag-start') {
            const {left} = gridEl.current.getBoundingClientRect();
            handleHorizontalScrollStart();
            setDraggedColumn(
              left === 0
                ? draggedColumn
                : {...draggedColumn, position: draggedColumn.position - left});
            draggingColumn.current = true;
          } else if (phase === 'drag-end') {
            setDraggedColumn(null);
            draggingColumn.current = false;
            // TODO we need the final scrollLeft here
            handleHorizontalScrollEnd();
            dispatchGridModel({ type: 'add-col', column: draggedColumn, targetColumn });
          }
    // }
      },[]
  );

  const [gridModel, dispatchGridModel] = useReducer(
    modelReducer,
    props,
    initModel
  );

  const [, dispatchGridAction] = useReducer(
    useCallback(
      actionReducer({
        "scroll-end-horizontal": handleHorizontalScrollEnd,
        "scroll-start-horizontal": handleHorizontalScrollStart
      }),
      []
    ),
    null
  );

  useEffect(() => {
    if (initialRender.current){
      initialRender.current = false;
    } else {
      dispatchGridModel({ type: 'resize', height: props.height, width: props.width});
    }
  },[props.height, props.width]);

  const { height, width } = gridModel;

  const getColumnHeaders = scrollingHeader => {
    return gridModel.columnGroups.map((columnGroup, idx) => (
      <ColumnGroupHeader
        columnGroup={columnGroup}
        depth={gridModel.headingDepth}
        height={gridModel.headerHeight}
        key={idx}
        onColumnDrag={handleColumnDrag}
        ref={scrollingHeader || columnGroup.locked ? null : scrollableHeader}
        width={scrollingHeader ? columnGroup.contentWidth : columnGroup.width}
      />
    ));
  };

  const classes = useStyles();

  return (
    <GridContext.Provider value={{ dispatchGridAction, dispatchGridModelAction: dispatchGridModel }}>
      <div className={classes.Grid} ref={gridEl} style={{ width, height }}>
        <div className={classes.headerContainer} style={{ height: gridModel.headerHeight * gridModel.headingDepth }}>
          {getColumnHeaders()}
        </div>
        <Viewport
          columnHeaders={getColumnHeaders(true)}
          dataSource={props.dataSource}
          gridModel={gridModel}
          draggedColumn={draggedColumn}
          onColumnDrag={handleColumnDrag}
          ref={viewport}
        />
      </div>
    </GridContext.Provider>
  );
}

export default Grid;