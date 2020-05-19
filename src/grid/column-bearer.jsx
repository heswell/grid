// @ts-nocheck
import React, {useCallback, useRef} from 'react';
import Cell from './grid-cell.jsx';
import HeaderCell from './header-cell.jsx';
import useStyles from './use-styles';
import useDrag, {DRAG, DRAG_END} from './use-drag';

const NULL_FORMATTER = () => {};
const LEFT = 'left';
const RIGHT = 'right';

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
    console.log(`scrollBounds ${JSON.stringify(scrollBounds, null,2)}`)

    const withinScrollZone = useCallback(pos => {
        const {current: { scrollableLeft, scrollableRight}} = scrollBounds;
        if (pos >= scrollableLeft - 20 && pos < scrollableLeft){
            return LEFT;
        } else if (pos > scrollableRight && pos <= scrollableRight + 20){
            return RIGHT;
        } else {
            return null;
        }
    },[scrollBounds.current])
    

    return [scrollBounds.current, withinScrollZone];
}


/** @type {ColumnBearerComponent} */
const ColumnBearer = ({column, gridModel, onDrag, onScroll, rows}) => {
    console.log(`[ColumnBearer]`)
    const {headerHeight, headingDepth, rowHeight, viewportHeight} = gridModel;    
    const top = headerHeight * (headingDepth - 1);
    
    const classes = useStyles();
    const position = useRef(column.position);
    const [scrollBounds, withinScrollZone] = useScrollBounds(gridModel, column);    
    const el = useRef(null);
    const scrollTimeout = useRef(null);

    const style = {
        top,
        left: column.position, 
        height: gridModel.height - top,
        width: column.width
    }

    useDrag(useCallback(
        (dragPhase, delta) => {
          if (dragPhase === 'drag'){
            const newPosition = Math.max(scrollBounds.left, Math.min(position.current + delta, scrollBounds.right + 5));

            if (newPosition !== position.current){
                position.current = newPosition;
                el.current.style.left = position.current + 'px';
            }

            const scroll = direction => () => {
                const right = direction === 'right';
                // needs a return value to tell us whether to continue
                const distanceScrolled = onScroll(right ? 1 : -1);
                console.log(`scroll ${direction} current ${position.current}`)
                if (distanceScrolled !== 0 && withinScrollZone(position.current)){
                    scrollTimeout.current = requestAnimationFrame(scroll(direction));
                }
            }
            // console.log(`[ColumnBearer] drag ${delta} => ${position.current} withinScrollZone ${withinScrollZone(position.current)}`)
            // We should probably just fire onDrag and let Viewport worry about this
            const direction = withinScrollZone(position.current);
            if (direction){
                scrollTimeout.current = requestAnimationFrame(scroll(direction));
            } else if (scrollTimeout.current){
                cancelAnimationFrame(scrollTimeout.current);
            }

          } else {

            if (scrollTimeout.current){
                cancelAnimationFrame(scrollTimeout.current)
            }
            onDrag('drag-end', column)
            console.log(`[ColumnBearer] ${dragPhase} ${delta}`)
          }
        },
        []),
        DRAG + DRAG_END
      );
    
    return (
        <div className={classes.ColumnBearer} ref={el} style={style}>
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