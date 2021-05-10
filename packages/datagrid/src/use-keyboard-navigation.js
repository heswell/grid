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
  Tab: true,
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
  });
  const allowCellSelection = gridModel.cellSelectionModel !== 'none';

  useEffect(() => {
    if (gridModel.viewportRowCount){
      range.current = {from:0, to: gridModel.viewportRowCount};
    }

  },[gridModel.viewportRowCount])

  const setRange = useCallback(value => {
    // remove focus from cell out of window
    range.current = value;
    if (focusState.current.row < value.from || focusState.current.row >= value.to){
      // shift focus to placehgolder
      rootRef.current.focus();
    }
  },[rootRef]);


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

  const handleClick = useCallback(e => {
    const cellEl = e.target.closest(".GridCell, .vuHeaderCell");
    if (cellEl){
      // what about row selection
      e.stopPropagation();
      const rowEl = cellEl.parentNode;
      const col = Array.from(rowEl.childNodes).indexOf(cellEl);
      const row = parseInt(rowEl.dataset.idx);
      focusCell(row, col);
    }

  },[focusCell])

  const handleFocus = useCallback(e => {
    const {current: {hasFocus}} = focusState;
    console.log(`handle Focus`)
    if (!hasFocus){
      focusState.current.hasFocus = true;
      // do this in a timeout, so we can cancel it if it turns out to have been a click
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
    if (allowCellSelection){
      rootEl.addEventListener('blur', handleBlur, true);
      rootEl.addEventListener('click', handleClick, true);
      rootEl.addEventListener('keydown', handleKeyDown, true);
      rootEl.addEventListener('focus', handleFocus, true);
    }

    return () => {
      if (allowCellSelection){
        rootEl.removeEventListener('blur', handleBlur, true);
        rootEl.removeEventListener('click', handleClick, true);
        rootEl.removeEventListener('focus', handleFocus, true);
        rootEl.removeEventListener('keydown', handleKeyDown, true);

      }
    }
  },[allowCellSelection, handleBlur, handleClick, handleFocus, handleKeyDown, rootRef])


  return setRange;

}
