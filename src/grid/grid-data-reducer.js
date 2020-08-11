
import { metadataKeys, update as updateRows } from "@heswell/utils";
import * as Action from "./grid-data-actions";


const INITIAL_RANGE = { lo: 0, hi: -1 };

/** @type {() =>  GridData} */
export const initData = () => ({
  rows: [],
  rowCount: 0,
  range: INITIAL_RANGE,
  offset: 0,
  _keys: {
    free: [],
    used: {}
  }
});

// This assumes model.meta never changes. If it does (columns etc)
// we will need additional action types to update
/** @type {DataReducer} */
export default (state=initData(), action) => {
    if (action.type === "range") {
      return setRange(state, action);
    } else if (action.type === "data") {
      return setData(state, action);
    } else if (action.type === "update") {
      return applyUpdates(state, action);
    } else if (action.type === Action.ROWCOUNT) {
      return setSize(state, action);
    } else if (action.type === 'clear'){
      return initData();
    } else {
      throw Error(`GridDataReducer unknown action type ${action.type}`);
    }
}

function setKeys(keys, { lo, hi }) {
  const free = [];
  const keyCount = hi - lo;
  for (let i = 0; i < keyCount; i++) {
    const usedKey = keys.used[i];
    if (usedKey === 3 || usedKey === undefined) {
      free.push(i);
    }
  }
  return {
    used: keys.used,
    free
  };
}
function setSize(state, { rowCount }) {
  return { ...state, rowCount };
}

//TODO we HAVE to remove out=of-range rows and add empty placeholders
/** @type {DataReducer} */
function setRange(state, { range }) {
  // return {
  //   ...state,
  //   range,
  //   _keys: setKeys(state._keys, range)
  // }

  const { rows, rowCount, offset } = state;
  const keys = setKeys(state._keys, range);

  const [mergedRows, _keys] =
    rows.length === 0
      ? [rows, keys]
      : mergeAndPurge(range, rows, offset, [], rowCount, keys);

  // const selected = rows.filter(row => row[SELECTED]).map(row => row[IDX]);
  return {
    rows: mergedRows,
    rowCount,
    offset,
    range,
    _keys
  };
}

function applyUpdates(state, action) {
  const rows = updateRows(state.rows, action.updates, metadataKeys);
  return {
    ...state,
    rows
  };
}

/** @type {DataReducer} */
function setData(state, action) {
  // const { IDX, SELECTED } = meta;
  // console.log(`data-reducer setData ${action.range.lo} ${action.range.hi}`)
  const { rows, rowCount, offset } = action;
  // const range =
  //   action.range.reset || state.range === INITIAL_RANGE
  //     ? action.range
  //     : state.range;
  const range = action.range;
  // console.log(`setData <<<<<<<  incoming...`)
  // console.table(rows)

  // console.log(`setData <<<<<<<  existing...`)
  // console.table(state.rows)

  const [mergedRows, _keys] = mergeAndPurge(
    range,
    state.rows,
    offset,
    rows,
    rowCount,
    state._keys
  );

  // console.log(`setData >>>>>>  out...`)
  // console.table(mergedRows)
  return {
    rows: mergedRows,
    rowCount,
    offset,
    range,
    _keys
  };
}

// TODO create a pool of these and reuse them
function emptyRow(idx, ) {
  const { IDX, count } = metadataKeys;
  const row = Array(count);
  row[IDX] = idx;
  return row;
}

/** @type {(...args: any[]) => [any[], RowKeys]} */
function mergeAndPurge(
  { lo, hi },
  rows,
  offset = 0,
  incomingRows,
  size,
  keys
) {
  // console.log(`dataReducer.mergeAndPurge: entry
  //   range ${lo} - ${hi}
  //   keys:
  //     free: ${keys.free.join(',')}
  //     used : ${Object.keys(keys.used).join(',')}
  //     existing rows : ${rows.map(r=>r[meta.IDX]-offset).join(',')}
  //     incoming rows : ${incomingRows.map(r=>r[meta.IDX]-offset).join(',')}
  // `)

  const { IDX, RENDER_IDX } = metadataKeys;
  const { free: freeKeys, used: usedKeys } = keys;
  const low = lo + offset;
  const high = Math.min(hi + offset, size + offset);
  const rowCount = hi - lo;
  const results = [];
  /** @type {{[key: number]: number}} */
  const used = {};
  /** @type {number[]} */
  const free = freeKeys.slice();

  let maxKey = rows.length;
  let pos, row, rowIdx, rowKey;

  // 1) iterate existing rows, copy to correct slot in results if still in range
  //    if not still in range, collect rowKey

  for (let i = 0; i < rows.length; i++) {
    row = rows[i];
    if (row) {
      rowIdx = row[IDX];
      rowKey = row[RENDER_IDX];
      pos = rowIdx - low;

      if (usedKeys[rowKey] === 1 && rowIdx >= low && rowIdx < high) {
        results[pos] = rows[i];
        used[rowKey] = 1;
      } else if (usedKeys[rowKey] === 1 && rowKey < rowCount) {
        free.push(rowKey);
        used[rowKey] = undefined;
      }
    }
  }

  // 2) iterate new rows, if not already in results (shouldn't be) , move to correct slot in results
  //      assign rowKey from free values
  for (let i = 0; i < incomingRows.length; i++) {
    row = incomingRows[i];
    if (row) {
      rowIdx = row[IDX];
      pos = rowIdx - low;

      if (rowIdx >= low && rowIdx < high) {
        if (results[pos]) {
          rowKey = results[pos][RENDER_IDX];
        } else {
          rowKey = free.shift();
          if (rowKey === undefined) {
            rowKey = maxKey++;
          }
          used[rowKey] = 1;
        }
        results[pos] = row;
        row[RENDER_IDX] = rowKey;
      } else {
        console.warn("new row outside range");
      }
    }
  }
  // 3) assign empty row to any free slots in results
  // TODO make this more efficient
  // TODO how do we determine this -2
  for (let i = 0, freeIdx = 0; i < rowCount; i++) {
    if (results[i] === undefined) {
      const row = (results[i] = emptyRow(i + low));
      if (free[freeIdx] === undefined){
        free[freeIdx] = i;
      }
      rowKey = free[freeIdx++]; // don't remove from free
      row[RENDER_IDX] = rowKey;
      used[rowKey] = 3;
    }
  }

  //   console.log(`dataReducer.mergeAndPurge: exit
  //   range ${lo} - ${hi}
  //   keys:
  //     free: ${free.join(',')}
  //     used : ${Object.keys(used).join(',')}
  //     row keys : ${results.map(r=>r[RENDER_IDX]).join(',')}
  // `)

  // console.table(results)

  return [
    results,
    {
      free,
      used
    }
  ];
}
