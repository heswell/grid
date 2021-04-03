export function getFullRange({lo,hi}, bufferSize=0, rowCount){
  if (bufferSize === 0){
    return {from: lo, to: hi};
  } else if (lo === 0){
    return {from: lo, to: hi + bufferSize};
  } else {
    const buff = Math.round(bufferSize / 2);
    // temp hack - need to take rowCount into consideration
    return {from: Math.max(0,lo-buff), to: hi+buff}

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

