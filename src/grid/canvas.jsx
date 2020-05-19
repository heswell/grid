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
    endVerticalScroll: scrollTop => {
      canvasEl.current.style.height = `${height}px`;
      contentEl.current.style.transform = `translate3d(0px, -${scrollTop}px, 0px)`;
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
