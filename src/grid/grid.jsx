//@ts-nocheck

import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import cx from 'classnames';
import GridContext from "./grid-context";
import {MenuProvider} from './context-menu/menu-context';
import modelReducer, { initModel } from "./grid-model-reducer";
import useGridAction from "./use-grid-action";
import useStyles from './use-styles';
import useEffectSkipFirst from './use-effect-skip-first';
import useAdornments from './use-adornments';
import Viewport from "./viewport";
import {GridModel, measureColumns} from './grid-model-utils';
import {Footer, Header, InlineHeader} from './grid-adornments';

/** @type {GridComponent} */
const Grid = (props) => {
  const gridEl = useRef(null);
  const viewport = useRef(null);
  // const scrollableHeader = useRef(null);
  const initialRender = useRef(true);
  /** @type {[ColumnDragData, React.Dispatch<ColumnDragData>]} */
  const [columnDragData, setColumnDragData] = useState(null);
  const draggingColumn = useRef(false);

  const handleSelectionChange = useCallback(({idx, row, rangeSelect, keepExistingSelection}) => {
    console.log(`Grid onSelectionChange idx=${idx} rangeSelect=${rangeSelect} keepExistingSelection=${keepExistingSelection}`);
    dataSource.select(idx, rangeSelect,keepExistingSelection);
    //if (onSelectionChange){
        //const isSelected = row[model.meta.SELECTED] === 1;
        // TODO what about range selections
        //onSelectionChange && onSelectionChange(idx, row, !isSelected)
    //}
  // if (selected.length === 1 && onSingleSelect) {
  //     onSingleSelect(selected[0], selectedItem);
  // }

  },[]);

  const handleHorizontalScrollStart = _scrollLeft => {
    if (!draggingColumn.current){
      viewport.current.beginHorizontalScroll();
      gridEl.current.classList.add("scrolling-x");
      gridEl.current.style.paddingTop = gridModel.customHeaderHeight + 'px';
    }
  };

  const handleHorizontalScrollEnd = () => {
    if (!draggingColumn.current){
      viewport.current.endHorizontalScroll();
      gridEl.current.classList.remove("scrolling-x");
      const {headerHeight, headingDepth, customHeaderHeight, customInlineHeaderHeight} = gridModel;
      const totalHeaderHeight = headerHeight * headingDepth + customHeaderHeight + customInlineHeaderHeight;
      gridEl.current.style.paddingTop = totalHeaderHeight + 'px';
      // scrollableHeader.current.endHorizontalScroll(scrollLeft);
    }
  };

  const dispatchGridAction = useGridAction({
    "selection": handleSelectionChange,
    "scroll-end-horizontal": handleHorizontalScrollEnd,
    "scroll-start-horizontal": handleHorizontalScrollStart
  });

  const classes = useStyles();

  const [dataSource, setDataSource] = useState(props.dataSource);

  const custom = useAdornments(props);
  
  const [gridModel, dispatchGridModel] = useReducer(
    modelReducer,
    [props, custom],
    initModel
  );

  //TODO do we need to useCallback here - can we ever send stale props ?
  useEffectSkipFirst(() => {
    dispatchGridModel({type: 'initialize', props});
    if (props.dataSource !== dataSource){
      setDataSource(props.dataSource)
    }
  },[props.columns, props.columnSizing, props.dataSource, props.groupBy])

  useEffectSkipFirst(() => {
    console.log('SORT changed')
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

  const handleColumnDragStart = useCallback(
      (phase, ...args) => {
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
      },[gridModel]
  );
  const handleColumnDrop = useCallback(
      (phase, ...args) => {
          const [column, insertIdx] = args;
          setColumnDragData(null);
          draggingColumn.current = false;
          // TODO we need the final scrollLeft here
          handleHorizontalScrollEnd();
          dispatchGridModel({ type: 'add-col', column, insertIdx });
      },[gridModel]
  );

  useEffect(() => {
    if (initialRender.current){
      initialRender.current = false;
    } else {
      dispatchGridModel({ type: 'resize', height: props.height, width: props.width});
    }
  },[props.height, props.width]);

  const { height, width, headerHeight, headingDepth } = gridModel;
  const totalHeaderHeight = custom.header.height + headerHeight * headingDepth + custom.inlineHeader.height;

  return (// Question, how much overhead are we introducing be adding gridModel to GridContext ? Perhaps it belongs in it's own context
      <GridContext.Provider value={{ custom, dataSource, dispatchGridAction, dispatchGridModelAction: dispatchGridModel, gridModel }}>
        <MenuProvider>
          <div className={cx(classes.Grid, props.className)} ref={gridEl} style={{ width, height, paddingTop: totalHeaderHeight }}>
            {custom.header.component}
            <Viewport
              custom={custom}
              dataSource={dataSource}
              gridModel={gridModel}
              columnDragData={columnDragData}
              onColumnDragStart={handleColumnDragStart}
              onColumnDrop={handleColumnDrop}
              ref={viewport}
            />
            {custom.footer.component}
          </div>
        </MenuProvider>
      </GridContext.Provider>
  );
}

Grid.Header = Header;
Grid.InlineHeader = InlineHeader;
Grid.Footer = Footer;

export default Grid;