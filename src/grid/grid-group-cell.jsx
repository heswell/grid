import React, {useCallback, useContext} from 'react';
import { metadataKeys} from '@heswell/utils';
import GridContext from "./grid-context";
import { getGroupValueAndOffset} from './grid-model-utils';
import useStyles from './use-styles';

/** @type {CellType} */
const GroupCell = React.memo(function GroupCell({column, row}){

  const { dispatchGridModelAction } = useContext(GridContext);

  const handleClick = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    dispatchGridModelAction({type: 'toggle', row});
  },[dispatchGridModelAction, row])

    const isExpanded = row[metadataKeys.DEPTH] > 0;
    const {GridCell, GridGroupCell} = useStyles();
    const count = row[metadataKeys.COUNT];
    const [value, offset] = getGroupValueAndOffset(column.columns, row);

    return (
        <div 
            className={GridCell}
            onClick={handleClick}
            style={{ width: column.width }}
            tabIndex={0} >
            {offset !== null ? (
              <div className={GridGroupCell} style={{ paddingLeft: offset * 20 }} tabIndex={0}>
                <i className='material-icons icon'>{isExpanded ? 'expand_more' : 'chevron_right'}</i>
                <span className='group-value'>{value}</span>
                <span> ({count})</span>
              </div>)
             : null}
        </div>
    );
})

export default GroupCell;