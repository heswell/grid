import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import ColumnGroupHeader from "./column-group-header";
import GridContext from "./grid-context";
import {MenuProvider} from './context-menu/menu-context';
import modelReducer, { initModel } from "./grid-model-reducer";
import useGridAction from "./use-grid-action";
import useStyles from './use-styles';
import useEffectSkipFirst from './use-effect-skip-first';
import Viewport from "./viewport";
import {GridModel, measureColumns} from './grid-model-utils';

/** @type {GridComponent} */
const Grid = (props) => {
  const {dataSource} = props;
  const gridEl = useRef(null);
  const viewport = useRef(null);
  const scrollableHeader = useRef(null);
  const initialRender = useRef(true);
  /** @type {[ColumnDragData, React.Dispatch<ColumnDragData>]} */
  const [columnDragData, setColumnDragData] = useState(null);
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

  const dispatchGridAction = useGridAction({
    "scroll-end-horizontal": handleHorizontalScrollEnd,
    "scroll-start-horizontal": handleHorizontalScrollStart
  });

  const classes = useStyles();

  const [gridModel, dispatchGridModel] = useReducer(
    modelReducer,
    props,
    initModel
  );

  //TODO do we need to useCallback here - can we ever send stale props ?
  useEffectSkipFirst(() => {
    dispatchGridModel({type: 'initialize', props});
  },[props.columns, props.columnSizing, props.groupBy])

  useEffectSkipFirst(() => {
    dataSource.sort(GridModel.sortBy(gridModel));
  },[gridModel.sortColumns])

  useEffectSkipFirst(() => {
    // undefined means these are unset, null means a previous value has been removed
    if (gridModel.groupColumns !== undefined || gridModel.pivotColumns !== undefined){
      dataSource.group(GridModel.groupBy(gridModel), GridModel.pivotBy(gridModel));
    }
  },[gridModel.groupColumns, gridModel.pivotColumns])

  useEffectSkipFirst(() => {
      dataSource.setGroupState(gridModel.groupState);
  }, [dataSource, gridModel.groupState]);

  useEffectSkipFirst(() => {
      dataSource.setSubscribedColumns(gridModel.columnNames);
}, [dataSource, gridModel.columnNames]);

  const handleColumnDrag = useCallback(
      (phase, ...args) => {
    // if (!column.isHeading) {
        if (phase === 'drag-start') {
            const [columnGroupIdx, column, columnPosition, mousePosition] = args;
            const {left} = gridEl.current.getBoundingClientRect();
            const columnGroup = gridModel.columnGroups[columnGroupIdx];
            handleHorizontalScrollStart();
            setColumnDragData({
              column,
              columnGroupIdx,
              columnIdx: columnGroup.columns.findIndex(col => col.key === column.key),
              initialColumnPosition: columnPosition - left,
              columnPositions: measureColumns(gridModel, left),
              mousePosition
            });
            draggingColumn.current = true;
          } else if (phase === 'drag-end') {
            const [column, insertIdx] = args;
            setColumnDragData(null);
            draggingColumn.current = false;
            // TODO we need the final scrollLeft here
            handleHorizontalScrollEnd();
            dispatchGridModel({ type: 'add-col', column, insertIdx });
          }
    // }
      },[gridModel]
  );

  useEffect(() => {
    if (initialRender.current){
      initialRender.current = false;
    } else {
      dispatchGridModel({ type: 'resize', height: props.height, width: props.width});
    }
  },[props.height, props.width]);

  const { height, width } = gridModel;

  return (// Question, how much overhead are we introducing be adding gridModel to GridContext ? Perhaps it belongs in it's own context
      <GridContext.Provider value={{ dispatchGridAction, dispatchGridModelAction: dispatchGridModel, gridModel }}>
        <MenuProvider>
        <div className={classes.Grid} ref={gridEl} style={{ width, height }}>
          <div className={classes.headerContainer} style={{ height: gridModel.headerHeight * gridModel.headingDepth }}>
            {gridModel.columnGroups.map((columnGroup, idx) => (
              <ColumnGroupHeader
                columnGroup={columnGroup}
                columnGroupIdx={idx}
                depth={gridModel.headingDepth}
                height={gridModel.headerHeight}
                key={idx}
                onColumnDrag={handleColumnDrag}
                ref={columnGroup.locked ? null : scrollableHeader}
                sortColumns={gridModel.sortColumns}
                width={columnGroup.width}
              />
            ))}
          </div>
          <Viewport
            dataSource={dataSource}
            gridModel={gridModel}
            columnDragData={columnDragData}
            onColumnDrag={handleColumnDrag}
            ref={viewport}
          />
        </div>
        </MenuProvider>
      </GridContext.Provider>
  );
}

export default Grid;