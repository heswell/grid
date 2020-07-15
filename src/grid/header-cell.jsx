import React, {useCallback, useContext, useRef} from "react";
import cx from 'classnames';
import GridContext from "./grid-context";
import useContextMenu from './context-menu/use-context-menu';
import useStyles from './use-styles';
import {useDragStart} from './use-drag';
import SortIndicator from './sort-indicator';
import Draggable from './draggable';

/** @type {HeaderCellComponent} */
const HeaderCell = function HeaderCell({ className, column, onDrag, onResize, sorted }){

  const el = useRef(null);
  const col = useRef(column);
  const isResizing = useRef(false);
  const {dispatchGridModelAction} = useContext(GridContext);
  // essential that handlers for resize do not use stale column
  // we could mitigate this by only passing column key and passing delta,
  // so we don't rely on current width in column
  col.current = column;

  const [handleMouseDown] = useDragStart(useCallback(
    (dragPhase, delta, mousePosition) => {
      const {left} = el.current.getBoundingClientRect();
      onDrag && onDrag(dragPhase, col.current, left + delta, mousePosition)
    },
    [onDrag, col])
  );

  const handleClick = e => {
    if (isResizing.current){
      isResizing.current = false;
    } else {
      dispatchGridModelAction({type: 'sort', column});
    }
  }

  const handleResizeStart = () => {
    // Note: the click handler will fire after the resizeEnd (mouseUp) handler and reset this
    isResizing.current = true;
    onResize('begin', column);
  }

  const handleResize = useCallback((e) => {
      const width = getWidthFromMouseEvent(e);
      if (width > 0 && width !== col.current.width) {
          onResize('resize', col.current, width);
      }
  },[onResize]);

  const handleResizeEnd = (e) => {
    onResize('end', col.current, getWidthFromMouseEvent(e));
  }

  const handleContextMenu = useContextMenu('header', { column });
  
  const getWidthFromMouseEvent = e => {
      const right = e.pageX;
      const left = el.current.getBoundingClientRect().left;
      return right - left;
  }

  // TODO could we just wrap the whole header in a draggable ?
  const { name, label=name, resizing, width, marginLeft=null } = column;
  const classes = useStyles();
  return (
    <div
      className={cx(classes.HeaderCell, className, {resizing})}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      ref={el}
      role="columnheader"
      style={{ marginLeft, width }}>
      <SortIndicator classes={classes} sorted={sorted} />
      <div className={classes.innerHeaderCell}>
        <div className={classes.cellWrapper}>{label}</div>
      </div>
      {column.resizeable !== false &&
          <Draggable className={classes.resizeHandle}
              onDrag={handleResize}
              onDragStart={handleResizeStart}
              onDragEnd={handleResizeEnd} />
          }
    </div>
  );
};

export default HeaderCell;
