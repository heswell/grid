import React, {useCallback, useContext} from 'react';
import { metadataKeys} from '@heswell/utils';
import GridContext from "./grid-context";
import useStyles from './use-styles';

/** @type {CellType} */
const GroupCell = React.memo(function GroupCell({column, row}){

  const { dispatchGridModelAction } = useContext(GridContext);

  const handleClick = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    dispatchGridModelAction({type: 'toggle', row});
  },[column.key, row])

    const isExpanded = row[metadataKeys.DEPTH] > 0;
    const {GridCell, GridGroupCell} = useStyles();
    const count = row[metadataKeys.COUNT];
    const [value, depth] = getValue(row, column.columns)

    return (
        <div 
            className={GridCell}
            onClick={handleClick}
            style={{ width: column.width }}
            tabIndex={0} >
            {depth !== null ? (
              <div className={GridGroupCell} style={{ paddingLeft: depth * 20 }} tabIndex={0}>
                <i className='material-icons icon'>{isExpanded ? 'expand_more' : 'chevron_right'}</i>
                <span className='group-value'>{value}</span>
                <span> ({count})</span>
              </div>)
             : null}
        </div>
    );
})

function getValue(row, columns){
    const {DEPTH} = metadataKeys;
    const depth = Math.abs(row[DEPTH]);
    for (let i=0;i<columns.length;i++){
        const column = columns[i];
        if (column.groupLevel === depth) {
            return [row[column.key],i];
        }
    }
    return [null,null];
}

export default GroupCell;