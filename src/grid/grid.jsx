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
    console.log(`%cGrid handleHorizontalScrollStart draggingColumn ? ${draggingColumn.current}`, 'color: green; fontWeight: bold;')
    if (!draggingColumn.current){
      viewport.current.beginHorizontalScroll();
      gridEl.current.classList.add("scrolling-x");
    }
  };

  const handleHorizontalScrollEnd = () => {
    console.log(`%cGrid handleHorizontalScrollEnd  draggingColumn ? ${draggingColumn.current} `, 'color: green; fontWeight: bold;')
    if (!draggingColumn.current){
      const scrollLeft = viewport.current.endHorizontalScroll();
      gridEl.current.classList.remove("scrolling-x");
      scrollableHeader.current.endHorizontalScroll(scrollLeft);
    }
  };

  /** @type {onDragHandler} */
  const handleColumnDrag = useCallback(
      (phase, column, position) => {
    // if (!column.isHeading) {
    //     const pos = scrollLeft.current;
        const pos = 0; // deal with horizontal scrolling later
        if (phase === 'drag') {
              // dispatch({ type: Action.MOVE, distance, scrollLeft: pos });
          } else if (phase === 'drag-start') {
            console.log(`set the draggedColumn`)
            const {left} = gridEl.current.getBoundingClientRect();
            handleHorizontalScrollStart();
            setDraggedColumn({...column, position: position - left});
            draggingColumn.current = true;
              // dispatch({ type: Action.MOVE_BEGIN, column, scrollLeft: pos });
          } else if (phase === 'drag-end') {
            setDraggedColumn(null);
            draggingColumn.current = false;
            // TODO we need the final scrollLeft here
            handleHorizontalScrollEnd();
              // dispatch({ type: Action.MOVE_END, column });
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