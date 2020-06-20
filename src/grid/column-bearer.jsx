import React, {forwardRef, useCallback, useContext, useImperativeHandle, useRef} from 'react';
import cx from 'classnames';
import GridContext from "./grid-context";
import Cell from './grid-cell.jsx';
import HeaderCell from './header-cell.jsx';
import useStyles from './use-styles';
import useDrag, {DRAG, DRAG_END, DRAG_PAUSE} from './use-drag';
import {getColumnGroup} from './grid-model-utils';

const LEFT = 'left';
const RIGHT = 'right';


/** @type {(dragData: ColumnDragData, dp: number, sp: number) => [number, number, number] } */
function getTargetColumn({columnPositions}, dragPosition, scrollPosition){
    for (let i=0,idx=0; i<columnPositions.length; i++){
        const positions = columnPositions[i];
        for (let j=0; j< positions.length; j++, idx++){
            if (dragPosition <= positions[j]){
                const [[offsetLeft]] = columnPositions;
                return [idx, positions[j] - offsetLeft, i];
            }
        }
    }
    return [-1, -1, -1]
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
const ColumnBearer = forwardRef(({columnDragData, gridModel, onDrag, onScroll, rows, initialScrollPosition}, ref) => {
    const {headerHeight, headingDepth, rowHeight, viewportHeight} = gridModel;    
    const top = headerHeight * (headingDepth - 1);
    const classes = useStyles();
    const columnPosition = useRef(columnDragData.initialColumnPosition);
    const [scrollBounds, withinScrollZone] = useScrollBounds(gridModel, columnDragData.column);    
    const el = useRef(null);
    const scrollTimeout = useRef(null);
    const scrollPosition = useRef(initialScrollPosition);
    const prevPosition = useRef(null);
    const { dispatchGridModelAction } = useContext(GridContext);

    const {column} = columnDragData;

    const style = {
        top,
        left: columnPosition.current, 
        height: gridModel.height - top,
        width: column.width
    }

    const scroll = useCallback(scrollDistance => () => {
        const distanceScrolled = onScroll(scrollDistance);
        scrollPosition.current += distanceScrolled;
        if (distanceScrolled !== 0 && withinScrollZone(columnPosition.current)){
            scrollTimeout.current = requestAnimationFrame(scroll(scrollDistance));
        }
    },[onScroll, withinScrollZone]);

    const cancelScroll = () => {
        cancelAnimationFrame(scrollTimeout.current);
        scrollTimeout.current = null;
    }

    useImperativeHandle(ref, () => ({
        setFinalPosition: (pos) => {
            console.log(`ColumnBearer finalPosition `)
            el.current.style.transition = 'left ease .3s';
            el.current.style.left = pos + `px`;
        }
    }))

    const dragCallback = useCallback(
        (dragPhase, delta, _dragPosition) => {
          if (dragPhase === 'drag'){
            const newPosition = Math.max(scrollBounds.left, Math.min(columnPosition.current + delta, scrollBounds.right + 5));

            if (newPosition !== columnPosition.current){
                columnPosition.current = newPosition;
                el.current.style.left = columnPosition.current + 'px';
            }

            const [insertIdx, insertPos, columnGroupIdx] = getTargetColumn(columnDragData, columnPosition.current, scrollPosition.current);
            if (columnGroupIdx !== columnDragData.columnGroupIdx){
                const targetColumnGroup = gridModel.columnGroups[columnGroupIdx]
                // we have to tell the viewport as well, so it can remove visual effects
                onDrag('drag', column, null);
                // TODO we won't need the targetColumnGroup because insertIdx spans all columnGroups
                dispatchGridModelAction({type: 'add-col', targetColumnGroup, column, insertIdx});
                // No need to cancel, the ColumnBearer will re-render, but the hook state is preserved
                //cancelDrag();
            } else if (insertPos !== prevPosition.current) {
                console.log(`insertPosition ${insertPos} insertIdx ${insertIdx} ${JSON.stringify(columnDragData.columnPositions)}`)
                onDrag('drag', column, insertIdx, insertPos);
            }
            prevPosition.current = insertPos;

            // We should probably just fire onDrag and let Viewport worry about this
            const direction = withinScrollZone(columnPosition.current);
            if (direction && !scrollTimeout.current){
                scrollTimeout.current = requestAnimationFrame(scroll(direction === 'right' ? 10 : -10));
            } else if (!direction && scrollTimeout.current){
                cancelScroll();
            }   
        } else {
            if (scrollTimeout.current){
                cancelScroll();
            }
            const [insertIdx] = getTargetColumn(columnDragData, columnPosition.current, scrollPosition.current);
            onDrag('drag-end', column, insertIdx, prevPosition.current)
          }
        },
        [columnDragData, dispatchGridModelAction, gridModel, onDrag, scroll, scrollBounds, withinScrollZone]
    );

    const [, cancelDrag] = useDrag(dragCallback, DRAG + DRAG_END, columnDragData.mousePosition);
    
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
});

export default ColumnBearer;