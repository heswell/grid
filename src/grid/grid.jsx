import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import ColumnGroupHeader from "./column-group-header";
import GridContext from "./grid-context";
import {MenuProvider} from './context-menu/menu-context';
import modelReducer, { initModel } from "./grid-model-reducer";
import actionReducer from "./grid-action-reducer";
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
  const availableColumns = useRef(props.columns);
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
    dataSource.group(GridModel.groupBy(gridModel), GridModel.pivotBy(gridModel));
  },[gridModel.groupColumns, gridModel.pivotColumns])

  useEffectSkipFirst(() => {
      dataSource.setGroupState(gridModel.groupState);
  }, [dataSource, gridModel.groupState]);

  useEffectSkipFirst(() => {
      dataSource.setSubscribedColumns(gridModel.columnNames);
}, [dataSource, gridModel.columnNames]);

  const setAvailableColumns = useCallback(columns => {
    availableColumns.current = columns;
    dispatchGridModel({type: 'set-columns', columns});
  },[dispatchGridModel])

  // be careful dataSource can change, but these methods get 'frozen' into gridReducer
  const hideColumn = useCallback(column => {
    dispatchGridModel({type: 'column-hide', column});
  },[dispatchGridModel])

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

  // TODO be careful of the dependency implications here
  const [, dispatchGridAction] = useReducer(
    useCallback(
      actionReducer({
        "scroll-end-horizontal": handleHorizontalScrollEnd,
        "scroll-start-horizontal": handleHorizontalScrollStart,
        "set-available-columns": setAvailableColumns,
        "column-hide": hideColumn
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