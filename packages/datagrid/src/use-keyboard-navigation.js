import {useCallback, useEffect, useRef} from 'react';
import { getFullRange } from "@heswell/utils/src/range-utils";

const RowNavKey = {
  ArrowUp: true,
  ArrowDown: true
}

const ColNavKey = {
  ArrowLeft: true,
  ArrowRight: true
}

const NavKey = {
  ...RowNavKey,
  ...ColNavKey
}

const isInteger = num => Math.floor(num) === num;

export const useKeyboardNavigation = (rootRef, gridModel) => {
  const headerRows = 1;
  const range = useRef(null);
  const focusState = useRef({
    hasFocus: false,
    isHeaderCell: false,
    row:-1,
    cell:-1
  })

  useEffect(() => {
    if (gridModel.viewportRowCount){
      range.current = {from:0, to: gridModel.viewportRowCount};
    }

  },[gridModel.viewportRowCount])

  const setRange = useCallback(value => {
    // remove focus from cell out of window
    const fullRange = getFullRange({lo:value.from, hi:value.to}, gridModel.renderBufferSize);
    console.log(`useKeyboardNavigation setRange ${value.from} - ${value.to} full range ${JSON.stringify(fullRange)}`)
    range.current = value;
    if (focusState.current.row < value.from || focusState.current.row >= value.to){
      // shift focus to placehgolder
      rootRef.current.focus();
    }
  },[gridModel.renderBufferSize, rootRef]);


  const focusHeaderCell = useCallback((row, col=focusState.current.col) => {
    const focus = focusState.current;
    focus.isHeaderCell = true;
    focus.row = row;
    focus.col = col;
    const target = rootRef.current.querySelector(`.vuHeaderCell:nth-child(${col+1})`);
    if (target){
      target.focus();
    }

  },[rootRef])

  const focusCell = useCallback((row, col=focusState.current.col) => {
    const focus = focusState.current;
    focus.isHeaderCell = false;
    focus.row = row;
    focus.col = col;
    const target = rootRef.current.querySelector(`.GridRow[data-idx="${row}"]`)?.querySelector(`.GridCell:nth-child(${col+1})`);
    if (target){
      target.focus();
    }

  },[rootRef])

  const handleKeyDown = useCallback(e => {
    if (NavKey){
      const {isHeaderCell, row, col} = focusState.current;

      if (RowNavKey[e.key]){
        const {current: {from, to}} = range;
        const fullRange = getFullRange({lo:from, hi: Math.ceil(to)}, gridModel.renderBufferSize);

        if (e.key === 'ArrowDown'){
          if (row === -1){
            focusHeaderCell(0,0);
          } else if (isHeaderCell && row+1 < headerRows){
            focusHeaderCell(row+1,col);
          } else {
            const nextRow = Math.max(from, isHeaderCell ? 0 : row+1);
            const nextRowIdx = nextRow;
            if (nextRowIdx < fullRange.to){
              if (nextRowIdx < Math.floor(to) && isInteger(nextRow)){
                focusCell(nextRow);
                e.stopPropagation();
                e.preventDefault();
              } else {
                if (!isInteger(nextRow)){
                  console.log('how do we tell viewport to scroll up to align row, not down ?')
                }
                requestAnimationFrame(() => {
                  focusCell(Math.floor(nextRow));
                })
              }
            }

          }
        } else if (e.key === 'ArrowUp'){
          if(isHeaderCell && row === 0){
            // do nothing
          } else if (isHeaderCell){
            focusHeaderCell(row-1);
          } else if (!isHeaderCell && row === 0){
            focusHeaderCell(headerRows-1);
          } else {
            const nextRow = row-1;
            if (nextRow >= fullRange.from){
              if (nextRow >= from &&  isInteger(nextRow)){
                focusCell(nextRow);
                e.stopPropagation();
                e.preventDefault();
              } else {
                requestAnimationFrame(() => {
                  focusCell(nextRow);
                })
              }
            }
          }
        }
      } else if (ColNavKey[e.key]){
        const focusNextCell = isHeaderCell ? focusHeaderCell : focusCell;
        e.stopPropagation();
        e.preventDefault();

        if (e.key === 'ArrowRight' && col+1 < gridModel.columns.length){
          focusNextCell(row, col+1);
        } else if (e.key === 'ArrowLeft' && col > 0){
          focusNextCell(row, col-1);
        }
      }

    }
  },[focusCell,focusHeaderCell, gridModel.columns, gridModel.renderBufferSize])

  const handleFocus = useCallback(e => {
    const {current: {hasFocus}} = focusState;
    if (!hasFocus){
      focusState.current.hasFocus = true;
      focusHeaderCell(0, 0);
    }
  },[focusHeaderCell])

  const handleBlur = useCallback(e => {
    if (rootRef.current.contains(e.relatedTarget)){
    } else {
      focusState.current.hasFocus = false;
    }
  },[rootRef])


  useEffect(() => {
    const rootEl = rootRef.current;
    rootEl.addEventListener('keydown', handleKeyDown, true);
    rootEl.addEventListener('blur', handleBlur, true);
    rootEl.addEventListener('focus', handleFocus, true);

    return () => {
      console.log('remove event listener')
      rootEl.removeEventListener('blur', handleBlur, true);
      rootEl.removeEventListener('focus', handleFocus, true);
      rootEl.removeEventListener('keydown', handleKeyDown, true);
    }
  },[handleBlur, handleFocus, handleKeyDown, rootRef])


  return setRange;

}
