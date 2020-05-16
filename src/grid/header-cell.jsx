import React, {useCallback, useRef} from "react";
import cx from 'classnames';
import useStyles from './use-styles';
import Draggable from './draggable';

/** @type {HeaderCellComponent} */
const HeaderCell = function HeaderCell({ className, column, onResize }){

  const el = useRef(null);
  const col = useRef(column);
  // essential that handlers for resize do not use stale column
  // we could mitigate this by only passing column key and passing delta,
  // so we don't rely on current width in column
  col.current = column;

  const handleResizeStart = () => onResize('begin', column);

  const handleResize = useCallback((e) => {
      const width = getWidthFromMouseEvent(e);
      if (width > 0 && width !== col.current.width) {
          onResize('resize', col.current, width);
      }
  },[])

  const handleResizeEnd = (e) => {
      const width = getWidthFromMouseEvent(e);
      onResize('end', col.current, width);
  }

  const getWidthFromMouseEvent = e => {
      const right = e.pageX;
      const left = el.current.getBoundingClientRect().left;
      return right - left;
  }


  const { name, label=name, resizing, width } = column;
  const classes = useStyles();
  return (
    <div className={cx(classes.HeaderCell, className, {resizing})} ref={el} style={{ width }}>
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
