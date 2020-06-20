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
  const classes = useStyles();

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

    endDrag: (draggedColumn, insertIdx, insertPos) => {
      const idx = columns.findIndex(col => col.key === draggedColumn.key);

      console.log(`endDrag insertPos ${insertPos} insertIdx: ${insertIdx}`)
      const rows = contentEl.current.childNodes;
      const headerCells = getHeaderCells(canvasEl, columnGroup);
      // const lastIdx = columns.length - 1; 
      const effect = { 
        replaceClass: {idx, className: classes.DraggedColumn, newClassName: classes.Vanishing}, 
        openSpaceLeft: {idx: insertIdx}
      };
      applyOperation(effect, [headerCells], draggedColumn.width);
      applyOperation(effect, rows, draggedColumn.width);
      // finalDragDisplay([headerCells], idx, hilightedIndex.current, hilightedIndex.current, lastIdx );
      // finalDragDisplay(rows, idx, hilightedIndex.current, hilightedIndex.current, lastIdx );
      hilightedIndex.current = -1;
      return new Promise(resolve => 
        rows[idx].addEventListener('transitionend', () => {
          const effect = {
            removeClass: {idx, className: classes.Vanishing},
            closeSpaceLeft: {idx: -insertIdx}
          };
          applyOperation(effect, [headerCells]);
          applyOperation(effect, rows);
          resolve();
        })
      );
    },

    endVerticalScroll: scrollTop => {
      canvasEl.current.style.height = `${height}px`;
      contentEl.current.style.transform = `translate3d(0px, -${scrollTop}px, 0px)`;
    },

    hideDraggedColumn: column => {

      const idx = columns.findIndex(col => col.key === column.key);
      const rows = contentEl.current.childNodes;
      const headerCells = getHeaderCells(canvasEl, columnGroup);
      const effect = { addClass: {idx} };
      applyOperation(effect, [headerCells], column.width);
      applyOperation(effect, rows, column.width);

      hilightedIndex.current = idx;

      const {left} = headerCells[idx].getBoundingClientRect();
      return left;
    },

    reverseDragEffect: (draggedColumn, operation) => {
      const headerCells = getHeaderCells(canvasEl, columnGroup);
      const rows = contentEl.current.childNodes;
      applyOperation(operation, [headerCells], draggedColumn.width);
      applyOperation(operation, rows, draggedColumn.width);
    },

    makeSpaceForColumn: (column, targetColumn) => {
      console.log(`makeSpaceForColumn`)
      const idx = columns.findIndex(col => col.key === targetColumn.key);
      if (hilightedIndex.current === idx){
        return null;
      }

      const idxDraggedColumn = columns.findIndex(col => col.key === column.key);
      const headerCells = getHeaderCells(canvasEl, columnGroup);
      const rows = contentEl.current.childNodes;
      const lastIdx = columns.length - 1;  
      const [effect, reverseEffect] = setDragDisplay(idxDraggedColumn, idx, hilightedIndex.current, column.width, lastIdx );

      // console.log(` ops: ${JSON.stringify(effect)}
      // reverse Ops: ${JSON.stringify(reverseEffect)}
      // `)

      applyOperation(effect, [headerCells], column.width);
      applyOperation(effect, rows, column.width);

      hilightedIndex.current = idx;

      return reverseEffect;
    },

    scrollBy: scrollDistance => scrollBy(scrollDistance),

    get scrollLeft(){
      return canvasEl.current.scrollLeft;
    }
  }));

  // TODO memoize
  function applyOperation(ops, rows, width){
    Object.entries(ops).forEach(([opName, args]) => {
      const suppressTransition = args.idx < 0;
      const idx = Math.abs(args.idx);
      for (let i=0;i<rows.length; i++){
        const cells = Array.isArray(rows[i]) ? rows[i] : rows[i].childNodes;
        if (idx !== -1 && idx < cells.length){
          switch(opName){
            case 'openSpaceLeft': 
              openSpaceLeft(cells[idx], width, suppressTransition);
              break;
            case 'closeSpaceLeft': 
              closeSpaceLeft(cells[idx], suppressTransition);
              break;
            case 'openSpaceRight': 
              openSpaceRight(cells[idx], width);
              break;
            case 'closeSpaceRight': 
              closeSpaceRight(cells[idx], suppressTransition);
              break;
            case 'hide':
              debugger;
              cells[idx].style.display = 'none';
              break;
            case 'addClass':
              cells[idx].classList.add(classes.DraggedColumn);
              break;
            case 'removeClass':
              cells[idx].classList.remove(args.className);
              break;
            case 'replaceClass':
              cells[idx].classList.replace(args.className, args.newClassName);
              break;
          }
        }
      }
    });
  
  }
  
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
  return columnGroup.locked || columnGroup.width >= columnGroup.contentWidth
    ? Array.from(canvasEl.current.querySelectorAll("[role='columnheader']"))
    : [null].concat(Array.from(canvasEl.current.querySelectorAll("[role='columnheader']")));

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

function setDragDisplay(origin, target, previous, size, lastIdx){

  const operation = {};
  const reverseOperation = {};
    if (target === -1){
      // the draggedColumn has left this Canvas (columnGroup)
      // Note, we only want to show it again if moving between fixed/scrollable canvas
      // i.e where re-render will occur
      /*
      cells[origin].style.display = '';
      if (previous < origin){
        closeSpaceLeft(cells[previous], true)
        reverseOperation.openSpaceLeft = previous;
      } else {
        closeSpaceLeft(cells[previous+1], true)
        reverseOperation.openSpaceLeft = previous + 1;
      }
      */
    } else {

      // dragging column within same canvas
      if (previous === lastIdx){
        console.log(`1)`)
        //closeSpaceRight(cells[previous - 1])
      } else if (target > origin && target === lastIdx){
        console.log(`2)`)
        //closeSpaceLeft(cells[previous+1])
      } else if ((previous === origin || target >= origin) && target !== lastIdx){
        console.log(`3)`)
        //closeSpaceLeft(cells[previous + 1])
      } else {
        console.log(`4)`)
        //closeSpaceLeft(cells[previous])
      }

      if (target < origin){
        operation.openSpaceLeft = reverseOperation.closeSpaceLeft = {idx:target};
      } else if (target === lastIdx){
        if (target > origin /*|| cells.length === 1*/){
          operation.openSpaceRight = reverseOperation.closeSpaceRight = {idx:target}; 
        } else {
          operation.openSpaceRight = reverseOperation.closeSpaceRight = {idx:target - 1}; 
        }
      } else {
        if (previous === -1){
          alert('never')
          operation.openSpaceLeft = {idx: -(target + 1)};
          // keep the gap open from which draggedColumn was dragged
        } else {
          reverseOperation.closeSpaceLeft = operation.openSpaceLeft = {idx:target};
        }
      }
  }
  return [operation, reverseOperation];
}

const closeSpaceLeft = (el, suppressTransition) => {
  el.style.marginLeft = '0px';
  // el.style.width = (parseInt(el.style.width) - 1) + 'px';
  // el.style.borderLeft = 'none';
  if (suppressTransition === true){
    el.style.transition = 'none';
  } else {
    el.style.transition = 'margin .15s ease-in-out';
  }
}

const closeSpaceRight = (el, suppressTransition) => {
  el.style.marginRight = '0px';
  el.style.width = (parseInt(el.style.width) - 1) + 'px';
  el.style.borderRight = 'none';
  if (suppressTransition === true){
    el.style.transition = 'none';
  } else {
    el.style.transition = 'margin .15s ease-in-out';
  }
}

const openSpaceLeft = (el, size, suppressTransition) => {
  el.style.marginLeft = (size-1) + 'px';
  // el.style.width = (parseInt(el.style.width) + 1) + 'px';
  // el.style.borderLeft = 'solid 1px #ccc';
  if (suppressTransition !== true){
    el.style.transition = 'margin .3s ease';
  }
}

const openSpaceRight = (el, size, suppressTransition) => {
  el.style.marginRight = (size-1) + 'px';
  el.style.width = (parseInt(el.style.width) + 1) + 'px';
  el.style.borderRight = 'solid 1px #ccc';
  if (suppressTransition !== true){
    el.style.transition = 'margin .15s ease-in-out';
  }
}
