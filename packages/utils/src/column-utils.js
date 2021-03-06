import {
  functor, 
  overrideColName
} from './filter-utils';

const SORT_ASC = 'asc';

export function mapSortCriteria(sortCriteria, columnMap, metadataOffset=0) {
  return sortCriteria.map(s => {
      if (typeof s === 'string') {
          return [columnMap[s] + metadataOffset, 'asc'];
      } else if (Array.isArray(s)) {
          const [columnName, sortDir] = s;
          return [columnMap[columnName] + metadataOffset, sortDir || SORT_ASC];
      } else {
          throw Error('columnUtils.mapSortCriteria invalid input');
      }

  });
}

export const toKeyedColumn = (column, key) =>
  typeof column === 'string'
      ? { key, name: column }
      : typeof column.key === 'number'
          ? column
          : {...column, key};

export function buildColumnMap(columns){
  const start = metadataKeys.count;  
  if (columns){
      return columns.reduce((map, column, i) => {
          if (typeof column === 'string'){
              map[column] = start + i;
          } else if (typeof column.key === 'number') {
              map[column.name] = column.key;
          } else {
              map[column.name] = start + i;
          }
          return map;
      },{})
  } else {
      return null;
  }
}

export function projectUpdates(updates){
    const results = [];
    const metadataOffset = metadataKeys.count - 2;
    for (let i=0;i<updates.length; i+=3){
        results[i] = updates[i] + metadataOffset;
        results[i+1] = updates[i+1];
        results[i + 2] = updates[i+2];
    }
    return results;
}

export function projectColumns(tableRowColumnMap, columns){
  const columnCount = columns.length;
  const {IDX, RENDER_IDX, DEPTH, COUNT, KEY, SELECTED, count} = metadataKeys;
  return (startIdx, offset, selectedRows=[]) => (row,i) => {
      // selectedRows are indices of rows within underlying dataset (not sorted or filtered)
      // row is the original row from this set, with original index in IDX pos, which might
      // be overwritten with a different value below if rows are sorted/filtered 
      const baseRowIdx = row[IDX];
      const out = [];
      for (let i=0; i < columnCount;i++){
          const colIdx = tableRowColumnMap[columns[i].name];
          out[count+i] = row[colIdx];
      }

      out[IDX] = startIdx + i + offset;
      out[RENDER_IDX] = 0;
      out[DEPTH] = 0;
      out[COUNT] = 0;
      out[KEY] = row[tableRowColumnMap.KEY];
      out[SELECTED] = selectedRows.includes(baseRowIdx) ? 1 : 0;
      return out;
  }
}

export function projectColumnsFilter(map, columns, meta, filter){
  const length = columns.length;
  const {IDX, RENDER_IDX, DEPTH, COUNT, KEY, SELECTED} = meta;

  // this is filterset specific where first col is always value
  const fn = filter ? functor(map, overrideColName(filter, 'name'))  : () => true;
  return startIdx => (row,i) => {
      const out = [];
      for (let i=0;i<length;i++){
          const colIdx = map[columns[i].name];
          out[i] = row[colIdx];
      }
      // assume row[0] is key for now
      // out.push(startIdx+i, 0, 0, row[0]);
      out[IDX] = startIdx+i;
      out[RENDER_IDX] = 0;
      out[DEPTH] = 0;
      out[COUNT] = 0;
      out[KEY] = row[map.KEY];
      out[SELECTED] = fn(row) ? 1 : 0;

      return out;
  }
}

export function getFilterType(column){
  return column.filter || filterTypeFromColumnType(column);
}

// {name: 'Price', 'type': {name: 'price'}, 'aggregate': 'avg'},
// {name: 'MarketCap', 'type': {name: 'number','format': 'currency'}, 'aggregate': 'sum'},

const filterTypeFromColumnType = column => {
    // TODO add remaining filter types
    switch (getDataType(column)){
        case 'number': return 'number'
        default: return 'set';
    }

}

export function getDataType({type=null}){
  if (type === null){
      return 'set';
  } else if (typeof type === 'string'){
      return type;
  } else {
      switch(type.name){
          case 'price':
              return 'number';
          default:
              return type.name;
      }
  }

}

export const metadataKeys = {
    IDX: 0,
    RENDER_IDX: 1,
    DEPTH: 2,
    COUNT: 3,
    KEY: 4,
    SELECTED: 5,
    PARENT_IDX: 6,
    IDX_POINTER: 7,
    FILTER_COUNT: 8,
    NEXT_FILTER_IDX: 9,
    count: 10
}

// Deprecated
export function metaData(columns){
    const start = columns.length === 0
        ? -1
        : Math.max(...columns.map((column, idx) => typeof column.key === 'number' ? column.key : idx));
    return {
        IDX: start + 1,
        RENDER_IDX: start + 2,
        DEPTH: start + 3,
        COUNT: start + 4,
        KEY: start + 5,
        SELECTED: start + 6,
        PARENT_IDX: start + 7,
        IDX_POINTER: start + 8,
        FILTER_COUNT: start + 9,
        NEXT_FILTER_IDX: start + 10,
        count: start + 11
    }
  }