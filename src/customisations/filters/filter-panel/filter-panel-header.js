import React from 'react';
import cx from 'classnames';

import {useGridStyles} from '@heswell/grid';
import useFilterStyles from '../../inline-filter/use-styles';

export const FilterPanelHeader = ({column, onMouseDown}) => {
  const {HeaderCell} = useGridStyles();
  const classes = useFilterStyles();

  return (
  <div className={cx(classes.FilterPanelHeader, 'col-header', HeaderCell)} onMouseDown={onMouseDown}>
    <div className='col-header-inner' style={{ width: column.width - 1 }}>{column.name}</div>
  </div>
  )
}
