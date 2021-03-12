
import { metadataKeys, update as updateRows } from "@heswell/utils";
import {
  anyRowsInRange,
  bufferMinMax,
  bufferLowHigh,
  getBufferIdx,
  initKeys,
  rangeLowHigh,
  rangeOverlap,
  reassignKeys,
  scrollDirection
} from './grid-data-helpers';
import * as Action from "./grid-data-actions";
import { storeAction } from "./test-data-capture";

const { IDX, RENDER_IDX } = metadataKeys;

const uniqueKeys = rows => {
  const keys = rows.map(row => row[1]);
  const uniqueKeys = new Set(keys);
  return uniqueKeys.size === keys.length;
}

export const initData = ({ range, bufferSize = 100, renderBufferSize = 0 }) => ({
  bufferIdx: { lo: 0, hi: 0 },
  buffer: [],
  bufferSize,
  renderBufferSize,
  rows: [],
  rowCount: 0,
  range,
  keys: {
    free: [],
    next: 0,
    used: {}
  },
  dataRequired: true
});

const bruteForceResetKeys = (state) => {
  state.keys = initKeys(state.range);
  state.rows.forEach(row => {
    const key = state.keys.free.shift();
    row[RENDER_IDX] = key;
    state.keys.used[key] = 1;
  })
}


// This assumes model.meta never changes. If it does (columns etc)
// we will need additional action types to update
const GridDataReducer = (state = initData({}), action) => {
  // console.log(`reducer ${JSON.stringify(action)}`)
  storeAction(action);
  if (action.type === "range") {
    // console.log(`setRange ${JSON.stringify(action.range)}`)
    return setRange(state, action);
  } else if (action.type === "data") {
    const result = setData(state, action)
    if (!uniqueKeys(result.rows)) {
      console.log(`%cKEY ERROR`, 'color: red;font-weight:bold;');
      console.table(result.rows)
      // Brute force fix until we eliminate all sources of this error
      bruteForceResetKeys(result)
    }
    return result;
    // return setData(state, action);
  } else if (action.type === "update") {
    return applyUpdates(state, action);
  } else if (action.type === Action.ROWCOUNT) {
    return setSize(state, action);
  } else if (action.type === 'clear') {
    return initData({ range: action.range, bufferSize: action.bufferSize, renderBufferSize: action.renderBufferSize });
  } else {
    throw Error(`GridDataReducer unknown action type ${action.type}`);
  }
}

export default GridDataReducer;

function setSize(state, { rowCount }) {
  return { ...state, rowCount };
}


function setRange(state, { range }) {

  if (state.range === undefined || range.lo !== state.range.lo || range.hi !== state.range.hi) {
    const { buffer } = state;
    const [vpLow, vpHigh] = rangeLowHigh(range, state.rowCount, state.renderBufferSize);
    let [bufferLow, bufferHigh] = bufferLowHigh(buffer);
    const bufferIdx = getBufferIdx(buffer, vpLow, vpHigh, bufferLow, bufferHigh);
    let newBuffer = buffer;

    reassignKeys(state, buffer, bufferIdx);

    if (buffer.length > 0 && vpLow >= bufferLow && vpHigh <= bufferHigh) {
      // We can satisfy this request for date from the buffer
      const rows = newBuffer.slice(bufferIdx.lo, bufferIdx.hi);
      const direction = scrollDirection(state.range, range);
      return {
        ...state,
        buffer: newBuffer,
        bufferIdx,
        rows,
        range,
        dataRequired: (
          // TODO sort this out
          ((direction === 'FWD' || direction === 'EXPAND') && (bufferHigh < state.rowCount - 1) && bufferHigh - vpHigh < state.bufferSize / 2) ||
          (direction === 'BWD' && bufferLow > 0 && (vpLow - bufferLow < state.bufferSize / 2))) ? true : false
      }
    } else {
      // Important, we return the same rows so this will not trigger a render
      return {
        ...state,
        buffer: newBuffer,
        bufferIdx,
        range,
        dataRequired: true
      }
    }
  } else {
    return state;
  }
}

function applyUpdates(state, action) {
  const rows = updateRows(state.rows, action.updates, metadataKeys);
  return {
    ...state,
    rows
  };
}

// TODO how do we deal with a collapsed range when we have collapsed a group ?
function setData(state, action) {
  const { rowCount } = action;

  // console.log(JSON.stringify(action.rows));
  console.table(action.rows)
  if (state.buffer.length > 0 && rowCount === state.rowCount && !anyRowsInRange(state, action.rows, rowCount)) {
    return state;
  }

  if (rowCount === 0){
    return {
      ...state,
      bufferIdx: { lo: 0, hi: 0 },
      buffer: [],
      keys: initKeys(state.range),
      rows: [],
      rowCount,
      dataRequired: false
    };

  }

  const [buffer, bufferIdx, rowsChanged] = addToBuffer(
    state,
    action.rows,
    rowCount,
  );

  const newRows = rowsChanged ? buffer.slice(bufferIdx.lo, bufferIdx.hi) : state.rows;

  if (rowsChanged) {
    for (let i = 0; i < newRows.length; i++) {
      if (newRows[i] === undefined) {
        const index = bufferIdx.lo + i;
        const key = state.keys.free.length > 0
          ? state.keys.free.pop()
          : state.keys.next++;

        state.keys.used[key] = 1;
        buffer[index] = newRows[i] = [state.range.lo + i, key, 0, 0, "", 0];
      }
    }
  }


  const rangeCount = state.range.hi - state.range.lo;
  return {
    ...state,
    bufferIdx,
    buffer,
    rows: newRows,
    rowCount,
    dataRequired: newRows.length < rangeCount
  };

}

function addToBuffer(
  state,
  incomingRows,
  rowCount,
) {


  // console.log(`addToBuffer ${JSON.stringify(state.bufferIdx)} ${state.buffer.length} size ${size}`)
  let { buffer, range } = state;
  const { bufferSize, keys, renderBufferSize } = state;
  let [bufferLow, bufferHigh] = bufferLowHigh(buffer);
  let [newBufferLow, newBufferHigh] = bufferMinMax(range, rowCount, bufferSize);
  // ignore incoming rows which are out of range
  const [incomingRowLow, incomingRowHigh] = bufferLowHigh(incomingRows, newBufferLow, newBufferHigh);
  const [vpLow, vpHigh] = rangeLowHigh(range, rowCount, renderBufferSize);

  if (incomingRowLow !== -1 && incomingRowLow > incomingRows[0][IDX]) {
    const firstGoodIncomingIndex = incomingRows.findIndex(row => row[IDX] === incomingRowLow);
    incomingRows = incomingRows.slice(firstGoodIncomingIndex);
  }

  //   console.log(`addToBuffer
  //   vpLow=${vpLow} vpHigh=${vpHigh}
  //   incomingRowLow=${incomingRowLow} incomingRowHigh ${incomingRowHigh}
  // `)

  const overlap = rangeOverlap(bufferLow, bufferHigh, newBufferLow, newBufferHigh);

    // If we have changed direction, the incoming rows might now be irrelevant
    const shortFallIncomingRows = overlap.startsWith('bwd') || overlap === 'extend'
      ? incomingRowLow - newBufferLow
      : 0; // TODO

    if (buffer.length > 0 && bufferLow < newBufferLow) {
      // console.log(`1) overlap=${overlap}`)
      const doomedRowCount = newBufferLow - bufferLow;
      buffer.splice(0, doomedRowCount);
    } else if (overlap === "bwd-overlap" || overlap === "bwd-extend" || overlap === 'extend') {
      // We cannot be sure that incomingRows carry all the rows we need to fill the
      // range gap, so take that into account

      if (incomingRowLow >= bufferLow){
        if (bufferLow > newBufferLow){
          newBufferLow = bufferLow;
        }
      } else {
        let rowsRequiredToFillRange = bufferLow - newBufferLow;
        // console.log(`2) overlap=${overlap} rowsRequiredToFillRange=${rowsRequiredToFillRange} shortFallIncomingRows=${shortFallIncomingRows}
        //   bufferLow=${bufferLow}, bufferHigh=${bufferHigh} => newBuffer:Low=${newBufferLow} newBufferHigh=${newBufferHigh}
        // `)

        let rowsAvailableToFillRange = shortFallIncomingRows > 0
          ? Math.max(0, rowsRequiredToFillRange - shortFallIncomingRows)
          : rowsRequiredToFillRange;

        if (shortFallIncomingRows > 0) {
          newBufferLow += Math.max(0, rowsRequiredToFillRange - rowsAvailableToFillRange);
        }

        buffer = Array(rowsAvailableToFillRange).concat(buffer);
      }
  }

  if (overlap.endsWith("no-overlap")) {
    state.keys = initKeys(range);
    buffer = incomingRows;
    newBufferLow = incomingRowLow;
    newBufferHigh = incomingRowHigh;

    let prevRowIdx = null;
    let rowIdx = null;

    for (let i = 0; i < buffer.length; i++) {
      prevRowIdx = rowIdx;
      rowIdx = buffer[i][IDX];
      if (prevRowIdx !== null) {
        if (rowIdx - prevRowIdx !== 1) {
          // we have a gap
          console.log(`gap in new data ${rowIdx}`)
          const rows = buffer.slice(i);
          let lastGoodIndex = prevRowIdx - newBufferLow;
          let index = lastGoodIndex + 1;
          for (let missingRowIdx = prevRowIdx + 1; missingRowIdx < rowIdx; index++, missingRowIdx++, i++) {
            const rowInViewport = missingRowIdx >= range.lo && missingRowIdx < range.hi;
            if (rowInViewport) {
              const rowKey = state.keys.free.shift();
              state.keys.used[rowKey] = 1;
              buffer[index] = [missingRowIdx, rowKey, 0, 0, "", 0]
            } else {
              buffer[index] = [missingRowIdx, 0, 0, 0, "", 0]
            }
          }
          buffer.length = index;
          buffer = buffer.concat(rows)
        }
      }

      if (rowIdx >= range.lo && rowIdx < range.hi) {
        const rowKey = state.keys.free.shift();
        state.keys.used[rowKey] = 1;
        buffer[i][RENDER_IDX] = rowKey
      }

    }

    const lo = Math.max(0, vpLow - newBufferLow);
    const hi = Math.max(0,vpHigh - newBufferLow);
    return [buffer, { lo, hi }, true];

  }


  let rowsChanged = false;

  const surplusTrailingRows = Math.max(0, bufferHigh - newBufferHigh);
  if (surplusTrailingRows > 0) {
    // Before we truncate the buffer, make sure we relase any keys in use
    const start = buffer.length - surplusTrailingRows;
    for (let i = start; i < buffer.length; i++) {
      const row = buffer[i];
      // It is possible that we have missing data, if we have received updates following a
      // range shift. Not sure if this should happen, but it does.
      if (row) {
        const rowIdx = row[IDX];
        const key = row[RENDER_IDX];
        if (rowIdx >= state.range.lo && rowIdx < state.range.hi && keys.used[key]) {
          rowsChanged = true;
          keys.free.push(key);
          keys.used[key] = undefined;
        } else {
          break;
        }
      }
    }
    buffer.length -= surplusTrailingRows;

    // make sure we have no trailing empty slots
    let emptyTrailingRowCount = 0;
    let firstEmptyRow = buffer.length - 1;
    while (buffer[firstEmptyRow] === undefined) {
      firstEmptyRow -= 1;
      emptyTrailingRowCount += 1;
    }
    if (emptyTrailingRowCount > 0) {
      buffer.length -= emptyTrailingRowCount;
    }

  }

  let prevRowIdx = null;
  let rowIdx = null;
  let rowInViewport;

  for (let row of incomingRows) {
    prevRowIdx = rowIdx;
    rowIdx = row[IDX];

    if (rowIdx >= newBufferLow && rowIdx < newBufferHigh) {
      // NO unless we have actually prepended rows to the buffer, we need to use bufferLo not newBufferLow
      const index = rowIdx - newBufferLow;
      rowInViewport = rowIdx >= range.lo && rowIdx < range.hi;

      if (prevRowIdx !== null) {
        // we have a gap of at least 1 row. Thats ok if it's an update, not if it's an insert
        if (rowIdx - prevRowIdx !== 1) {
          let lastGoodIndex = prevRowIdx - newBufferLow;
          for (let i = lastGoodIndex + 1, missingRowIdx = prevRowIdx + 1; i < index; i++, missingRowIdx++) {
            if (buffer[i] === undefined || buffer[i][IDX] !== missingRowIdx) {
              rowInViewport = missingRowIdx >= range.lo && missingRowIdx < range.hi;
              if (rowInViewport) {
                const rowKey = keys.free.shift();
                keys.used[rowKey] = 1;
                buffer[i] = [missingRowIdx, rowKey, 0, 0, "", 0]
              } else {
                buffer[i] = [missingRowIdx, 0, 0, 0, "", 0]
              }
            } else {
              break;
            }
          }
        }
      }

      let rowKey = undefined;
      if (rowInViewport) {
        if (buffer[index] && buffer[index][IDX] === rowIdx) {
          // Update
          rowKey = buffer[index][RENDER_IDX];
        } else if (keys.free.length) {
          rowKey = keys.free.shift();
        } else {
          rowKey = keys.next++;
        }
      }
      if (rowKey !== undefined) {
        row[RENDER_IDX] = rowKey;
        keys.used[rowKey] = 1;
      }
      buffer[index] = row;
      rowsChanged = rowsChanged || rowInViewport;
    }
  }

  const lo = Math.max(0, vpLow - newBufferLow);
  const hi = vpHigh - newBufferLow;

  return [buffer, { lo, hi }, rowsChanged];

}

