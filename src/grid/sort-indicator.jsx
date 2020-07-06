import React from 'react';
import cx from 'classnames';
import SortIcon, {Direction} from './sort-icon.jsx';

export default ({classes, sorted}) => {

  if (!sorted) {
    return null;
  }

  const direction = sorted < 0
    ? Direction.DSC
    : Direction.ASC;

  const {SortIndicator, SortPosition} = classes;  

  return typeof sorted === 'number' ? (
      <div className={cx(SortIndicator, 'multi-col', direction)}>
          <SortIcon direction={direction}/>
          <span className={SortPosition}>{Math.abs(sorted)}</span>
      </div>
  ) : (
      <div className={cx(SortIndicator, 'single-col')}>
          <SortIcon direction={sorted}/>
      </div>

  )
}