import React from 'react';
import {useRowHeight} from './use-row-height';
import "./row-height-canary.css";

const RowHeightCanary = () => {
  const rowHeightCanary = useRowHeight();
  return (
    <div className="Grid-rowHeightCanary" ref={rowHeightCanary}/>
  )
}

export default RowHeightCanary;