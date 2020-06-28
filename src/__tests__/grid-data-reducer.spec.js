import gridDataReducer, {initData} from '../grid/grid-data-reducer';

const initialRowset = [
  ['zero', 100, true, 0, 0],
  ['one', 100, true, 1, 0],
  ['two', 100, true, 2, 0],
  ['three', 100, true, 3, 0],
  ['four', 100, true, 4, 0],
  ['five', 100, true, 5, 0],
  ['six', 100, true, 6, 0],
  ['seven', 100, true, 7, 0],
  ['eight', 100, true, 8, 0],
  ['nine', 100, true, 9, 0]
];

describe('grid-data-reducer', () => {

  const metaDataKeys = {IDX: 3, RENDER_IDX: 4};
  const keysOf = rows => rows.map(row => row[metaDataKeys.RENDER_IDX])
  const isEmpty = row => row[0] === undefined;

  describe('initData', () => {
    it('merges empty static structure with metaDataKeys', () => {
      const state = initData(metaDataKeys);
      expect(state).toEqual({
        metaDataKeys,
        offset: 0,
        rows: [],
        rowCount: 0,
        range: {lo:0, hi:-1},
        _keys: {
          free: [],
          used: {}
        }
      })
    }); 
  })

  describe('setData', () => {

    it ('assigns keys to initial set of rows', () => {
      const initialState = initData(metaDataKeys);
      const {rows,_keys: {free, used}} = gridDataReducer(initialState, {
        type: 'data',
        rows: initialRowset,
        offset:0,
        range: {lo:0, hi: 10},
        rowCount: 100
      });
      
      expect(keysOf(rows)).toEqual([0,1,2,3,4,5,6,7,8,9]);
      expect(free).toEqual([]);
      expect(used).toEqual({0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1})
  
    })


    it ('manages keys across range changes, scroll FWD, single new row', () => {
      const initialState = initData(metaDataKeys);
      const firstState = gridDataReducer(initialState, {
        type: 'data',
        rows: initialRowset,
        offset:0,
        range: {lo:0, hi: 10},
        rowCount: 100
      });

      // Requires that setRange be called first !
      const stateWithNewRange = gridDataReducer(firstState, {
        type: 'range',
        range: {lo:1, hi:11}
      })

      const {rows: rows1, _keys: {free: free1, used: used1}} = stateWithNewRange;
      expect(keysOf(rows1)).toEqual([1,2,3,4,5,6,7,8,9,0]);
      expect(free1).toEqual([0]);
      expect(used1).toEqual({0:3,1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1})
      expect(isEmpty(rows1[9])).toBeTruthy();

      const {rows: rows2,_keys: {free: free2, used: used2}} = gridDataReducer(stateWithNewRange, {
        type: 'data',
        rows: [
          ['ten', 100, true, 10, 0],
        ],
        offset:0,
        range: {lo:1, hi: 11},
        rowCount: 100
      });

      expect(keysOf(rows2)).toEqual([1,2,3,4,5,6,7,8,9,0]);
      expect(free2).toEqual([]);
      expect(used2).toEqual({0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1});
      expect(rows2[9][0]).toEqual('ten');
  
    })

    it.only ('preserves identity of empty rows across refreshes', () => {
      const initialState = initData(metaDataKeys);
      const firstState = gridDataReducer(initialState, {
        type: 'data',
        rows: initialRowset,
        offset:0,
        range: {lo:0, hi: 10},
        rowCount: 100
      });

      // scroll ahead rapidly, emptying most of rowset
      const stateWithNewRange = gridDataReducer(firstState, {
        type: 'range',
        range: {lo:8, hi:18}
      })

      const thirdState = gridDataReducer(stateWithNewRange, {
        type: 'data',
        rows: [
          ['ten', 100, true, 10, 0],
          ['eleven', 100, true, 11, 0],
        ],
        offset:0,
        range: {lo:2, hi: 12},
        rowCount: 100
      });

      const {rows: rows1} = stateWithNewRange;  
      const {rows: rows2} = thirdState;  

      expect(rows1[4]).toBe(rows2[4]);
      expect(rows1[5]).toBe(rows2[5]);
      expect(rows1[6]).toBe(rows2[6]);
      expect(rows1[7]).toBe(rows2[7]);
      expect(rows1[8]).toBe(rows2[8]);
    })

  })

})