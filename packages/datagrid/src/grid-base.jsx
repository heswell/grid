import React, {
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import {useForkRef} from "@heswell/utils"
import cx from "classnames";
import GridContext from "./grid-context";
import { MenuProvider } from "./context-menu/menu-context";
import RowHeightCanary from "./row-height-canary";
import { ComponentProvider } from "./component-context";
import {useGridModel} from "./use-grid-model";
import useDataSourceModelBindings from "./use-datasource-model-bindings";
import Viewport from "./viewport";
import { measureColumns } from "./grid-model-utils";
import components from "./standard-renderers";

import "./grid-base.css";

/** @type {GridBase} */
const GridBase = forwardRef(function GridBase(props, ref){
  // TODO height needs to default to auto
  const viewportRef = useRef(null);
  // const scrollableHeader = useRef(null);
  const [columnDragData, setColumnDragData] = useState(null);
  const draggingColumn = useRef(false);

  const [rootRef, gridModel, dataSource, dispatchGridModel, custom] = useGridModel(props);


  const handleSelectionChange = useCallback(
    ({ idx, row, rangeSelect, keepExistingSelection }) => {
      console.log(
        `Grid onSelectionChange idx=${idx} rangeSelect=${rangeSelect} keepExistingSelection=${keepExistingSelection}`
      );
      dataSource.select(idx, rangeSelect, keepExistingSelection);
      //if (onSelectionChange){
      //const isSelected = row[model.meta.SELECTED] === 1;
      // TODO what about range selections
      //onSelectionChange && onSelectionChange(idx, row, !isSelected)
      //}
      // if (selected.length === 1 && onSingleSelect) {
      //     onSingleSelect(selected[0], selectedItem);
      // }
    },
    []
  );

  const handleHorizontalScrollStart = () => {
    if (!draggingColumn.current) {
      viewportRef.current.beginHorizontalScroll();
      rootRef.current.classList.add("scrolling-x");
      rootRef.current.style.paddingTop = gridModel.customHeaderHeight + "px";
    }
  };

  const handleHorizontalScrollEnd = () => {
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
  };

  const invokeDataSourceOperation = (operation) => {
    switch (operation.type) {
      case "group":
        return dataSource.group(operation.columns);
      case "sort":
        return dataSource.sort(operation.columns);
      default:
        console.log(
          `[GridBase] dataSourceOperation: unknown operation ${operation.type}`
        );
    }
  };

  const dispatchGridAction = (action) =>
    ({
      group: invokeDataSourceOperation,
      sort: invokeDataSourceOperation,
      selection: handleSelectionChange,
      "scroll-end-horizontal": handleHorizontalScrollEnd,
      "scroll-start-horizontal": handleHorizontalScrollStart,
    }[action.type](action));



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
    [gridModel]
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
    [gridModel]
  );


  const { height, width, headerHeight, headingDepth } = gridModel;
  const totalHeaderHeight =
    custom.header.height +
    headerHeight * headingDepth +
    custom.inlineHeader.height;
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
      <MenuProvider>
        <ComponentProvider components={components}>
          <div
            className={cx("Grid", props.className)}
            ref={useForkRef(ref, rootRef)}
            style={{ width, height, paddingTop: totalHeaderHeight }}
          >
            <RowHeightCanary/>
            {custom.header.component}
            <Viewport
              custom={custom}
              dataSource={dataSource}
              gridModel={gridModel}
              columnDragData={columnDragData}
              onColumnDragStart={handleColumnDragStart}
              onColumnDrop={handleColumnDrop}
              onRowClick={props.onRowClick}
              ref={viewportRef}
            />
            {custom.footer.component}
          </div>
        </ComponentProvider>
      </MenuProvider>
    </GridContext.Provider>
  );
});

export default GridBase;
