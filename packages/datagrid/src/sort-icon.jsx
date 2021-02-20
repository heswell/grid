import React from 'react';

export const Direction = {
  ASC: 'asc',
  DSC: 'dsc'
}

export default ({direction}) =>
  direction === Direction.ASC
    ? <i className="material-icons">arrow_drop_up</i>
    : <i className="material-icons">arrow_drop_down</i>
