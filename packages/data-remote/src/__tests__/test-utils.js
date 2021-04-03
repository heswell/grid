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

export const updateTableRow = (viewPortId, rowIndex, updatedVal, vpSize=100) => {
    const key = ('0'+rowIndex).slice(-2);
    const rowKey = `key-${key}`;
    return {
      viewPortId,
      vpSize,
      rowIndex,
      rowKey,
      updateType: 'U',
      sel: 0,
      data: [ rowKey, `name ${key}`, updatedVal, true]
    };
}

export const createSubscription = ({key='1', lo=0, hi=10, bufferSize=0}={}) => ([
  { viewport: `client-vp-${key}`, tablename: "test-table", range: { lo, hi }, bufferSize },
  {
    requestId: `client-vp-${key}`, body: {
      type: "CREATE_VP_SUCCESS",
      viewPortId: `server-vp-${key}`,
      columns: ["col-1", "col-2", "col-3", "col-4"],
      range: { from: lo, to: hi + bufferSize },
      sort: { sortDefs: [] },
      groupBy: [],
      filterSpec: { filter: "" },
    }
  }
])
