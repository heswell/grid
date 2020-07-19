// @ts-nocheck
import React, { useEffect,useRef } from 'react';
import cx from 'classnames';
import { metadataKeys } from '@heswell/utils';
import useFormatter from '../grid/use-cell-formatter';
import useStyles from './background-style';

// import './background-cell.css';

const CHAR_ARROW_UP = String.fromCharCode(11014);
const CHAR_ARROW_DOWN = String.fromCharCode(11015);

const UP1 = 'up1';
const UP2 = 'up2';
const DOWN1 = 'down1';
const DOWN2 = 'down2';

// TODO these sre repeated from PriceFormatter - where shoud they live ?
const FlashStyle = {
  ArrowOnly: 'arrow',
  BackgroundOnly: 'bg-only',
  ArrowBackground: 'arrow-bg'
};

const INITIAL_VALUE = [null, null, null, null]

function useDirection(key, value, column) {
  const ref = useRef(null);
  const [prevKey, prevValue, prevColumn, prevDirection] = ref.current || INITIAL_VALUE;
  const direction = key === prevKey &&  column === prevColumn && 
    Number.isFinite(prevValue) && Number.isFinite(value)
    ? getDirection(prevDirection, prevValue, value, column)
    : '';

  useEffect(() => {
    ref.current = [key, value, column, direction]
  })

  return direction;
}

const getFlashStyle = (colType) => {
  if (typeof colType === 'string'){
    return FlashStyle.BackgroundOnly;
  } else {
    const {renderer} = colType;
    return (renderer && renderer.flashStyle) || FlashStyle.BackgroundOnly;
  }
}

/** @type {CellType} */
const BackgroundCell = props => {
  //TODO what about click handling
  const { className: classNameProp, column, row}  = props;
  const { key, width, type } = column;
  const value = row[key];

  const flashStyle = getFlashStyle(type);

  const direction = useDirection(row[metadataKeys.KEY], value, column)

  const arrow = flashStyle === FlashStyle.ArrowOnly || flashStyle === FlashStyle.ArrowBackground
    ? direction === UP1 || direction === UP2 ? CHAR_ARROW_UP :
      direction === DOWN1 || direction === DOWN2 ? CHAR_ARROW_DOWN : null
    : null;

  const classes = useStyles();

  const [format] = useFormatter(column);
  const className = cx(classNameProp, classes.background, {
    [classes.up1]: direction === UP1,
    [classes.up2]: direction === UP2,
    [classes.down1]: direction === DOWN1,
    [classes.down2]: direction === DOWN2,
    [classes.arrow]: FlashStyle.ArrowBackground,
    [classes.arrowOnly]: flashStyle === FlashStyle.ArrowOnly
  })

  return (
    <div
      className={className}
      style={{ width }}>
      <div className={classes.flasher}>{arrow}</div>
      {format(row[column.key])}
    </div>
  );
}

function getDirection(direction, prevValue, newValue, column) {
  if (!Number.isFinite(newValue)) {
    return '';
  } else if (prevValue !== null && newValue !== null){
    let diff = newValue - prevValue;
    if (diff) {
      // make sure there is still a diff when reduced to number of decimals to be displayed
      const { type: dataType } = column;
      let decimals = dataType && dataType.formatting && dataType.formatting.decimals;
      if (typeof decimals === 'number') {
        diff = +newValue.toFixed(decimals) - +prevValue.toFixed(decimals);
      }
    }

    if (diff) {
      if (direction === '') {
        if (diff < 0) {
          return DOWN1;
        } else {
          return UP1;
        }
      } else if (diff > 0) {
        if (direction === DOWN1 || direction === DOWN2 || direction === UP2) {
          return UP1;
        } else {
          return UP2;
        }
      } else if (direction === UP1 || direction === UP2 || direction === DOWN2) {
        return DOWN1;
      } else {
        return DOWN2;
      }
    }
  }

}


export default BackgroundCell;