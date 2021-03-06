export function getFullRange({lo,hi,bufferSize=0}){
  return {
      lo: Math.max(0, lo - bufferSize),
      hi: hi + bufferSize
  };
}

export function resetRange({lo,hi,bufferSize=0}){
  return {
      lo: 0,
      hi: hi-lo,
      bufferSize,
      reset: true
  };
}

