/* eslint-disable no-sequences */
import React, {
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import { ContextMenuProvider } from "@heswell/popup";
import { useForkRef } from "@heswell/react-utils"
import cx from "classnames";
import GridContext from "./grid-context";
import { buildContextMenuDescriptors } from './context-menu/grid-context-menu-descriptors';
import * as Action from "./context-menu/context-menu-actions"
// import RowHeightCanary from "./row-height-canary";
import { ComponentProvider } from "./component-context";
import { useGridModel } from "./use-grid-model";
import useDataSourceModelBindings from "./use-datasource-model-bindings";
import Viewport from "./viewport";
import { measureColumns } from "./grid-model-utils";
import components from "./standard-renderers";
import {SortType} from './constants';

// for now ...
import {GridModel} from './grid-model-utils';

import "./grid-base.css";

const noop = () => undefined;

/** @type {GridBase} */
const GridBase = forwardRef(function GridBase(props, ref) {
  const viewportRef = useRef(null);
  // const scrollableHeader = useRef(null);
  const [columnDragData, setColumnDragData] = useState(null);
  const draggingColumn = useRef(false);
  const { className, onConfigChange = noop, onRowClick } = props;
  const [rootRef, gridModel, dataSource, dispatchGridModel, custom] = useGridModel(props);

  const handleSelectionChange = useCallback(
    ({ row, rangeSelect, keepExistingSelection }) => {
      dataSource.select(row, rangeSelect, keepExistingSelection);
    },
    [dataSource]
  );

  const handleHorizontalScrollStart = useCallback(() => {
    if (!draggingColumn.current) {
      viewportRef.current.beginHorizontalScroll();
      rootRef.current.classList.add("scrolling-x");
      rootRef.current.style.paddingTop = gridModel.customHeaderHeight + "px";
    }
  }, [gridModel.customHeaderHeight, rootRef]);

  const handleHorizontalScrollEnd = useCallback(() => {
    if (!draggingColumn.current) {
      viewportRef.current.endHorizontalScroll();
      rootRef.current.classList.remove("scrolling-x");
      const {
        headerHeight,
        headingDepth,
        customHeaderHeight,
        customInlineHeaderHeight,
      } = gridModel;
      const totalHeaderHeight =
        headerHeight * headingDepth +
        customHeaderHeight +
        customInlineHeaderHeight;
      rootRef.current.style.paddingTop = totalHeaderHeight + "px";
    }
  }, [gridModel, rootRef]);

  const invokeDataSourceOperation = (operation) => {
    switch (operation.type) {
      case "openTreeNode":
        return dataSource.openTreeNode(operation.key);
      case "closeTreeNode":
        return dataSource.closeTreeNode(operation.key);
      default:
        console.log(
          `[GridBase] dataSourceOperation: unknown operation ${operation.type}`
        );
    }
  };

  const dispatchGridAction = (action) =>
  ({
    [Action.Sort]: action => dataSource.sort(action.columns),
    openTreeNode: invokeDataSourceOperation,
    closeTreeNode: invokeDataSourceOperation,
    deselection: handleSelectionChange,
    selection: handleSelectionChange,
    "scroll-end-horizontal": handleHorizontalScrollEnd,
    "scroll-start-horizontal": handleHorizontalScrollStart,
  }[action.type](action));


  const handleContextMenuAction = (type, options) => {
    switch (type){
      case Action.SortAscending:
        return dataSource.sort(GridModel.setSortColumn(gridModel, options.column, SortType.ASC)), true;
      case Action.SortDescending:
        return dataSource.sort(GridModel.setSortColumn(gridModel, options.column, SortType.DSC)), true;
      case Action.SortAddAscending:
        return dataSource.sort(GridModel.addSortColumn(gridModel, options.column, SortType.ASC)), true;
      case Action.SortAddDescending:
        return dataSource.sort(GridModel.addSortColumn(gridModel, options.column, SortType.DSC)), true;
      // case Action.SortRemove: {
      case Action.Group:
        return dataSource.group(GridModel.addGroupColumn({}, options.column)), true;
      case Action.GroupAdd:
        return dataSource.group(GridModel.addGroupColumn(gridModel,options.column)), true;
      case Action.ColumnHide:
        return dispatchGridModel({type: 'column-hide', column: options.column}), true;
      case Action.LinkTable:
        return dataSource.createLink(options), true;
      default:
        return false;
    }
  }

  useDataSourceModelBindings(dataSource, gridModel);

  const handleColumnDragStart = useCallback(
    (phase, ...args) => {
      const [columnGroupIdx, column, columnPosition, mousePosition] = args;
      const { left } = rootRef.current.getBoundingClientRect();
      const columnGroup = gridModel.columnGroups[columnGroupIdx];
      handleHorizontalScrollStart();
      setColumnDragData({
        column,
        columnGroupIdx,
        columnIdx: columnGroup.columns.findIndex(
          (col) => col.key === column.key
        ),
        initialColumnPosition: columnPosition - left,
        columnPositions: measureColumns(gridModel, left),
        mousePosition,
      });
      draggingColumn.current = true;
    },
    [gridModel, handleHorizontalScrollStart, rootRef]
  );
  const handleColumnDrop = useCallback(
    (phase, ...args) => {
      const [column, insertIdx] = args;
      setColumnDragData(null);
      draggingColumn.current = false;
      // TODO we need the final scrollLeft here
      handleHorizontalScrollEnd();
      dispatchGridModel({ type: "add-col", column, insertIdx });
    },
    [dispatchGridModel, handleHorizontalScrollEnd]
  );

  const { assignedWidth, assignedHeight, width, height, totalHeaderHeight } = gridModel;

  return (
    // Question, how much overhead are we introducing be adding gridModel to GridContext ? Perhaps it belongs in it's own context
    <GridContext.Provider
      value={{
        custom,
        dataSource,
        dispatchGridAction,
        dispatchGridModelAction: dispatchGridModel,
        gridModel,
      }}
    >
      <ContextMenuProvider label="Grid" menuActionHandler={handleContextMenuAction} menuBuilder={buildContextMenuDescriptors(gridModel)}>
        <ComponentProvider components={components}>
          <div
            className={cx("Grid", className)}
            ref={useForkRef(ref, rootRef)}
            style={{ width: assignedWidth, height: assignedHeight, paddingTop: totalHeaderHeight }}
          >
            {/* <RowHeightCanary/> */}
            {
              height == null || width === null ? null : (
                <>
                  {custom.header.component}
                  <Viewport
                    custom={custom}
                    dataSource={dataSource}
                    gridModel={gridModel}
                    columnDragData={columnDragData}
                    onColumnDragStart={handleColumnDragStart}
                    onColumnDrop={handleColumnDrop}
                    onConfigChange={onConfigChange}
                    onRowClick={onRowClick}
                    ref={viewportRef}
                  />
                  {custom.footer.component}
                </>
              )
            }
          </div>
        </ComponentProvider>
      </ContextMenuProvider>
    </GridContext.Provider>
  );
});

export default GridBase;
