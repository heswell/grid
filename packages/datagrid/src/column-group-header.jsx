import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import cx from "classnames";
import GridContext from "./grid-context";
import { GridModel } from "./grid-model-utils";
import ColumnGroupContext from "./column-group-context";

import HeaderCell from "./header-cell";
import GroupHeaderCell from "./group-header-cell";
import HeadingCell from "./heading-cell";

import "./column-group-header.css";

/** @type {ColumnGroupHeaderType} */
const ColumnGroupHeader = React.memo(
  forwardRef(function ColumnGroupHeader(
    {
      columnGroup,
      columnGroupIdx,
      columns = columnGroup.columns,
      onColumnDragStart,
    },
    ref
  ) {
    const columnGroupHeader = useRef(null);
    const scrollingHeaderWrapper = useRef(null);
    const {
      custom,
      dispatchGridAction,
      dispatchGridModelAction,
      gridModel,
    } = useContext(GridContext);

    const sortIndicator = (sortColumns, column) => {
      if (!sortColumns) {
        return undefined;
      } else {
        const multiColumnSort = Object.keys(sortColumns).length > 1;
        const sorted = sortColumns[column.name];
        return sorted === undefined
          ? undefined
          : multiColumnSort
          ? sorted
          : sorted > 0
          ? "asc"
          : "dsc";
      }
    };

    useImperativeHandle(ref, () => ({
      beginHorizontalScroll: (width) => {
        columnGroupHeader.current.style.width = width + "px";
        scrollingHeaderWrapper.current.style.transform = `translate3d(0px, 0px, 0px)`;
      },
      endHorizontalScroll: (scrollLeft, width) => {
        scrollingHeaderWrapper.current.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
        columnGroupHeader.current.style.width = width + "px";
      },
    }));

    const handleColumnResize = useCallback(
      (phase, column, width) => {
        dispatchGridModelAction({ type: "resize-col", phase, column, width });
      },
      [dispatchGridModelAction]
    );

    const handleHeadingResize = useCallback(
      (phase, column, width) => {
        dispatchGridModelAction({
          type: "resize-heading",
          phase,
          column,
          width,
        });
      },
      [dispatchGridModelAction]
    );

    const handleDrag = useCallback(
      (phase, column, columnPosition, mousePosition) =>
        onColumnDragStart(
          phase,
          columnGroupIdx,
          column,
          columnPosition,
          mousePosition
        ),
      [columnGroup, columnGroupIdx]
    );

    const handleRemoveGroup = useCallback(
      (column) => {
        dispatchGridAction({
          type: "group",
          columns: GridModel.removeGroupColumn(gridModel, column),
        });
      },
      [gridModel]
    );

    const {
      customHeaderHeight: top,
      customInlineHeaderHeight,
      headerHeight,
      headingDepth,
      sortColumns,
    } = gridModel;
    const height = headerHeight * headingDepth;

    const renderColHeadings = (heading) =>
      heading.map((item, idx) => (
        <HeadingCell
          key={idx}
          className={cx({ noBottomBorder: item.label === "" })}
          column={item}
          onResize={handleHeadingResize}
        />
      ));

    const { contentWidth, headings = [], width } = columnGroup;
    return (
      <div
        className={"ColumnGroupHeader"}
        ref={columnGroupHeader}
        style={{ height: height + customInlineHeaderHeight, top, width }}
      >
        <div
          ref={scrollingHeaderWrapper}
          style={{ height, width: contentWidth }}
        >
          {headings
            .map((heading, idx) => (
              <div key={idx} style={{ height: headerHeight, width }}>
                {renderColHeadings(heading)}
              </div>
            ))
            .reverse()}

          <div role="row" style={{ height: headerHeight, width: contentWidth }}>
            {columns.map((column, idx) =>
              column.isGroup ? (
                <GroupHeaderCell
                  column={column}
                  key={column.key}
                  onClick={() => console.log("onClick")}
                  onResize={handleColumnResize}
                  onToggleGroupState={() => console.log("onToggleGroupState")}
                  onRemoveColumn={handleRemoveGroup}
                />
              ) : (
                <HeaderCell
                  column={column}
                  key={column.key}
                  onDrag={handleDrag}
                  onResize={handleColumnResize}
                  sorted={sortIndicator(sortColumns, column)}
                />
              )
            )}
          </div>
        </div>
        <ColumnGroupContext.Provider value={columnGroup}>
          {custom.inlineHeader.component}
        </ColumnGroupContext.Provider>
      </div>
    );
  })
);

export default ColumnGroupHeader;
