import ColumnGroupHeader from "./column-group-header";

/** @type {(gm: GridModel, target: Column | number) => ColumnGroup} */
export function getColumnGroup({columnGroups}, target){
  if (typeof target === 'number'){
    // this can be simplified, dom\t need to iterate columns
    const lastGroup = columnGroups.length - 1;
    for (let i=0,idx=0;i<=lastGroup;i++){
      const columnGroup = columnGroups[i];
      for (let j=0;j<columnGroup.columns.length;j++, idx++){
        if (target === idx){
          return columnGroup;
        } else if (i === lastGroup && target === j + 1){
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