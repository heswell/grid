import React, { forwardRef, useCallback, useContext, useImperativeHandle, useRef } from "react";
import cx from 'classnames';
import GridContext from "./grid-context";
import HeaderCell from "./header-cell";
import useStyles from './use-styles';

/** @type {ColumnGroupHeaderType} */
const ColumnGroupHeader = React.memo(forwardRef(function ColumnGroupHeader(
  { columnGroup, depth, height, onColumnDrag, width },
  ref
) {
  const scrollingHeaderWrapper = useRef(null);
  const { dispatchGridModelAction } = useContext(GridContext);

  useImperativeHandle(ref, () => ({
    endHorizontalScroll: scrollLeft => {
      scrollingHeaderWrapper.current.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
    }
  }));

  const handleColumnResize = useCallback((phase, column, width) => {
    dispatchGridModelAction({ type: 'resize-col', phase, column, width });
  },[]);

  const handleHeadingResize = useCallback((phase, column, width) => {
    dispatchGridModelAction({ type: 'resize-heading', phase, column, width });
  },[]);

  const classes = useStyles();

  const renderColHeadings = heading =>
  heading.map((item, idx) =>
      <HeaderCell
          key={idx}
          className={cx({[classes.noBottomBorder]: item.label === ''})}
          column={item}
          onResize={handleHeadingResize}
          // onMove={onColumnMove}
          // onContextMenu={showContextMenu}
      />
  )

  const { columns, contentWidth, headings = [] } = columnGroup;

  return (
    <div className={classes.ColumnGroupHeader} style={{ height: height * depth, width }}>
      <div ref={scrollingHeaderWrapper}
        style={{ height: height * depth, width: contentWidth }} >
      
      {headings.map((heading, idx) =>
        <div key={idx} style={{ height, width }}>
            {renderColHeadings(heading)}
        </div>).reverse()
      }

      <div className={classes.headerCells}
        style={{ height, width: contentWidth }}>
        {columns.map(column => (
          <HeaderCell
            column={column}
            key={column.key}
            onDrag={onColumnDrag}
            onResize={handleColumnResize}/>
        ))}
      </div>
      </div>
    </div>
  );
}));

export default ColumnGroupHeader;