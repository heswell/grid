import { metadataKeys } from "@heswell/utils";

const { RENDER_IDX } = metadataKeys;

export const isDataOutOfRange = (buffer, vpLow, vpHigh, bufferLow, bufferHigh) =>
  buffer.length == 0 || vpLow >= bufferHigh || vpHigh <= bufferLow;


export function anyRowsInRange(state, rows, rowCount) {
  let [firstRowIdx, lastRowIdx] = bufferLowHigh(rows);
  const { range, bufferSize } = state;
  const [bufferMin, bufferMax] = bufferMinMax(range, rowCount, bufferSize);
  return lastRowIdx >= bufferMin && firstRowIdx < bufferMax;
}

export const initKeys = ({ hi, lo }) => {
  const count = hi - lo;
  return {
    free: Array(count).fill(0).map((_, i) => i),
    next: count,
    used: {}
  }
}


export function rangeOverlap(low, high, newLow, newHigh){
  if (newLow === low && newHigh === high){
    return 'match';
  } else if (newLow >= high ){
    return "fwd-no-overlap";
  } else if (newHigh <= low){
    return "bwd-no-overlap";
  } else if (newLow > low && newHigh > high){
    return "fwd-overlap"
  } else if (newLow < low && newHigh < high){
    return "bwd-overlap"
  } else if (newLow < low && newHigh === high){
    return "bwd-extend"
  } else if (newLow === low && newHigh > high){
    return "fwd-extend"
  } else if (newLow < low && newHigh > high){
    return "extend"
  } else {
    // console.log(`range change neither overlap`);
    return '';
  }
}

export function rangeLowHigh(range, rowCount, renderBufferSize = 0) {
  return [
    Math.max(0, range.lo - renderBufferSize),
    Math.min(range.hi + renderBufferSize, rowCount)
  ];
}

export function bufferLowHigh(rows, min=-Number.MAX_VALUE, max=Number.MAX_VALUE) {
  const count = rows.length;
  if (count === 0) {
    return [-1, -1];
  } else {
    let first = 0;
    let [firstRowInRange] = rows[first];

    while (firstRowInRange < min){
      first += 1;
      if (first === rows.length){
        return [-1, -1];
      }
      ([firstRowInRange] = rows[first]);
    }

    let last = count - 1;
    let [lastRowInRange] = rows[last];
    while (lastRowInRange > max && last > first){
      last -= 1;
      if (last === first){
        return [firstRowInRange, firstRowInRange];
      }
      ([lastRowInRange] = rows[last]);
    }

    return [firstRowInRange, Math.min(lastRowInRange+1, max)]
  }
}

export const getFreedKeys = ({ lo: oldLo, hi: oldHi }, { lo: newLo, hi: newHi }) => {
  const freedKeys = [];

  if (oldLo !== newLo || oldHi !== newHi) {
    if (newHi <= oldLo || newLo >= oldHi) {
      // all old keys are freed
      for (let i = oldLo; i < oldHi; i++) {
        freedKeys.push(i);
      }
    } else {
      if (oldLo < newLo) {
        for (let i = oldLo; i < newLo; i++) {
          freedKeys.push(i);
        }
      }
      if (oldHi > newHi) {
        for (let i = newHi; i < oldHi; i++) {
          freedKeys.push(i)
        }
      }
    }
  }
  return freedKeys;
}

export const getNewEntriesIntoRange = ({ lo: oldLo, hi: oldHi }, { lo: newLo, hi: newHi }) => {

  const newEntries = [];

  if (oldLo !== newLo || oldHi !== newHi) {
    if (newHi <= oldLo || newLo >= oldHi) {
      // all keys are new entries
      for (let i = newLo; i < newHi; i++) {
        newEntries.push(i);
      }
    } else {
      if (newLo < oldLo) {
        for (let i = newLo; i < oldLo; i++) {
          newEntries.push(i);
        }
      }
      if (newHi > oldHi) {
        for (let i = oldHi; i < newHi; i++) {
          newEntries.push(i)
        }
      }
    }
  }
  return newEntries;

}

export const  getBufferIdx = (buffer, vpLow, vpHigh, bufferLow, bufferHigh) => {
  return isDataOutOfRange(buffer, vpLow, vpHigh, bufferLow, bufferHigh)
  ? { lo: 0, hi: 0 }
  : {
    lo: Math.max(0, vpLow - bufferLow),
    hi: Math.min(buffer.length, vpHigh - bufferLow)
  };

}

export function bufferMinMax(range, rowCount, bufferSize) {
  return [
    Math.max(0, (range.lo) - bufferSize),
    Math.min(rowCount, range.hi + bufferSize)]
}

export const getFullBufferSize = (range, rowCount, bufferSize) => {
  const leadCount = Math.min(bufferSize, range.lo);
  const trailCount = Math.min(bufferSize, rowCount - range.hi);
  return range.hi - range.lo + leadCount + trailCount;;
}

const applyOffset = (range, offset) => offset === 0
  ? range
  : { lo: range.lo + offset, hi: range.hi + offset };


// The idxOffset allows for leading buffer items which have been removed, 
// requiring an adjustment to the new bufferIdx
export function reassignKeys(state, buffer, bufferIdx, idxOffset=0) {
  const {keys} = state;
  const newBufferIdx = applyOffset(bufferIdx, idxOffset);
  const freedKeys = getFreedKeys(state.bufferIdx, newBufferIdx);
  for (let bufferIdx of freedKeys){
    if (buffer[bufferIdx]){
      // Why do we sometimes not come in here ?
      const rowKey = buffer[bufferIdx][RENDER_IDX];
      keys.free.push(rowKey);
      keys.used[rowKey] = undefined;
    }
  }

  const newEntries = getNewEntriesIntoRange(state.bufferIdx, newBufferIdx)
  for (let bufferIdx of newEntries){
    if (buffer[bufferIdx - idxOffset]){
      let rowKey = keys.free.shift();
      if (rowKey === undefined) {
        rowKey = keys.next++;
      }
      keys.used[rowKey] = 1;
      buffer[bufferIdx - idxOffset][RENDER_IDX] = rowKey;
    }
  }
}

export function scrollDirection(range1, range2) {
  if (range1 === null) {
    return 'INIT';
  } else if (range1.lo === range2.lo && range2.hi > range1.hi) {
    return 'EXPAND';
  } else if (range1.hi === range2.hi && range2.lo < range1.lo) {
    return 'EXPAND';
  } else if (range2.lo > range1.lo) {
    return 'FWD';
  } else if (range2.lo < range1.lo) {
    return 'BWD';
  } else {
    return 'UNKNOWN'
  }
}