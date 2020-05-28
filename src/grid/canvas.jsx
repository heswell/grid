import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useReducer,
  useRef
} from "react";
import cx from "classnames";
import GridContext from "./grid-context";
import useScroll from "./use-scroll";
import useUpdate from "./use-update";
import useStyles from "./use-styles";
import canvasReducer, { initCanvasReducer } from "./canvas-reducer";
import Row from "./row";

const byKey = ([key1], [key2]) => key1 - key2;

/** @type {CanvasType} */
const Canvas = forwardRef(function Canvas(
  {
    columnGroup,
    columnHeader,
    contentHeight,
    firstVisibleRow,
    totalHeaderHeight,
    height,
    horizontalScrollbarHeight,
    meta,
    rowHeight,
    rows
  },
  ref
) {
  const canvasEl = useRef(null);
  const contentEl = useRef(null);
  const hilightedIndex = useRef(-1);
  const { dispatchGridAction } = useContext(GridContext);

  const [[columns, cellKeys], dispatchCanvasAction] = useReducer(
    canvasReducer,
    columnGroup,
    initCanvasReducer
  );

  useUpdate(() => {
    dispatchCanvasAction({type: 'refresh', columnGroup});
  },[columnGroup.width, columnGroup.columns]);

  useImperativeHandle(ref, () => ({
    beginHorizontalScroll: () => {
      canvasEl.current.style.height = `${height + totalHeaderHeight}px`;
    },

    endHorizontalScroll: () => {
      canvasEl.current.style.height = `${height}px`;
    },

    beginVerticalScroll: () => {
      canvasEl.current.style.height = `${contentHeight + horizontalScrollbarHeight}px`;
      contentEl.current.style.transform = "translate3d(0px, 0px, 0px)";
    },

    endDrag: (draggedColumn, targetColumn) => {
      const idx = columns.findIndex(col => col.key === draggedColumn.key);
      const rows = contentEl.current.childNodes;
      const headerCells = getHeaderCells(canvasEl, columnGroup);
      const lastIdx = columns.length - 1; 
      finalDragDisplay([headerCells], idx, hilightedIndex.current, hilightedIndex.current, lastIdx );
      finalDragDisplay(rows, idx, hilightedIndex.current, hilightedIndex.current, lastIdx );
      hilightedIndex.current = -1;
    },

    endVerticalScroll: scrollTop => {
      canvasEl.current.style.height = `${height}px`;
      contentEl.current.style.transform = `translate3d(0px, -${scrollTop}px, 0px)`;
    },

    hideDraggedColumn: column => {
      const idx = columns.findIndex(col => col.key === column.key);
      const rows = contentEl.current.childNodes;
      const headerCells = getHeaderCells(canvasEl, columnGroup);
      const lastIdx = columns.length - 1;
      setDragDisplay([headerCells], idx, idx, -1, column.width, lastIdx);
      setDragDisplay(rows, idx, idx, -1, column.width, lastIdx );
      
      hilightedIndex.current = idx;
    },

    makeSpaceForColumn: (column, targetColumn) => {
      const idxDraggedColumn = columns.findIndex(col => col.key === column.key);
      if (targetColumn === null){
        const headerCells = getHeaderCells(canvasEl, columnGroup);
        const rows = contentEl.current.childNodes;
        const lastIdx = columns.length - 1;  
        clearDragDisplay([headerCells], idxDraggedColumn, hilightedIndex.current, lastIdx );
        clearDragDisplay(rows, idxDraggedColumn, hilightedIndex.current, lastIdx );

        hilightedIndex.current = -1;

      } else {
        const idx = columns.findIndex(col => col.key === targetColumn.key);
        if (hilightedIndex.current !== idx){
          const headerCells = getHeaderCells(canvasEl, columnGroup);
          const rows = contentEl.current.childNodes;
          const lastIdx = columns.length - 1;  
          setDragDisplay([headerCells], idxDraggedColumn, idx, hilightedIndex.current, column.width, lastIdx );
          setDragDisplay(rows, idxDraggedColumn, idx, hilightedIndex.current, column.width, lastIdx );
        }
        hilightedIndex.current = idx;
      }
    },

    scrollBy: scrollDistance => scrollBy(scrollDistance),

    get scrollLeft(){
      return canvasEl.current.scrollLeft;
    }
  }));

  const scrollBy = useCallback(scrollDistance => {

    let scrollLeft = canvasEl.current.scrollLeft;
    let newScrollLeft = 0;

    if (scrollDistance < 0) {
      if (scrollLeft === 0){
        return 0;
      } else {
        newScrollLeft = Math.max(0, scrollLeft + scrollDistance);
      }
    } else {
      // need to read this once, at start
      const maxScroll = canvasEl.current.scrollWidth - canvasEl.current.clientWidth;
      if (scrollLeft === maxScroll){
        return 0;
      } else {
        newScrollLeft = Math.min(maxScroll, scrollLeft + scrollDistance);
      }
    }

    canvasEl.current.scrollLeft = newScrollLeft;
    // return the distance actually scrolled
    return newScrollLeft - scrollLeft;

  },[canvasEl])

  const { contentWidth, width } = columnGroup;

  const scrollCallback = useCallback(
    (scrollEvent, scrollLeft) => {
      if (scrollEvent === "scroll") {
        dispatchCanvasAction({type:'scroll-left', scrollLeft});
      } else if (scrollEvent === "scroll-start") {
        dispatchGridAction({ type: "scroll-start-horizontal", scrollLeft });
      } else {
        dispatchGridAction({ type: "scroll-end-horizontal", scrollLeft });
      }
    },
    [dispatchCanvasAction, dispatchGridAction]
  );

  const handleHorizontalScroll = useScroll("scrollLeft", scrollCallback, 100);

  const rowPositions = rows
    .map((row, idx) => {
      const absIdx = firstVisibleRow + idx;
      return [row[meta.RENDER_IDX], absIdx, row];
    })
    .sort(byKey);

  const classes = useStyles();
  const rootClassName = cx(classes.Canvas, {
    [classes.fixed]: columnGroup.locked,
    [classes.scrollable]: !columnGroup.locked
  });

  return (
    <div
      className={rootClassName}
      ref={canvasEl}
      style={{ height, width }}
      onScroll={handleHorizontalScroll}
    >
      <div className={classes.canvasContentWrapper} style={{ top: totalHeaderHeight,  width: contentWidth }}>
        <div
          className={classes.canvasContent}
          ref={contentEl}
          style={{ width: contentWidth, height: Math.max(contentHeight+horizontalScrollbarHeight,height) }}
        >
          {rowPositions.map(([rowKey, absIdx, row]) => {
            return (
              <Row
                key={rowKey}
                columns={columns}
                height={rowHeight}
                idx={absIdx}
                keys={cellKeys}
                meta={meta}
                row={row}
              />
            );
          })}
        </div>
      </div>
      {columnHeader}
    </div>
  );
});

export default Canvas;

function getHeaderCells(canvasEl, columnGroup){
  return columnGroup.locked
    ? Array.from(canvasEl.current.querySelectorAll("[role='columnheader']"))
    : [null].concat(Array.from(canvasEl.current.querySelectorAll("[role='columnheader']")));

}

function clearDragDisplay(rows, origin, previous, lastIdx){
  for (let i=0;i<rows.length; i++){
    const cells = Array.isArray(rows[i]) ? rows[i] : rows[i].childNodes;
      if (previous === lastIdx){
        closeSpaceRight(cells[previous - 1], true)
      } else if (previous < origin){
        closeSpaceLeft(cells[previous], true)
      } else {
        closeSpaceLeft(cells[previous+1], true)
      }
  }
}

function finalDragDisplay(rows, origin, target, previous, lastIdx){
  for (let i=0;i<rows.length; i++){
    const cells = Array.isArray(rows[i]) ? rows[i] : rows[i].childNodes;
      // the draggedColumn has left this Canvas (columnGroup)
      // Note, we only want to show it again if moving between fixed/scrollable canvas
      // i.e where re-render will occur
      cells[origin].style.display = '';
      if (previous === lastIdx){
        if (target > origin){
          closeSpaceRight(cells[target], true);
        } else {
          closeSpaceRight(cells[target - 1], true);
        }
      } else if (previous < origin){
        closeSpaceLeft(cells[previous], true)
      } else {
        closeSpaceLeft(cells[previous+1], true)
      }
    }
}

function setDragDisplay(rows, origin, target, previous, size, lastIdx){
  console.log(`setDragDisplay origin ${origin}, target ${target} previous ${previous}, last ${lastIdx}`)

  for (let i=0;i<rows.length; i++){
    const cells = Array.isArray(rows[i]) ? rows[i] : rows[i].childNodes;
    if (target === -1){
      // the draggedColumn has left this Canvas (columnGroup)
      // Note, we only want to show it again if moving between fixed/scrollable canvas
      // i.e where re-render will occur
      cells[origin].style.display = '';
      if (previous < origin){
        closeSpaceLeft(cells[previous], true)
      } else {
        closeSpaceLeft(cells[previous+1], true)
      }

    } else {

      // dragging column within same canvas
      if (previous === -1){
        cells[origin].style.display = 'none';
      } else if (previous === lastIdx /*&& origin === lastIdx*/){
        closeSpaceRight(cells[previous - 1])
      } else if (target > origin && target === lastIdx){
        closeSpaceLeft(cells[previous+1])
      } else if ((previous === origin || target >= origin) && target !== lastIdx){
        closeSpaceLeft(cells[previous + 1])
      } else {
        closeSpaceLeft(cells[previous])
      }

      if (target < origin){
        openSpaceLeft(cells[target], size);
      } else if (target === lastIdx){
        if (target > origin){
          openSpaceRight(cells[target], size, target === origin);
        } else {
          openSpaceRight(cells[target - 1], size, target === origin);
        }
      } else {
        openSpaceLeft(cells[target + 1], size, target === origin);
      }
    } 
  }
}

const closeSpaceLeft = (el, suppressTransition) => {
  el.style.marginLeft = '0px';
  el.style.width = (parseInt(el.style.width) - 1) + 'px';
  el.style.borderLeft = 'none';
  if (suppressTransition === true){
    el.style.transition = 'none';
  } else {
    el.style.transition = 'margin .15s ease-out';
  }
}

const closeSpaceRight = (el, suppressTransition) => {
  el.style.marginRight = '0px';
  el.style.width = (parseInt(el.style.width) - 1) + 'px';
  el.style.borderRight = 'none';
  if (suppressTransition === true){
    el.style.transition = 'none';
  } else {
    el.style.transition = 'margin .15s ease-out';
  }
}

const openSpaceLeft = (el, size, suppressTransition) => {
  el.style.marginLeft = (size-1) + 'px';
  el.style.width = (parseInt(el.style.width) + 1) + 'px';
  el.style.borderLeft = 'solid 1px #ccc';
  if (suppressTransition !== true){
    el.style.transition = 'margin .15s ease-out';
  }
}

const openSpaceRight = (el, size, suppressTransition) => {
  console.log(`oprn space right ${el.innerText}`)
  el.style.marginRight = (size-1) + 'px';
  el.style.width = (parseInt(el.style.width) + 1) + 'px';
  el.style.borderRight = 'solid 1px #ccc';
  if (suppressTransition !== true){
    el.style.transition = 'margin .15s ease-out';
  }
}
