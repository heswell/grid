export const createTableRows = (viewPortId, lo, hi, vpSize=100) => {
  const results = [];
  for (let rowIndex = lo; rowIndex < hi; rowIndex++){
    const key = ('0'+rowIndex).slice(-2);
    const rowKey = `key-${key}`;
    results.push({
      viewPortId,
      vpSize,
      rowIndex,
      rowKey,
      updateType: 'U',
      sel: 0,
      data: [ rowKey, `name ${key}`, 1000 + rowIndex, true]
    });
  }
  return results;
}
