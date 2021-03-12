import React from 'react';
import cx from "classnames";
import useFormatter from "../use-cell-formatter";

import './progress-cell.css';


const BackgroundCell = React.memo(function BackgroundCell({column, columnMap, row}){

  const { width, type } = column;
  const [format] = useFormatter(column);
  const {associatedField} = type.renderer;
  const value = row[column.key];
  const associatedValue = row[columnMap[associatedField]];
  const percentage = value === 0
    ?   0
    :  Math.round( value / associatedValue * 100);


  return (
    <div
      className={cx("GridCell", "hwProgressCell")}
      style={{ marginLeft: column.marginLeft, width }}>
      <div className='hwProgressCell-progress-container'>
        <div className='hwProgressCell-progress-bar' style={{width: `${percentage}%`}}/>
        {format(row[column.key])}
        </div>
    </div>
  );
})


export default BackgroundCell;