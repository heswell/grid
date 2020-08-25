import React, { forwardRef, useCallback, useContext, useImperativeHandle, useRef } from "react";
import cx from 'classnames';
import GridContext from "./grid-context";
import HeaderCell from "./header-cell";
import GroupHeaderCell from "./group-header-cell";
import HeadingCell from "./heading-cell";
import useStyles from './use-styles';

/** @type {ColumnGroupHeaderType} */
const ColumnGroupHeader = React.memo(forwardRef(function ColumnGroupHeader({ 
    columnGroup,
    columnGroupIdx,
    columns=columnGroup.columns,
    depth,
    height,
    onColumnDrag,
    sortColumns,
    width },
  ref
) {
  const columnGroupHeader = useRef(null);
  const scrollingHeaderWrapper = useRef(null);
  const { dispatchGridModelAction } = useContext(GridContext);

  useImperativeHandle(ref, () => ({
    beginHorizontalScroll: (width) => {
      columnGroupHeader.current.style.width = width + 'px';
      scrollingHeaderWrapper.current.style.transform = `translate3d(0px, 0px, 0px)`;
    },
    endHorizontalScroll: (scrollLeft, width) => {
      scrollingHeaderWrapper.current.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
      columnGroupHeader.current.style.width = width + 'px';
    }
  }));

  const handleColumnResize = useCallback((phase, column, width) => {
    dispatchGridModelAction({ type: 'resize-col', phase, column, width });
  },[dispatchGridModelAction]);

  const handleHeadingResize = useCallback((phase, column, width) => {
    dispatchGridModelAction({ type: 'resize-heading', phase, column, width });
  },[dispatchGridModelAction]);

  const classes = useStyles();

  const handleDrag = useCallback((phase, column, columnPosition, mousePosition) => 
    onColumnDrag(phase, columnGroupIdx, column, columnPosition, mousePosition)
  ,[columnGroup, columnGroupIdx])

  const handleRemoveGroup = useCallback(column => {
    dispatchGridModelAction({ type: 'group', column, remove: true });
  },[]);


  const renderColHeadings = heading =>
  heading.map((item, idx) =>
      <HeadingCell
          key={idx}
          className={cx({[classes.noBottomBorder]: item.label === ''})}
          column={item}
          onResize={handleHeadingResize}
          // onMove={onColumnMove}
      />
  )

  const { contentWidth, headings = [] } = columnGroup;
  return (
    <div className={classes.ColumnGroupHeader} ref={columnGroupHeader} style={{ height: height * depth, width }}>
      <div ref={scrollingHeaderWrapper}
        style={{ height: height * depth, width: contentWidth }} >
      
      {headings.map((heading, idx) =>
        <div key={idx} style={{ height, width }}>
            {renderColHeadings(heading)}
        </div>).reverse()
      }

      <div
        role="row"
        style={{ height, width: contentWidth }}>
        {columns.map((column,idx) => 
          column.isGroup ? (
            <GroupHeaderCell
              column={column}
              key={column.key}
              onClick={() => console.log('onClick')}
              onResize={handleColumnResize}
              onToggleGroupState={() => console.log('onToggleGroupState')}
              onRemoveColumn={handleRemoveGroup}
            />
          ) : (
          <HeaderCell
            column={column}
            key={column.key}
            onDrag={handleDrag}
            onResize={handleColumnResize}
            sorted={sortColumns ? sortColumns[column.name]: undefined}
          />
        ))}
      </div>
      </div>
    </div>
  );
}));

export default ColumnGroupHeader;