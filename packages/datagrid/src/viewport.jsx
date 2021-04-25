import React, {
  createRef,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
} from "react";
import { metadataKeys, useEffectSkipFirst } from "@heswell/utils";
import useScroll from "./use-scroll";
import useUpdate from "./use-update";
import useDataSource from "./use-data-source";
import GridContext from "./grid-context";
import { getColumnGroupColumnIdx } from "./grid-model-utils.js";
import useContextMenu from "./context-menu/use-context-menu";

import Canvas from "./canvas";
import ColumnBearer from "./column-bearer";
import InsertIndicator from "./insert-indicator";
import * as Message from "./vuu-messages";

import "./viewport.css";

const DEFAULT_TOGGLE_STRATEGY = {};

const getToggleStrategy = (dataSource) => {
  const { features = {} } = dataSource;
  if (features.expand_level_1 === false) {
    return { expand_level_1: false };
  } else {
    return DEFAULT_TOGGLE_STRATEGY;
  }
};

// Temp, until we manage selection properly
const countSelectedRows = data => {
  let count = 0;
  for (let row of data){
    if (row && row[metadataKeys.SELECTED]){
      count += 1;
    }
  }
  return count;
}

/** @type {Viewport} */
const Viewport = forwardRef(function Viewport(
  { columnDragData, gridModel, onColumnDragStart, onColumnDrop, onConfigChange, onRowClick },
  ref
) {
  const viewportEl = useRef(null);
  const scrollingEl = useRef(null);
  const rowCount = useRef(0);
  /** @type {React.MutableRefObject<any>} */
  const canvasRefs = useRef([]);
  const columnBearer = useRef(null);
  const contentHeight = useRef(0);
  const horizontalScrollbarHeight = useRef(gridModel.horizontalScrollbarHeight);
  const verticalScrollbarWidth = useRef(0);
  const firstVisibleRow = useRef(0);
  const insertIndicator = useRef(null);

  useEffect(() => {
    horizontalScrollbarHeight.current = gridModel.horizontalScrollbarHeight;
  }, [gridModel.horizontalScrollbarHeight]);

  // TODO we could get gridModel here as well. Or would it be better to split gridModel into it's own context ?
  const { dataSource, dispatchGridModelAction } = useContext(GridContext);

  const gridModelRef = useRef(gridModel);
  if (gridModelRef.current !== gridModel) {
    // Is there a better way to do this - the dataSource effect needs to get the latest gridModel
    // but changes to gridModel should not trigger re-subscription
    gridModelRef.current = gridModel;
  }

  const showColumnBearer = useRef(columnDragData !== null);
  showColumnBearer.current = columnDragData !== null;

  const canvasCount = gridModel.columnGroups
    ? gridModel.columnGroups.length
    : 0;
  if (canvasRefs.current.length !== canvasCount) {
    // add or remove refs
    canvasRefs.current = Array(canvasCount)
      .fill(null)
      .map((_, i) => canvasRefs.current[i] || createRef());
  }
  const scrollableCanvasIdx = gridModel.columnGroups
    ? gridModel.columnGroups.findIndex((group) => !group.locked)
    : -1;


  useImperativeHandle(ref, () => ({
    beginHorizontalScroll: () => {
      if (!showColumnBearer.current) {
        const header =
          gridModel.headerHeight * gridModel.headingDepth +
          gridModel.customInlineHeaderHeight;
        scrollingEl.current.style.height = `${header +
          Math.max(
            contentHeight.current + horizontalScrollbarHeight.current,
            gridModel.viewportHeight
          )
          }px`;
        canvasRefs.current.forEach(({ current }) =>
          current.beginHorizontalScroll()
        );
      }
    },
    endHorizontalScroll: () => {
      if (!showColumnBearer.current) {
        canvasRefs.current.forEach(({ current }) =>
          current.endHorizontalScroll()
        );
        scrollingEl.current.style.height = `${Math.max(
          contentHeight.current + horizontalScrollbarHeight.current,
          gridModel.viewportHeight
        )}px`;
        return canvasRefs.current[scrollableCanvasIdx].current.scrollLeft;
      }
    },
  }));

  const handleColumnBearerScroll = (scrollDistance) =>
    canvasRefs.current[scrollableCanvasIdx].current.scrollBy(scrollDistance);

  const handleColumnDrag = useCallback(
    async (dragPhase, draggedColumn, insertIdx, insertPos, columnLeft) => {
      const { columnGroupIdx, columnIdx } = columnDragData;
      const { current: canvas } = canvasRefs.current[columnGroupIdx];
      if (dragPhase === "drag") {
        // only called when we cross onto next targetColumn
        insertIndicator.current.style.left = insertPos + "px";
      } else if (dragPhase === "drag-end") {
        insertIndicator.current.style.transition = "left ease .3s";
        if (canvas.isWithinScrollWindow(draggedColumn)) {
          if (insertIdx > columnIdx) {
            insertIndicator.current.style.left =
              insertPos - draggedColumn.width + "px";
            columnBearer.current.setFinalPosition(
              insertPos - draggedColumn.width
            );
          } else {
            insertIndicator.current.style.left = insertPos + "px";
            columnBearer.current.setFinalPosition(insertPos);
          }
        }
        const groupInsertIdx = getColumnGroupColumnIdx(gridModel, insertIdx);
        await canvas.endDrag(columnDragData, groupInsertIdx, columnLeft);
        onColumnDrop(dragPhase, draggedColumn, insertIdx);
      }
    },
    [gridModel, onColumnDrop, columnDragData]
  );

  // we should not take columnNames from gridModel - thye will not yet have been recomputed if
  // dataSource has changed
  const { columnNames, viewportRowCount } = gridModelRef.current;
  const subscriptionDetails = useRef({
    columnNames,
    range: { lo: 0, hi: viewportRowCount },
  });

  const dataSourceCallback = useCallback(
    (type, options) => {
      // We apply visual effects to the UI and save config only when we receive
      // server confirmation that operation has bene acknowledged
      switch (type) {
        case "subscribed":
          dispatchGridModelAction({
            type: "set-available-columns",
            columns: options.columns,
          });
          break;
        case "pivot":
          dispatchGridModelAction({
            type: "set-pivot-columns",
            columns: options,
          });
          break;
        case "sort": {
          const action = { type, sort: options };
          dispatchGridModelAction(action);
          onConfigChange(action);
        }
          break;
        case "filter": {
          // We don't currently show filter ops innthe Grid UI, but we might at some point
          const action = { type, filter: options };
          onConfigChange(action);
        }
          break;
        case 'groupBy': {
          const action = { type: "group", groupBy: options };
          dispatchGridModelAction(action);
          onConfigChange(action);
        }
          break;

        case 'visual-link-created':
          onConfigChange({ type, ...options });
          break;

        case "size":
          // How do we handle this withoput having this dependency on gridModel ?
          // This is the important one, it comes with every rowSet
          rowCount.current = options;
          contentHeight.current = rowCount.current * gridModel.rowHeight;
          if (
            options >= gridModel.viewportRowCount &&
            verticalScrollbarWidth.current === 0
          ) {
            verticalScrollbarWidth.current = 15;
          } else if (
            options < gridModel.viewportRowCount &&
            verticalScrollbarWidth.current === 15
          ) {
            verticalScrollbarWidth.current = 0;
          }
          break;

        // TODO how do we abstract these concepts away from the grid itself ?
        case Message.VisualLinksResp:
          dispatchGridModelAction({ type: "visual-links", links: options });
          break;

        case Message.RpcResp:
          console.log(`RPC Resp ${JSON.stringify(options)}`)
        break;

        default:
      }
    },
    [dispatchGridModelAction, gridModel.viewportRowCount, gridModel.rowHeight, onConfigChange]
  );

  const [data, setRange] = useDataSource(
    dataSource,
    subscriptionDetails.current,
    gridModel.renderBufferSize,
    dataSourceCallback
  );

  useUpdate(() => {
    setRange(
      firstVisibleRow.current,
      firstVisibleRow.current +
      gridModel.viewportRowCount
    );
  }, [gridModel.viewportRowCount]);

  useUpdate(() => {
    contentHeight.current = gridModel.rowHeight * rowCount.current;
  }, [gridModel.rowHeight, rowCount])

  useEffectSkipFirst(() => {
    viewportEl.current.scrollTop = 0;
  }, [dataSource]);

  useLayoutEffect(() => {
    if (columnDragData) {
      const { column, columnGroupIdx } = columnDragData;
      const columnOffset = canvasRefs.current[columnGroupIdx].current.beginDrag(
        column
      );
      const { left } = viewportEl.current.getBoundingClientRect();
      insertIndicator.current.style.left = columnOffset - left + "px";
    }
  }, [columnDragData]);

  const scrollCallback = useCallback(
    (scrollEvent, scrollTop) => {
      if (scrollEvent === "scroll") {
        const firstRow = Math.floor(scrollTop / gridModel.rowHeight);
        if (firstRow !== firstVisibleRow.current) {
          firstVisibleRow.current = firstRow;
          const lastRow = firstRow + gridModel.viewportRowCount;
          if (lastRow > rowCount.current) {
            setRange(rowCount.current - gridModel.viewportRowCount, rowCount.current);
          } else {
            setRange(firstRow, firstRow + gridModel.viewportRowCount);
          }
        }
      } else if (scrollEvent === "scroll-start") {
        canvasRefs.current.forEach(({ current }) =>
          current.beginVerticalScroll()
        );
      } else {
        canvasRefs.current.forEach(({ current }) =>
          current.endVerticalScroll(scrollTop)
        );
      }
    },
    [gridModel.rowHeight, gridModel.viewportRowCount, setRange]
  );

  const [handleVerticalScroll, suspendScrollHandling] = useScroll("scrollTop", scrollCallback);

  const toggleStrategy = useMemo(() => getToggleStrategy(dataSource), [
    dataSource,
  ]);


  const contextMenuOptions = useMemo(() => {
    return {selectedRowCount: countSelectedRows(data)}
  }, [data])
  const handleContextMenu = useContextMenu("grid", contextMenuOptions);

  const scrollBy = useCallback((rows) => {
    const scrollTop = viewportEl.current.scrollTop + rows * gridModel.rowHeight;
    const diff = scrollTop % gridModel.rowHeight;
    viewportEl.current.scrollTop = scrollTop - diff;
  }, [gridModel.rowHeight]);

  const scrollEnd = useCallback((startOrEnd) => {
    suspendScrollHandling(true);
    const { rowHeight, viewportHeight } = gridModel;

    const scrollPos = startOrEnd === 'start'
      ? 0
      : rowCount.current * rowHeight - viewportHeight;
    viewportEl.current.scrollTop = scrollPos;
    suspendScrollHandling(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridModel.rowHeight, gridModel.viewportHeight, suspendScrollHandling]);

  const handleKeyDown = useCallback(evt => {
    console.log(`key ${evt.key}`)
    switch (evt.key) {
      case 'ArrowDown':
        evt.preventDefault();
        scrollBy(1);
        break;
      case 'ArrowUp':
        evt.preventDefault();
        scrollBy(-1);
        break;
      case 'Home':
        evt.preventDefault();
        scrollEnd('start');
        break;
      case 'End':
        evt.preventDefault();
        scrollEnd('end');
        break;
      default:
    }
  }, [scrollBy, scrollEnd]);

  return (
    <>
      <div
        className="Viewport"
        ref={viewportEl}
        style={{ height: gridModel.viewportHeight }}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        onScroll={handleVerticalScroll}
        tabIndex={-1}
      >
        <div
          className="scrollingCanvasContainer"
          ref={scrollingEl}
          style={{
            height: Math.max(
              contentHeight.current + horizontalScrollbarHeight.current,
              gridModel.viewportHeight
            ),
          }}
        >
          {gridModel.columnGroups
            ? gridModel.columnGroups.map((columnGroup, idx) => (
              <Canvas
                columnGroupIdx={idx}
                contentHeight={contentHeight.current}
                firstVisibleRow={firstVisibleRow.current}
                gridModel={gridModel}
                height={gridModel.viewportHeight}
                horizontalScrollbarHeight={horizontalScrollbarHeight.current}
                key={idx}
                onColumnDragStart={onColumnDragStart}
                onRowClick={onRowClick}
                ref={canvasRefs.current[idx]}
                data={data}
                toggleStrategy={toggleStrategy} // brand new, not well thought out yet
              />
            ))
            : null}
        </div>
      </div>
      {columnDragData && (
        <>
          <InsertIndicator ref={insertIndicator} />
          <ColumnBearer
            columnDragData={columnDragData}
            gridModel={gridModel}
            initialScrollPosition={
              canvasRefs.current[scrollableCanvasIdx].current.scrollLeft
            }
            onDrag={handleColumnDrag}
            onScroll={handleColumnBearerScroll}
            ref={columnBearer}
            rows={data}
          />
        </>
      )}
    </>
  );
});

export default Viewport;
