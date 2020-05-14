import React, { useCallback, useEffect, memo, useReducer, useRef } from "react";
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

  const handleHorizontalScrollStart = _scrollLeft => {
    viewport.current.beginHorizontalScroll();
    gridEl.current.classList.add("scrolling-x");
  };

  const handleHorizontalScrollEnd = scrollLeft => {
    viewport.current.endHorizontalScroll();
    gridEl.current.classList.remove("scrolling-x");
    scrollableHeader.current.endHorizontalScroll(scrollLeft);
  };

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

  const { headerHeight, height, width } = gridModel;

  const getColumnHeaders = scrollingHeaders => {
    return gridModel.columnGroups.map((columnGroup, idx) => (
      <ColumnGroupHeader
        columnGroup={columnGroup}
        height={headerHeight}
        key={idx}
        ref={scrollingHeaders || columnGroup.locked ? null : scrollableHeader}
        width={scrollingHeaders ? columnGroup.contentWidth : columnGroup.width}
      />
    ));
  };

  const classes = useStyles();

  return (
    <GridContext.Provider value={{ dispatchGridAction }}>
      <div className={classes.Grid} ref={gridEl} style={{ width, height }}>
        <div className={classes.headerContainer} style={{ height: headerHeight }}>
          {getColumnHeaders()}
        </div>
        <Viewport
          columnHeaders={getColumnHeaders(true)}
          dataSource={props.dataSource}
          gridModel={gridModel}
          ref={viewport}
        />
      </div>
    </GridContext.Provider>
  );
}

export default Grid;