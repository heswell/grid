export function getFullRange({lo,hi}, bufferSize=0, rowCount=Number.MAX_SAFE_INTEGER){
  if (bufferSize === 0){
    return {from: lo, to: Math.min(hi, rowCount)};
  } else if (lo === 0){
    return {from: lo, to: Math.min(hi + bufferSize, rowCount)};
  } else {
    const rangeSize = hi - lo;
    const buff = Math.round(bufferSize / 2);
    const shortfallBefore = lo - buff < 0;
    const shortFallAfter = rowCount - (hi + buff) < 0;

    if (shortfallBefore && shortFallAfter){
      return {from: 0, to: rowCount}
    } else if (shortfallBefore){
      return {from: 0, to: rangeSize + bufferSize}
    } else if (shortFallAfter){
      return {from: Math.max(0,rowCount - (rangeSize + bufferSize)), to: rowCount}
    } else {
      return {from: lo-buff, to: hi + buff}
    }
  }
}

export function resetRange({lo,hi,bufferSize=0}){
  return {
      lo: 0,
      hi: hi-lo,
      bufferSize,
      reset: true
  };
}

