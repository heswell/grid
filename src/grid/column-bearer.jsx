import React, {useCallback, useContext, useRef} from 'react';
import cx from 'classnames';
import GridContext from "./grid-context";
import Cell from './grid-cell.jsx';
import HeaderCell from './header-cell.jsx';
import useStyles from './use-styles';
import useDrag, {DRAG, DRAG_END} from './use-drag';
import {getColumnGroup} from './grid-model-utils';

const LEFT = 'left';
const RIGHT = 'right';

function getTargetColumnGroup({columnGroups}, dragPosition, draggedColumn){

    // If dragged column overlaps another columnGroup, it is considered movimng into that columnGroup
    const dragPosStart = dragPosition;
    const dragPosEnd = dragPosition + draggedColumn.width;
    for (let i=0, start=0; i<columnGroups.length; i++){
        const columnGroup = columnGroups[i];
        const homeColumnGroup = columnGroup.columns.some(({key}) => key === draggedColumn.key);
        const end = start + columnGroup.width;
        if (i < columnGroups.length - 1 && homeColumnGroup && dragPosEnd - end > 9){
            // do nothing
        } else if (!homeColumnGroup && dragPosStart < start && (dragPosEnd - start > 9)){
            return [columnGroup, start];           
        } else if (dragPosition >= start && dragPosition < end){
            return [columnGroup, start];           
        }
        start += columnGroup.width;
    }
    return [null, -1];
}

/**
 * 
 * @param {*} param0 
 * @param {number} startPosition the left hand edge of column group
 * @param {number} dragPosition the leading edge of the column being dragged
 * @param {number} scrollPosition of canvas 
 */
function getColumn({columns, contentWidth, width}, startPosition, dragPosition, scrollPosition){
    const draggedColumnLeadingEdge = dragPosition;
    const draggedColumnTrailingEdge = dragPosition + 100;
    for (let i=0, start=startPosition; i<columns.length; i++){
        const column = columns[i];
        const centerPoint = start + (column.width / 2);
        const end = start + column.width;
        if (draggedColumnLeadingEdge >= start && draggedColumnLeadingEdge < centerPoint){
            return column;           
        } else if (draggedColumnTrailingEdge >= centerPoint && draggedColumnTrailingEdge < end){
            return column;           
        }
        start += column.width;
    }
    return null;
}

/** @type {(gm: GridModel, column: DraggedColumn, dp: number, sp: number) => [ColumnGroup, Column] } */
function getTargetColumn(gridModel, draggedColumn, dragPosition, scrollPosition){
    const [columnGroup, startPosition] = getTargetColumnGroup(gridModel, dragPosition, draggedColumn);
    return columnGroup === null
        ? [null, null]
        : [columnGroup, getColumn(columnGroup, startPosition, dragPosition, scrollPosition)];
}

function getScrollBounds(gridModel, column){
    const {columnGroups, width} = gridModel;
    let scrollableLeft = 0;
    let scrollableRight= 0;
    for (let columnGroup of columnGroups){
        if (columnGroup.locked && scrollableLeft === 0){
            scrollableLeft += columnGroup.width;
            scrollableRight += columnGroup.width; 
        } else if (!columnGroup.locked){
            scrollableRight += columnGroup.width; 
        }
    }

    return {
        left: 0,
        right: width - column.width,
        scrollableLeft: scrollableLeft,
        scrollableRight: scrollableRight - column.width
    }
}

/** @type {(gridModel: GridModel, column: Column) => any} */
function useScrollBounds(gridModel, column){
    const scrollBounds = useRef(getScrollBounds(gridModel, column));

    const withinScrollZone = useCallback(pos => {
        const {current: { scrollableLeft, scrollableRight}} = scrollBounds;
        if (pos >= scrollableLeft - 20 && pos < scrollableLeft){
            return LEFT;
        } else if (pos > scrollableRight && pos <= scrollableRight + 20){
            return RIGHT;
        } else {
            return null;
        }
    },[])
    
    return [scrollBounds.current, withinScrollZone];
}

/** @type {ColumnBearerComponent} */
const ColumnBearer = ({column, gridModel, onDrag, onScroll, rows, initialScrollPosition}) => {
    const {headerHeight, headingDepth, rowHeight, viewportHeight} = gridModel;    
    const top = headerHeight * (headingDepth - 1);
    const classes = useStyles();
    const position = useRef(column.position);
    const [scrollBounds, withinScrollZone] = useScrollBounds(gridModel, column);    
    const el = useRef(null);
    const scrollTimeout = useRef(null);
    const scrollPosition = useRef(initialScrollPosition);
    const prevTarget = useRef([null, null]);
    const { dispatchGridModelAction } = useContext(GridContext);

    const style = {
        top,
        left: column.position, 
        height: gridModel.height - top,
        width: column.width
    }

    const scroll = useCallback(scrollDistance => () => {
        const distanceScrolled = onScroll(scrollDistance);
        scrollPosition.current += distanceScrolled;
        if (distanceScrolled !== 0 && withinScrollZone(position.current)){
            scrollTimeout.current = requestAnimationFrame(scroll(scrollDistance));
        }
    },[onScroll, withinScrollZone]);

    const cancelScroll = () => {
        cancelAnimationFrame(scrollTimeout.current);
        scrollTimeout.current = null;
    }

    const [, cancelDrag] = useDrag(useCallback(
        (dragPhase, delta) => {
          if (dragPhase === 'drag'){
            const newPosition = Math.max(scrollBounds.left, Math.min(position.current + delta, scrollBounds.right + 5));

            if (newPosition !== position.current){
                position.current = newPosition;
                el.current.style.left = position.current + 'px';
            }
            const [targetColumnGroup, targetColumn] = getTargetColumn(gridModel, column, position.current, scrollPosition.current);
            const [prevColumnGroup,prevColumn] = prevTarget.current;
            if (!(targetColumnGroup === prevColumnGroup && targetColumn === prevColumn)){
                if (targetColumnGroup !== prevColumnGroup && targetColumn === null){
                    // we have to tell the viewport as well, so it can remove visual effects
                    onDrag('drag', column, null);
                    dispatchGridModelAction({type: 'add-col', targetColumnGroup, column});
                    // TODO figure out right way to cancel
                    cancelDrag();
                } else {
                    onDrag('drag', column, targetColumn);
                }
                prevTarget.current = [targetColumnGroup, targetColumn];
            }

            // We should probably just fire onDrag and let Viewport worry about this
            const direction = withinScrollZone(position.current);
            if (direction && !scrollTimeout.current){
                scrollTimeout.current = requestAnimationFrame(scroll(direction === 'right' ? 10 : -10));
            } else if (!direction && scrollTimeout.current){
                cancelScroll();
            }   

          } else {

            if (scrollTimeout.current){
                cancelScroll();
            }
            const [, targetColumn] = getTargetColumn(gridModel, column, position.current, scrollPosition.current);
            onDrag('drag-end', column, targetColumn)
          }
        },
        [column, dispatchGridModelAction, gridModel, onDrag, scroll, scrollBounds, withinScrollZone]),
        DRAG + DRAG_END
    );
    
    const columnGroup = getColumnGroup(gridModel, column);

    return (
        <div className={cx(classes.ColumnBearer, {[classes.fixed]: columnGroup.locked})} ref={el} style={style}>
            <div className='Header' style={{height: headerHeight}}> 
                <HeaderCell column={column}/>
            </div>
            <div style={{position: 'relative', height: viewportHeight}}>
            {
                rows.map((row,idx) => 
                    <div 
                        key={idx}
                        className={classes.GridRow}
                        style={{height: rowHeight, transform: `translate3d(0px, ${idx * rowHeight}px, 0px)`}}>
                        <Cell column={column} key={idx} meta={gridModel.meta} row={row} />
                    </div>
                )
            }
            </div>
        </div>
    );
};

export default ColumnBearer;