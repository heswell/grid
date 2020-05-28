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


/** @type {(columnGroup: ColumnGroup, column: Column, reduceWidth?: boolean) => ColumnGroup} */
export function removeColumn(columnGroup, column, resize=false){
  const {columns, contentWidth, width} = columnGroup;
  const remainingColumns = columns.filter(({key}) => key !== column.key);
  if (remainingColumns.length === columns.length){
    throw Error('removeColumn: column not found in columnGroup');
  } 
  const remainingContentWidth = contentWidth - column.width;
  const newWidth = resize
    ? width - column.width
    : Math.min(width, remainingContentWidth)

  return {
    ...columnGroup,
    columns: remainingColumns,
    contentWidth: remainingContentWidth,
    width: newWidth
  }
}

/** @type {(columnGroup: ColumnGroup, column: Column, idx: number, resize: boolean) => ColumnGroup} */
export function addColumn(columnGroup, column, idx, resize){
  const {columns, contentWidth, width} = columnGroup;
  if (columns.findIndex(({key}) => key === column.key) !== -1){
    throw Error(`addColumn: columnGroup columns already has column with key '${column.key}'`);
  }

  const newColumns = columns.slice();
  newColumns.splice(idx, 0, column);

  return {
    ...columnGroup,
    columns: newColumns,
    contentWidth: contentWidth + column.width,
    width: resize ? width + column.width : width
  }  

}