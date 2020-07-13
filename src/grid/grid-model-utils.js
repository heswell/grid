import {  metadataKeys } from '@heswell/utils'

import { COLUMNS_CHANGE } from "./grid-data-actions";

/** @type {(gm: GridModel, target: Column | number) => ColumnGroup} */
export function getColumnGroup({columnGroups}, target){
  if (typeof target === 'number'){
    // this can be simplified, dom\t need to iterate columns
    const lastGroup = columnGroups.length - 1;
    for (let i=0,idx=0;i<=lastGroup;i++){
      const columnGroup = columnGroups[i];
      const columnCount = columnGroup.columns.length;
      for (let j=0;j<columnCount;j++, idx++){
        if (target === idx){
          return columnGroup;
        } else if (i === lastGroup && target === idx+1 && j === columnCount - 1){
          return columnGroup;
        }
      }
    }
  } else {
    for (let columnGroup of columnGroups){
      if (columnGroup.columns.some(({key}) => key === target.key)){
        return columnGroup;
      }
    }
  }
  return null;
}

/** @type {(gm: GridModel, c: Column) => number} */
export function getColumnGroupIdx({columnGroups}, column){
  for (let i=0; i<columnGroups.length; i++){
    if (columnGroups[i].columns.some(({key}) => key === column.key)){
      return i;
    }
  }
  return -1;
}

/** @type {(columnGroup: ColumnGroup, column: Column, targetColumn: Column) => ColumnGroup} */
export function moveColumn(columnGroup, column, targetColumn){
  const col = columnGroup.columns.find(c => c.key === column.key);
  const idx = columnGroup.columns.findIndex(c => c.key === targetColumn.key);
  const columns = columnGroup.columns.filter(c => c !== col);
  columns.splice(idx, 0, col);
  return { ...columnGroup, columns };
}

export const Column = {
  /** @type {(column: Column, columnGroup: ColumnGroup) => Column} */
  clone: (column, {locked}) => {
    return {...column, locked};
  }
}

export const ColumnGroup = {
  insertColumnAt: (columnGroup, column, idx) => {
    const columns = columnGroup.columns.slice();
    columns.splice(idx, 0, Column.clone(column, columnGroup));
    return columns;
  },
  moveColumnTo: (columnGroup, column, idx) => {
    const sourceIdx = columnGroup.columns.findIndex(col => col.key === column.key);
    const columns = columnGroup.columns.slice();
    if (sourceIdx < idx){
      columns.splice(idx, 0, column);
      columns.splice(sourceIdx,1);
    } else {
      columns.splice(sourceIdx, 1);
      columns.splice(idx, 0, column);
    }
    return columns;
  }
}

export const measureColumns = (gridModel, left) => {
  let position = left;
  const lastGroup = gridModel.columnGroups.length- 1;
  return gridModel.columnGroups.map((columnGroup,groupIdx) => 
    columnGroup.columns.reduce((sizes, column, i, columns) => {
      sizes.push(position);
      position += column.width;
      if (groupIdx === lastGroup && i === columns.length - 1){
        sizes.push(position);
      }
      return sizes;
    },[]));
  }

export const getColumnGroupColumnIdx = ({columnGroups}, idx) => {
  let relativeIdx = idx;
  const lastGroup = columnGroups.length - 1;
  for (let i=0; i<=lastGroup; i++){
    const {columns} = columnGroups[i];
    if (relativeIdx < columns.length){
      break;
    } else if (i === lastGroup && relativeIdx === columns.length){
      break;
    }
    relativeIdx -= columns.length;
  }
  return relativeIdx;
}

/** @type {(gridModel: GridModel, columnGroupIdx: number) => number} */
export const getColumnGroupOffset = ({columnGroups}, columnGroupIdx) => {
  let offset = 0;
  for (let i=0;i<columnGroupIdx;i++){
    offset += columnGroups[i].width;
  }
  return offset;
}

/** @type {(gridModel: GridModel, columnGroupIdx: number, columnIdx: number) => number} */
export const getColumnOffset = (gridModel, columnGroupIdx, columnIdx) => {
  let offset = getColumnGroupOffset(gridModel, columnGroupIdx);
  const cols = gridModel.columnGroups[columnGroupIdx].columns;
  for (let i=0;i<columnIdx;i++){
    offset += cols[i].width;
  }
  return offset;
}

const mapSortColumns = sortColumns => {
  if (sortColumns){
    const entries = Object.entries(sortColumns);
    if (entries.length === 1){
      return entries;
    } else {
      return entries.sort(([,a],[,b]) => a-b).map(([col, pos]) => [col, pos > 0 ? 'asc' : 'dsc']);
    }  
  } else {
    return null;
  }
}

function toggleGroupState(gridModel, row) {

  let { groupState } = gridModel;
  const groupBy = GridModel.groupBy(gridModel);
  const columns = GridModel.columns(gridModel);
  const groupLevel = row[metadataKeys.DEPTH];
  const groupByIdx = groupBy.length - Math.abs(groupLevel);

  const newGroupState = groupState === null ? {} : { ...groupState };
  let stateEntry = newGroupState;

  for (let i = 0; i <= groupByIdx; i++) {
      const [groupCol] = groupBy[i];
      const column = columns.find(col => col.name === groupCol);
      const groupVal = row[column.key];

      if (i === groupByIdx) {
          if (stateEntry[groupVal]) {
              stateEntry[groupVal] = null;
          } else {
              stateEntry[groupVal] = i === groupBy.length - 1 ? true : {};
          }
      } else if (stateEntry[groupVal] === true) {
          stateEntry = stateEntry[groupVal] = {};
      } else {
          // clone as we descend
          stateEntry = stateEntry[groupVal] = { ...stateEntry[groupVal] };
          if (!stateEntry) {
              console.log(`Grid.toggleGroup something is wrong - trying to toggle a node whose parent is not expanded`);
              return;
          }
      }
  }

  return newGroupState;

}


export const GridModel = {
  columns: gridModel => gridModel.columnGroups.flatMap(group => group.columns.flatMap(column => column.isGroup ? column.columns : column)),
  columnNames: gridModel => GridModel.columns(gridModel).map(column => column.name),
  groupBy: gridModel => mapSortColumns(gridModel.groupColumns),
  sortBy: gridModel => mapSortColumns(gridModel.sortColumns),
  toggleGroupState
}

export function expandStatesfromGroupState({columns},groupState){
  const results = Array(columns.length).fill(-1);
  let all = groupState && groupState['*'];
  let idx = 0;
  while (all){
      results[idx] = 1;
      all = all['*'];
  }
  return results;
}
