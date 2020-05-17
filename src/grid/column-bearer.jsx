import React, {useCallback, useRef} from 'react';
import Cell from './grid-cell.jsx';
import HeaderCell from './header-cell.jsx';
import useStyles from './use-styles';
import useDrag, {DRAG, DRAG_END} from './use-drag';

const NULL_FORMATTER = () => {};

/** @type {ColumnBearerComponent} */
const ColumnBearer = ({column, gridModel, onDrag, rows}) => {
    console.log(`[ColumnBearer]`)
    const {headerHeight, headingDepth, rowHeight, viewportHeight} = gridModel;    
    const top = headerHeight * (headingDepth - 1);
    
    const classes = useStyles();
    const position = useRef(column.position);
    const el = useRef(null);

    const style = {
        top,
        left: column.position, 
        height: gridModel.height - top,
        width: column.width
    }


    useDrag(useCallback(
        (dragPhase, delta) => {
          if (dragPhase === 'drag'){
            console.log(`[ColumnBearer] drag ${delta}`)
            position.current += delta;
            el.current.style.left = position.current + 'px';

          } else {
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