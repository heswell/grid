import ColumnGroupHeader from "./column-group-header";

/** @type {(gm: GridModel, c: Column) => ColumnGroup} */
export function getColumnGroup({columnGroups}, column){
  for (let columnGroup of columnGroups){
    if (columnGroup.columns.some(({key}) => key === column.key)){
      return columnGroup;
    }
  }
  return null;
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