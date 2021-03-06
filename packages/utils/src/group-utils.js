import {ASC} from './constants';

export function indexOfCol(key, cols = null) {
  if (cols !== null) {
      for (let i = 0; i < cols.length; i++) {
          // check both while we transition from groupBy to extendedGroupby
          // groupBy = [colName, dir] extendedGroupby = [colIdx, dir,colName]
          const [col1, , col2] = cols[i];
          if (col1 === key || col2 === key) {
              return i;
          }
      }
  }
  return -1;
}

// should be called toggleColumnInGroupBy
export function updateGroupBy(existingGroupBy = null, column/*, replace = false*/) {
  console.log(``)
  if (existingGroupBy === null) {
      return [[column.name, ASC]];
  } else {
      return indexOfCol(column.name, existingGroupBy) === -1
          ? existingGroupBy.concat([[column.name, ASC]])
          : existingGroupBy.length === 1
              ? null
              : existingGroupBy.filter(([colName]) => colName !== column.name);
  }
}
