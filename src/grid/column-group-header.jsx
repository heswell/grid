import React, { forwardRef, useImperativeHandle, useRef } from "react";
import cx from 'classnames';
import HeaderCell from "./header-cell";
import useStyles from './use-styles';

/** @type {ColumnGroupHeaderType} */
const ColumnGroupHeader = React.memo(forwardRef(function ColumnGroupHeader(
  { columnGroup, depth, height, width },
  ref
) {
  const scrollingHeaderWrapper = useRef(null);

  useImperativeHandle(ref, () => ({
    endHorizontalScroll: scrollLeft => {
      scrollingHeaderWrapper.current.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
    }
  }));

  const classes = useStyles();

  const renderColHeadings = heading =>
  heading.map((item, idx) =>
      <HeaderCell
          key={idx}
          className={cx({[classes.noBottomBorder]: item.label === ''})}
          // className={cx('colgroup-header', { bottomless: item.label === '' })}
          column={item}
          // onResize={handleColumnResize}
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
          <HeaderCell key={column.key} column={column} />
        ))}
      </div>
      </div>
    </div>
  );
}));

export default ColumnGroupHeader;