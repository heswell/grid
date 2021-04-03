import GridDataReducer from '../../grid-data-reducer';
import { rows, getRows } from './test-data.js';

const getRowKeys = rows => rows.map(row => row[1]).sort((a, b) => a - b);
const uniqueKeys = rows => {
  const keys = getRowKeys(rows);
  const uniqueKeys = new Set(keys);
  return uniqueKeys.size === keys.length;
}

describe('grid-data-reducer', () => {

  describe('initialisation', () => {
    test('init, default bufferSize', () => {
      const initialState = GridDataReducer(undefined, { type: 'clear', range: { lo: 0, hi: 20 } });
      expect(initialState).toEqual({
        bufferIdx: { lo: 0, hi: 0 },
        buffer: [],
        bufferSize: 100,
        renderBufferSize: 0,
        rows: [],
        rowCount: 0,
        range: { lo: 0, hi: 20 },
        keys: { free: [], used: {}, next: 0 },
        dataRequired: true
      })
    });

    test('init, custom bufferSize', () => {
      const initialState = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 20 } });
      expect(initialState).toEqual({
        bufferIdx: { lo: 0, hi: 0 },
        buffer: [],
        bufferSize: 20,
        renderBufferSize: 0,
        rows: [],
        rowCount: 0,
        range: { lo: 0, hi: 20 },
        keys: { free: [], used: {}, next: 0 },
        dataRequired: true
      })
    });

    test('initial load', () => {
      const initialState = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      const state = GridDataReducer(initialState, {
        type: 'data',
        rowCount: 1000,
        rows
      });
      expect(state.buffer.length).toEqual(30);
      expect(state.bufferIdx).toEqual({ lo: 0, hi: 10 });
      expect(state.rows).toEqual([
        [0, 0, 0, 0, 0, 'key-00'],
        [1, 1, 0, 0, 0, 'key-01'],
        [2, 2, 0, 0, 0, 'key-02'],
        [3, 3, 0, 0, 0, 'key-03'],
        [4, 4, 0, 0, 0, 'key-04'],
        [5, 5, 0, 0, 0, 'key-05'],
        [6, 6, 0, 0, 0, 'key-06'],
        [7, 7, 0, 0, 0, 'key-07'],
        [8, 8, 0, 0, 0, 'key-08'],
        [9, 9, 0, 0, 0, 'key-09'],
      ]);
    })
  });

  describe('setRange', () => {

    test('FWD 1 row at a time until out of range', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 10, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1000, rows: getRows(0, 20, 0) });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 0, hi: 10 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 1, hi: 11 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 1, hi: 11 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 2, hi: 12 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 2, hi: 12 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 3, hi: 13 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 3, hi: 13 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 4, hi: 14 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 4, hi: 14 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 5, hi: 15 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 5, hi: 15 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 6, hi: 16 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 6, hi: 16 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 7, hi: 17 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 7, hi: 17 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 8, hi: 18 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 8, hi: 18 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 9, hi: 19 } });
      expect(getRowKeys(state.rows)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 9, hi: 19 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 10, hi: 20 } });
      const lastRowsInRange = state.rows
      expect(getRowKeys(lastRowsInRange)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(state.bufferIdx).toEqual({ lo: 10, hi: 20 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 11, hi: 21 } });
      expect(state.rows === lastRowsInRange).toBe(true);
      expect(state.keys.free.length).toEqual(1);
      expect(state.bufferIdx).toEqual({ lo: 11, hi: 20 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 15, hi: 25 } });
      expect(state.rows === lastRowsInRange).toBe(true);
      expect(state.keys.free.length).toEqual(5);
      expect(state.bufferIdx).toEqual({ lo: 15, hi: 20 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 20, hi: 30 } });
      expect(state.rows === lastRowsInRange).toBe(true);
      expect(state.keys.free.length).toEqual(10);
      expect(state.bufferIdx).toEqual({ lo: 0, hi: 0 });

    });
  })


  describe('FWD scrolling', () => {

    test('scroll 1 row', () => {

      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1000, rows });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1, hi: 11 } });

      expect(state.dataRequired).toEqual(false);
      expect(state.buffer.length).toEqual(30);
      expect(state.bufferIdx).toEqual({ lo: 1, hi: 11 });

      const rowsOut = [
        [1, 1, 0, 0, 0, 'key-01'],
        [2, 2, 0, 0, 0, 'key-02'],
        [3, 3, 0, 0, 0, 'key-03'],
        [4, 4, 0, 0, 0, 'key-04'],
        [5, 5, 0, 0, 0, 'key-05'],
        [6, 6, 0, 0, 0, 'key-06'],
        [7, 7, 0, 0, 0, 'key-07'],
        [8, 8, 0, 0, 0, 'key-08'],
        [9, 9, 0, 0, 0, 'key-09'],
        [10, 0, 0, 0, 0, 'key-10'],
      ];

      expect(state.rows).toEqual(rowsOut);
      const rows1 = state.rows;

      // We wouldn't have requested data at this point, byt we should handle it anyway
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [30, 0, 0, 0, 0, 'key-30'],
        ]
      });

      expect(state.rows === rows1).toBe(true);
      expect(state.buffer.length).toEqual(31);

    })

    test('scroll 5 rows', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1000, rows });
      state = GridDataReducer(state, { type: 'range', range: { lo: 5, hi: 15 } });

      const rowsOut = [
        [5, 5, 0, 0, 0, 'key-05'],
        [6, 6, 0, 0, 0, 'key-06'],
        [7, 7, 0, 0, 0, 'key-07'],
        [8, 8, 0, 0, 0, 'key-08'],
        [9, 9, 0, 0, 0, 'key-09'],
        [10, 0, 0, 0, 0, 'key-10'],
        [11, 1, 0, 0, 0, 'key-11'],
        [12, 2, 0, 0, 0, 'key-12'],
        [13, 3, 0, 0, 0, 'key-13'],
        [14, 4, 0, 0, 0, 'key-14'],
      ];

      expect(state.bufferIdx).toEqual({ lo: 5, hi: 15 });
      expect(state.rows).toEqual(rowsOut);
      const rows1 = state.rows;

      state = GridDataReducer(state, {
        type: 'data', rowCount: 1000, rows: [
          [30, 0, 0, 0, 0, 'key-30'],
          [31, 0, 0, 0, 0, 'key-31'],
          [32, 0, 0, 0, 0, 'key-32'],
          [33, 0, 0, 0, 0, 'key-33'],
          [34, 0, 0, 0, 0, 'key-34'],
        ]
      });

      expect(state.buffer.length).toEqual(35);
      expect(state.rows === rows1).toBe(true);

    });

    test('scroll beyond current viewport', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1000, rows: getRows(0, 30) });

      const rowsOut = [
        [20, 0, 0, 0, 'key-020'],
        [21, 1, 0, 0, 'key-021'],
        [22, 2, 0, 0, 'key-022'],
        [23, 3, 0, 0, 'key-023'],
        [24, 4, 0, 0, 'key-024'],
        [25, 5, 0, 0, 'key-025'],
        [26, 6, 0, 0, 'key-026'],
        [27, 7, 0, 0, 'key-027'],
        [28, 8, 0, 0, 'key-028'],
        [29, 9, 0, 0, 'key-029']
      ];

      state = GridDataReducer(state, { type: 'range', range: { lo: 20, hi: 30 } });

      expect(state.buffer.length).toEqual(30);
      expect(state.rows).toEqual(rowsOut);
      expect(state.dataRequired).toEqual(true);
      expect(state.bufferIdx).toEqual({ lo: 20, hi: 30 });

      const rowsOut2 = state.rows;
      // This is purely a buffer top-up, so rows are unaffected
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: getRows(30, 50)
      });
      expect(state.rows === rowsOut2).toBe(true);
      expect(state.bufferIdx).toEqual({ lo: 20, hi: 30 });
      expect(state.buffer.length).toEqual(50);
    })

    test('scroll beyond current viewport and partially out of buffer', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1000, rows: getRows(0, 30) });

      const rowsOut1 = state.rows;
      // scroll 5 rows beyond current buffer
      state = GridDataReducer(state, { type: 'range', range: { lo: 25, hi: 35 } });

      // No buffer pruning yet, but buffer indices have shifted
      expect(state.dataRequired).toEqual(true);
      expect(state.buffer.length).toEqual(30);
      expect(state.bufferIdx).toEqual({ lo: 25, hi: 30 });

      // if we can't fill the full request from buffer we return existing rows, so will not render
      expect(state.rows === rowsOut1).toBe(true);

      state = GridDataReducer(state, {
        type: 'data', rowCount: 1000, rows: getRows(30, 55)
      });

      expect(state.bufferIdx).toEqual({ lo: 20, hi: 30 });
      expect(state.buffer.length).toBe(50);
      expect(state.dataRequired).toEqual(false);
      expect(state.rows).toEqual([
        [25, 0, 0, 0, 'key-025'],
        [26, 1, 0, 0, 'key-026'],
        [27, 2, 0, 0, 'key-027'],
        [28, 3, 0, 0, 'key-028'],
        [29, 4, 0, 0, 'key-029'],
        [30, 5, 0, 0, 'key-030'],
        [31, 6, 0, 0, 'key-031'],
        [32, 7, 0, 0, 'key-032'],
        [33, 8, 0, 0, 'key-033'],
        [34, 9, 0, 0, 'key-034']
      ]);


    });

    test('jump ahead, then again', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 100, range: { lo: 0, hi: 20 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: getRows(0, 120) });
      expect(state.buffer.length).toEqual(120);
      expect(state.dataRequired).toEqual(false);
      expect(state.bufferIdx).toEqual({ lo: 0, hi: 20 });

      // jump beyond buffer
      state = GridDataReducer(state, { type: 'range', range: { lo: 243, hi: 263 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: getRows(143, 363) });

      expect(state.buffer.length).toEqual(220);
      expect(state.dataRequired).toEqual(false);
      expect(state.bufferIdx).toEqual({ lo: 100, hi: 120 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 637, hi: 657 } });

      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: getRows(537, 757) });

      expect(state.buffer.length).toEqual(220);
      expect(state.dataRequired).toEqual(false);
      expect(state.bufferIdx).toEqual({ lo: 100, hi: 120 });

      expect(state.rows).toEqual([
        [637, 0, 0, 0, 'key-637'],
        [638, 1, 0, 0, 'key-638'],
        [639, 2, 0, 0, 'key-639'],
        [640, 3, 0, 0, 'key-640'],
        [641, 4, 0, 0, 'key-641'],
        [642, 5, 0, 0, 'key-642'],
        [643, 6, 0, 0, 'key-643'],
        [644, 7, 0, 0, 'key-644'],
        [645, 8, 0, 0, 'key-645'],
        [646, 9, 0, 0, 'key-646'],
        [647, 10, 0, 0, 'key-647'],
        [648, 11, 0, 0, 'key-648'],
        [649, 12, 0, 0, 'key-649'],
        [650, 13, 0, 0, 'key-650'],
        [651, 14, 0, 0, 'key-651'],
        [652, 15, 0, 0, 'key-652'],
        [653, 16, 0, 0, 'key-653'],
        [654, 17, 0, 0, 'key-654'],
        [655, 18, 0, 0, 'key-655'],
        [656, 19, 0, 0, 'key-656']
      ]);
    });

    test('jump ahead, then back', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 100, range: { lo: 0, hi: 20 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: getRows(0, 120) });
      // Jump to a position near end of dataset
      state = GridDataReducer(state, { type: 'range', range: { lo: 978, hi: 998 } });
      expect(state.buffer.length).toEqual(120);
      expect(state.dataRequired).toEqual(true);
      expect(state.bufferIdx).toEqual({ lo: 0, hi: 0 });

      // Fetch data for new range
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: getRows(878, 1098) });
      expect(state.buffer.length).toEqual(220);
      expect(state.dataRequired).toEqual(false);
      expect(state.bufferIdx).toEqual({ lo: 100, hi: 120 });

      // Jump back to near beginning of dataset
      state = GridDataReducer(state, { type: 'range', range: { lo: 28, hi: 48 } });
      expect(state.buffer.length).toEqual(220);
      expect(state.bufferIdx).toEqual({ lo: 0, hi: 0 });
      expect(state.dataRequired).toEqual(true);

      // Fetch data for this range
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: getRows(0, 148) });
      expect(state.buffer.length).toBe(148);
      expect(state.dataRequired).toEqual(false);
      expect(state.bufferIdx).toEqual({ lo: 28, hi: 48 });

      expect(state.rows).toEqual([
        [28, 0, 0, 0, 'key-028'],
        [29, 1, 0, 0, 'key-029'],
        [30, 2, 0, 0, 'key-030'],
        [31, 3, 0, 0, 'key-031'],
        [32, 4, 0, 0, 'key-032'],
        [33, 5, 0, 0, 'key-033'],
        [34, 6, 0, 0, 'key-034'],
        [35, 7, 0, 0, 'key-035'],
        [36, 8, 0, 0, 'key-036'],
        [37, 9, 0, 0, 'key-037'],
        [38, 10, 0, 0, 'key-038'],
        [39, 11, 0, 0, 'key-039'],
        [40, 12, 0, 0, 'key-040'],
        [41, 13, 0, 0, 'key-041'],
        [42, 14, 0, 0, 'key-042'],
        [43, 15, 0, 0, 'key-043'],
        [44, 16, 0, 0, 'key-044'],
        [45, 17, 0, 0, 'key-045'],
        [46, 18, 0, 0, 'key-046'],
        [47, 19, 0, 0, 'key-047']
      ]);

    });


    test('jump to end', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(0, 30) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 90, hi: 100 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(70, 100) });

      expect(state.buffer.length).toBe(30);
      expect(state.rows).toEqual([
        [90, 0, 0, 0, 'key-090'],
        [91, 1, 0, 0, 'key-091'],
        [92, 2, 0, 0, 'key-092'],
        [93, 3, 0, 0, 'key-093'],
        [94, 4, 0, 0, 'key-094'],
        [95, 5, 0, 0, 'key-095'],
        [96, 6, 0, 0, 'key-096'],
        [97, 7, 0, 0, 'key-097'],
        [98, 8, 0, 0, 'key-098'],
        [99, 9, 0, 0, 'key-099']
      ]);
    });
  });

  describe('FWD scrolling with renderBuffer', () => {

    test('scroll 1 row', () => {

      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1000, rows });

      state = GridDataReducer(state, { type: 'range', range: { lo: 1, hi: 11 } });

      expect(state.dataRequired).toEqual(false);
      expect(state.buffer.length).toEqual(30);
      expect(state.bufferIdx).toEqual({ lo: 1, hi: 11 });

      const rowsOut = [
        [1, 1, 0, 0, 0, 'key-01'],
        [2, 2, 0, 0, 0, 'key-02'],
        [3, 3, 0, 0, 0, 'key-03'],
        [4, 4, 0, 0, 0, 'key-04'],
        [5, 5, 0, 0, 0, 'key-05'],
        [6, 6, 0, 0, 0, 'key-06'],
        [7, 7, 0, 0, 0, 'key-07'],
        [8, 8, 0, 0, 0, 'key-08'],
        [9, 9, 0, 0, 0, 'key-09'],
        [10, 0, 0, 0, 0, 'key-10'],
      ];

      expect(state.rows).toEqual(rowsOut);
      const rows1 = state.rows;

      // We wouldn't have requested data at this point, byt we should handle it anyway
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [30, 0, 0, 0, 0, 'key-30'],
        ]
      });

      expect(state.rows === rows1).toBe(true);
      expect(state.buffer.length).toEqual(31);

    })

  });

  describe('BWD scrolling', () => {

    test(`scroll back 1 row`, () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(0, 30) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 90, hi: 100 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(70, 100) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 89, hi: 99 } });
      expect(state.rows).toEqual([
        [89, 9, 0, 0, 'key-089'],
        [90, 0, 0, 0, 'key-090'],
        [91, 1, 0, 0, 'key-091'],
        [92, 2, 0, 0, 'key-092'],
        [93, 3, 0, 0, 'key-093'],
        [94, 4, 0, 0, 'key-094'],
        [95, 5, 0, 0, 'key-095'],
        [96, 6, 0, 0, 'key-096'],
        [97, 7, 0, 0, 'key-097'],
        [98, 8, 0, 0, 'key-098']]);

    });

    test(`scroll back 5 row`, () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(0, 30) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 90, hi: 100 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(70, 100) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 85, hi: 95 } });
      expect(state.dataRequired).toBe(false);
      expect(state.buffer.length).toBe(30);
      expect(state.rows).toEqual([
        [85, 5, 0, 0, 'key-085'],
        [86, 6, 0, 0, 'key-086'],
        [87, 7, 0, 0, 'key-087'],
        [88, 8, 0, 0, 'key-088'],
        [89, 9, 0, 0, 'key-089'],
        [90, 0, 0, 0, 'key-090'],
        [91, 1, 0, 0, 'key-091'],
        [92, 2, 0, 0, 'key-092'],
        [93, 3, 0, 0, 'key-093'],
        [94, 4, 0, 0, 'key-094']
      ]);
    });

    test(`scroll beyond buffer threshold`, () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(0, 30) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 90, hi: 100 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(70, 100) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 83, hi: 93 } });
      expect(state.dataRequired).toBe(false);
      expect(state.buffer.length).toBe(30);

      state = GridDataReducer(state, { type: 'range', range: { lo: 78, hi: 88 } });
      expect(state.dataRequired).toBe(true);
      expect(state.buffer.length).toBe(30);
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(58, 70) });
      expect(state.dataRequired).toBe(false);
      expect(state.buffer.length).toBe(42);

    })

    test(`scroll beyond viewport`, () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(0, 30) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 90, hi: 100 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 100, rows: getRows(70, 100) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 79, hi: 89 } });

      expect(state.rows).toEqual([
        [79, 0, 0, 0, 'key-079'],
        [80, 1, 0, 0, 'key-080'],
        [81, 2, 0, 0, 'key-081'],
        [82, 3, 0, 0, 'key-082'],
        [83, 4, 0, 0, 'key-083'],
        [84, 5, 0, 0, 'key-084'],
        [85, 6, 0, 0, 'key-085'],
        [86, 7, 0, 0, 'key-086'],
        [87, 8, 0, 0, 'key-087'],
        [88, 9, 0, 0, 'key-088']
      ]);
    })


  })


  describe('growing the range', () => {

    test('first few rows', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1000, rows });

      state = GridDataReducer(state, { type: 'range', range: { lo: 0, hi: 11 } });
      expect(state.rows).toEqual([
        [0, 0, 0, 0, 0, 'key-00'],
        [1, 1, 0, 0, 0, 'key-01'],
        [2, 2, 0, 0, 0, 'key-02'],
        [3, 3, 0, 0, 0, 'key-03'],
        [4, 4, 0, 0, 0, 'key-04'],
        [5, 5, 0, 0, 0, 'key-05'],
        [6, 6, 0, 0, 0, 'key-06'],
        [7, 7, 0, 0, 0, 'key-07'],
        [8, 8, 0, 0, 0, 'key-08'],
        [9, 9, 0, 0, 0, 'key-09'],
        [10, 10, 0, 0, 0, 'key-10']
      ]);

      state = GridDataReducer(state, { type: 'range', range: { lo: 0, hi: 13 } });

      expect(state.rows).toEqual([
        [0, 0, 0, 0, 0, 'key-00'],
        [1, 1, 0, 0, 0, 'key-01'],
        [2, 2, 0, 0, 0, 'key-02'],
        [3, 3, 0, 0, 0, 'key-03'],
        [4, 4, 0, 0, 0, 'key-04'],
        [5, 5, 0, 0, 0, 'key-05'],
        [6, 6, 0, 0, 0, 'key-06'],
        [7, 7, 0, 0, 0, 'key-07'],
        [8, 8, 0, 0, 0, 'key-08'],
        [9, 9, 0, 0, 0, 'key-09'],
        [10, 10, 0, 0, 0, 'key-10'],
        [11, 11, 0, 0, 0, 'key-11'],
        [12, 12, 0, 0, 0, 'key-12']
      ]);

      state = GridDataReducer(state, { type: 'range', range: { lo: 0, hi: 16 } });
      expect(state.dataRequired).toEqual(false);

      expect(state.rows).toEqual([
        [0, 0, 0, 0, 0, 'key-00'],
        [1, 1, 0, 0, 0, 'key-01'],
        [2, 2, 0, 0, 0, 'key-02'],
        [3, 3, 0, 0, 0, 'key-03'],
        [4, 4, 0, 0, 0, 'key-04'],
        [5, 5, 0, 0, 0, 'key-05'],
        [6, 6, 0, 0, 0, 'key-06'],
        [7, 7, 0, 0, 0, 'key-07'],
        [8, 8, 0, 0, 0, 'key-08'],
        [9, 9, 0, 0, 0, 'key-09'],
        [10, 10, 0, 0, 0, 'key-10'],
        [11, 11, 0, 0, 0, 'key-11'],
        [12, 12, 0, 0, 0, 'key-12'],
        [13, 13, 0, 0, 0, 'key-13'],
        [14, 14, 0, 0, 0, 'key-14'],
        [15, 15, 0, 0, 0, 'key-15']
      ]);

      state = GridDataReducer(state, { type: 'range', range: { lo: 0, hi: 21 } });
      expect(state.dataRequired).toEqual(true);
    })
  })

  describe('buffer pruning', () => {

    test('no buffer pruning until buffer is filled', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 10 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1000, rows });
      state = GridDataReducer(state, { type: 'range', range: { lo: 5, hi: 15 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [30, 0, 0, 0, 0, 'key-30'],
          [31, 0, 0, 0, 0, 'key-31'],
          [32, 0, 0, 0, 0, 'key-32'],
          [33, 0, 0, 0, 0, 'key-33'],
          [34, 0, 0, 0, 0, 'key-34'],
        ]
      });
      expect(state.buffer.length).toEqual(35);
      state = GridDataReducer(state, { type: 'range', range: { lo: 15, hi: 25 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [35, 0, 0, 0, 0, 'key-35'],
          [36, 0, 0, 0, 0, 'key-36'],
          [37, 0, 0, 0, 0, 'key-37'],
          [38, 0, 0, 0, 0, 'key-38'],
          [39, 0, 0, 0, 0, 'key-39'],
          [40, 0, 0, 0, 0, 'key-40'],
          [41, 0, 0, 0, 0, 'key-41'],
          [42, 0, 0, 0, 0, 'key-42'],
          [43, 0, 0, 0, 0, 'key-43'],
          [44, 0, 0, 0, 0, 'key-44'],
        ]
      });
      expect(state.buffer.length).toEqual(45);
      state = GridDataReducer(state, { type: 'range', range: { lo: 20, hi: 30 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [45, 0, 0, 0, 0, 'key-45'],
          [46, 0, 0, 0, 0, 'key-46'],
          [47, 0, 0, 0, 0, 'key-47'],
          [48, 0, 0, 0, 0, 'key-48'],
          [49, 0, 0, 0, 0, 'key-49'],
        ]
      });
      expect(state.buffer.length).toEqual(50);
      state = GridDataReducer(state, { type: 'range', range: { lo: 25, hi: 35 } });
      expect(state.buffer.length).toEqual(50)

      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [50, 0, 0, 0, 0, 'key-50'],
          [51, 0, 0, 0, 0, 'key-51'],
          [52, 0, 0, 0, 0, 'key-52'],
          [53, 0, 0, 0, 0, 'key-53'],
          [54, 0, 0, 0, 0, 'key-54'],
        ]
      });
      expect(state.buffer.length).toEqual(50)

      state = GridDataReducer(state, { type: 'range', range: { lo: 22, hi: 32 } });

      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [2, 0, 0, 0, 0, 'key-02'],
          [3, 0, 0, 0, 0, 'key-03'],
          [4, 0, 0, 0, 0, 'key-04'],
        ]
      });
      expect(state.buffer.length).toEqual(50);
      expect(uniqueKeys(state.rows)).toEqual(true);


    });

    test('scroll to end', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 20, range: { lo: 0, hi: 20 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 100, rows: getRows(0, 40) });

      state = GridDataReducer(state, { type: 'range', range: { lo: 3, hi: 23 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 16, hi: 36 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 100, rows: getRows(40, 56) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 46, hi: 66 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 100, rows: getRows(56, 86) });

      state = GridDataReducer(state, { type: 'range', range: { lo: 66, hi: 86 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 100, rows: getRows(86, 100) });

      state = GridDataReducer(state, { type: 'range', range: { lo: 70, hi: 90 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 75, hi: 95 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 80, hi: 100 } });

      expect(state.rows).toEqual([
        [80, 10, 0, 0, 'key-080'],
        [81, 11, 0, 0, 'key-081'],
        [82, 12, 0, 0, 'key-082'],
        [83, 13, 0, 0, 'key-083'],
        [84, 14, 0, 0, 'key-084'],
        [85, 15, 0, 0, 'key-085'],
        [86, 16, 0, 0, 'key-086'],
        [87, 17, 0, 0, 'key-087'],
        [88, 18, 0, 0, 'key-088'],
        [89, 19, 0, 0, 'key-089'],
        [90, 0, 0, 0, 'key-090'],
        [91, 1, 0, 0, 'key-091'],
        [92, 2, 0, 0, 'key-092'],
        [93, 3, 0, 0, 'key-093'],
        [94, 4, 0, 0, 'key-094'],
        [95, 5, 0, 0, 'key-095'],
        [96, 6, 0, 0, 'key-096'],
        [97, 7, 0, 0, 'key-097'],
        [98, 8, 0, 0, 'key-098'],
        [99, 9, 0, 0, 'key-099']]);

    });
  })

  describe('dataRequired', () => {

    test('no data required on snall scrolls', () => {

    })
  });

  describe('VUU type updates', () => {


    test('setRange before data arrives', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 0, range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 0, hi: 19 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [0, 0, 0, 0, "AAA.L", 0, null, null, null, null, "AAA.L", "AAA.L London PLC", "USD", "XLON/LSE-SETS", 633, 101, 121, "", "", "", "fastTick"],
          [1, 0, 0, 0, "AAA.N", 0, null, null, null, null, "AAA.N", "AAA.N Corporation", "EUR", "XNGS/NAS-GSM", 220, 914, 943.08, "", "", "", "fastTick"],
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 393, 435, 439.35, "", "", "", "noop"],
          [3, 0, 0, 0, "AAA.AS", 0, null, null, null, null, "AAA.AS", "AAA.AS B.V", "GBX", "XAMS/ENA-MAIN", 449, 60, 60, "", "", "", "walkBidAsk"],
          [4, 0, 0, 0, "AAB.L", 0, null, null, null, null, "AAB.L", "AAB.L London PLC", "GBX", "XLON/LSE-SETS", 37, 205, 207.05, "", "", "", "noop"],
          [5, 0, 0, 0, "AAB.N", 0, null, null, null, null, "AAB.N", "AAB.N Corporation", "CAD", "XNGS/NAS-GSM", 38, 89, 89, "", "", "", "walkBidAsk"],
          [6, 0, 0, 0, "AAB.OQ", 0, null, null, null, null, "AAB.OQ", "AAB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 286, 246, 248.46, "", "", "", "walkBidAsk"],
          [7, 0, 0, 0, "AAB.AS", 0, null, null, null, null, "AAB.AS", "AAB.AS B.V", "USD", "XAMS/ENA-MAIN", 364, 9, 9.09, "", "", "", "walkBidAsk"],
          [8, 0, 0, 0, "AAC.L", 0, null, null, null, null, "AAC.L", "AAC.L London PLC", "EUR", "XLON/LSE-SETS", 12, 72, 102, "", "", "", "fastTick"],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 927, 72, 102, "", "", "", "fastTick"],
          [10, 0, 0, 0, "AAC.OQ", 0, null, null, null, null, "AAC.OQ", "AAC.OQ Co.", "GBX", "XNYS/NYS-MAIN", 559, 704, 711.04, "", "", "", "fastTick"],
          [11, 0, 0, 0, "AAC.AS", 0, null, null, null, null, "AAC.AS", "AAC.AS B.V", "CAD", "XAMS/ENA-MAIN", 946, 655, 661.55, "", "", "", "walkBidAsk"],
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363, 166, 167.66, "", "", "", ""],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696, 166, 167.66, "", "", "", ""],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806, 13, 13, "", "", "", "walkBidAsk"],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44, 929, 938.29, "", "", "", ""],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226, 474, 478.74, "", "", "", "fastTick"],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54, 120, 140, "", "", "", "fastTick"],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618, 682, 688.82, "", "", "", "walkBidAsk"],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643, 245, 247.45, "", "", "", "walkBidAsk"],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690, 160, 181.23000000000002, "", "", "", "fastTick"],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623, 160, 181.23000000000002, "", "", "", "fastTick"],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167, 523, 528.23, "", "", "", ""],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410, 867, 875.67, "", "", "", "noop"],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"]
        ]
      });
      expect(state.buffer.length).toEqual(19);

      state = GridDataReducer(state, { type: 'range', range: { lo: 12, hi: 31 } });
      expect(state.buffer.length).toEqual(19);
      expect(state.dataRequired).toEqual(true);
      expect(state.bufferIdx).toEqual({ lo: 12, hi: 19 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 29, hi: 48 } });
      expect(state.dataRequired).toEqual(true);
      expect(state.buffer.length).toEqual(19);
      expect(state.bufferIdx).toEqual({ lo: 0, hi: 0 });



    });

    test('simple update', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 0, range: { lo: 0, hi: 26 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [0, 0, 0, 0, "AAA.L", 0, null, null, null, null, "AAA.L", "AAA.L London PLC", "USD", "XLON/LSE-SETS", 633, 101, 121, "", "", "", "fastTick"],
          [1, 0, 0, 0, "AAA.N", 0, null, null, null, null, "AAA.N", "AAA.N Corporation", "EUR", "XNGS/NAS-GSM", 220, 914, 943.08, "", "", "", "fastTick"],
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 393, 435, 439.35, "", "", "", "noop"],
          [3, 0, 0, 0, "AAA.AS", 0, null, null, null, null, "AAA.AS", "AAA.AS B.V", "GBX", "XAMS/ENA-MAIN", 449, 60, 60, "", "", "", "walkBidAsk"],
          [4, 0, 0, 0, "AAB.L", 0, null, null, null, null, "AAB.L", "AAB.L London PLC", "GBX", "XLON/LSE-SETS", 37, 205, 207.05, "", "", "", "noop"],
          [5, 0, 0, 0, "AAB.N", 0, null, null, null, null, "AAB.N", "AAB.N Corporation", "CAD", "XNGS/NAS-GSM", 38, 89, 89, "", "", "", "walkBidAsk"],
          [6, 0, 0, 0, "AAB.OQ", 0, null, null, null, null, "AAB.OQ", "AAB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 286, 246, 248.46, "", "", "", "walkBidAsk"],
          [7, 0, 0, 0, "AAB.AS", 0, null, null, null, null, "AAB.AS", "AAB.AS B.V", "USD", "XAMS/ENA-MAIN", 364, 9, 9.09, "", "", "", "walkBidAsk"],
          [8, 0, 0, 0, "AAC.L", 0, null, null, null, null, "AAC.L", "AAC.L London PLC", "EUR", "XLON/LSE-SETS", 12, 72, 102, "", "", "", "fastTick"],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 927, 72, 102, "", "", "", "fastTick"],
          [10, 0, 0, 0, "AAC.OQ", 0, null, null, null, null, "AAC.OQ", "AAC.OQ Co.", "GBX", "XNYS/NYS-MAIN", 559, 704, 711.04, "", "", "", "fastTick"],
          [11, 0, 0, 0, "AAC.AS", 0, null, null, null, null, "AAC.AS", "AAC.AS B.V", "CAD", "XAMS/ENA-MAIN", 946, 655, 661.55, "", "", "", "walkBidAsk"],
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363, 166, 167.66, "", "", "", ""],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696, 166, 167.66, "", "", "", ""],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806, 13, 13, "", "", "", "walkBidAsk"],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44, 929, 938.29, "", "", "", ""],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226, 474, 478.74, "", "", "", "fastTick"],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54, 120, 140, "", "", "", "fastTick"],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618, 682, 688.82, "", "", "", "walkBidAsk"],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643, 245, 247.45, "", "", "", "walkBidAsk"],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690, 160, 181.23000000000002, "", "", "", "fastTick"],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623, 160, 181.23000000000002, "", "", "", "fastTick"],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167, 523, 528.23, "", "", "", ""],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410, 867, 875.67, "", "", "", "noop"],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"]
        ]
      });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 500, 435, 439.35, "", "", "", "noop"],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 1000, 72, 102, "", "", "", "fastTick"],
        ]
      });

      expect(state.buffer[2]).toEqual(
        [2, 2, 0, 0, 'AAA.OQ', 0, null, null, null, null, 'AAA.OQ', 'AAA.OQ Co.', 'EUR', 'XNYS/NYS-MAIN', 500, 435, 439.35, '', '', '', 'noop']
      );
      expect(state.buffer[9]).toEqual(
        [9, 9, 0, 0, 'AAC.N', 0, null, null, null, null, 'AAC.N', 'AAC.N Corporation', 'CAD', 'XNGS/NAS-GSM', 1000, 72, 102, '', '', '', 'fastTick']
      );

    })
    test('mismatched ranges I', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 0, range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [0, 0, 0, 0, "AAA.L", 0, null, null, null, null, "AAA.L", "AAA.L London PLC", "USD", "XLON/LSE-SETS", 633, 101, 121, "", "", "", "fastTick"],
          [1, 0, 0, 0, "AAA.N", 0, null, null, null, null, "AAA.N", "AAA.N Corporation", "EUR", "XNGS/NAS-GSM", 220, 914, 943.08, "", "", "", "fastTick"],
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 393, 435, 439.35, "", "", "", "noop"],
          [3, 0, 0, 0, "AAA.AS", 0, null, null, null, null, "AAA.AS", "AAA.AS B.V", "GBX", "XAMS/ENA-MAIN", 449, 60, 60, "", "", "", "walkBidAsk"],
          [4, 0, 0, 0, "AAB.L", 0, null, null, null, null, "AAB.L", "AAB.L London PLC", "GBX", "XLON/LSE-SETS", 37, 205, 207.05, "", "", "", "noop"],
          [5, 0, 0, 0, "AAB.N", 0, null, null, null, null, "AAB.N", "AAB.N Corporation", "CAD", "XNGS/NAS-GSM", 38, 89, 89, "", "", "", "walkBidAsk"],
          [6, 0, 0, 0, "AAB.OQ", 0, null, null, null, null, "AAB.OQ", "AAB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 286, 246, 248.46, "", "", "", "walkBidAsk"],
          [7, 0, 0, 0, "AAB.AS", 0, null, null, null, null, "AAB.AS", "AAB.AS B.V", "USD", "XAMS/ENA-MAIN", 364, 9, 9.09, "", "", "", "walkBidAsk"],
          [8, 0, 0, 0, "AAC.L", 0, null, null, null, null, "AAC.L", "AAC.L London PLC", "EUR", "XLON/LSE-SETS", 12, 72, 102, "", "", "", "fastTick"],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 927, 72, 102, "", "", "", "fastTick"],
          [10, 0, 0, 0, "AAC.OQ", 0, null, null, null, null, "AAC.OQ", "AAC.OQ Co.", "GBX", "XNYS/NYS-MAIN", 559, 704, 711.04, "", "", "", "fastTick"],
          [11, 0, 0, 0, "AAC.AS", 0, null, null, null, null, "AAC.AS", "AAC.AS B.V", "CAD", "XAMS/ENA-MAIN", 946, 655, 661.55, "", "", "", "walkBidAsk"],
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363, 166, 167.66, "", "", "", ""],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696, 166, 167.66, "", "", "", ""],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806, 13, 13, "", "", "", "walkBidAsk"],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44, 929, 938.29, "", "", "", ""],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226, 474, 478.74, "", "", "", "fastTick"],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54, 120, 140, "", "", "", "fastTick"],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618, 682, 688.82, "", "", "", "walkBidAsk"],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643, 245, 247.45, "", "", "", "walkBidAsk"],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690, 160, 181.23000000000002, "", "", "", "fastTick"],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623, 160, 181.23000000000002, "", "", "", "fastTick"],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167, 523, 528.23, "", "", "", ""],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410, 867, 875.67, "", "", "", "noop"],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 31, hi: 56 } });

      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [0, 0, 0, 0, "AAA.L", 0, null, null, null, null, "AAA.L", "AAA.L London PLC", "USD", "XLON/LSE-SETS", 633, 101, 121, "", "", "", "fastTick"],
          [1, 0, 0, 0, "AAA.N", 0, null, null, null, null, "AAA.N", "AAA.N Corporation", "EUR", "XNGS/NAS-GSM", 220, 914, 943.08, "", "", "", "fastTick"],
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 393, 435, 439.35, "", "", "", "noop"],
          [3, 0, 0, 0, "AAA.AS", 0, null, null, null, null, "AAA.AS", "AAA.AS B.V", "GBX", "XAMS/ENA-MAIN", 449, 60, 60, "", "", "", "walkBidAsk"],
          [4, 0, 0, 0, "AAB.L", 0, null, null, null, null, "AAB.L", "AAB.L London PLC", "GBX", "XLON/LSE-SETS", 37, 205, 207.05, "", "", "", "noop"],
          [5, 0, 0, 0, "AAB.N", 0, null, null, null, null, "AAB.N", "AAB.N Corporation", "CAD", "XNGS/NAS-GSM", 38, 89, 89, "", "", "", "walkBidAsk"],
          [6, 0, 0, 0, "AAB.OQ", 0, null, null, null, null, "AAB.OQ", "AAB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 286, 246, 248.46, "", "", "", "walkBidAsk"],
          [7, 0, 0, 0, "AAB.AS", 0, null, null, null, null, "AAB.AS", "AAB.AS B.V", "USD", "XAMS/ENA-MAIN", 364, 9, 9.09, "", "", "", "walkBidAsk"],
          [8, 0, 0, 0, "AAC.L", 0, null, null, null, null, "AAC.L", "AAC.L London PLC", "EUR", "XLON/LSE-SETS", 12, 72, 102, "", "", "", "fastTick"],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 927, 72, 102, "", "", "", "fastTick"],
          [10, 0, 0, 0, "AAC.OQ", 0, null, null, null, null, "AAC.OQ", "AAC.OQ Co.", "GBX", "XNYS/NYS-MAIN", 559, 704, 711.04, "", "", "", "fastTick"],
          [11, 0, 0, 0, "AAC.AS", 0, null, null, null, null, "AAC.AS", "AAC.AS B.V", "CAD", "XAMS/ENA-MAIN", 946, 655, 661.55, "", "", "", "walkBidAsk"],
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363, 166, 167.66, "", "", "", ""],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696, 166, 167.66, "", "", "", ""],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806, 13, 13, "", "", "", "walkBidAsk"],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44, 929, 938.29, "", "", "", ""],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226, 474, 478.74, "", "", "", "fastTick"],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54, 120, 140, "", "", "", "fastTick"],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618, 682, 688.82, "", "", "", "walkBidAsk"],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643, 245, 247.45, "", "", "", "walkBidAsk"],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690, 160, 181.23000000000002, "", "", "", "fastTick"],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623, 160, 181.23000000000002, "", "", "", "fastTick"],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167, 523, 528.23, "", "", "", ""],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410, 867, 875.67, "", "", "", "noop"],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [25, 0, 0, 0, "AAG.N", 0, null, null, null, null, "AAG.N", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [26, 0, 0, 0, "AAG.OQ", 0, null, null, null, null, "AAG.OQ", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [27, 0, 0, 0, "AAG.AS", 0, null, null, null, null, "AAG.AS", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [28, 0, 0, 0, "AAH.L", 0, null, null, null, null, "AAH.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [29, 0, 0, 0, "AAH.N", 0, null, null, null, null, "AAH.N", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [30, 0, 0, 0, "AAH.OQ", 0, null, null, null, null, "AAH.OQ", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [31, 0, 0, 0, "AAH.AS", 0, null, null, null, null, "AAH.AS", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [32, 0, 0, 0, "AAI.L", 0, null, null, null, null, "AAI.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
        ]
      });

      expect(state.buffer.length).toEqual(2);

    });

    test('mismatched ranges II', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 0, range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [0, 0, 0, 0, "AAA.L", 0, null, null, null, null, "AAA.L", "AAA.L London PLC", "USD", "XLON/LSE-SETS", 633, 101, 121, "", "", "", "fastTick"],
          [1, 0, 0, 0, "AAA.N", 0, null, null, null, null, "AAA.N", "AAA.N Corporation", "EUR", "XNGS/NAS-GSM", 220, 914, 943.08, "", "", "", "fastTick"],
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 393, 435, 439.35, "", "", "", "noop"],
          [3, 0, 0, 0, "AAA.AS", 0, null, null, null, null, "AAA.AS", "AAA.AS B.V", "GBX", "XAMS/ENA-MAIN", 449, 60, 60, "", "", "", "walkBidAsk"],
          [4, 0, 0, 0, "AAB.L", 0, null, null, null, null, "AAB.L", "AAB.L London PLC", "GBX", "XLON/LSE-SETS", 37, 205, 207.05, "", "", "", "noop"],
          [5, 0, 0, 0, "AAB.N", 0, null, null, null, null, "AAB.N", "AAB.N Corporation", "CAD", "XNGS/NAS-GSM", 38, 89, 89, "", "", "", "walkBidAsk"],
          [6, 0, 0, 0, "AAB.OQ", 0, null, null, null, null, "AAB.OQ", "AAB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 286, 246, 248.46, "", "", "", "walkBidAsk"],
          [7, 0, 0, 0, "AAB.AS", 0, null, null, null, null, "AAB.AS", "AAB.AS B.V", "USD", "XAMS/ENA-MAIN", 364, 9, 9.09, "", "", "", "walkBidAsk"],
          [8, 0, 0, 0, "AAC.L", 0, null, null, null, null, "AAC.L", "AAC.L London PLC", "EUR", "XLON/LSE-SETS", 12, 72, 102, "", "", "", "fastTick"],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 927, 72, 102, "", "", "", "fastTick"],
          [10, 0, 0, 0, "AAC.OQ", 0, null, null, null, null, "AAC.OQ", "AAC.OQ Co.", "GBX", "XNYS/NYS-MAIN", 559, 704, 711.04, "", "", "", "fastTick"],
          [11, 0, 0, 0, "AAC.AS", 0, null, null, null, null, "AAC.AS", "AAC.AS B.V", "CAD", "XAMS/ENA-MAIN", 946, 655, 661.55, "", "", "", "walkBidAsk"],
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363, 166, 167.66, "", "", "", ""],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696, 166, 167.66, "", "", "", ""],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806, 13, 13, "", "", "", "walkBidAsk"],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44, 929, 938.29, "", "", "", ""],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226, 474, 478.74, "", "", "", "fastTick"],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54, 120, 140, "", "", "", "fastTick"],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618, 682, 688.82, "", "", "", "walkBidAsk"],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643, 245, 247.45, "", "", "", "walkBidAsk"],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690, 160, 181.23000000000002, "", "", "", "fastTick"],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623, 160, 181.23000000000002, "", "", "", "fastTick"],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167, 523, 528.23, "", "", "", ""],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410, 867, 875.67, "", "", "", "noop"],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 2, hi: 21 } });

      state = GridDataReducer(state, { type: 'range', range: { lo: 6, hi: 25 } });

      state = GridDataReducer(state, { type: 'range', range: { lo: 11, hi: 30 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 393, 435, 439.35, "", "", "", "noop"],
          [3, 0, 0, 0, "AAA.AS", 0, null, null, null, null, "AAA.AS", "AAA.AS B.V", "GBX", "XAMS/ENA-MAIN", 449, 60, 60, "", "", "", "walkBidAsk"],
          [4, 0, 0, 0, "AAB.L", 0, null, null, null, null, "AAB.L", "AAB.L London PLC", "GBX", "XLON/LSE-SETS", 37, 205, 207.05, "", "", "", "noop"],
          [5, 0, 0, 0, "AAB.N", 0, null, null, null, null, "AAB.N", "AAB.N Corporation", "CAD", "XNGS/NAS-GSM", 38, 89, 89, "", "", "", "walkBidAsk"],
          [6, 0, 0, 0, "AAB.OQ", 0, null, null, null, null, "AAB.OQ", "AAB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 286, 246, 248.46, "", "", "", "walkBidAsk"],
          [7, 0, 0, 0, "AAB.AS", 0, null, null, null, null, "AAB.AS", "AAB.AS B.V", "USD", "XAMS/ENA-MAIN", 364, 9, 9.09, "", "", "", "walkBidAsk"],
          [8, 0, 0, 0, "AAC.L", 0, null, null, null, null, "AAC.L", "AAC.L London PLC", "EUR", "XLON/LSE-SETS", 12, 72, 102, "", "", "", "fastTick"],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 927, 72, 102, "", "", "", "fastTick"],
          [10, 0, 0, 0, "AAC.OQ", 0, null, null, null, null, "AAC.OQ", "AAC.OQ Co.", "GBX", "XNYS/NYS-MAIN", 559, 704, 711.04, "", "", "", "fastTick"],
          [11, 0, 0, 0, "AAC.AS", 0, null, null, null, null, "AAC.AS", "AAC.AS B.V", "CAD", "XAMS/ENA-MAIN", 946, 655, 661.55, "", "", "", "walkBidAsk"],
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363, 166, 167.66, "", "", "", ""],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696, 166, 167.66, "", "", "", ""],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806, 13, 13, "", "", "", "walkBidAsk"],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44, 929, 938.29, "", "", "", ""],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226, 474, 478.74, "", "", "", "fastTick"],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54, 120, 140, "", "", "", "fastTick"],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618, 682, 688.82, "", "", "", "walkBidAsk"],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643, 245, 247.45, "", "", "", "walkBidAsk"],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690, 160, 181.23000000000002, "", "", "", "fastTick"],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623, 160, 181.23000000000002, "", "", "", "fastTick"],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167, 523, 528.23, "", "", "", ""],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410, 867, 875.67, "", "", "", "noop"],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [25, 0, 0, 0, "AAG.N", 0, null, null, null, null, "AAG.N", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [26, 0, 0, 0, "AAG.OQ", 0, null, null, null, null, "AAG.OQ", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [27, 0, 0, 0, "AAG.AS", 0, null, null, null, null, "AAG.AS", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [28, 0, 0, 0, "AAH.L", 0, null, null, null, null, "AAH.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
          [29, 0, 0, 0, "AAH.N", 0, null, null, null, null, "AAH.N", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928, 690, 696.9, "", "", "", "walkBidAsk"],
        ]
      });

      expect(state.buffer.length).toEqual(19);

    })
  })

  describe('VUU Scrolling', () => {

    test('Scrolling FWD from top, then BWD, many scolls before data response', () => {
      let state = GridDataReducer(undefined, { type: 'clear', size: 1000, bufferSize: 10, range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [0, 0, 0, 0, "AAA.L", 0, null, null, null, null, "AAA.L", "AAA.L London PLC", "USD", "XLON/LSE-SETS", 633],
          [1, 0, 0, 0, "AAA.N", 0, null, null, null, null, "AAA.N", "AAA.N Corporation", "EUR", "XNGS/NAS-GSM", 220],
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 393],
          [3, 0, 0, 0, "AAA.AS", 0, null, null, null, null, "AAA.AS", "AAA.AS B.V", "GBX", "XAMS/ENA-MAIN", 449],
          [4, 0, 0, 0, "AAB.L", 0, null, null, null, null, "AAB.L", "AAB.L London PLC", "GBX", "XLON/LSE-SETS", 37],
          [5, 0, 0, 0, "AAB.N", 0, null, null, null, null, "AAB.N", "AAB.N Corporation", "CAD", "XNGS/NAS-GSM", 38],
          [6, 0, 0, 0, "AAB.OQ", 0, null, null, null, null, "AAB.OQ", "AAB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 286],
          [7, 0, 0, 0, "AAB.AS", 0, null, null, null, null, "AAB.AS", "AAB.AS B.V", "USD", "XAMS/ENA-MAIN", 364],
          [8, 0, 0, 0, "AAC.L", 0, null, null, null, null, "AAC.L", "AAC.L London PLC", "EUR", "XLON/LSE-SETS", 12],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 927],
          [10, 0, 0, 0, "AAC.OQ", 0, null, null, null, null, "AAC.OQ", "AAC.OQ Co.", "GBX", "XNYS/NYS-MAIN", 559],
          [11, 0, 0, 0, "AAC.AS", 0, null, null, null, null, "AAC.AS", "AAC.AS B.V", "CAD", "XAMS/ENA-MAIN", 946],
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928]
        ]
      });
      state = GridDataReducer(state, { type: 'range', range: { lo: 6, hi: 31 } });     // server request 0:41
      state = GridDataReducer(state, { type: 'range', range: { lo: 13, hi: 38 } });    // server request 3:48
      state = GridDataReducer(state, { type: 'range', range: { lo: 18, hi: 43 } });   // server erquest 8:53
      state = GridDataReducer(state, { type: 'range', range: { lo: 28, hi: 53 } });   // server request 18:63
      state = GridDataReducer(state, { type: 'range', range: { lo: 37, hi: 62 } });   // server request 27:72
      state = GridDataReducer(state, { type: 'range', range: { lo: 45, hi: 70 } });   // server request 35:80
      state = GridDataReducer(state, { type: 'range', range: { lo: 53, hi: 78 } });   // server erquest 43:88
      state = GridDataReducer(state, { type: 'range', range: { lo: 60, hi: 85 } });    // server request 50:95
      state = GridDataReducer(state, { type: 'range', range: { lo: 66, hi: 91 } });    // server request 56:101
      state = GridDataReducer(state, { type: 'range', range: { lo: 72, hi: 97 } });    // server request 62:108
      state = GridDataReducer(state, { type: 'range', range: { lo: 76, hi: 101 } });  // server request 66:111

      // This set of rows is already out of range so will be ignored
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928],
          [25, 0, 0, 0, "AAG.N", 0, null, null, null, null, "AAG.N", "AAG.N Corporation", "GBX", "XNGS/NAS-GSM", 900],
          [26, 0, 0, 0, "AAG.OQ", 0, null, null, null, null, "AAG.OQ", "AAG.OQ Co.", "CAD", "XNYS/NYS-MAIN", 896],
          [27, 0, 0, 0, "AAG.AS", 0, null, null, null, null, "AAG.AS", "AAG.AS B.V", "USD", "XAMS/ENA-MAIN", 934],
          [28, 0, 0, 0, "AAH.L", 0, null, null, null, null, "AAH.L", "AAH.L London PLC", "USD", "XLON/LSE-SETS", 553],
          [29, 0, 0, 0, "AAH.N", 0, null, null, null, null, "AAH.N", "AAH.N Corporation", "EUR", "XNGS/NAS-GSM", 879],
          [30, 0, 0, 0, "AAH.OQ", 0, null, null, null, null, "AAH.OQ", "AAH.OQ Co.", "GBX", "XNYS/NYS-MAIN", 943],
          [31, 0, 0, 0, "AAH.AS", 0, null, null, null, null, "AAH.AS", "AAH.AS B.V", "GBX", "XAMS/ENA-MAIN", 303],
          [32, 0, 0, 0, "AAI.L", 0, null, null, null, null, "AAI.L", "AAI.L London PLC", "CAD", "XLON/LSE-SETS", 430],
          [33, 0, 0, 0, "AAI.N", 0, null, null, null, null, "AAI.N", "AAI.N Corporation", "EUR", "XNGS/NAS-GSM", 628],
          [34, 0, 0, 0, "AAI.OQ", 0, null, null, null, null, "AAI.OQ", "AAI.OQ Co.", "CAD", "XNYS/NYS-MAIN", 720],
          [35, 0, 0, 0, "AAI.AS", 0, null, null, null, null, "AAI.AS", "AAI.AS B.V", "EUR", "XAMS/ENA-MAIN", 478],
          [36, 0, 0, 0, "AAJ.L", 0, null, null, null, null, "AAJ.L", "AAJ.L London PLC", "CAD", "XLON/LSE-SETS", 759],
          [37, 0, 0, 0, "AAJ.N", 0, null, null, null, null, "AAJ.N", "AAJ.N Corporation", "GBX", "XNGS/NAS-GSM", 697],
          [38, 0, 0, 0, "AAJ.OQ", 0, null, null, null, null, "AAJ.OQ", "AAJ.OQ Co.", "EUR", "XNYS/NYS-MAIN", 68],
          [39, 0, 0, 0, "AAJ.AS", 0, null, null, null, null, "AAJ.AS", "AAJ.AS B.V", "GBX", "XAMS/ENA-MAIN", 199],
          [40, 0, 0, 0, "AAK.L", 0, null, null, null, null, "AAK.L", "AAK.L London PLC", "USD", "XLON/LSE-SETS", 873],
          [41, 0, 0, 0, "AAK.N", 0, null, null, null, null, "AAK.N", "AAK.N Corporation", "EUR", "XNGS/NAS-GSM", 951],
          [42, 0, 0, 0, "AAK.OQ", 0, null, null, null, null, "AAK.OQ", "AAK.OQ Co.", "EUR", "XNYS/NYS-MAIN", 793],
          [43, 0, 0, 0, "AAK.AS", 0, null, null, null, null, "AAK.AS", "AAK.AS B.V", "USD", "XAMS/ENA-MAIN", 382],
          [44, 0, 0, 0, "AAL.L", 0, null, null, null, null, "AAL.L", "AAL.L London PLC", "GBX", "XLON/LSE-SETS", 578],
          [45, 0, 0, 0, "AAL.N", 0, null, null, null, null, "AAL.N", "AAL.N Corporation", "CAD", "XNGS/NAS-GSM", 328],
          [46, 0, 0, 0, "AAL.OQ", 0, null, null, null, null, "AAL.OQ", "AAL.OQ Co.", "EUR", "XNYS/NYS-MAIN", 76],
          [47, 0, 0, 0, "AAL.AS", 0, null, null, null, null, "AAL.AS", "AAL.AS B.V", "CAD", "XAMS/ENA-MAIN", 691],
          [48, 0, 0, 0, "AAM.L", 0, null, null, null, null, "AAM.L", "AAM.L London PLC", "GBX", "XLON/LSE-SETS", 161],
          [49, 0, 0, 0, "AAM.N", 0, null, null, null, null, "AAM.N", "AAM.N Corporation", "CAD", "XNGS/NAS-GSM", 57],
          [50, 0, 0, 0, "AAM.OQ", 0, null, null, null, null, "AAM.OQ", "AAM.OQ Co.", "CAD", "XNYS/NYS-MAIN", 201],
          [51, 0, 0, 0, "AAM.AS", 0, null, null, null, null, "AAM.AS", "AAM.AS B.V", "USD", "XAMS/ENA-MAIN", 432],
          [52, 0, 0, 0, "AAN.L", 0, null, null, null, null, "AAN.L", "AAN.L London PLC", "USD", "XLON/LSE-SETS", 80],
          [53, 0, 0, 0, "AAN.N", 0, null, null, null, null, "AAN.N", "AAN.N Corporation", "CAD", "XNGS/NAS-GSM", 903],
          [54, 0, 0, 0, "AAN.OQ", 0, null, null, null, null, "AAN.OQ", "AAN.OQ Co.", "EUR", "XNYS/NYS-MAIN", 206],
          [55, 0, 0, 0, "AAN.AS", 0, null, null, null, null, "AAN.AS", "AAN.AS B.V", "USD", "XAMS/ENA-MAIN", 911],
          [56, 0, 0, 0, "AAO.L", 0, null, null, null, null, "AAO.L", "AAO.L London PLC", "CAD", "XLON/LSE-SETS", 356],
          [57, 0, 0, 0, "AAO.N", 0, null, null, null, null, "AAO.N", "AAO.N Corporation", "EUR", "XNGS/NAS-GSM", 211],
          [58, 0, 0, 0, "AAO.OQ", 0, null, null, null, null, "AAO.OQ", "AAO.OQ Co.", "CAD", "XNYS/NYS-MAIN", 310],
          [59, 0, 0, 0, "AAO.AS", 0, null, null, null, null, "AAO.AS", "AAO.AS B.V", "USD", "XAMS/ENA-MAIN", 654],
          [60, 0, 0, 0, "AAP.L", 0, null, null, null, null, "AAP.L", "AAP.L London PLC", "USD", "XLON/LSE-SETS", 169],
          [61, 0, 0, 0, "AAP.N", 0, null, null, null, null, "AAP.N", "AAP.N Corporation", "USD", "XNGS/NAS-GSM", 408],
          [62, 0, 0, 0, "AAP.OQ", 0, null, null, null, null, "AAP.OQ", "AAP.OQ Co.", "GBX", "XNYS/NYS-MAIN", 706]
        ]
      });

      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [50, 0, 0, 0, "AAM.OQ", 0, null, null, null, null, "AAM.OQ", "AAM.OQ Co.", "CAD", "XNYS/NYS-MAIN", 201],
          [51, 0, 0, 0, "AAM.AS", 0, null, null, null, null, "AAM.AS", "AAM.AS B.V", "USD", "XAMS/ENA-MAIN", 432],
          [52, 0, 0, 0, "AAN.L", 0, null, null, null, null, "AAN.L", "AAN.L London PLC", "USD", "XLON/LSE-SETS", 80],
          [53, 0, 0, 0, "AAN.N", 0, null, null, null, null, "AAN.N", "AAN.N Corporation", "CAD", "XNGS/NAS-GSM", 903],
          [54, 0, 0, 0, "AAN.OQ", 0, null, null, null, null, "AAN.OQ", "AAN.OQ Co.", "EUR", "XNYS/NYS-MAIN", 206],
          [55, 0, 0, 0, "AAN.AS", 0, null, null, null, null, "AAN.AS", "AAN.AS B.V", "USD", "XAMS/ENA-MAIN", 911],
          [56, 0, 0, 0, "AAO.L", 0, null, null, null, null, "AAO.L", "AAO.L London PLC", "CAD", "XLON/LSE-SETS", 356],
          [57, 0, 0, 0, "AAO.N", 0, null, null, null, null, "AAO.N", "AAO.N Corporation", "EUR", "XNGS/NAS-GSM", 211],
          [58, 0, 0, 0, "AAO.OQ", 0, null, null, null, null, "AAO.OQ", "AAO.OQ Co.", "CAD", "XNYS/NYS-MAIN", 310],
          [59, 0, 0, 0, "AAO.AS", 0, null, null, null, null, "AAO.AS", "AAO.AS B.V", "USD", "XAMS/ENA-MAIN", 654],
          [60, 0, 0, 0, "AAP.L", 0, null, null, null, null, "AAP.L", "AAP.L London PLC", "USD", "XLON/LSE-SETS", 169],
          [61, 0, 0, 0, "AAP.N", 0, null, null, null, null, "AAP.N", "AAP.N Corporation", "USD", "XNGS/NAS-GSM", 408],
          [62, 0, 0, 0, "AAP.OQ", 0, null, null, null, null, "AAP.OQ", "AAP.OQ Co.", "GBX", "XNYS/NYS-MAIN", 706],
          [63, 0, 0, 0, "AAP.AS", 0, null, null, null, null, "AAP.AS", "AAP.AS B.V", "USD", "XAMS/ENA-MAIN", 892],
          [64, 0, 0, 0, "AAQ.L", 0, null, null, null, null, "AAQ.L", "AAQ.L London PLC", "EUR", "XLON/LSE-SETS", 568],
          [65, 0, 0, 0, "AAQ.N", 0, null, null, null, null, "AAQ.N", "AAQ.N Corporation", "EUR", "XNGS/NAS-GSM", 313],
          // The following are in range (including buffer). We only have part of the current viewport,
          // so we won't render it
          [66, 0, 0, 0, "AAQ.OQ", 0, null, null, null, null, "AAQ.OQ", "AAQ.OQ Co.", "USD", "XNYS/NYS-MAIN", 607],
          [67, 0, 0, 0, "AAQ.AS", 0, null, null, null, null, "AAQ.AS", "AAQ.AS B.V", "CAD", "XAMS/ENA-MAIN", 451],
          [68, 0, 0, 0, "AAR.L", 0, null, null, null, null, "AAR.L", "AAR.L London PLC", "GBX", "XLON/LSE-SETS", 346],
          [69, 0, 0, 0, "AAR.N", 0, null, null, null, null, "AAR.N", "AAR.N Corporation", "GBX", "XNGS/NAS-GSM", 717],
          [70, 0, 0, 0, "AAR.OQ", 0, null, null, null, null, "AAR.OQ", "AAR.OQ Co.", "CAD", "XNYS/NYS-MAIN", 404],
          [71, 0, 0, 0, "AAR.AS", 0, null, null, null, null, "AAR.AS", "AAR.AS B.V", "GBX", "XAMS/ENA-MAIN", 606],
          [72, 0, 0, 0, "AAS.L", 0, null, null, null, null, "AAS.L", "AAS.L London PLC", "USD", "XLON/LSE-SETS", 19],
          [73, 0, 0, 0, "AAS.N", 0, null, null, null, null, "AAS.N", "AAS.N Corporation", "GBX", "XNGS/NAS-GSM", 429],
          [74, 0, 0, 0, "AAS.OQ", 0, null, null, null, null, "AAS.OQ", "AAS.OQ Co.", "EUR", "XNYS/NYS-MAIN", 170],
          [75, 0, 0, 0, "AAS.AS", 0, null, null, null, null, "AAS.AS", "AAS.AS B.V", "GBX", "XAMS/ENA-MAIN", 234],
          [76, 0, 0, 0, "AAT.L", 0, null, null, null, null, "AAT.L", "AAT.L London PLC", "CAD", "XLON/LSE-SETS", 202],
          [77, 0, 0, 0, "AAT.N", 0, null, null, null, null, "AAT.N", "AAT.N Corporation", "USD", "XNGS/NAS-GSM", 426],
          [78, 0, 0, 0, "AAT.OQ", 0, null, null, null, null, "AAT.OQ", "AAT.OQ Co.", "EUR", "XNYS/NYS-MAIN", 444],
          [79, 0, 0, 0, "AAT.AS", 0, null, null, null, null, "AAT.AS", "AAT.AS B.V", "CAD", "XAMS/ENA-MAIN", 134],
          [80, 0, 0, 0, "AAU.L", 0, null, null, null, null, "AAU.L", "AAU.L London PLC", "GBX", "XLON/LSE-SETS", 517],
          [81, 0, 0, 0, "AAU.N", 0, null, null, null, null, "AAU.N", "AAU.N Corporation", "GBX", "XNGS/NAS-GSM", 169],
          [82, 0, 0, 0, "AAU.OQ", 0, null, null, null, null, "AAU.OQ", "AAU.OQ Co.", "EUR", "XNYS/NYS-MAIN", 750],
          [83, 0, 0, 0, "AAU.AS", 0, null, null, null, null, "AAU.AS", "AAU.AS B.V", "USD", "XAMS/ENA-MAIN", 676],
          [84, 0, 0, 0, "AAV.L", 0, null, null, null, null, "AAV.L", "AAV.L London PLC", "CAD", "XLON/LSE-SETS", 823],
          [85, 0, 0, 0, "AAV.N", 0, null, null, null, null, "AAV.N", "AAV.N Corporation", "EUR", "XNGS/NAS-GSM", 768],
          [86, 0, 0, 0, "AAV.OQ", 0, null, null, null, null, "AAV.OQ", "AAV.OQ Co.", "EUR", "XNYS/NYS-MAIN", 856],
          [87, 0, 0, 0, "AAV.AS", 0, null, null, null, null, "AAV.AS", "AAV.AS B.V", "GBX", "XAMS/ENA-MAIN", 120],
          [88, 0, 0, 0, "AAW.L", 0, null, null, null, null, "AAW.L", "AAW.L London PLC", "USD", "XLON/LSE-SETS", 900],
          [89, 0, 0, 0, "AAW.N", 0, null, null, null, null, "AAW.N", "AAW.N Corporation", "CAD", "XNGS/NAS-GSM", 48],
          [90, 0, 0, 0, "AAW.OQ", 0, null, null, null, null, "AAW.OQ", "AAW.OQ Co.", "USD", "XNYS/NYS-MAIN", 818],
          [91, 0, 0, 0, "AAW.AS", 0, null, null, null, null, "AAW.AS", "AAW.AS B.V", "USD", "XAMS/ENA-MAIN", 581],
          [92, 0, 0, 0, "AAX.L", 0, null, null, null, null, "AAX.L", "AAX.L London PLC", "GBX", "XLON/LSE-SETS", 761],
          [93, 0, 0, 0, "AAX.N", 0, null, null, null, null, "AAX.N", "AAX.N Corporation", "CAD", "XNGS/NAS-GSM", 435],
          [94, 0, 0, 0, "AAX.OQ", 0, null, null, null, null, "AAX.OQ", "AAX.OQ Co.", "EUR", "XNYS/NYS-MAIN", 407]
        ]
      });

      expect(state.dataRequired).toEqual(true);
      state = GridDataReducer(state, { type: 'range', range: { lo: 80, hi: 105 } });    // server request 70:115
      state = GridDataReducer(state, { type: 'range', range: { lo: 87, hi: 112 } });    // server request 77:122

      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [66, 0, 0, 0, "AAQ.OQ", 0, null, null, null, null, "AAQ.OQ", "AAQ.OQ Co.", "USD", "XNYS/NYS-MAIN", 607],
          [67, 0, 0, 0, "AAQ.AS", 0, null, null, null, null, "AAQ.AS", "AAQ.AS B.V", "CAD", "XAMS/ENA-MAIN", 451],
          [68, 0, 0, 0, "AAR.L", 0, null, null, null, null, "AAR.L", "AAR.L London PLC", "GBX", "XLON/LSE-SETS", 346],
          [69, 0, 0, 0, "AAR.N", 0, null, null, null, null, "AAR.N", "AAR.N Corporation", "GBX", "XNGS/NAS-GSM", 717],
          [70, 0, 0, 0, "AAR.OQ", 0, null, null, null, null, "AAR.OQ", "AAR.OQ Co.", "CAD", "XNYS/NYS-MAIN", 404],
          [71, 0, 0, 0, "AAR.AS", 0, null, null, null, null, "AAR.AS", "AAR.AS B.V", "GBX", "XAMS/ENA-MAIN", 606],
          [72, 0, 0, 0, "AAS.L", 0, null, null, null, null, "AAS.L", "AAS.L London PLC", "USD", "XLON/LSE-SETS", 19],
          [73, 0, 0, 0, "AAS.N", 0, null, null, null, null, "AAS.N", "AAS.N Corporation", "GBX", "XNGS/NAS-GSM", 429],
          [74, 0, 0, 0, "AAS.OQ", 0, null, null, null, null, "AAS.OQ", "AAS.OQ Co.", "EUR", "XNYS/NYS-MAIN", 170],
          [75, 0, 0, 0, "AAS.AS", 0, null, null, null, null, "AAS.AS", "AAS.AS B.V", "GBX", "XAMS/ENA-MAIN", 234],
          [76, 0, 0, 0, "AAT.L", 0, null, null, null, null, "AAT.L", "AAT.L London PLC", "CAD", "XLON/LSE-SETS", 202],
          [77, 0, 0, 0, "AAT.N", 0, null, null, null, null, "AAT.N", "AAT.N Corporation", "USD", "XNGS/NAS-GSM", 426],
          [78, 0, 0, 0, "AAT.OQ", 0, null, null, null, null, "AAT.OQ", "AAT.OQ Co.", "EUR", "XNYS/NYS-MAIN", 444],
          [79, 0, 0, 0, "AAT.AS", 0, null, null, null, null, "AAT.AS", "AAT.AS B.V", "CAD", "XAMS/ENA-MAIN", 134],
          [80, 0, 0, 0, "AAU.L", 0, null, null, null, null, "AAU.L", "AAU.L London PLC", "GBX", "XLON/LSE-SETS", 517],
          [81, 0, 0, 0, "AAU.N", 0, null, null, null, null, "AAU.N", "AAU.N Corporation", "GBX", "XNGS/NAS-GSM", 169],
          [82, 0, 0, 0, "AAU.OQ", 0, null, null, null, null, "AAU.OQ", "AAU.OQ Co.", "EUR", "XNYS/NYS-MAIN", 750],
          [83, 0, 0, 0, "AAU.AS", 0, null, null, null, null, "AAU.AS", "AAU.AS B.V", "USD", "XAMS/ENA-MAIN", 676],
          [84, 0, 0, 0, "AAV.L", 0, null, null, null, null, "AAV.L", "AAV.L London PLC", "CAD", "XLON/LSE-SETS", 823],
          [85, 0, 0, 0, "AAV.N", 0, null, null, null, null, "AAV.N", "AAV.N Corporation", "EUR", "XNGS/NAS-GSM", 768],
          [86, 0, 0, 0, "AAV.OQ", 0, null, null, null, null, "AAV.OQ", "AAV.OQ Co.", "EUR", "XNYS/NYS-MAIN", 856],
          [87, 0, 0, 0, "AAV.AS", 0, null, null, null, null, "AAV.AS", "AAV.AS B.V", "GBX", "XAMS/ENA-MAIN", 120],
          [88, 0, 0, 0, "AAW.L", 0, null, null, null, null, "AAW.L", "AAW.L London PLC", "USD", "XLON/LSE-SETS", 900],
          [89, 0, 0, 0, "AAW.N", 0, null, null, null, null, "AAW.N", "AAW.N Corporation", "CAD", "XNGS/NAS-GSM", 48],
          [90, 0, 0, 0, "AAW.OQ", 0, null, null, null, null, "AAW.OQ", "AAW.OQ Co.", "USD", "XNYS/NYS-MAIN", 818],
          [91, 0, 0, 0, "AAW.AS", 0, null, null, null, null, "AAW.AS", "AAW.AS B.V", "USD", "XAMS/ENA-MAIN", 581],
          [92, 0, 0, 0, "AAX.L", 0, null, null, null, null, "AAX.L", "AAX.L London PLC", "GBX", "XLON/LSE-SETS", 761],
          [93, 0, 0, 0, "AAX.N", 0, null, null, null, null, "AAX.N", "AAX.N Corporation", "CAD", "XNGS/NAS-GSM", 435],
          [94, 0, 0, 0, "AAX.OQ", 0, null, null, null, null, "AAX.OQ", "AAX.OQ Co.", "EUR", "XNYS/NYS-MAIN", 407],
          [95, 0, 0, 0, "AAX.AS", 0, null, null, null, null, "AAX.AS", "AAX.AS B.V", "GBX", "XAMS/ENA-MAIN", 269],
          [96, 0, 0, 0, "AAY.L", 0, null, null, null, null, "AAY.L", "AAY.L London PLC", "EUR", "XLON/LSE-SETS", 774],
          [97, 0, 0, 0, "AAY.N", 0, null, null, null, null, "AAY.N", "AAY.N Corporation", "USD", "XNGS/NAS-GSM", 44],
          [98, 0, 0, 0, "AAY.OQ", 0, null, null, null, null, "AAY.OQ", "AAY.OQ Co.", "EUR", "XNYS/NYS-MAIN", 828],
          [99, 0, 0, 0, "AAY.AS", 0, null, null, null, null, "AAY.AS", "AAY.AS B.V", "EUR", "XAMS/ENA-MAIN", 767],
          [100, 0, 0, 0, "AAZ.L", 0, null, null, null, null, "AAZ.L", "AAZ.L London PLC", "EUR", "XLON/LSE-SETS", 637],
          [101, 0, 0, 0, "AAZ.N", 0, null, null, null, null, "AAZ.N", "AAZ.N Corporation", "GBX", "XNGS/NAS-GSM", 44],
          [102, 0, 0, 0, "AAZ.OQ", 0, null, null, null, null, "AAZ.OQ", "AAZ.OQ Co.", "USD", "XNYS/NYS-MAIN", 647],
          [103, 0, 0, 0, "AAZ.AS", 0, null, null, null, null, "AAZ.AS", "AAZ.AS B.V", "USD", "XAMS/ENA-MAIN", 312],
          [104, 0, 0, 0, "ABA.L", 0, null, null, null, null, "ABA.L", "ABA.L London PLC", "GBX", "XLON/LSE-SETS", 914],
          [105, 0, 0, 0, "ABA.N", 0, null, null, null, null, "ABA.N", "ABA.N Corporation", "CAD", "XNGS/NAS-GSM", 568],
          [106, 0, 0, 0, "ABA.OQ", 0, null, null, null, null, "ABA.OQ", "ABA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 66],
          [107, 0, 0, 0, "ABA.AS", 0, null, null, null, null, "ABA.AS", "ABA.AS B.V", "CAD", "XAMS/ENA-MAIN", 325],
          [108, 0, 0, 0, "ABB.L", 0, null, null, null, null, "ABB.L", "ABB.L London PLC", "EUR", "XLON/LSE-SETS", 322],
          [109, 0, 0, 0, "ABB.N", 0, null, null, null, null, "ABB.N", "ABB.N Corporation", "USD", "XNGS/NAS-GSM", 126],
          [110, 0, 0, 0, "ABB.OQ", 0, null, null, null, null, "ABB.OQ", "ABB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 351]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 89, hi: 114 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 91, hi: 116 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 92, hi: 117 } });

      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [70, 0, 0, 0, "AAR.OQ", 0, null, null, null, null, "AAR.OQ", "AAR.OQ Co.", "CAD", "XNYS/NYS-MAIN", 404],
          [71, 0, 0, 0, "AAR.AS", 0, null, null, null, null, "AAR.AS", "AAR.AS B.V", "GBX", "XAMS/ENA-MAIN", 606],
          [72, 0, 0, 0, "AAS.L", 0, null, null, null, null, "AAS.L", "AAS.L London PLC", "USD", "XLON/LSE-SETS", 19],
          [73, 0, 0, 0, "AAS.N", 0, null, null, null, null, "AAS.N", "AAS.N Corporation", "GBX", "XNGS/NAS-GSM", 429],
          [74, 0, 0, 0, "AAS.OQ", 0, null, null, null, null, "AAS.OQ", "AAS.OQ Co.", "EUR", "XNYS/NYS-MAIN", 170],
          [75, 0, 0, 0, "AAS.AS", 0, null, null, null, null, "AAS.AS", "AAS.AS B.V", "GBX", "XAMS/ENA-MAIN", 234],
          [76, 0, 0, 0, "AAT.L", 0, null, null, null, null, "AAT.L", "AAT.L London PLC", "CAD", "XLON/LSE-SETS", 202],
          [77, 0, 0, 0, "AAT.N", 0, null, null, null, null, "AAT.N", "AAT.N Corporation", "USD", "XNGS/NAS-GSM", 426],
          [78, 0, 0, 0, "AAT.OQ", 0, null, null, null, null, "AAT.OQ", "AAT.OQ Co.", "EUR", "XNYS/NYS-MAIN", 444],
          [79, 0, 0, 0, "AAT.AS", 0, null, null, null, null, "AAT.AS", "AAT.AS B.V", "CAD", "XAMS/ENA-MAIN", 134],
          [80, 0, 0, 0, "AAU.L", 0, null, null, null, null, "AAU.L", "AAU.L London PLC", "GBX", "XLON/LSE-SETS", 517],
          [81, 0, 0, 0, "AAU.N", 0, null, null, null, null, "AAU.N", "AAU.N Corporation", "GBX", "XNGS/NAS-GSM", 169],
          [82, 0, 0, 0, "AAU.OQ", 0, null, null, null, null, "AAU.OQ", "AAU.OQ Co.", "EUR", "XNYS/NYS-MAIN", 750],
          [83, 0, 0, 0, "AAU.AS", 0, null, null, null, null, "AAU.AS", "AAU.AS B.V", "USD", "XAMS/ENA-MAIN", 676],
          [84, 0, 0, 0, "AAV.L", 0, null, null, null, null, "AAV.L", "AAV.L London PLC", "CAD", "XLON/LSE-SETS", 823],
          [85, 0, 0, 0, "AAV.N", 0, null, null, null, null, "AAV.N", "AAV.N Corporation", "EUR", "XNGS/NAS-GSM", 768],
          [86, 0, 0, 0, "AAV.OQ", 0, null, null, null, null, "AAV.OQ", "AAV.OQ Co.", "EUR", "XNYS/NYS-MAIN", 856],
          [87, 0, 0, 0, "AAV.AS", 0, null, null, null, null, "AAV.AS", "AAV.AS B.V", "GBX", "XAMS/ENA-MAIN", 120],
          [88, 0, 0, 0, "AAW.L", 0, null, null, null, null, "AAW.L", "AAW.L London PLC", "USD", "XLON/LSE-SETS", 900],
          [89, 0, 0, 0, "AAW.N", 0, null, null, null, null, "AAW.N", "AAW.N Corporation", "CAD", "XNGS/NAS-GSM", 48],
          [90, 0, 0, 0, "AAW.OQ", 0, null, null, null, null, "AAW.OQ", "AAW.OQ Co.", "USD", "XNYS/NYS-MAIN", 818],
          [91, 0, 0, 0, "AAW.AS", 0, null, null, null, null, "AAW.AS", "AAW.AS B.V", "USD", "XAMS/ENA-MAIN", 581],
          [92, 0, 0, 0, "AAX.L", 0, null, null, null, null, "AAX.L", "AAX.L London PLC", "GBX", "XLON/LSE-SETS", 761],
          [93, 0, 0, 0, "AAX.N", 0, null, null, null, null, "AAX.N", "AAX.N Corporation", "CAD", "XNGS/NAS-GSM", 435],
          [94, 0, 0, 0, "AAX.OQ", 0, null, null, null, null, "AAX.OQ", "AAX.OQ Co.", "EUR", "XNYS/NYS-MAIN", 407],
          [95, 0, 0, 0, "AAX.AS", 0, null, null, null, null, "AAX.AS", "AAX.AS B.V", "GBX", "XAMS/ENA-MAIN", 269],
          [96, 0, 0, 0, "AAY.L", 0, null, null, null, null, "AAY.L", "AAY.L London PLC", "EUR", "XLON/LSE-SETS", 774],
          [97, 0, 0, 0, "AAY.N", 0, null, null, null, null, "AAY.N", "AAY.N Corporation", "USD", "XNGS/NAS-GSM", 44],
          [98, 0, 0, 0, "AAY.OQ", 0, null, null, null, null, "AAY.OQ", "AAY.OQ Co.", "EUR", "XNYS/NYS-MAIN", 828],
          [99, 0, 0, 0, "AAY.AS", 0, null, null, null, null, "AAY.AS", "AAY.AS B.V", "EUR", "XAMS/ENA-MAIN", 767],
          [100, 0, 0, 0, "AAZ.L", 0, null, null, null, null, "AAZ.L", "AAZ.L London PLC", "EUR", "XLON/LSE-SETS", 637],
          [101, 0, 0, 0, "AAZ.N", 0, null, null, null, null, "AAZ.N", "AAZ.N Corporation", "GBX", "XNGS/NAS-GSM", 44],
          [102, 0, 0, 0, "AAZ.OQ", 0, null, null, null, null, "AAZ.OQ", "AAZ.OQ Co.", "USD", "XNYS/NYS-MAIN", 647],
          [103, 0, 0, 0, "AAZ.AS", 0, null, null, null, null, "AAZ.AS", "AAZ.AS B.V", "USD", "XAMS/ENA-MAIN", 312],
          [104, 0, 0, 0, "ABA.L", 0, null, null, null, null, "ABA.L", "ABA.L London PLC", "GBX", "XLON/LSE-SETS", 914],
          [105, 0, 0, 0, "ABA.N", 0, null, null, null, null, "ABA.N", "ABA.N Corporation", "CAD", "XNGS/NAS-GSM", 568],
          [106, 0, 0, 0, "ABA.OQ", 0, null, null, null, null, "ABA.OQ", "ABA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 66],
          [107, 0, 0, 0, "ABA.AS", 0, null, null, null, null, "ABA.AS", "ABA.AS B.V", "CAD", "XAMS/ENA-MAIN", 325],
          [108, 0, 0, 0, "ABB.L", 0, null, null, null, null, "ABB.L", "ABB.L London PLC", "EUR", "XLON/LSE-SETS", 322],
          [109, 0, 0, 0, "ABB.N", 0, null, null, null, null, "ABB.N", "ABB.N Corporation", "USD", "XNGS/NAS-GSM", 126],
          [110, 0, 0, 0, "ABB.OQ", 0, null, null, null, null, "ABB.OQ", "ABB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 351],
          [111, 0, 0, 0, "ABB.AS", 0, null, null, null, null, "ABB.AS", "ABB.AS B.V", "CAD", "XAMS/ENA-MAIN", 524],
          [112, 0, 0, 0, "ABC.L", 0, null, null, null, null, "ABC.L", "ABC.L London PLC", "EUR", "XLON/LSE-SETS", 686],
          [113, 0, 0, 0, "ABC.N", 0, null, null, null, null, "ABC.N", "ABC.N Corporation", "CAD", "XNGS/NAS-GSM", 751],
          [114, 0, 0, 0, "ABC.OQ", 0, null, null, null, null, "ABC.OQ", "ABC.OQ Co.", "CAD", "XNYS/NYS-MAIN", 283]
        ]
      });

      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [82, 0, 0, 0, "AAU.OQ", 0, null, null, null, null, "AAU.OQ", "AAU.OQ Co.", "EUR", "XNYS/NYS-MAIN", 750],
          [83, 0, 0, 0, "AAU.AS", 0, null, null, null, null, "AAU.AS", "AAU.AS B.V", "USD", "XAMS/ENA-MAIN", 676],
          [84, 0, 0, 0, "AAV.L", 0, null, null, null, null, "AAV.L", "AAV.L London PLC", "CAD", "XLON/LSE-SETS", 823],
          [85, 0, 0, 0, "AAV.N", 0, null, null, null, null, "AAV.N", "AAV.N Corporation", "EUR", "XNGS/NAS-GSM", 768],
          [86, 0, 0, 0, "AAV.OQ", 0, null, null, null, null, "AAV.OQ", "AAV.OQ Co.", "EUR", "XNYS/NYS-MAIN", 856],
          [87, 0, 0, 0, "AAV.AS", 0, null, null, null, null, "AAV.AS", "AAV.AS B.V", "GBX", "XAMS/ENA-MAIN", 120],
          [88, 0, 0, 0, "AAW.L", 0, null, null, null, null, "AAW.L", "AAW.L London PLC", "USD", "XLON/LSE-SETS", 900],
          [89, 0, 0, 0, "AAW.N", 0, null, null, null, null, "AAW.N", "AAW.N Corporation", "CAD", "XNGS/NAS-GSM", 48],
          [90, 0, 0, 0, "AAW.OQ", 0, null, null, null, null, "AAW.OQ", "AAW.OQ Co.", "USD", "XNYS/NYS-MAIN", 818],
          [91, 0, 0, 0, "AAW.AS", 0, null, null, null, null, "AAW.AS", "AAW.AS B.V", "USD", "XAMS/ENA-MAIN", 581],
          [92, 0, 0, 0, "AAX.L", 0, null, null, null, null, "AAX.L", "AAX.L London PLC", "GBX", "XLON/LSE-SETS", 761],
          [93, 0, 0, 0, "AAX.N", 0, null, null, null, null, "AAX.N", "AAX.N Corporation", "CAD", "XNGS/NAS-GSM", 435],
          [94, 0, 0, 0, "AAX.OQ", 0, null, null, null, null, "AAX.OQ", "AAX.OQ Co.", "EUR", "XNYS/NYS-MAIN", 407],
          [95, 0, 0, 0, "AAX.AS", 0, null, null, null, null, "AAX.AS", "AAX.AS B.V", "GBX", "XAMS/ENA-MAIN", 269],
          [96, 0, 0, 0, "AAY.L", 0, null, null, null, null, "AAY.L", "AAY.L London PLC", "EUR", "XLON/LSE-SETS", 774],
          [97, 0, 0, 0, "AAY.N", 0, null, null, null, null, "AAY.N", "AAY.N Corporation", "USD", "XNGS/NAS-GSM", 44],
          [98, 0, 0, 0, "AAY.OQ", 0, null, null, null, null, "AAY.OQ", "AAY.OQ Co.", "EUR", "XNYS/NYS-MAIN", 828],
          [99, 0, 0, 0, "AAY.AS", 0, null, null, null, null, "AAY.AS", "AAY.AS B.V", "EUR", "XAMS/ENA-MAIN", 767],
          [100, 0, 0, 0, "AAZ.L", 0, null, null, null, null, "AAZ.L", "AAZ.L London PLC", "EUR", "XLON/LSE-SETS", 637],
          [101, 0, 0, 0, "AAZ.N", 0, null, null, null, null, "AAZ.N", "AAZ.N Corporation", "GBX", "XNGS/NAS-GSM", 44],
          [102, 0, 0, 0, "AAZ.OQ", 0, null, null, null, null, "AAZ.OQ", "AAZ.OQ Co.", "USD", "XNYS/NYS-MAIN", 647],
          [103, 0, 0, 0, "AAZ.AS", 0, null, null, null, null, "AAZ.AS", "AAZ.AS B.V", "USD", "XAMS/ENA-MAIN", 312],
          [104, 0, 0, 0, "ABA.L", 0, null, null, null, null, "ABA.L", "ABA.L London PLC", "GBX", "XLON/LSE-SETS", 914],
          [105, 0, 0, 0, "ABA.N", 0, null, null, null, null, "ABA.N", "ABA.N Corporation", "CAD", "XNGS/NAS-GSM", 568],
          [106, 0, 0, 0, "ABA.OQ", 0, null, null, null, null, "ABA.OQ", "ABA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 66],
          [107, 0, 0, 0, "ABA.AS", 0, null, null, null, null, "ABA.AS", "ABA.AS B.V", "CAD", "XAMS/ENA-MAIN", 325],
          [108, 0, 0, 0, "ABB.L", 0, null, null, null, null, "ABB.L", "ABB.L London PLC", "EUR", "XLON/LSE-SETS", 322],
          [109, 0, 0, 0, "ABB.N", 0, null, null, null, null, "ABB.N", "ABB.N Corporation", "USD", "XNGS/NAS-GSM", 126],
          [110, 0, 0, 0, "ABB.OQ", 0, null, null, null, null, "ABB.OQ", "ABB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 351],
          [111, 0, 0, 0, "ABB.AS", 0, null, null, null, null, "ABB.AS", "ABB.AS B.V", "CAD", "XAMS/ENA-MAIN", 524],
          [112, 0, 0, 0, "ABC.L", 0, null, null, null, null, "ABC.L", "ABC.L London PLC", "EUR", "XLON/LSE-SETS", 686],
          [113, 0, 0, 0, "ABC.N", 0, null, null, null, null, "ABC.N", "ABC.N Corporation", "CAD", "XNGS/NAS-GSM", 751],
          [114, 0, 0, 0, "ABC.OQ", 0, null, null, null, null, "ABC.OQ", "ABC.OQ Co.", "CAD", "XNYS/NYS-MAIN", 283],
          [115, 0, 0, 0, "ABC.AS", 0, null, null, null, null, "ABC.AS", "ABC.AS B.V", "CAD", "XAMS/ENA-MAIN", 888],
          [116, 0, 0, 0, "ABD.L", 0, null, null, null, null, "ABD.L", "ABD.L London PLC", "EUR", "XLON/LSE-SETS", 895],
          [117, 0, 0, 0, "ABD.N", 0, null, null, null, null, "ABD.N", "ABD.N Corporation", "USD", "XNGS/NAS-GSM", 107],
          [118, 0, 0, 0, "ABD.OQ", 0, null, null, null, null, "ABD.OQ", "ABD.OQ Co.", "GBX", "XNYS/NYS-MAIN", 269],
          [119, 0, 0, 0, "ABD.AS", 0, null, null, null, null, "ABD.AS", "ABD.AS B.V", "GBX", "XAMS/ENA-MAIN", 308],
          [120, 0, 0, 0, "ABE.L", 0, null, null, null, null, "ABE.L", "ABE.L London PLC", "EUR", "XLON/LSE-SETS", 137],
          [121, 0, 0, 0, "ABE.N", 0, null, null, null, null, "ABE.N", "ABE.N Corporation", "GBX", "XNGS/NAS-GSM", 730],
          [122, 0, 0, 0, "ABE.OQ", 0, null, null, null, null, "ABE.OQ", "ABE.OQ Co.", "USD", "XNYS/NYS-MAIN", 509],
          [123, 0, 0, 0, "ABE.AS", 0, null, null, null, null, "ABE.AS", "ABE.AS B.V", "USD", "XAMS/ENA-MAIN", 852],
          [124, 0, 0, 0, "ABF.L", 0, null, null, null, null, "ABF.L", "ABF.L London PLC", "EUR", "XLON/LSE-SETS", 50],
          [125, 0, 0, 0, "ABF.N", 0, null, null, null, null, "ABF.N", "ABF.N Corporation", "CAD", "XNGS/NAS-GSM", 943],
          [126, 0, 0, 0, "ABF.OQ", 0, null, null, null, null, "ABF.OQ", "ABF.OQ Co.", "GBX", "XNYS/NYS-MAIN", 95]
        ]
      });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [126, 0, 0, 0, "ABF.OQ", 0, null, null, null, null, "ABF.OQ", "ABF.OQ Co.", "GBX", "XNYS/NYS-MAIN", 95]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 90, hi: 115 } });

      // Turn around
      state = GridDataReducer(state, { type: 'range', range: { lo: 82, hi: 107 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 70, hi: 95 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 63, hi: 88 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 48, hi: 73 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [53, 0, 0, 0, "AAN.N", 0, null, null, null, null, "AAN.N", "AAN.N Corporation", "CAD", "XNGS/NAS-GSM", 903],
          [54, 0, 0, 0, "AAN.OQ", 0, null, null, null, null, "AAN.OQ", "AAN.OQ Co.", "EUR", "XNYS/NYS-MAIN", 206],
          [55, 0, 0, 0, "AAN.AS", 0, null, null, null, null, "AAN.AS", "AAN.AS B.V", "USD", "XAMS/ENA-MAIN", 911],
          [56, 0, 0, 0, "AAO.L", 0, null, null, null, null, "AAO.L", "AAO.L London PLC", "CAD", "XLON/LSE-SETS", 356],
          [57, 0, 0, 0, "AAO.N", 0, null, null, null, null, "AAO.N", "AAO.N Corporation", "EUR", "XNGS/NAS-GSM", 211],
          [58, 0, 0, 0, "AAO.OQ", 0, null, null, null, null, "AAO.OQ", "AAO.OQ Co.", "CAD", "XNYS/NYS-MAIN", 310],
          [59, 0, 0, 0, "AAO.AS", 0, null, null, null, null, "AAO.AS", "AAO.AS B.V", "USD", "XAMS/ENA-MAIN", 654],
          [60, 0, 0, 0, "AAP.L", 0, null, null, null, null, "AAP.L", "AAP.L London PLC", "USD", "XLON/LSE-SETS", 169],
          [61, 0, 0, 0, "AAP.N", 0, null, null, null, null, "AAP.N", "AAP.N Corporation", "USD", "XNGS/NAS-GSM", 408],
          [62, 0, 0, 0, "AAP.OQ", 0, null, null, null, null, "AAP.OQ", "AAP.OQ Co.", "GBX", "XNYS/NYS-MAIN", 706],
          [63, 0, 0, 0, "AAP.AS", 0, null, null, null, null, "AAP.AS", "AAP.AS B.V", "USD", "XAMS/ENA-MAIN", 892],
          [64, 0, 0, 0, "AAQ.L", 0, null, null, null, null, "AAQ.L", "AAQ.L London PLC", "EUR", "XLON/LSE-SETS", 568],
          [65, 0, 0, 0, "AAQ.N", 0, null, null, null, null, "AAQ.N", "AAQ.N Corporation", "EUR", "XNGS/NAS-GSM", 313],
          [66, 0, 0, 0, "AAQ.OQ", 0, null, null, null, null, "AAQ.OQ", "AAQ.OQ Co.", "USD", "XNYS/NYS-MAIN", 607],
          [67, 0, 0, 0, "AAQ.AS", 0, null, null, null, null, "AAQ.AS", "AAQ.AS B.V", "CAD", "XAMS/ENA-MAIN", 451],
          [68, 0, 0, 0, "AAR.L", 0, null, null, null, null, "AAR.L", "AAR.L London PLC", "GBX", "XLON/LSE-SETS", 346],
          [69, 0, 0, 0, "AAR.N", 0, null, null, null, null, "AAR.N", "AAR.N Corporation", "GBX", "XNGS/NAS-GSM", 717],
          [70, 0, 0, 0, "AAR.OQ", 0, null, null, null, null, "AAR.OQ", "AAR.OQ Co.", "CAD", "XNYS/NYS-MAIN", 404],
          [71, 0, 0, 0, "AAR.AS", 0, null, null, null, null, "AAR.AS", "AAR.AS B.V", "GBX", "XAMS/ENA-MAIN", 606],
          [72, 0, 0, 0, "AAS.L", 0, null, null, null, null, "AAS.L", "AAS.L London PLC", "USD", "XLON/LSE-SETS", 19],
          [73, 0, 0, 0, "AAS.N", 0, null, null, null, null, "AAS.N", "AAS.N Corporation", "GBX", "XNGS/NAS-GSM", 429],
          [74, 0, 0, 0, "AAS.OQ", 0, null, null, null, null, "AAS.OQ", "AAS.OQ Co.", "EUR", "XNYS/NYS-MAIN", 170],
          [75, 0, 0, 0, "AAS.AS", 0, null, null, null, null, "AAS.AS", "AAS.AS B.V", "GBX", "XAMS/ENA-MAIN", 234],
          [76, 0, 0, 0, "AAT.L", 0, null, null, null, null, "AAT.L", "AAT.L London PLC", "CAD", "XLON/LSE-SETS", 202],
          [77, 0, 0, 0, "AAT.N", 0, null, null, null, null, "AAT.N", "AAT.N Corporation", "USD", "XNGS/NAS-GSM", 426],
          [78, 0, 0, 0, "AAT.OQ", 0, null, null, null, null, "AAT.OQ", "AAT.OQ Co.", "EUR", "XNYS/NYS-MAIN", 444],
          [79, 0, 0, 0, "AAT.AS", 0, null, null, null, null, "AAT.AS", "AAT.AS B.V", "CAD", "XAMS/ENA-MAIN", 134],
          [80, 0, 0, 0, "AAU.L", 0, null, null, null, null, "AAU.L", "AAU.L London PLC", "GBX", "XLON/LSE-SETS", 517],
          [81, 0, 0, 0, "AAU.N", 0, null, null, null, null, "AAU.N", "AAU.N Corporation", "GBX", "XNGS/NAS-GSM", 169],
          [82, 0, 0, 0, "AAU.OQ", 0, null, null, null, null, "AAU.OQ", "AAU.OQ Co.", "EUR", "XNYS/NYS-MAIN", 750],
          [83, 0, 0, 0, "AAU.AS", 0, null, null, null, null, "AAU.AS", "AAU.AS B.V", "USD", "XAMS/ENA-MAIN", 676],
          [84, 0, 0, 0, "AAV.L", 0, null, null, null, null, "AAV.L", "AAV.L London PLC", "CAD", "XLON/LSE-SETS", 823],
          [85, 0, 0, 0, "AAV.N", 0, null, null, null, null, "AAV.N", "AAV.N Corporation", "EUR", "XNGS/NAS-GSM", 768],
          [86, 0, 0, 0, "AAV.OQ", 0, null, null, null, null, "AAV.OQ", "AAV.OQ Co.", "EUR", "XNYS/NYS-MAIN", 856],
          [87, 0, 0, 0, "AAV.AS", 0, null, null, null, null, "AAV.AS", "AAV.AS B.V", "GBX", "XAMS/ENA-MAIN", 120],
          [88, 0, 0, 0, "AAW.L", 0, null, null, null, null, "AAW.L", "AAW.L London PLC", "USD", "XLON/LSE-SETS", 900],
          [89, 0, 0, 0, "AAW.N", 0, null, null, null, null, "AAW.N", "AAW.N Corporation", "CAD", "XNGS/NAS-GSM", 48],
          [90, 0, 0, 0, "AAW.OQ", 0, null, null, null, null, "AAW.OQ", "AAW.OQ Co.", "USD", "XNYS/NYS-MAIN", 818],
          [91, 0, 0, 0, "AAW.AS", 0, null, null, null, null, "AAW.AS", "AAW.AS B.V", "USD", "XAMS/ENA-MAIN", 581],
          [92, 0, 0, 0, "AAX.L", 0, null, null, null, null, "AAX.L", "AAX.L London PLC", "GBX", "XLON/LSE-SETS", 761],
          [93, 0, 0, 0, "AAX.N", 0, null, null, null, null, "AAX.N", "AAX.N Corporation", "CAD", "XNGS/NAS-GSM", 435],
          [94, 0, 0, 0, "AAX.OQ", 0, null, null, null, null, "AAX.OQ", "AAX.OQ Co.", "EUR", "XNYS/NYS-MAIN", 407],
          [95, 0, 0, 0, "AAX.AS", 0, null, null, null, null, "AAX.AS", "AAX.AS B.V", "GBX", "XAMS/ENA-MAIN", 269],
          [96, 0, 0, 0, "AAY.L", 0, null, null, null, null, "AAY.L", "AAY.L London PLC", "EUR", "XLON/LSE-SETS", 774],
          [97, 0, 0, 0, "AAY.N", 0, null, null, null, null, "AAY.N", "AAY.N Corporation", "USD", "XNGS/NAS-GSM", 44]
        ]
      });

      // We don't get all the rows we need to fill the buffer, we're missing 5 rows from the leading edge of range
      // and the entire leading buffer;
      expect(state.buffer.length).toEqual(30);
      expect(state.bufferIdx).toEqual({lo:0, hi: 20});
      state = GridDataReducer(state, { type: 'range', range: { lo: 34, hi: 59 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 22, hi: 47 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 11, hi: 36 } });

      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928],
          [25, 0, 0, 0, "AAG.N", 0, null, null, null, null, "AAG.N", "AAG.N Corporation", "GBX", "XNGS/NAS-GSM", 900],
          [26, 0, 0, 0, "AAG.OQ", 0, null, null, null, null, "AAG.OQ", "AAG.OQ Co.", "CAD", "XNYS/NYS-MAIN", 896],
          [27, 0, 0, 0, "AAG.AS", 0, null, null, null, null, "AAG.AS", "AAG.AS B.V", "USD", "XAMS/ENA-MAIN", 934],
          [28, 0, 0, 0, "AAH.L", 0, null, null, null, null, "AAH.L", "AAH.L London PLC", "USD", "XLON/LSE-SETS", 553],
          [29, 0, 0, 0, "AAH.N", 0, null, null, null, null, "AAH.N", "AAH.N Corporation", "EUR", "XNGS/NAS-GSM", 879],
          [30, 0, 0, 0, "AAH.OQ", 0, null, null, null, null, "AAH.OQ", "AAH.OQ Co.", "GBX", "XNYS/NYS-MAIN", 943],
          [31, 0, 0, 0, "AAH.AS", 0, null, null, null, null, "AAH.AS", "AAH.AS B.V", "GBX", "XAMS/ENA-MAIN", 303],
          [32, 0, 0, 0, "AAI.L", 0, null, null, null, null, "AAI.L", "AAI.L London PLC", "CAD", "XLON/LSE-SETS", 430],
          [33, 0, 0, 0, "AAI.N", 0, null, null, null, null, "AAI.N", "AAI.N Corporation", "EUR", "XNGS/NAS-GSM", 628],
          [34, 0, 0, 0, "AAI.OQ", 0, null, null, null, null, "AAI.OQ", "AAI.OQ Co.", "CAD", "XNYS/NYS-MAIN", 720],
          [35, 0, 0, 0, "AAI.AS", 0, null, null, null, null, "AAI.AS", "AAI.AS B.V", "EUR", "XAMS/ENA-MAIN", 478],
          [36, 0, 0, 0, "AAJ.L", 0, null, null, null, null, "AAJ.L", "AAJ.L London PLC", "CAD", "XLON/LSE-SETS", 759],
          [37, 0, 0, 0, "AAJ.N", 0, null, null, null, null, "AAJ.N", "AAJ.N Corporation", "GBX", "XNGS/NAS-GSM", 697],
          [38, 0, 0, 0, "AAJ.OQ", 0, null, null, null, null, "AAJ.OQ", "AAJ.OQ Co.", "EUR", "XNYS/NYS-MAIN", 68],
          [39, 0, 0, 0, "AAJ.AS", 0, null, null, null, null, "AAJ.AS", "AAJ.AS B.V", "GBX", "XAMS/ENA-MAIN", 199],
          [40, 0, 0, 0, "AAK.L", 0, null, null, null, null, "AAK.L", "AAK.L London PLC", "USD", "XLON/LSE-SETS", 873],
          [41, 0, 0, 0, "AAK.N", 0, null, null, null, null, "AAK.N", "AAK.N Corporation", "EUR", "XNGS/NAS-GSM", 951],
          [42, 0, 0, 0, "AAK.OQ", 0, null, null, null, null, "AAK.OQ", "AAK.OQ Co.", "EUR", "XNYS/NYS-MAIN", 793],
          [43, 0, 0, 0, "AAK.AS", 0, null, null, null, null, "AAK.AS", "AAK.AS B.V", "USD", "XAMS/ENA-MAIN", 382],
          [44, 0, 0, 0, "AAL.L", 0, null, null, null, null, "AAL.L", "AAL.L London PLC", "GBX", "XLON/LSE-SETS", 578],
          [45, 0, 0, 0, "AAL.N", 0, null, null, null, null, "AAL.N", "AAL.N Corporation", "CAD", "XNGS/NAS-GSM", 328],
          [46, 0, 0, 0, "AAL.OQ", 0, null, null, null, null, "AAL.OQ", "AAL.OQ Co.", "EUR", "XNYS/NYS-MAIN", 76],
          [47, 0, 0, 0, "AAL.AS", 0, null, null, null, null, "AAL.AS", "AAL.AS B.V", "CAD", "XAMS/ENA-MAIN", 691],
          [48, 0, 0, 0, "AAM.L", 0, null, null, null, null, "AAM.L", "AAM.L London PLC", "GBX", "XLON/LSE-SETS", 161],
          [49, 0, 0, 0, "AAM.N", 0, null, null, null, null, "AAM.N", "AAM.N Corporation", "CAD", "XNGS/NAS-GSM", 57],
          [50, 0, 0, 0, "AAM.OQ", 0, null, null, null, null, "AAM.OQ", "AAM.OQ Co.", "CAD", "XNYS/NYS-MAIN", 201],
          [51, 0, 0, 0, "AAM.AS", 0, null, null, null, null, "AAM.AS", "AAM.AS B.V", "USD", "XAMS/ENA-MAIN", 432],
          [52, 0, 0, 0, "AAN.L", 0, null, null, null, null, "AAN.L", "AAN.L London PLC", "USD", "XLON/LSE-SETS", 80],
          [53, 0, 0, 0, "AAN.N", 0, null, null, null, null, "AAN.N", "AAN.N Corporation", "CAD", "XNGS/NAS-GSM", 903],
          [54, 0, 0, 0, "AAN.OQ", 0, null, null, null, null, "AAN.OQ", "AAN.OQ Co.", "EUR", "XNYS/NYS-MAIN", 206],
          [55, 0, 0, 0, "AAN.AS", 0, null, null, null, null, "AAN.AS", "AAN.AS B.V", "USD", "XAMS/ENA-MAIN", 911],
          [56, 0, 0, 0, "AAO.L", 0, null, null, null, null, "AAO.L", "AAO.L London PLC", "CAD", "XLON/LSE-SETS", 356]
        ]
      });
      // We don't get all the rows we need to fill the buffer, we're missing 5 rows from the leading edge of range
      // and the entire leading buffer;
      expect(state.buffer.length).toEqual(34);
      expect(state.bufferIdx).toEqual({lo:0, hi: 24});
      state = GridDataReducer(state, { type: 'range', range: { lo: 2, hi: 27 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 0, rowCount: 1000, rows: [
          [0, 0, 0, 0, "AAA.L", 0, null, null, null, null, "AAA.L", "AAA.L London PLC", "USD", "XLON/LSE-SETS", 633],
          [1, 0, 0, 0, "AAA.N", 0, null, null, null, null, "AAA.N", "AAA.N Corporation", "EUR", "XNGS/NAS-GSM", 220],
          [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 393],
          [3, 0, 0, 0, "AAA.AS", 0, null, null, null, null, "AAA.AS", "AAA.AS B.V", "GBX", "XAMS/ENA-MAIN", 449],
          [4, 0, 0, 0, "AAB.L", 0, null, null, null, null, "AAB.L", "AAB.L London PLC", "GBX", "XLON/LSE-SETS", 37],
          [5, 0, 0, 0, "AAB.N", 0, null, null, null, null, "AAB.N", "AAB.N Corporation", "CAD", "XNGS/NAS-GSM", 38],
          [6, 0, 0, 0, "AAB.OQ", 0, null, null, null, null, "AAB.OQ", "AAB.OQ Co.", "GBX", "XNYS/NYS-MAIN", 286],
          [7, 0, 0, 0, "AAB.AS", 0, null, null, null, null, "AAB.AS", "AAB.AS B.V", "USD", "XAMS/ENA-MAIN", 364],
          [8, 0, 0, 0, "AAC.L", 0, null, null, null, null, "AAC.L", "AAC.L London PLC", "EUR", "XLON/LSE-SETS", 12],
          [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 927],
          [10, 0, 0, 0, "AAC.OQ", 0, null, null, null, null, "AAC.OQ", "AAC.OQ Co.", "GBX", "XNYS/NYS-MAIN", 559],
          [11, 0, 0, 0, "AAC.AS", 0, null, null, null, null, "AAC.AS", "AAC.AS B.V", "CAD", "XAMS/ENA-MAIN", 946],
          [12, 0, 0, 0, "AAD.L", 0, null, null, null, null, "AAD.L", "AAD.L London PLC", "CAD", "XLON/LSE-SETS", 363],
          [13, 0, 0, 0, "AAD.N", 0, null, null, null, null, "AAD.N", "AAD.N Corporation", "CAD", "XNGS/NAS-GSM", 696],
          [14, 0, 0, 0, "AAD.OQ", 0, null, null, null, null, "AAD.OQ", "AAD.OQ Co.", "EUR", "XNYS/NYS-MAIN", 806],
          [15, 0, 0, 0, "AAD.AS", 0, null, null, null, null, "AAD.AS", "AAD.AS B.V", "GBX", "XAMS/ENA-MAIN", 44],
          [16, 0, 0, 0, "AAE.L", 0, null, null, null, null, "AAE.L", "AAE.L London PLC", "GBX", "XLON/LSE-SETS", 226],
          [17, 0, 0, 0, "AAE.N", 0, null, null, null, null, "AAE.N", "AAE.N Corporation", "GBX", "XNGS/NAS-GSM", 54],
          [18, 0, 0, 0, "AAE.OQ", 0, null, null, null, null, "AAE.OQ", "AAE.OQ Co.", "USD", "XNYS/NYS-MAIN", 618],
          [19, 0, 0, 0, "AAE.AS", 0, null, null, null, null, "AAE.AS", "AAE.AS B.V", "CAD", "XAMS/ENA-MAIN", 643],
          [20, 0, 0, 0, "AAF.L", 0, null, null, null, null, "AAF.L", "AAF.L London PLC", "GBX", "XLON/LSE-SETS", 690],
          [21, 0, 0, 0, "AAF.N", 0, null, null, null, null, "AAF.N", "AAF.N Corporation", "CAD", "XNGS/NAS-GSM", 623],
          [22, 0, 0, 0, "AAF.OQ", 0, null, null, null, null, "AAF.OQ", "AAF.OQ Co.", "USD", "XNYS/NYS-MAIN", 167],
          [23, 0, 0, 0, "AAF.AS", 0, null, null, null, null, "AAF.AS", "AAF.AS B.V", "EUR", "XAMS/ENA-MAIN", 410],
          [24, 0, 0, 0, "AAG.L", 0, null, null, null, null, "AAG.L", "AAG.L London PLC", "EUR", "XLON/LSE-SETS", 928],
          [25, 0, 0, 0, "AAG.N", 0, null, null, null, null, "AAG.N", "AAG.N Corporation", "GBX", "XNGS/NAS-GSM", 900],
          [26, 0, 0, 0, "AAG.OQ", 0, null, null, null, null, "AAG.OQ", "AAG.OQ Co.", "CAD", "XNYS/NYS-MAIN", 896],
          [27, 0, 0, 0, "AAG.AS", 0, null, null, null, null, "AAG.AS", "AAG.AS B.V", "USD", "XAMS/ENA-MAIN", 934],
          [28, 0, 0, 0, "AAH.L", 0, null, null, null, null, "AAH.L", "AAH.L London PLC", "USD", "XLON/LSE-SETS", 553],
          [29, 0, 0, 0, "AAH.N", 0, null, null, null, null, "AAH.N", "AAH.N Corporation", "EUR", "XNGS/NAS-GSM", 879],
          [30, 0, 0, 0, "AAH.OQ", 0, null, null, null, null, "AAH.OQ", "AAH.OQ Co.", "GBX", "XNYS/NYS-MAIN", 943],
          [31, 0, 0, 0, "AAH.AS", 0, null, null, null, null, "AAH.AS", "AAH.AS B.V", "GBX", "XAMS/ENA-MAIN", 303],
          [32, 0, 0, 0, "AAI.L", 0, null, null, null, null, "AAI.L", "AAI.L London PLC", "CAD", "XLON/LSE-SETS", 430],
          [33, 0, 0, 0, "AAI.N", 0, null, null, null, null, "AAI.N", "AAI.N Corporation", "EUR", "XNGS/NAS-GSM", 628],
          [34, 0, 0, 0, "AAI.OQ", 0, null, null, null, null, "AAI.OQ", "AAI.OQ Co.", "CAD", "XNYS/NYS-MAIN", 720]
        ]
      });

      expect(uniqueKeys(state.rows)).toEqual(true);

    })

  })

  describe('real world tests', () => {

    test('doomed rows removed, keys reclaimed', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 100, range: { lo: 0, hi: 20 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1000, rows: getRows(0, 120) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 3, hi: 23 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 16, hi: 36 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 46, hi: 66 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 73, hi: 93 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1000, rows: getRows(120, 193) });

      state = GridDataReducer(state, { type: 'range', range: { lo: 103, hi: 123 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 122, hi: 142 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 137, hi: 157 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1000, rows: getRows(193, 257) });
      expect(state.buffer.length).toBe(220);

      state = GridDataReducer(state, { type: 'range', range: { lo: 150, hi: 170 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 160, hi: 180 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 165, hi: 185 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 168, hi: 188 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 170, hi: 190 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 172, hi: 192 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 174, hi: 194 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 175, hi: 195 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 177, hi: 197 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 178, hi: 198 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 180, hi: 200 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 181, hi: 201 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 182, hi: 202 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 183, hi: 203 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 184, hi: 204 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 185, hi: 205 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 186, hi: 206 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 187, hi: 207 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1000, rows: getRows(257, 307) });
      expect(state.buffer.length).toBe(220);


      state = GridDataReducer(state, { type: 'range', range: { lo: 188, hi: 208 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 189, hi: 209 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 190, hi: 210 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 191, hi: 211 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 192, hi: 212 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 193, hi: 213 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 194, hi: 214 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 195, hi: 215 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 203, hi: 223 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 211, hi: 231 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 237, hi: 257 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1000, rows: getRows(307, 357) });
      expect(state.buffer.length).toBe(220);

      state = GridDataReducer(state, { type: 'range', range: { lo: 269, hi: 289 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 290, hi: 310 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1000, rows: getRows(357, 410) });

      expect(state.buffer.length).toBe(220);

    });

    test('jump into moddel of dataset, then scroll backwards', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 10, range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows:[
        [0,0,0,0,"TFSC",0,null,null,null,null,"TFSC","1347 Capital Corp.",9.4345671,56090000,"2014","Finance","Business Services"],
        [1,0,0,0,"PIH",0,null,null,null,null,"PIH","1347 Property Insurance Holdings, Inc.",7.6400987,48580000,"2014","Finance","Property-Casualty Insurers"],
        [2,0,0,0,"FLWS",0,null,null,null,null,"FLWS","1-800 FLOWERS.COM, Inc.",10.3300001,668420000,"1999","Consumer Services","Other Specialty Stores"],
        [3,0,0,0,"VNET",0,null,null,null,null,"VNET","21Vianet Group, Inc.",19.05,1250000000,"2011","Technology","Computer Software: Programming, Data Processing"],
        [4,0,0,0,"TWOU",0,null,null,null,null,"TWOU","2U, Inc.",17.11,693670000,"2014","Technology","Computer Software: Prepackaged Software"],
        [5,0,0,0,"JOBS",0,null,null,null,null,"JOBS","51job, Inc.",34.86,2060000000,"2004","Technology","Diversified Commercial Services"],
        [6,0,0,0,"SHLM",0,null,null,null,null,"SHLM","A. Schulman, Inc.",39.83,1160000000,"1972","Basic Industries","Major Chemicals"],
        [7,0,0,0,"ABAX",0,null,null,null,null,"ABAX","ABAXIS, Inc.",60.93,1370000000,"1992","Capital Goods","Industrial Machinery/Components"],
        [8,0,0,0,"ABY",0,null,null,null,null,"ABY","Abengoa Yield plc",34.4,2750000000,"2014","Public Utilities","Electric Utilities: Central"],
        [9,0,0,0,"ABGB",0,null,null,null,null,"ABGB","Abengoa, S.A.",15.52,2610000000,"2013","Consumer Services","Military/Government/Technical"],
        [10,0,0,0,"ACAD",0,null,null,null,null,"ACAD","ACADIA Pharmaceuticals Inc.",34.21,3410000000,"1985","Health Care","Major Pharmaceuticals"],
        [11,0,0,0,"XLRN",0,null,null,null,null,"XLRN","Acceleron Pharma Inc.",38.02,1230000000,"2013","Health Care","Biotechnology: Biological Products (No Diagnostic Substances)"],
        [12,0,0,0,"ARAY",0,null,null,null,null,"ARAY","Accuray Incorporated",8,627920000,"2007","Health Care","Medical/Dental Instruments"],
        [13,0,0,0,"ACRX",0,null,null,null,null,"ACRX","AcelRx Pharmaceuticals, Inc.",7.29,318630000,"2011","Health Care","Major Pharmaceuticals"],
        [14,0,0,0,"AKAO",0,null,null,null,null,"AKAO","Achaogen, Inc.",11.11,197290000,"2014","Health Care","Major Pharmaceuticals"],
        [15,0,0,0,"ACHN",0,null,null,null,null,"ACHN","Achillion Pharmaceuticals, Inc.",10.89,1090000000,"2006","Health Care","Major Pharmaceuticals"],
        [16,0,0,0,"ACOR",0,null,null,null,null,"ACOR","Acorda Therapeutics, Inc.",36.14,1520000000,"2006","Health Care","Biotechnology: Biological Products (No Diagnostic Substances)"],
        [17,0,0,0,"ACTS",0,null,null,null,null,"ACTS","Actions Semiconductor Co., Ltd.",1.54,132440000,"2005","Technology","Semiconductors"],
        [18,0,0,0,"ACPW",0,null,null,null,null,"ACPW","Active Power, Inc.",1.86,42950000,"2000","Public Utilities","Electric Utilities: Central"],
        [19,0,0,0,"ADMS",0,null,null,null,null,"ADMS","Adamas Pharmaceuticals, Inc.",16.98,290800000,"2014","Health Care","Major Pharmaceuticals"],
        [20,0,0,0,"ADUS",0,null,null,null,null,"ADUS","Addus HomeCare Corporation",21.57,237050000,"2009","Health Care","Medical/Nursing Services"],
        [21,0,0,0,"ADBE",0,null,null,null,null,"ADBE","Adobe Systems Incorporated",76.51,38130000000,"1986","Technology","Computer Software: Prepackaged Software"],
        [22,0,0,0,"ADTN",0,null,null,null,null,"ADTN","ADTRAN, Inc.",23.11,1260000000,"1994","Public Utilities","Telecommunications Equipment"],
        [23,0,0,0,"AEIS",0,null,null,null,null,"AEIS","Advanced Energy Industries, Inc.",26.68,1070000000,"1995","Capital Goods","Industrial Machinery/Components"],
        [24,0,0,0,"ADVS",0,null,null,null,null,"ADVS","Advent Software, Inc.",44.18,2280000000,"1995","Technology","EDP Services"],
        [25,0,0,0,"AEGR",0,null,null,null,null,"AEGR","Aegerion Pharmaceuticals, Inc.",25.15,715170000,"2010","Health Care","Major Pharmaceuticals"],
        [26,0,0,0,"AEHR",0,null,null,null,null,"AEHR","Aehr Test Systems",2.47,31300000,"1997","Capital Goods","Electrical Products"],
        [27,0,0,0,"AEPI",0,null,null,null,null,"AEPI","AEP Industries Inc.",49.71,252560000,"1986","Capital Goods","Specialty Chemicals"],
        [28,0,0,0,"AERI",0,null,null,null,null,"AERI","Aerie Pharmaceuticals, Inc.",27.91,669410000,"2013","Health Care","Biotechnology: Biological Products (No Diagnostic Substances)"],
        [29,0,0,0,"AVAV",0,null,null,null,null,"AVAV","AeroVironment, Inc.",26.86,626430000,"2007","Capital Goods","Aerospace"],
        [30,0,0,0,"AFMD",0,null,null,null,null,"AFMD","Affimed N.V.",5.7,136710000,"2014","Health Care","Major Pharmaceuticals"],
        [31,0,0,0,"AFFX",0,null,null,null,null,"AFFX","Affymetrix, Inc.",11.45,842530000,"1996","Capital Goods","Biotechnology: Laboratory Analytical Instruments"],
        [32,0,0,0,"AGEN",0,null,null,null,null,"AGEN","Agenus Inc.",5.03,315300000,"2000","Health Care","Biotechnology: Biological Products (No Diagnostic Substances)"],
        [33,0,0,0,"AGRX",0,null,null,null,null,"AGRX","Agile Therapeutics, Inc.",8.57,171500000,"2014","Health Care","Major Pharmaceuticals"],
        [34,0,0,0,"AGIO",0,null,null,null,null,"AGIO","Agios Pharmaceuticals, Inc.",118.55,4380000000,"2013","Health Care","Major Pharmaceuticals"]
      ] });


      state = GridDataReducer(state, { type: 'range', range: { lo: 417, hi: 442 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: [
        [407,0,0,0,"EPIQ",0,null,null,null,null,"EPIQ","EPIQ Systems, Inc.",18.3,666250000,"1997","Technology","EDP Services"],
        [408,0,0,0,"EPZM",0,null,null,null,null,"EPZM","Epizyme, Inc.",21.58,737240000,"2013","Health Care","Major Pharmaceuticals"],
        [409,0,0,0,"PLUS",0,null,null,null,null,"PLUS","ePlus inc.",80.17,592480000,"1996","Technology","Retail: Computer Software & Peripheral Equipment"],
        [410,0,0,0,"EQIX",0,null,null,null,null,"EQIX","Equinix, Inc.",227.7,12140000000,"2000","Public Utilities","Telecommunications Equipment"],
        [411,0,0,0,"EAC",0,null,null,null,null,"EAC","Erickson Incorporated",7.19,99320000,"2012","Capital Goods","Aerospace"],
        [412,0,0,0,"ESPR",0,null,null,null,null,"ESPR","Esperion Therapeutics, Inc.",67.13,1370000000,"2013","Health Care","Major Pharmaceuticals"],
        [413,0,0,0,"CLWT",0,null,null,null,null,"CLWT","Euro Tech Holdings Company Limited",2.69,6000000,"1997","Consumer Durables","Diversified Electronic Products"],
        [414,0,0,0,"EEFT",0,null,null,null,null,"EEFT","Euronet Worldwide, Inc.",53.96,2840000000,"1997","Finance","Investment Bankers/Brokers/Service"],
        [415,0,0,0,"EVEP",0,null,null,null,null,"EVEP","EV Energy Partners, L.P.",16.82,816980000,"2006","Energy","Oil & Gas Production"],
        [416,0,0,0,"EVRY",0,null,null,null,null,"EVRY","EveryWare Global, Inc.",1,22120000,"2012","Consumer Durables","Home Furnishings"],
        [417,0,0,0,"EVOK",0,null,null,null,null,"EVOK","Evoke Pharma, Inc.",5.41,33070000,"2013","Health Care","Major Pharmaceuticals"],
        [418,0,0,0,"EVOL",0,null,null,null,null,"EVOL","Evolving Systems, Inc.",8.83,102990000,"1998","Technology","EDP Services"],
        [419,0,0,0,"EXA",0,null,null,null,null,"EXA","Exa Corporation",10.46,144740000,"2012","Technology","Computer Software: Prepackaged Software"],
        [420,0,0,0,"EXAS",0,null,null,null,null,"EXAS","EXACT Sciences Corporation",25.56,2160000000,"2001","Health Care","Biotechnology: Commercial Physical & Biological Resarch"],
        [421,0,0,0,"EXAC",0,null,null,null,null,"EXAC","Exactech, Inc.",22.33,308340000,"1996","Health Care","Industrial Specialties"],
        [422,0,0,0,"EXEL",0,null,null,null,null,"EXEL","Exelixis, Inc.",2.48,484140000,"2000","Health Care","Biotechnology: Commercial Physical & Biological Resarch"],
        [423,0,0,0,"EXLS",0,null,null,null,null,"EXLS","ExlService Holdings, Inc.",31.34,1030000000,"2006","Miscellaneous","Business Services"],
        [424,0,0,0,"ESRX",0,null,null,null,null,"ESRX","Express Scripts Holding Company",84.9,62310000000,"1992","Health Care","Medical/Nursing Services"],
        [425,0,0,0,"EXTR",0,null,null,null,null,"EXTR","Extreme Networks, Inc.",3.46,343670000,"1999","Technology","Computer Communications Equipment"],
        [426,0,0,0,"EZPW",0,null,null,null,null,"EZPW","EZCORP, Inc.",9.96,534360000,"1991","Consumer Services","Other Specialty Stores"],
        [427,0,0,0,"FFIV",0,null,null,null,null,"FFIV","F5 Networks, Inc.",116.635,8410000000,"1999","Technology","Computer Communications Equipment"],
        [428,0,0,0,"FB",0,null,null,null,null,"FB","Facebook, Inc.",75.74,212000000000,"2012","Technology","Computer Software: Programming, Data Processing"],
        [429,0,0,0,"FCS",0,null,null,null,null,"FCS","Fairchild Semiconductor International, Inc.",16.37,1940000000,"1999","Technology","Semiconductors"],
        [430,0,0,0,"FWM",0,null,null,null,null,"FWM","Fairway Group Holdings Corp.",5.55,241910000,"2013","Consumer Services","Food Chains"],
        [431,0,0,0,"FARO",0,null,null,null,null,"FARO","FARO Technologies, Inc.",58.65,1010000000,"1997","Capital Goods","Industrial Machinery/Components"],
        [432,0,0,0,"FAST",0,null,null,null,null,"FAST","Fastenal Company",42.5,12570000000,"1987","Consumer Services","RETAIL: Building Materials"],
        [433,0,0,0,"FATE",0,null,null,null,null,"FATE","Fate Therapeutics, Inc.",5,102850000,"2013","Health Care","Biotechnology: Biological Products (No Diagnostic Substances)"],
        [434,0,0,0,"FEIC",0,null,null,null,null,"FEIC","FEI Company",79.99,3320000000,"1995","Capital Goods","Biotechnology: Laboratory Analytical Instruments"],
        [435,0,0,0,"FGEN",0,null,null,null,null,"FGEN","FibroGen, Inc",30.25,1710000000,"2014","Health Care","Major Pharmaceuticals"],
        [436,0,0,0,"FSAM",0,null,null,null,null,"FSAM","Fifth Street Asset Management Inc.",12.11,591660000,"2014","Finance","Investment Managers"],
        [437,0,0,0,"FNGN",0,null,null,null,null,"FNGN","Financial Engines, Inc.",39.76,2070000000,"2010","Finance","Investment Managers"],
        [438,0,0,0,"FISI",0,null,null,null,null,"FISI","Financial Institutions, Inc.",22.98,323980000,"1999","Finance","Major Banks"],
        [439,0,0,0,"FNSR",0,null,null,null,null,"FNSR","Finisar Corporation",20.75,2150000000,"1999","Technology","Semiconductors"],
        [440,0,0,0,"FEYE",0,null,null,null,null,"FEYE","FireEye, Inc.",42.26,6360000000,"2013","Technology","Computer peripheral equipment"],
        [441,0,0,0,"FBNC",0,null,null,null,null,"FBNC","First Bancorp",17.2,338930000,"1987","Finance","Major Banks"],
        [442,0,0,0,"FCVA",0,null,null,null,null,"FCVA","First Capital Bancorp, Inc. (VA)",4.289,55180000,"2007","Finance","Major Banks"],
        [443,0,0,0,"FCFS",0,null,null,null,null,"FCFS","First Cash Financial Services, Inc.",48.92,1380000000,"1991","Consumer Services","Other Specialty Stores"],
        [444,0,0,0,"FBNK",0,null,null,null,null,"FBNK","First Connecticut Bancorp, Inc.",15.2,243600000,"2011","Finance","Banks"],
        [445,0,0,0,"FIBK",0,null,null,null,null,"FIBK","First Interstate BancSystem, Inc.",26.15,1190000000,"2010","Finance","Major Banks"],
        [446,0,0,0,"FNBC",0,null,null,null,null,"FNBC","First NBC Bank Holding Company",33.58,623750000,"2013","Finance","Major Banks"],
        [447,0,0,0,"FSGI",0,null,null,null,null,"FSGI","First Security Group, Inc.",2.27,151700000,"2005","Finance","Major Banks"],
        [448,0,0,0,"FSLR",0,null,null,null,null,"FSLR","First Solar, Inc.",48.84,4890000000,"2006","Technology","Semiconductors"],
        [449,0,0,0,"FISV",0,null,null,null,null,"FISV","Fiserv, Inc.",78.7,19200000000,"1986","Technology","EDP Services"],
        [450,0,0,0,"FIVE",0,null,null,null,null,"FIVE","Five Below, Inc.",33.01,1790000000,"2012","Consumer Services","Department/Specialty Retail Stores"],
        [451,0,0,0,"FPRX",0,null,null,null,null,"FPRX","Five Prime Therapeutics, Inc.",24.63,627150000,"2013","Health Care","Major Pharmaceuticals"]
      ] });

      state = GridDataReducer(state, { type: 'range', range: { lo: 416, hi: 441 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 414, hi: 439 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 412, hi: 437 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 409, hi: 434 } });

      expect(state.bufferIdx).toEqual({lo:2, hi: 27});

      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: [
        [399,0,0,0,"ENPH",0,null,null,null,null,"ENPH","Enphase Energy, Inc.",15.15,660910000,"2012","Technology","Semiconductors"],
        [400,0,0,0,"ENFC",0,null,null,null,null,"ENFC","Entegra Financial Corp.",15.4,100810000,"2014","Finance","Banks"],
        [401,0,0,0,"ENTG",0,null,null,null,null,"ENTG","Entegris, Inc.",13.5,1880000000,"2000","Consumer Non-Durables","Plastic Products"],
        [402,0,0,0,"ETRM",0,null,null,null,null,"ETRM","EnteroMedics Inc.",1.21,83620000,"2007","Health Care","Biotechnology: Electromedical & Electrotherapeutic Apparatus"],
        [403,0,0,0,"ENTR",0,null,null,null,null,"ENTR","Entropic Communications, Inc.",2.92,263010000,"2007","Technology","Semiconductors"],
        [404,0,0,0,"ENVI",0,null,null,null,null,"ENVI","Envivio, Inc.",1.45,40180000,"2012","Technology","Radio And Television Broadcasting And Communications Equipment"],
        [405,0,0,0,"ENZN",0,null,null,null,null,"ENZN","Enzon Pharmaceuticals, Inc.",0.99,43700000,"1984","Health Care","Biotechnology: Biological Products (No Diagnostic Substances)"],
        [406,0,0,0,"ENZY",0,null,null,null,null,"ENZY","Enzymotec Ltd.",5.68,125610000,"2013","Consumer Durables","Specialty Chemicals"]
      ] });

    expect(state.buffer.length).toEqual(45);
    expect(state.bufferIdx).toEqual({lo:10, hi: 35});


    state = GridDataReducer(state, { type: 'range', range: { lo: 406, hi: 431 } });
    state = GridDataReducer(state, { type: 'range', range: { lo: 403, hi: 428 } });

    state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: [
      [393,0,0,0,"WIRE",0,null,null,null,null,"WIRE","Encore Wire Corporation",34.7,718990000,"1992","Capital Goods","Metal Fabrications"],
      [394,0,0,0,"ECYT",0,null,null,null,null,"ECYT","Endocyte, Inc.",5.26,219400000,"2011","Health Care","Major Pharmaceuticals"],
      [395,0,0,0,"EIGI",0,null,null,null,null,"EIGI","Endurance International Group Holdings, Inc.",19.49,2580000000,"2013","Technology","Computer Software: Prepackaged Software"],
      [396,0,0,0,"WATT",0,null,null,null,null,"WATT","Energous Corporation",9.43,120530000,"2014","Technology","Radio And Television Broadcasting And Communications Equipment"],
      [397,0,0,0,"ERII",0,null,null,null,null,"ERII","Energy Recovery, Inc.",3.36,174310000,"2008","Technology","Industrial Machinery/Components"],
      [398,0,0,0,"ENOC",0,null,null,null,null,"ENOC","EnerNOC, Inc.",18.24,532160000,"2007","Technology","Computer Software: Programming, Data Processing"]
    ] });

    expect(uniqueKeys(state.rows)).toEqual(true);

    })


    test('jump to near end, scroll backwards', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 100, range: { lo: 0, hi: 40 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: getRows(0, 140) });

      state = GridDataReducer(state, { type: 'range', range: { lo: 1104, hi: 1144 } });
      state = GridDataReducer(state, { type: 'data', rowCount: 1247, rows: getRows(1004, 1244) });

      state = GridDataReducer(state, { type: 'range', range: { lo: 1103, hi: 1143 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1100, hi: 1140 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1094, hi: 1134 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1082, hi: 1122 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1071, hi: 1111 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1061, hi: 1101 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1049, hi: 1089 } });

      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1247, rows: getRows(949, 1004) });

      expect(state.rows).toEqual([
        [1049, 25, 0, 0, 'key-049'],
        [1050, 26, 0, 0, 'key-050'],
        [1051, 27, 0, 0, 'key-051'],
        [1052, 28, 0, 0, 'key-052'],
        [1053, 29, 0, 0, 'key-053'],
        [1054, 30, 0, 0, 'key-054'],
        [1055, 31, 0, 0, 'key-055'],
        [1056, 32, 0, 0, 'key-056'],
        [1057, 33, 0, 0, 'key-057'],
        [1058, 34, 0, 0, 'key-058'],
        [1059, 35, 0, 0, 'key-059'],
        [1060, 36, 0, 0, 'key-060'],
        [1061, 37, 0, 0, 'key-061'],
        [1062, 38, 0, 0, 'key-062'],
        [1063, 39, 0, 0, 'key-063'],
        [1064, 0, 0, 0, 'key-064'],
        [1065, 1, 0, 0, 'key-065'],
        [1066, 2, 0, 0, 'key-066'],
        [1067, 3, 0, 0, 'key-067'],
        [1068, 4, 0, 0, 'key-068'],
        [1069, 5, 0, 0, 'key-069'],
        [1070, 6, 0, 0, 'key-070'],
        [1071, 7, 0, 0, 'key-071'],
        [1072, 8, 0, 0, 'key-072'],
        [1073, 9, 0, 0, 'key-073'],
        [1074, 10, 0, 0, 'key-074'],
        [1075, 11, 0, 0, 'key-075'],
        [1076, 12, 0, 0, 'key-076'],
        [1077, 13, 0, 0, 'key-077'],
        [1078, 14, 0, 0, 'key-078'],
        [1079, 15, 0, 0, 'key-079'],
        [1080, 16, 0, 0, 'key-080'],
        [1081, 17, 0, 0, 'key-081'],
        [1082, 18, 0, 0, 'key-082'],
        [1083, 19, 0, 0, 'key-083'],
        [1084, 20, 0, 0, 'key-084'],
        [1085, 21, 0, 0, 'key-085'],
        [1086, 22, 0, 0, 'key-086'],
        [1087, 23, 0, 0, 'key-087'],
        [1088, 24, 0, 0, 'key-088']
      ]);

    });

    test('jump to near end, scroll backwards, using renderBuffer', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 100, range: { lo: 0, hi: 63 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1247, rows: getRows(0, 163) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1186, hi: 1269 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1247, rows: getRows(1086, 1247) });
      state = GridDataReducer(state, { type: 'range', range: { lo: 1184, hi: 1267 } });


    })

    test('scroll gently forward, then backwards', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 100, range: { lo: 0, hi: 40 } });
      state = GridDataReducer(state, { type: 'data', offset: 100, rowCount: 1247, rows: getRows(0, 140) });

      state = GridDataReducer(state, { type: 'range', range: { lo: 1, hi: 41 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 2, hi: 42 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 3, hi: 43 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 4, hi: 44 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 3, hi: 43 } });

    });


    test('scroll ahead quickly, with buffering, then backwards', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 10, range: { lo: 0, hi: 25 } });




      // check keys are unique
      expect(uniqueKeys(state.rows)).toEqual(true);

    })

    test('short forward scroll burst, then back, before data refresh', () => {

      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 10, range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [0, 0, 0, 0, "TFSC", 0, null, null, null, null, "TFSC", "1347 Capital Corp.", 9.4345671, 56090000, "2014", "Finance", "Business Services"],
          [1, 0, 0, 0, "PIH", 0, null, null, null, null, "PIH", "1347 Property Insurance Holdings, Inc.", 7.6400987, 48580000, "2014", "Finance", "Property-Casualty Insurers"],
          [2, 0, 0, 0, "FLWS", 0, null, null, null, null, "FLWS", "1-800 FLOWERS.COM, Inc.", 10.3300001, 668420000, "1999", "Consumer Services", "Other Specialty Stores"],
          [3, 0, 0, 0, "VNET", 0, null, null, null, null, "VNET", "21Vianet Group, Inc.", 19.05, 1250000000, "2011", "Technology", "Computer Software: Programming, Data Processing"],
          [4, 0, 0, 0, "TWOU", 0, null, null, null, null, "TWOU", "2U, Inc.", 17.11, 693670000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [5, 0, 0, 0, "JOBS", 0, null, null, null, null, "JOBS", "51job, Inc.", 34.86, 2060000000, "2004", "Technology", "Diversified Commercial Services"],
          [6, 0, 0, 0, "SHLM", 0, null, null, null, null, "SHLM", "A. Schulman, Inc.", 39.83, 1160000000, "1972", "Basic Industries", "Major Chemicals"],
          [7, 0, 0, 0, "ABAX", 0, null, null, null, null, "ABAX", "ABAXIS, Inc.", 60.93, 1370000000, "1992", "Capital Goods", "Industrial Machinery/Components"],
          [8, 0, 0, 0, "ABY", 0, null, null, null, null, "ABY", "Abengoa Yield plc", 34.4, 2750000000, "2014", "Public Utilities", "Electric Utilities: Central"],
          [9, 0, 0, 0, "ABGB", 0, null, null, null, null, "ABGB", "Abengoa, S.A.", 15.52, 2610000000, "2013", "Consumer Services", "Military/Government/Technical"],
          [10, 0, 0, 0, "ACAD", 0, null, null, null, null, "ACAD", "ACADIA Pharmaceuticals Inc.", 34.21, 3410000000, "1985", "Health Care", "Major Pharmaceuticals"],
          [11, 0, 0, 0, "XLRN", 0, null, null, null, null, "XLRN", "Acceleron Pharma Inc.", 38.02, 1230000000, "2013", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [12, 0, 0, 0, "ARAY", 0, null, null, null, null, "ARAY", "Accuray Incorporated", 8, 627920000, "2007", "Health Care", "Medical/Dental Instruments"],
          [13, 0, 0, 0, "ACRX", 0, null, null, null, null, "ACRX", "AcelRx Pharmaceuticals, Inc.", 7.29, 318630000, "2011", "Health Care", "Major Pharmaceuticals"],
          [14, 0, 0, 0, "AKAO", 0, null, null, null, null, "AKAO", "Achaogen, Inc.", 11.11, 197290000, "2014", "Health Care", "Major Pharmaceuticals"],
          [15, 0, 0, 0, "ACHN", 0, null, null, null, null, "ACHN", "Achillion Pharmaceuticals, Inc.", 10.89, 1090000000, "2006", "Health Care", "Major Pharmaceuticals"],
          [16, 0, 0, 0, "ACOR", 0, null, null, null, null, "ACOR", "Acorda Therapeutics, Inc.", 36.14, 1520000000, "2006", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [17, 0, 0, 0, "ACTS", 0, null, null, null, null, "ACTS", "Actions Semiconductor Co., Ltd.", 1.54, 132440000, "2005", "Technology", "Semiconductors"],
          [18, 0, 0, 0, "ACPW", 0, null, null, null, null, "ACPW", "Active Power, Inc.", 1.86, 42950000, "2000", "Public Utilities", "Electric Utilities: Central"],
          [19, 0, 0, 0, "ADMS", 0, null, null, null, null, "ADMS", "Adamas Pharmaceuticals, Inc.", 16.98, 290800000, "2014", "Health Care", "Major Pharmaceuticals"],
          [20, 0, 0, 0, "ADUS", 0, null, null, null, null, "ADUS", "Addus HomeCare Corporation", 21.57, 237050000, "2009", "Health Care", "Medical/Nursing Services"],
          [21, 0, 0, 0, "ADBE", 0, null, null, null, null, "ADBE", "Adobe Systems Incorporated", 76.51, 38130000000, "1986", "Technology", "Computer Software: Prepackaged Software"],
          [22, 0, 0, 0, "ADTN", 0, null, null, null, null, "ADTN", "ADTRAN, Inc.", 23.11, 1260000000, "1994", "Public Utilities", "Telecommunications Equipment"],
          [23, 0, 0, 0, "AEIS", 0, null, null, null, null, "AEIS", "Advanced Energy Industries, Inc.", 26.68, 1070000000, "1995", "Capital Goods", "Industrial Machinery/Components"],
          [24, 0, 0, 0, "ADVS", 0, null, null, null, null, "ADVS", "Advent Software, Inc.", 44.18, 2280000000, "1995", "Technology", "EDP Services"],
          [25, 0, 0, 0, "AEGR", 0, null, null, null, null, "AEGR", "Aegerion Pharmaceuticals, Inc.", 25.15, 715170000, "2010", "Health Care", "Major Pharmaceuticals"],
          [26, 0, 0, 0, "AEHR", 0, null, null, null, null, "AEHR", "Aehr Test Systems", 2.47, 31300000, "1997", "Capital Goods", "Electrical Products"],
          [27, 0, 0, 0, "AEPI", 0, null, null, null, null, "AEPI", "AEP Industries Inc.", 49.71, 252560000, "1986", "Capital Goods", "Specialty Chemicals"],
          [28, 0, 0, 0, "AERI", 0, null, null, null, null, "AERI", "Aerie Pharmaceuticals, Inc.", 27.91, 669410000, "2013", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [29, 0, 0, 0, "AVAV", 0, null, null, null, null, "AVAV", "AeroVironment, Inc.", 26.86, 626430000, "2007", "Capital Goods", "Aerospace"],
          [30, 0, 0, 0, "AFMD", 0, null, null, null, null, "AFMD", "Affimed N.V.", 5.7, 136710000, "2014", "Health Care", "Major Pharmaceuticals"],
          [31, 0, 0, 0, "AFFX", 0, null, null, null, null, "AFFX", "Affymetrix, Inc.", 11.45, 842530000, "1996", "Capital Goods", "Biotechnology: Laboratory Analytical Instruments"],
          [32, 0, 0, 0, "AGEN", 0, null, null, null, null, "AGEN", "Agenus Inc.", 5.03, 315300000, "2000", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [33, 0, 0, 0, "AGRX", 0, null, null, null, null, "AGRX", "Agile Therapeutics, Inc.", 8.57, 171500000, "2014", "Health Care", "Major Pharmaceuticals"],
          [34, 0, 0, 0, "AGIO", 0, null, null, null, null, "AGIO", "Agios Pharmaceuticals, Inc.", 118.55, 4380000000, "2013", "Health Care", "Major Pharmaceuticals"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 4, hi: 29 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 9, hi: 34 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [35, 0, 0, 0, "AMCN", 0, null, null, null, null, "AMCN", "AirMedia Group Inc", 2.28, 135810000, "2007", "Technology", "Advertising"],
          [36, 0, 0, 0, "AKAM", 0, null, null, null, null, "AKAM", "Akamai Technologies, Inc.", 68.77, 12240000000, "1999", "Miscellaneous", "Business Services"],
          [37, 0, 0, 0, "AKBA", 0, null, null, null, null, "AKBA", "Akebia Therapeutics, Inc.", 9.32, 189580000, "2014", "Health Care", "Major Pharmaceuticals"],
          [38, 0, 0, 0, "AKER", 0, null, null, null, null, "AKER", "Akers Biosciences Inc", 3.5, 17340000, "2014", "Health Care", "Biotechnology: In Vitro & In Vivo Diagnostic Substances"],
          [39, 0, 0, 0, "ALSK", 0, null, null, null, null, "ALSK", "Alaska Communications Systems Group, Inc.", 1.75, 86690000, "1999", "Public Utilities", "Telecommunications Equipment"],
          [40, 0, 0, 0, "AMRI", 0, null, null, null, null, "AMRI", "Albany Molecular Research, Inc.", 16.94, 552360000, "1999", "Health Care", "Biotechnology: Commercial Physical & Biological Resarch"],
          [41, 0, 0, 0, "ADHD", 0, null, null, null, null, "ADHD", "Alcobra Ltd.", 6.92, 146550000, "2013", "Health Care", "Major Pharmaceuticals"],
          [42, 0, 0, 0, "ALDR", 0, null, null, null, null, "ALDR", "Alder BioPharmaceuticals, Inc.", 26.06, 982630000, "2014", "Health Care", "Major Pharmaceuticals"],
          [43, 0, 0, 0, "ALDX", 0, null, null, null, null, "ALDX", "Aldeyra Therapeutics, Inc.", 11.01, 61280000, "2014", "Health Care", "Major Pharmaceuticals"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 16, hi: 41 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [44, 0, 0, 0, "ALXN", 0, null, null, null, null, "ALXN", "Alexion Pharmaceuticals, Inc.", 182.29, 36850000000, "1996", "Health Care", "Major Pharmaceuticals"],
          [45, 0, 0, 0, "ALXA", 0, null, null, null, null, "ALXA", "Alexza Pharmaceuticals, Inc.", 2.07, 40170000, "2006", "Health Care", "Major Pharmaceuticals"],
          [46, 0, 0, 0, "ALGN", 0, null, null, null, null, "ALGN", "Align Technology, Inc.", 56.9, 4570000000, "2001", "Health Care", "Industrial Specialties"],
          [47, 0, 0, 0, "ALIM", 0, null, null, null, null, "ALIM", "Alimera Sciences, Inc.", 5.16, 228570000, "2010", "Health Care", "Major Pharmaceuticals"],
          [48, 0, 0, 0, "ALKS", 0, null, null, null, null, "ALKS", "Alkermes plc", 71.4, 10440000000, "1991", "Health Care", "Major Pharmaceuticals"],
          [49, 0, 0, 0, "ALGT", 0, null, null, null, null, "ALGT", "Allegiant Travel Company", 178.42, 3120000000, "2006", "Transportation", "Air Freight/Delivery Services"],
          [50, 0, 0, 0, "AFOP", 0, null, null, null, null, "AFOP", "Alliance Fiber Optic Products, Inc.", 16.51, 307950000, "2000", "Technology", "Semiconductors"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 22, hi: 47 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [51, 0, 0, 0, "AIQ", 0, null, null, null, null, "AIQ", "Alliance HealthCare Services, Inc.", 24.99, 268250000, "2001", "Health Care", "Medical Specialities"],
          [52, 0, 0, 0, "AHGP", 0, null, null, null, null, "AHGP", "Alliance Holdings GP, L.P.", 53, 3170000000, "2006", "Energy", "Coal Mining"],
          [53, 0, 0, 0, "ARLP", 0, null, null, null, null, "ARLP", "Alliance Resource Partners, L.P.", 39.29, 2910000000, "1999", "Energy", "Coal Mining"],
          [54, 0, 0, 0, "AHPI", 0, null, null, null, null, "AHPI", "Allied Healthcare Products, Inc.", 1.56, 12520000, "1992", "Health Care", "Industrial Specialties"],
          [55, 0, 0, 0, "ALLT", 0, null, null, null, null, "ALLT", "Allot Communications Ltd.", 9.15, 304210000, "2006", "Technology", "Computer Communications Equipment"],
          [56, 0, 0, 0, "ALNY", 0, null, null, null, null, "ALNY", "Alnylam Pharmaceuticals, Inc.", 95.54, 7830000000, "2004", "Health Care", "Major Pharmaceuticals"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 26, hi: 51 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 28, hi: 53 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [57, 0, 0, 0, "AOSL", 0, null, null, null, null, "AOSL", "Alpha and Omega Semiconductor Limited", 9.05, 241240000, "2010", "Technology", "Semiconductors"],
          [58, 0, 0, 0, "ATEC", 0, null, null, null, null, "ATEC", "Alphatec Holdings, Inc.", 1.34, 133460000, "2006", "Health Care", "Medical/Dental Instruments"],
          [59, 0, 0, 0, "ALTR", 0, null, null, null, null, "ALTR", "Altera Corporation", 35.66, 10870000000, "1988", "Technology", "Semiconductors"],
          [60, 0, 0, 0, "AIMC", 0, null, null, null, null, "AIMC", "Altra Industrial Motion Corp.", 27.85, 741790000, "2006", "Capital Goods", "Industrial Machinery/Components"],
          [61, 0, 0, 0, "AMZN", 0, null, null, null, null, "AMZN", "Amazon.com, Inc.", 381.83, 177320000000, "1997", "Consumer Services", "Catalog/Specialty Distribution"],
          [62, 0, 0, 0, "AMBA", 0, null, null, null, null, "AMBA", "Ambarella, Inc.", 50.71, 1540000000, "2012", "Technology", "Semiconductors"]
        ]
      });

      expect(state.buffer.length).toEqual(45)
      expect(state.bufferIdx).toEqual({ lo: 10, hi: 35 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 29, hi: 54 } });
      expect(state.dataRequired).toEqual(false);
      expect(state.buffer.length).toEqual(45);
      expect(state.bufferIdx).toEqual({ lo: 11, hi: 36 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 30, hi: 55 } });
      expect(state.dataRequired).toEqual(false);
      expect(state.buffer.length).toEqual(45)
      expect(state.bufferIdx).toEqual({ lo: 12, hi: 37 });

      // Turn back

      state = GridDataReducer(state, { type: 'range', range: { lo: 28, hi: 53 } });
      expect(state.dataRequired).toEqual(false);
      expect(state.buffer.length).toEqual(45)
      expect(state.bufferIdx).toEqual({ lo: 10, hi: 35 });

      state = GridDataReducer(state, { type: 'range', range: { lo: 21, hi: 46 } });
      expect(state.dataRequired).toEqual(true);
      expect(state.buffer.length).toEqual(45)
      expect(state.bufferIdx).toEqual({ lo: 3, hi: 28 });


      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [11, 0, 0, 0, "XLRN", 0, null, null, null, null, "XLRN", "Acceleron Pharma Inc.", 38.02, 1230000000, "2013", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [12, 0, 0, 0, "ARAY", 0, null, null, null, null, "ARAY", "Accuray Incorporated", 8, 627920000, "2007", "Health Care", "Medical/Dental Instruments"],
          [13, 0, 0, 0, "ACRX", 0, null, null, null, null, "ACRX", "AcelRx Pharmaceuticals, Inc.", 7.29, 318630000, "2011", "Health Care", "Major Pharmaceuticals"],
          [14, 0, 0, 0, "AKAO", 0, null, null, null, null, "AKAO", "Achaogen, Inc.", 11.11, 197290000, "2014", "Health Care", "Major Pharmaceuticals"],
          [15, 0, 0, 0, "ACHN", 0, null, null, null, null, "ACHN", "Achillion Pharmaceuticals, Inc.", 10.89, 1090000000, "2006", "Health Care", "Major Pharmaceuticals"],
          [16, 0, 0, 0, "ACOR", 0, null, null, null, null, "ACOR", "Acorda Therapeutics, Inc.", 36.14, 1520000000, "2006", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [17, 0, 0, 0, "ACTS", 0, null, null, null, null, "ACTS", "Actions Semiconductor Co., Ltd.", 1.54, 132440000, "2005", "Technology", "Semiconductors"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 11, hi: 36 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [1, 0, 0, 0, "PIH", 0, null, null, null, null, "PIH", "1347 Property Insurance Holdings, Inc.", 7.6400987, 48580000, "2014", "Finance", "Property-Casualty Insurers"],
          [2, 0, 0, 0, "FLWS", 0, null, null, null, null, "FLWS", "1-800 FLOWERS.COM, Inc.", 10.3300001, 668420000, "1999", "Consumer Services", "Other Specialty Stores"],
          [3, 0, 0, 0, "VNET", 0, null, null, null, null, "VNET", "21Vianet Group, Inc.", 19.05, 1250000000, "2011", "Technology", "Computer Software: Programming, Data Processing"],
          [4, 0, 0, 0, "TWOU", 0, null, null, null, null, "TWOU", "2U, Inc.", 17.11, 693670000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [5, 0, 0, 0, "JOBS", 0, null, null, null, null, "JOBS", "51job, Inc.", 34.86, 2060000000, "2004", "Technology", "Diversified Commercial Services"],
          [6, 0, 0, 0, "SHLM", 0, null, null, null, null, "SHLM", "A. Schulman, Inc.", 39.83, 1160000000, "1972", "Basic Industries", "Major Chemicals"],
          [7, 0, 0, 0, "ABAX", 0, null, null, null, null, "ABAX", "ABAXIS, Inc.", 60.93, 1370000000, "1992", "Capital Goods", "Industrial Machinery/Components"],
          [8, 0, 0, 0, "ABY", 0, null, null, null, null, "ABY", "Abengoa Yield plc", 34.4, 2750000000, "2014", "Public Utilities", "Electric Utilities: Central"],
          [9, 0, 0, 0, "ABGB", 0, null, null, null, null, "ABGB", "Abengoa, S.A.", 15.52, 2610000000, "2013", "Consumer Services", "Military/Government/Technical"],
          [10, 0, 0, 0, "ACAD", 0, null, null, null, null, "ACAD", "ACADIA Pharmaceuticals Inc.", 34.21, 3410000000, "1985", "Health Care", "Major Pharmaceuticals"]
        ]
      });


      state = GridDataReducer(state, { type: 'range', range: { lo: 2, hi: 27 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [0, 0, 0, 0, "TFSC", 0, null, null, null, null, "TFSC", "1347 Capital Corp.", 9.4345671, 56090000, "2014", "Finance", "Business Services"]
        ]
      });


    })


    test('from top, scroll  FWD out of viewport, then back to top, then FWD', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 10, range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1000, rows: [
          [0, 0, 0, 0, "TFSC", 0, null, null, null, null, "TFSC", "1347 Capital Corp.", 9.4345671, 56090000, "2014", "Finance", "Business Services"],
          [1, 0, 0, 0, "PIH", 0, null, null, null, null, "PIH", "1347 Property Insurance Holdings, Inc.", 7.6400987, 48580000, "2014", "Finance", "Property-Casualty Insurers"],
          [2, 0, 0, 0, "FLWS", 0, null, null, null, null, "FLWS", "1-800 FLOWERS.COM, Inc.", 10.3300001, 668420000, "1999", "Consumer Services", "Other Specialty Stores"],
          [3, 0, 0, 0, "VNET", 0, null, null, null, null, "VNET", "21Vianet Group, Inc.", 19.05, 1250000000, "2011", "Technology", "Computer Software: Programming, Data Processing"],
          [4, 0, 0, 0, "TWOU", 0, null, null, null, null, "TWOU", "2U, Inc.", 17.11, 693670000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [5, 0, 0, 0, "JOBS", 0, null, null, null, null, "JOBS", "51job, Inc.", 34.86, 2060000000, "2004", "Technology", "Diversified Commercial Services"],
          [6, 0, 0, 0, "SHLM", 0, null, null, null, null, "SHLM", "A. Schulman, Inc.", 39.83, 1160000000, "1972", "Basic Industries", "Major Chemicals"],
          [7, 0, 0, 0, "ABAX", 0, null, null, null, null, "ABAX", "ABAXIS, Inc.", 60.93, 1370000000, "1992", "Capital Goods", "Industrial Machinery/Components"],
          [8, 0, 0, 0, "ABY", 0, null, null, null, null, "ABY", "Abengoa Yield plc", 34.4, 2750000000, "2014", "Public Utilities", "Electric Utilities: Central"],
          [9, 0, 0, 0, "ABGB", 0, null, null, null, null, "ABGB", "Abengoa, S.A.", 15.52, 2610000000, "2013", "Consumer Services", "Military/Government/Technical"],
          [10, 0, 0, 0, "ACAD", 0, null, null, null, null, "ACAD", "ACADIA Pharmaceuticals Inc.", 34.21, 3410000000, "1985", "Health Care", "Major Pharmaceuticals"],
          [11, 0, 0, 0, "XLRN", 0, null, null, null, null, "XLRN", "Acceleron Pharma Inc.", 38.02, 1230000000, "2013", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [12, 0, 0, 0, "ARAY", 0, null, null, null, null, "ARAY", "Accuray Incorporated", 8, 627920000, "2007", "Health Care", "Medical/Dental Instruments"],
          [13, 0, 0, 0, "ACRX", 0, null, null, null, null, "ACRX", "AcelRx Pharmaceuticals, Inc.", 7.29, 318630000, "2011", "Health Care", "Major Pharmaceuticals"],
          [14, 0, 0, 0, "AKAO", 0, null, null, null, null, "AKAO", "Achaogen, Inc.", 11.11, 197290000, "2014", "Health Care", "Major Pharmaceuticals"],
          [15, 0, 0, 0, "ACHN", 0, null, null, null, null, "ACHN", "Achillion Pharmaceuticals, Inc.", 10.89, 1090000000, "2006", "Health Care", "Major Pharmaceuticals"],
          [16, 0, 0, 0, "ACOR", 0, null, null, null, null, "ACOR", "Acorda Therapeutics, Inc.", 36.14, 1520000000, "2006", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [17, 0, 0, 0, "ACTS", 0, null, null, null, null, "ACTS", "Actions Semiconductor Co., Ltd.", 1.54, 132440000, "2005", "Technology", "Semiconductors"],
          [18, 0, 0, 0, "ACPW", 0, null, null, null, null, "ACPW", "Active Power, Inc.", 1.86, 42950000, "2000", "Public Utilities", "Electric Utilities: Central"],
          [19, 0, 0, 0, "ADMS", 0, null, null, null, null, "ADMS", "Adamas Pharmaceuticals, Inc.", 16.98, 290800000, "2014", "Health Care", "Major Pharmaceuticals"],
          [20, 0, 0, 0, "ADUS", 0, null, null, null, null, "ADUS", "Addus HomeCare Corporation", 21.57, 237050000, "2009", "Health Care", "Medical/Nursing Services"],
          [21, 0, 0, 0, "ADBE", 0, null, null, null, null, "ADBE", "Adobe Systems Incorporated", 76.51, 38130000000, "1986", "Technology", "Computer Software: Prepackaged Software"],
          [22, 0, 0, 0, "ADTN", 0, null, null, null, null, "ADTN", "ADTRAN, Inc.", 23.11, 1260000000, "1994", "Public Utilities", "Telecommunications Equipment"],
          [23, 0, 0, 0, "AEIS", 0, null, null, null, null, "AEIS", "Advanced Energy Industries, Inc.", 26.68, 1070000000, "1995", "Capital Goods", "Industrial Machinery/Components"],
          [24, 0, 0, 0, "ADVS", 0, null, null, null, null, "ADVS", "Advent Software, Inc.", 44.18, 2280000000, "1995", "Technology", "EDP Services"],
          [25, 0, 0, 0, "AEGR", 0, null, null, null, null, "AEGR", "Aegerion Pharmaceuticals, Inc.", 25.15, 715170000, "2010", "Health Care", "Major Pharmaceuticals"],
          [26, 0, 0, 0, "AEHR", 0, null, null, null, null, "AEHR", "Aehr Test Systems", 2.47, 31300000, "1997", "Capital Goods", "Electrical Products"],
          [27, 0, 0, 0, "AEPI", 0, null, null, null, null, "AEPI", "AEP Industries Inc.", 49.71, 252560000, "1986", "Capital Goods", "Specialty Chemicals"],
          [28, 0, 0, 0, "AERI", 0, null, null, null, null, "AERI", "Aerie Pharmaceuticals, Inc.", 27.91, 669410000, "2013", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [29, 0, 0, 0, "AVAV", 0, null, null, null, null, "AVAV", "AeroVironment, Inc.", 26.86, 626430000, "2007", "Capital Goods", "Aerospace"],
          [30, 0, 0, 0, "AFMD", 0, null, null, null, null, "AFMD", "Affimed N.V.", 5.7, 136710000, "2014", "Health Care", "Major Pharmaceuticals"],
          [31, 0, 0, 0, "AFFX", 0, null, null, null, null, "AFFX", "Affymetrix, Inc.", 11.45, 842530000, "1996", "Capital Goods", "Biotechnology: Laboratory Analytical Instruments"],
          [32, 0, 0, 0, "AGEN", 0, null, null, null, null, "AGEN", "Agenus Inc.", 5.03, 315300000, "2000", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [33, 0, 0, 0, "AGRX", 0, null, null, null, null, "AGRX", "Agile Therapeutics, Inc.", 8.57, 171500000, "2014", "Health Care", "Major Pharmaceuticals"],
          [34, 0, 0, 0, "AGIO", 0, null, null, null, null, "AGIO", "Agios Pharmaceuticals, Inc.", 118.55, 4380000000, "2013", "Health Care", "Major Pharmaceuticals"]]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 6, hi: 31 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [35, 0, 0, 0, "AMCN", 0, null, null, null, null, "AMCN", "AirMedia Group Inc", 2.28, 135810000, "2007", "Technology", "Advertising"],
          [36, 0, 0, 0, "AKAM", 0, null, null, null, null, "AKAM", "Akamai Technologies, Inc.", 68.77, 12240000000, "1999", "Miscellaneous", "Business Services"],
          [37, 0, 0, 0, "AKBA", 0, null, null, null, null, "AKBA", "Akebia Therapeutics, Inc.", 9.32, 189580000, "2014", "Health Care", "Major Pharmaceuticals"],
          [38, 0, 0, 0, "AKER", 0, null, null, null, null, "AKER", "Akers Biosciences Inc", 3.5, 17340000, "2014", "Health Care", "Biotechnology: In Vitro & In Vivo Diagnostic Substances"],
          [39, 0, 0, 0, "ALSK", 0, null, null, null, null, "ALSK", "Alaska Communications Systems Group, Inc.", 1.75, 86690000, "1999", "Public Utilities", "Telecommunications Equipment"],
          [40, 0, 0, 0, "AMRI", 0, null, null, null, null, "AMRI", "Albany Molecular Research, Inc.", 16.94, 552360000, "1999", "Health Care", "Biotechnology: Commercial Physical & Biological Resarch"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 16, hi: 41 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [41, 0, 0, 0, "ADHD", 0, null, null, null, null, "ADHD", "Alcobra Ltd.", 6.92, 146550000, "2013", "Health Care", "Major Pharmaceuticals"],
          [42, 0, 0, 0, "ALDR", 0, null, null, null, null, "ALDR", "Alder BioPharmaceuticals, Inc.", 26.06, 982630000, "2014", "Health Care", "Major Pharmaceuticals"],
          [43, 0, 0, 0, "ALDX", 0, null, null, null, null, "ALDX", "Aldeyra Therapeutics, Inc.", 11.01, 61280000, "2014", "Health Care", "Major Pharmaceuticals"],
          [44, 0, 0, 0, "ALXN", 0, null, null, null, null, "ALXN", "Alexion Pharmaceuticals, Inc.", 182.29, 36850000000, "1996", "Health Care", "Major Pharmaceuticals"],
          [45, 0, 0, 0, "ALXA", 0, null, null, null, null, "ALXA", "Alexza Pharmaceuticals, Inc.", 2.07, 40170000, "2006", "Health Care", "Major Pharmaceuticals"],
          [46, 0, 0, 0, "ALGN", 0, null, null, null, null, "ALGN", "Align Technology, Inc.", 56.9, 4570000000, "2001", "Health Care", "Industrial Specialties"],
          [47, 0, 0, 0, "ALIM", 0, null, null, null, null, "ALIM", "Alimera Sciences, Inc.", 5.16, 228570000, "2010", "Health Care", "Major Pharmaceuticals"],
          [48, 0, 0, 0, "ALKS", 0, null, null, null, null, "ALKS", "Alkermes plc", 71.4, 10440000000, "1991", "Health Care", "Major Pharmaceuticals"],
          [49, 0, 0, 0, "ALGT", 0, null, null, null, null, "ALGT", "Allegiant Travel Company", 178.42, 3120000000, "2006", "Transportation", "Air Freight/Delivery Services"],
          [50, 0, 0, 0, "AFOP", 0, null, null, null, null, "AFOP", "Alliance Fiber Optic Products, Inc.", 16.51, 307950000, "2000", "Technology", "Semiconductors"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 24, hi: 49 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [51, 0, 0, 0, "AIQ", 0, null, null, null, null, "AIQ", "Alliance HealthCare Services, Inc.", 24.99, 268250000, "2001", "Health Care", "Medical Specialities"],
          [52, 0, 0, 0, "AHGP", 0, null, null, null, null, "AHGP", "Alliance Holdings GP, L.P.", 53, 3170000000, "2006", "Energy", "Coal Mining"],
          [53, 0, 0, 0, "ARLP", 0, null, null, null, null, "ARLP", "Alliance Resource Partners, L.P.", 39.29, 2910000000, "1999", "Energy", "Coal Mining"],
          [54, 0, 0, 0, "AHPI", 0, null, null, null, null, "AHPI", "Allied Healthcare Products, Inc.", 1.56, 12520000, "1992", "Health Care", "Industrial Specialties"],
          [55, 0, 0, 0, "ALLT", 0, null, null, null, null, "ALLT", "Allot Communications Ltd.", 9.15, 304210000, "2006", "Technology", "Computer Communications Equipment"],
          [56, 0, 0, 0, "ALNY", 0, null, null, null, null, "ALNY", "Alnylam Pharmaceuticals, Inc.", 95.54, 7830000000, "2004", "Health Care", "Major Pharmaceuticals"],
          [57, 0, 0, 0, "AOSL", 0, null, null, null, null, "AOSL", "Alpha and Omega Semiconductor Limited", 9.05, 241240000, "2010", "Technology", "Semiconductors"],
          [58, 0, 0, 0, "ATEC", 0, null, null, null, null, "ATEC", "Alphatec Holdings, Inc.", 1.34, 133460000, "2006", "Health Care", "Medical/Dental Instruments"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 35, hi: 60 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [59, 0, 0, 0, "ALTR", 0, null, null, null, null, "ALTR", "Altera Corporation", 35.66, 10870000000, "1988", "Technology", "Semiconductors"],
          [60, 0, 0, 0, "AIMC", 0, null, null, null, null, "AIMC", "Altra Industrial Motion Corp.", 27.85, 741790000, "2006", "Capital Goods", "Industrial Machinery/Components"],
          [61, 0, 0, 0, "AMZN", 0, null, null, null, null, "AMZN", "Amazon.com, Inc.", 381.83, 177320000000, "1997", "Consumer Services", "Catalog/Specialty Distribution"],
          [62, 0, 0, 0, "AMBA", 0, null, null, null, null, "AMBA", "Ambarella, Inc.", 50.71, 1540000000, "2012", "Technology", "Semiconductors"],
          [63, 0, 0, 0, "AMDA", 0, null, null, null, null, "AMDA", "Amedica Corporation", 0.65, 8970000, "2014", "Health Care", "Medical/Dental Instruments"],
          [64, 0, 0, 0, "AGNC", 0, null, null, null, null, "AGNC", "American Capital Agency Corp.", 21.95, 7740000000, "2008", "Consumer Services", "Real Estate Investment Trusts"],
          [65, 0, 0, 0, "MTGE", 0, null, null, null, null, "MTGE", "American Capital Mortgage Investment Corp.", 18.33, 937430000, "2011", "Consumer Services", "Real Estate Investment Trusts"],
          [66, 0, 0, 0, "APEI", 0, null, null, null, null, "APEI", "American Public Education, Inc.", 34.36, 593210000, "2007", "Consumer Services", "Other Consumer Services"],
          [67, 0, 0, 0, "ARII", 0, null, null, null, null, "ARII", "American Railcar Industries, Inc.", 54.26, 1160000000, "2006", "Capital Goods", "Railroads"],
          [68, 0, 0, 0, "ARCP", 0, null, null, null, null, "ARCP", "American Realty Capital Properties, Inc.", 9.4, 8540000000, "2011", "Consumer Services", "Real Estate Investment Trusts"],
          [69, 0, 0, 0, "AMSC", 0, null, null, null, null, "AMSC", "American Superconductor Corporation", 0.7999, 76570000, "1991", "Consumer Durables", "Metal Fabrications"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 45, hi: 70 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [70, 0, 0, 0, "AMWD", 0, null, null, null, null, "AMWD", "American Woodmark Corporation", 43.98, 696160000, "1986", "Basic Industries", "Forest Products"],
          [71, 0, 0, 0, "ABCB", 0, null, null, null, null, "ABCB", "Ameris Bancorp", 25.75, 725140000, "1994", "Finance", "Major Banks"],
          [72, 0, 0, 0, "AMSF", 0, null, null, null, null, "AMSF", "AMERISAFE, Inc.", 43.7, 822560000, "2005", "Finance", "Property-Casualty Insurers"],
          [73, 0, 0, 0, "AMGN", 0, null, null, null, null, "AMGN", "Amgen Inc.", 153.48, 116750000000, "1983", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [74, 0, 0, 0, "FOLD", 0, null, null, null, null, "FOLD", "Amicus Therapeutics, Inc.", 8.36, 796280000, "2007", "Health Care", "Major Pharmaceuticals"],
          [75, 0, 0, 0, "AMKR", 0, null, null, null, null, "AMKR", "Amkor Technology, Inc.", 8.9, 2110000000, "1998", "Technology", "Semiconductors"],
          [76, 0, 0, 0, "AMPH", 0, null, null, null, null, "AMPH", "Amphastar Pharmaceuticals, Inc.", 12.76, 569720000, "2014", "Health Care", "Major Pharmaceuticals"],
          [77, 0, 0, 0, "AMRS", 0, null, null, null, null, "AMRS", "Amyris, Inc.", 2.09, 165270000, "2010", "Basic Industries", "Major Chemicals"],
          [78, 0, 0, 0, "ANAC", 0, null, null, null, null, "ANAC", "Anacor Pharmaceuticals, Inc.", 40.76, 1750000000, "2010", "Health Care", "Major Pharmaceuticals"],
          [79, 0, 0, 0, "ANAD", 0, null, null, null, null, "ANAD", "ANADIGICS, Inc.", 1.26, 109090000, "1995", "Technology", "Semiconductors"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 54, hi: 79 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [80, 0, 0, 0, "ALOG", 0, null, null, null, null, "ALOG", "Analogic Corporation", 86.55, 1070000000, "1972", "Capital Goods", "Electrical Products"],
          [81, 0, 0, 0, "ANCB", 0, null, null, null, null, "ANCB", "Anchor Bancorp", 22.14, 56460000, "2011", "Finance", "Banks"],
          [82, 0, 0, 0, "ABCW", 0, null, null, null, null, "ABCW", "Anchor BanCorp Wisconsin Inc.", 33.49, 309630000, "2014", "Finance", "Banks"],
          [83, 0, 0, 0, "AMCF", 0, null, null, null, null, "AMCF", "Andatee China Marine Fuel Services Corporation", 1.44, 14770000, "2010", "Energy", "Oil Refining/Marketing"],
          [84, 0, 0, 0, "ANGI", 0, null, null, null, null, "ANGI", "Angie&#39;s List, Inc.", 5.02, 293750000, "2011", "Consumer Services", "Advertising"],
          [85, 0, 0, 0, "ANGO", 0, null, null, null, null, "ANGO", "AngioDynamics, Inc.", 18.78, 672720000, "2004", "Health Care", "Medical/Dental Instruments"],
          [86, 0, 0, 0, "ANSS", 0, null, null, null, null, "ANSS", "ANSYS, Inc.", 86.26, 7930000000, "1996", "Technology", "Computer Software: Prepackaged Software"],
          [87, 0, 0, 0, "ANTH", 0, null, null, null, null, "ANTH", "Anthera Pharmaceuticals, Inc.", 3.84, 88090000, "2010", "Health Care", "Major Pharmaceuticals"],
          [88, 0, 0, 0, "APOL", 0, null, null, null, null, "APOL", "Apollo Education Group, Inc.", 25.97, 2810000000, "1994", "Consumer Services", "Other Consumer Services"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 61, hi: 86 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [89, 0, 0, 0, "AAPL", 0, null, null, null, null, "AAPL", "Apple Inc.", 127.08, 740210000000, "1980", "Technology", "Computer Manufacturing"],
          [90, 0, 0, 0, "AGTC", 0, null, null, null, null, "AGTC", "Applied Genetic Technologies Corporation", 24.49, 401900000, "2014", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [91, 0, 0, 0, "AMAT", 0, null, null, null, null, "AMAT", "Applied Materials, Inc.", 24.12, 29460000000, "1972", "Technology", "Semiconductors"],
          [92, 0, 0, 0, "AMCC", 0, null, null, null, null, "AMCC", "Applied Micro Circuits Corporation", 5.21, 412320000, "1997", "Technology", "Semiconductors"],
          [93, 0, 0, 0, "AAOI", 0, null, null, null, null, "AAOI", "Applied Optoelectronics, Inc.", 10.15, 150380000, "2013", "Technology", "Semiconductors"],
          [94, 0, 0, 0, "AREX", 0, null, null, null, null, "AREX", "Approach Resources Inc.", 8.15, 322380000, "2007", "Energy", "Oil & Gas Production"],
          [95, 0, 0, 0, "AQXP", 0, null, null, null, null, "AQXP", "Aquinox Pharmaceuticals, Inc.", 10.29, 110050000, "2014", "Health Care", "Major Pharmaceuticals"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 75, hi: 100 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [96, 0, 0, 0, "AUMA", 0, null, null, null, null, "AUMA", "AR Capital Acquisition Corp.", 9.75, 292500000, "2014", "Finance", "Business Services"],
          [97, 0, 0, 0, "ARDM", 0, null, null, null, null, "ARDM", "Aradigm Corporation", 7.66, 112810000, "1996", "Health Care", "Biotechnology: Electromedical & Electrotherapeutic Apparatus"],
          [98, 0, 0, 0, "PETX", 0, null, null, null, null, "PETX", "Aratana Therapeutics, Inc.", 16.52, 573330000, "2013", "Health Care", "Major Pharmaceuticals"],
          [99, 0, 0, 0, "ACAT", 0, null, null, null, null, "ACAT", "Arctic Cat Inc.", 39, 504930000, "1990", "Capital Goods", "Industrial Specialties"],
          [100, 0, 0, 0, "ARDX", 0, null, null, null, null, "ARDX", "Ardelyx, Inc.", 17.14, 317780000, "2014", "Health Care", "Major Pharmaceuticals"],
          [101, 0, 0, 0, "ARNA", 0, null, null, null, null, "ARNA", "Arena Pharmaceuticals, Inc.", 4.55, 1000000000, "2000", "Health Care", "Major Pharmaceuticals"],
          [102, 0, 0, 0, "ARGS", 0, null, null, null, null, "ARGS", "Argos Therapeutics, Inc.", 8.35, 164120000, "2014", "Health Care", "Major Pharmaceuticals"],
          [103, 0, 0, 0, "ARIS", 0, null, null, null, null, "ARIS", "ARI Network Services, Inc.", 3.63, 51660000, "1991", "Technology", "Computer Software: Programming, Data Processing"],
          [104, 0, 0, 0, "ARIA", 0, null, null, null, null, "ARIA", "ARIAD Pharmaceuticals, Inc.", 7.35, 1380000000, "1994", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [105, 0, 0, 0, "ARTX", 0, null, null, null, null, "ARTX", "Arotech Corporation", 2.44, 59640000, "1994", "Miscellaneous", "Industrial Machinery/Components"],
          [106, 0, 0, 0, "ARQL", 0, null, null, null, null, "ARQL", "ArQule, Inc.", 1.35, 84740000, "1996", "Health Care", "Major Pharmaceuticals"],
          [107, 0, 0, 0, "ARRY", 0, null, null, null, null, "ARRY", "Array BioPharma Inc.", 8.05, 1120000000, "2000", "Health Care", "Major Pharmaceuticals"],
          [108, 0, 0, 0, "ARUN", 0, null, null, null, null, "ARUN", "Aruba Networks, Inc.", 17.7, 1940000000, "2007", "Technology", "Computer peripheral equipment"],
          [109, 0, 0, 0, "ASBB", 0, null, null, null, null, "ASBB", "ASB Bancorp, Inc.", 19.9, 87130000, "2011", "Finance", "Savings Institutions"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 81, hi: 106 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [110, 0, 0, 0, "ASML", 0, null, null, null, null, "ASML", "ASML Holding N.V.", 104.48, 45680000000, "1995", "Technology", "Industrial Machinery/Components"],
          [111, 0, 0, 0, "AZPN", 0, null, null, null, null, "AZPN", "Aspen Technology, Inc.", 38.4, 3390000000, "1994", "Technology", "EDP Services"],
          [112, 0, 0, 0, "ASFI", 0, null, null, null, null, "ASFI", "Asta Funding, Inc.", 8.46, 109860000, "1995", "Finance", "Finance Companies"],
          [113, 0, 0, 0, "ATEA", 0, null, null, null, null, "ATEA", "Astea International, Inc.", 1.76, 6310000, "1995", "Technology", "Computer Software: Prepackaged Software"],
          [114, 0, 0, 0, "ALOT", 0, null, null, null, null, "ALOT", "Astro-Med, Inc.", 14.65, 106060000, "1983", "Technology", "Computer peripheral equipment"],
          [115, 0, 0, 0, "ATAI", 0, null, null, null, null, "ATAI", "ATA Inc.", 4.15, 95640000, "2008", "Consumer Services", "Other Consumer Services"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 85, hi: 110 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 88, hi: 113 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [116, 0, 0, 0, "ATRA", 0, null, null, null, null, "ATRA", "Atara Biotherapeutics, Inc.", 18, 363830000, "2014", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [117, 0, 0, 0, "ATHN", 0, null, null, null, null, "ATHN", "athenahealth, Inc.", 134.605, 5140000000, "2007", "Miscellaneous", "Business Services"],
          [118, 0, 0, 0, "AFCB", 0, null, null, null, null, "AFCB", "Athens Bancshares Corporation", 24.77, 44630000, "2010", "Finance", "Savings Institutions"],
          [119, 0, 0, 0, "ATLC", 0, null, null, null, null, "ATLC", "Atlanticus Holdings Corporation", 2.9118, 40500000, "1995", "Finance", "Finance: Consumer Services"],
          [120, 0, 0, 0, "AFH", 0, null, null, null, null, "AFH", "Atlas Financial Holdings, Inc.", 17.55, 206590000, "2013", "Finance", "Property-Casualty Insurers"],
          [121, 0, 0, 0, "ATML", 0, null, null, null, null, "ATML", "Atmel Corporation", 8.39, 3500000000, "1991", "Technology", "Semiconductors"],
          [122, 0, 0, 0, "ATOS", 0, null, null, null, null, "ATOS", "Atossa Genetics Inc.", 1.67, 41020000, "2012", "Health Care", "Medical/Dental Instruments"]
        ]
      });

      // turn around
      state = GridDataReducer(state, { type: 'range', range: { lo: 87, hi: 112 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 85, hi: 110 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 70, hi: 95 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [60, 0, 0, 0, "AIMC", 0, null, null, null, null, "AIMC", "Altra Industrial Motion Corp.", 27.85, 741790000, "2006", "Capital Goods", "Industrial Machinery/Components"],
          [61, 0, 0, 0, "AMZN", 0, null, null, null, null, "AMZN", "Amazon.com, Inc.", 381.83, 177320000000, "1997", "Consumer Services", "Catalog/Specialty Distribution"],
          [62, 0, 0, 0, "AMBA", 0, null, null, null, null, "AMBA", "Ambarella, Inc.", 50.71, 1540000000, "2012", "Technology", "Semiconductors"],
          [63, 0, 0, 0, "AMDA", 0, null, null, null, null, "AMDA", "Amedica Corporation", 0.65, 8970000, "2014", "Health Care", "Medical/Dental Instruments"],
          [64, 0, 0, 0, "AGNC", 0, null, null, null, null, "AGNC", "American Capital Agency Corp.", 21.95, 7740000000, "2008", "Consumer Services", "Real Estate Investment Trusts"],
          [65, 0, 0, 0, "MTGE", 0, null, null, null, null, "MTGE", "American Capital Mortgage Investment Corp.", 18.33, 937430000, "2011", "Consumer Services", "Real Estate Investment Trusts"],
          [66, 0, 0, 0, "APEI", 0, null, null, null, null, "APEI", "American Public Education, Inc.", 34.36, 593210000, "2007", "Consumer Services", "Other Consumer Services"],
          [67, 0, 0, 0, "ARII", 0, null, null, null, null, "ARII", "American Railcar Industries, Inc.", 54.26, 1160000000, "2006", "Capital Goods", "Railroads"],
          [68, 0, 0, 0, "ARCP", 0, null, null, null, null, "ARCP", "American Realty Capital Properties, Inc.", 9.4, 8540000000, "2011", "Consumer Services", "Real Estate Investment Trusts"],
          [69, 0, 0, 0, "AMSC", 0, null, null, null, null, "AMSC", "American Superconductor Corporation", 0.7999, 76570000, "1991", "Consumer Durables", "Metal Fabrications"],
          [70, 0, 0, 0, "AMWD", 0, null, null, null, null, "AMWD", "American Woodmark Corporation", 43.98, 696160000, "1986", "Basic Industries", "Forest Products"],
          [71, 0, 0, 0, "ABCB", 0, null, null, null, null, "ABCB", "Ameris Bancorp", 25.75, 725140000, "1994", "Finance", "Major Banks"],
          [72, 0, 0, 0, "AMSF", 0, null, null, null, null, "AMSF", "AMERISAFE, Inc.", 43.7, 822560000, "2005", "Finance", "Property-Casualty Insurers"],
          [73, 0, 0, 0, "AMGN", 0, null, null, null, null, "AMGN", "Amgen Inc.", 153.48, 116750000000, "1983", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [74, 0, 0, 0, "FOLD", 0, null, null, null, null, "FOLD", "Amicus Therapeutics, Inc.", 8.36, 796280000, "2007", "Health Care", "Major Pharmaceuticals"],
          [75, 0, 0, 0, "AMKR", 0, null, null, null, null, "AMKR", "Amkor Technology, Inc.", 8.9, 2110000000, "1998", "Technology", "Semiconductors"],
          [76, 0, 0, 0, "AMPH", 0, null, null, null, null, "AMPH", "Amphastar Pharmaceuticals, Inc.", 12.76, 569720000, "2014", "Health Care", "Major Pharmaceuticals"],
          [77, 0, 0, 0, "AMRS", 0, null, null, null, null, "AMRS", "Amyris, Inc.", 2.09, 165270000, "2010", "Basic Industries", "Major Chemicals"]
        ]
      });
      state = GridDataReducer(state, { type: 'range', range: { lo: 46, hi: 71 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [36, 0, 0, 0, "AKAM", 0, null, null, null, null, "AKAM", "Akamai Technologies, Inc.", 68.77, 12240000000, "1999", "Miscellaneous", "Business Services"],
          [37, 0, 0, 0, "AKBA", 0, null, null, null, null, "AKBA", "Akebia Therapeutics, Inc.", 9.32, 189580000, "2014", "Health Care", "Major Pharmaceuticals"],
          [38, 0, 0, 0, "AKER", 0, null, null, null, null, "AKER", "Akers Biosciences Inc", 3.5, 17340000, "2014", "Health Care", "Biotechnology: In Vitro & In Vivo Diagnostic Substances"],
          [39, 0, 0, 0, "ALSK", 0, null, null, null, null, "ALSK", "Alaska Communications Systems Group, Inc.", 1.75, 86690000, "1999", "Public Utilities", "Telecommunications Equipment"],
          [40, 0, 0, 0, "AMRI", 0, null, null, null, null, "AMRI", "Albany Molecular Research, Inc.", 16.94, 552360000, "1999", "Health Care", "Biotechnology: Commercial Physical & Biological Resarch"],
          [41, 0, 0, 0, "ADHD", 0, null, null, null, null, "ADHD", "Alcobra Ltd.", 6.92, 146550000, "2013", "Health Care", "Major Pharmaceuticals"],
          [42, 0, 0, 0, "ALDR", 0, null, null, null, null, "ALDR", "Alder BioPharmaceuticals, Inc.", 26.06, 982630000, "2014", "Health Care", "Major Pharmaceuticals"],
          [43, 0, 0, 0, "ALDX", 0, null, null, null, null, "ALDX", "Aldeyra Therapeutics, Inc.", 11.01, 61280000, "2014", "Health Care", "Major Pharmaceuticals"],
          [44, 0, 0, 0, "ALXN", 0, null, null, null, null, "ALXN", "Alexion Pharmaceuticals, Inc.", 182.29, 36850000000, "1996", "Health Care", "Major Pharmaceuticals"],
          [45, 0, 0, 0, "ALXA", 0, null, null, null, null, "ALXA", "Alexza Pharmaceuticals, Inc.", 2.07, 40170000, "2006", "Health Care", "Major Pharmaceuticals"],
          [46, 0, 0, 0, "ALGN", 0, null, null, null, null, "ALGN", "Align Technology, Inc.", 56.9, 4570000000, "2001", "Health Care", "Industrial Specialties"],
          [47, 0, 0, 0, "ALIM", 0, null, null, null, null, "ALIM", "Alimera Sciences, Inc.", 5.16, 228570000, "2010", "Health Care", "Major Pharmaceuticals"],
          [48, 0, 0, 0, "ALKS", 0, null, null, null, null, "ALKS", "Alkermes plc", 71.4, 10440000000, "1991", "Health Care", "Major Pharmaceuticals"],
          [49, 0, 0, 0, "ALGT", 0, null, null, null, null, "ALGT", "Allegiant Travel Company", 178.42, 3120000000, "2006", "Transportation", "Air Freight/Delivery Services"],
          [50, 0, 0, 0, "AFOP", 0, null, null, null, null, "AFOP", "Alliance Fiber Optic Products, Inc.", 16.51, 307950000, "2000", "Technology", "Semiconductors"],
          [51, 0, 0, 0, "AIQ", 0, null, null, null, null, "AIQ", "Alliance HealthCare Services, Inc.", 24.99, 268250000, "2001", "Health Care", "Medical Specialities"],
          [52, 0, 0, 0, "AHGP", 0, null, null, null, null, "AHGP", "Alliance Holdings GP, L.P.", 53, 3170000000, "2006", "Energy", "Coal Mining"],
          [53, 0, 0, 0, "ARLP", 0, null, null, null, null, "ARLP", "Alliance Resource Partners, L.P.", 39.29, 2910000000, "1999", "Energy", "Coal Mining"],
          [54, 0, 0, 0, "AHPI", 0, null, null, null, null, "AHPI", "Allied Healthcare Products, Inc.", 1.56, 12520000, "1992", "Health Care", "Industrial Specialties"],
          [55, 0, 0, 0, "ALLT", 0, null, null, null, null, "ALLT", "Allot Communications Ltd.", 9.15, 304210000, "2006", "Technology", "Computer Communications Equipment"],
          [56, 0, 0, 0, "ALNY", 0, null, null, null, null, "ALNY", "Alnylam Pharmaceuticals, Inc.", 95.54, 7830000000, "2004", "Health Care", "Major Pharmaceuticals"],
          [57, 0, 0, 0, "AOSL", 0, null, null, null, null, "AOSL", "Alpha and Omega Semiconductor Limited", 9.05, 241240000, "2010", "Technology", "Semiconductors"],
          [58, 0, 0, 0, "ATEC", 0, null, null, null, null, "ATEC", "Alphatec Holdings, Inc.", 1.34, 133460000, "2006", "Health Care", "Medical/Dental Instruments"],
          [59, 0, 0, 0, "ALTR", 0, null, null, null, null, "ALTR", "Altera Corporation", 35.66, 10870000000, "1988", "Technology", "Semiconductors"]
        ]
      });
      expect(uniqueKeys(state.rows)).toEqual(true);

      state = GridDataReducer(state, { type: 'range', range: { lo: 9, hi: 34 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [0, 0, 0, 0, "TFSC", 0, null, null, null, null, "TFSC", "1347 Capital Corp.", 9.4345671, 56090000, "2014", "Finance", "Business Services"],
          [1, 0, 0, 0, "PIH", 0, null, null, null, null, "PIH", "1347 Property Insurance Holdings, Inc.", 7.6400987, 48580000, "2014", "Finance", "Property-Casualty Insurers"],
          [2, 0, 0, 0, "FLWS", 0, null, null, null, null, "FLWS", "1-800 FLOWERS.COM, Inc.", 10.3300001, 668420000, "1999", "Consumer Services", "Other Specialty Stores"],
          [3, 0, 0, 0, "VNET", 0, null, null, null, null, "VNET", "21Vianet Group, Inc.", 19.05, 1250000000, "2011", "Technology", "Computer Software: Programming, Data Processing"],
          [4, 0, 0, 0, "TWOU", 0, null, null, null, null, "TWOU", "2U, Inc.", 17.11, 693670000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [5, 0, 0, 0, "JOBS", 0, null, null, null, null, "JOBS", "51job, Inc.", 34.86, 2060000000, "2004", "Technology", "Diversified Commercial Services"],
          [6, 0, 0, 0, "SHLM", 0, null, null, null, null, "SHLM", "A. Schulman, Inc.", 39.83, 1160000000, "1972", "Basic Industries", "Major Chemicals"],
          [7, 0, 0, 0, "ABAX", 0, null, null, null, null, "ABAX", "ABAXIS, Inc.", 60.93, 1370000000, "1992", "Capital Goods", "Industrial Machinery/Components"],
          [8, 0, 0, 0, "ABY", 0, null, null, null, null, "ABY", "Abengoa Yield plc", 34.4, 2750000000, "2014", "Public Utilities", "Electric Utilities: Central"],
          [9, 0, 0, 0, "ABGB", 0, null, null, null, null, "ABGB", "Abengoa, S.A.", 15.52, 2610000000, "2013", "Consumer Services", "Military/Government/Technical"],
          [10, 0, 0, 0, "ACAD", 0, null, null, null, null, "ACAD", "ACADIA Pharmaceuticals Inc.", 34.21, 3410000000, "1985", "Health Care", "Major Pharmaceuticals"],
          [11, 0, 0, 0, "XLRN", 0, null, null, null, null, "XLRN", "Acceleron Pharma Inc.", 38.02, 1230000000, "2013", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [12, 0, 0, 0, "ARAY", 0, null, null, null, null, "ARAY", "Accuray Incorporated", 8, 627920000, "2007", "Health Care", "Medical/Dental Instruments"],
          [13, 0, 0, 0, "ACRX", 0, null, null, null, null, "ACRX", "AcelRx Pharmaceuticals, Inc.", 7.29, 318630000, "2011", "Health Care", "Major Pharmaceuticals"],
          [14, 0, 0, 0, "AKAO", 0, null, null, null, null, "AKAO", "Achaogen, Inc.", 11.11, 197290000, "2014", "Health Care", "Major Pharmaceuticals"],
          [15, 0, 0, 0, "ACHN", 0, null, null, null, null, "ACHN", "Achillion Pharmaceuticals, Inc.", 10.89, 1090000000, "2006", "Health Care", "Major Pharmaceuticals"],
          [16, 0, 0, 0, "ACOR", 0, null, null, null, null, "ACOR", "Acorda Therapeutics, Inc.", 36.14, 1520000000, "2006", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [17, 0, 0, 0, "ACTS", 0, null, null, null, null, "ACTS", "Actions Semiconductor Co., Ltd.", 1.54, 132440000, "2005", "Technology", "Semiconductors"],
          [18, 0, 0, 0, "ACPW", 0, null, null, null, null, "ACPW", "Active Power, Inc.", 1.86, 42950000, "2000", "Public Utilities", "Electric Utilities: Central"],
          [19, 0, 0, 0, "ADMS", 0, null, null, null, null, "ADMS", "Adamas Pharmaceuticals, Inc.", 16.98, 290800000, "2014", "Health Care", "Major Pharmaceuticals"],
          [20, 0, 0, 0, "ADUS", 0, null, null, null, null, "ADUS", "Addus HomeCare Corporation", 21.57, 237050000, "2009", "Health Care", "Medical/Nursing Services"],
          [21, 0, 0, 0, "ADBE", 0, null, null, null, null, "ADBE", "Adobe Systems Incorporated", 76.51, 38130000000, "1986", "Technology", "Computer Software: Prepackaged Software"],
          [22, 0, 0, 0, "ADTN", 0, null, null, null, null, "ADTN", "ADTRAN, Inc.", 23.11, 1260000000, "1994", "Public Utilities", "Telecommunications Equipment"],
          [23, 0, 0, 0, "AEIS", 0, null, null, null, null, "AEIS", "Advanced Energy Industries, Inc.", 26.68, 1070000000, "1995", "Capital Goods", "Industrial Machinery/Components"],
          [24, 0, 0, 0, "ADVS", 0, null, null, null, null, "ADVS", "Advent Software, Inc.", 44.18, 2280000000, "1995", "Technology", "EDP Services"],
          [25, 0, 0, 0, "AEGR", 0, null, null, null, null, "AEGR", "Aegerion Pharmaceuticals, Inc.", 25.15, 715170000, "2010", "Health Care", "Major Pharmaceuticals"],
          [26, 0, 0, 0, "AEHR", 0, null, null, null, null, "AEHR", "Aehr Test Systems", 2.47, 31300000, "1997", "Capital Goods", "Electrical Products"],
          [27, 0, 0, 0, "AEPI", 0, null, null, null, null, "AEPI", "AEP Industries Inc.", 49.71, 252560000, "1986", "Capital Goods", "Specialty Chemicals"],
          [28, 0, 0, 0, "AERI", 0, null, null, null, null, "AERI", "Aerie Pharmaceuticals, Inc.", 27.91, 669410000, "2013", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [29, 0, 0, 0, "AVAV", 0, null, null, null, null, "AVAV", "AeroVironment, Inc.", 26.86, 626430000, "2007", "Capital Goods", "Aerospace"],
          [30, 0, 0, 0, "AFMD", 0, null, null, null, null, "AFMD", "Affimed N.V.", 5.7, 136710000, "2014", "Health Care", "Major Pharmaceuticals"],
          [31, 0, 0, 0, "AFFX", 0, null, null, null, null, "AFFX", "Affymetrix, Inc.", 11.45, 842530000, "1996", "Capital Goods", "Biotechnology: Laboratory Analytical Instruments"],
          [32, 0, 0, 0, "AGEN", 0, null, null, null, null, "AGEN", "Agenus Inc.", 5.03, 315300000, "2000", "Health Care", "Biotechnology: Biological Products (No Diagnostic Substances)"],
          [33, 0, 0, 0, "AGRX", 0, null, null, null, null, "AGRX", "Agile Therapeutics, Inc.", 8.57, 171500000, "2014", "Health Care", "Major Pharmaceuticals"],
          [34, 0, 0, 0, "AGIO", 0, null, null, null, null, "AGIO", "Agios Pharmaceuticals, Inc.", 118.55, 4380000000, "2013", "Health Care", "Major Pharmaceuticals"],
          [35, 0, 0, 0, "AMCN", 0, null, null, null, null, "AMCN", "AirMedia Group Inc", 2.28, 135810000, "2007", "Technology", "Advertising"]
        ]
      });
      expect(uniqueKeys(state.rows)).toEqual(true);

      state = GridDataReducer(state, { type: 'range', range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 3, hi: 28 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 6, hi: 31 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 8, hi: 33 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 12, hi: 37 } });
      state = GridDataReducer(state, { type: 'range', range: { lo: 16, hi: 41 } });
      state = GridDataReducer(state, {
        type: 'data', offset: 100, rowCount: 1247, rows: [
          [44, 0, 0, 0, "ALXN", 0, null, null, null, null, "ALXN", "Alexion Pharmaceuticals, Inc.", 182.29, 36850000000, "1996", "Health Care", "Major Pharmaceuticals"],
          [45, 0, 0, 0, "ALXA", 0, null, null, null, null, "ALXA", "Alexza Pharmaceuticals, Inc.", 2.07, 40170000, "2006", "Health Care", "Major Pharmaceuticals"],
          [46, 0, 0, 0, "ALGN", 0, null, null, null, null, "ALGN", "Align Technology, Inc.", 56.9, 4570000000, "2001", "Health Care", "Industrial Specialties"],
          [47, 0, 0, 0, "ALIM", 0, null, null, null, null, "ALIM", "Alimera Sciences, Inc.", 5.16, 228570000, "2010", "Health Care", "Major Pharmaceuticals"],
          [48, 0, 0, 0, "ALKS", 0, null, null, null, null, "ALKS", "Alkermes plc", 71.4, 10440000000, "1991", "Health Care", "Major Pharmaceuticals"],
          [49, 0, 0, 0, "ALGT", 0, null, null, null, null, "ALGT", "Allegiant Travel Company", 178.42, 3120000000, "2006", "Transportation", "Air Freight/Delivery Services"],
          [50, 0, 0, 0, "AFOP", 0, null, null, null, null, "AFOP", "Alliance Fiber Optic Products, Inc.", 16.51, 307950000, "2000", "Technology", "Semiconductors"]
        ]
      });

      state = GridDataReducer(state, { type: 'range', range: { lo: 20, hi: 45 } });

      expect(uniqueKeys(state.rows)).toEqual(true);

    });
  });

  describe('Scroll grouped rows', () => {


    test.only('group by single col', () => {
      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 10, range: { lo: 0, hi: 25 } });
      state = GridDataReducer(state, {
        type: 'data', rowCount: 1000, rows: [
          [0,0,-1,27,"Basic Industries",0,null,0,null,null,null,null,22.489225925925922,30965590000,null,"Basic Industries",null],
          [1,0,-1,79,"Capital Goods",0,null,27,null,null,null,null,27.76405949367088,135023840000,null,"Capital Goods",null],
          [2,0,-1,35,"Consumer Durables",0,null,106,null,null,null,null,19.91088285714286,34227080000,null,"Consumer Durables",null],
          [3,0,-1,40,"Consumer Non-Durables",0,null,141,null,null,null,null,35.002382499999996,76043890000,null,"Consumer Non-Durables",null],
          [4,0,-1,167,"Consumer Services",0,null,181,null,null,null,null,34.78527724610778,698786390026,null,"Consumer Services",null],
          [5,0,-1,29,"Energy",0,null,348,null,null,null,null,20.812041379310344,37013700000,null,"Energy",null],
          [6,0,-1,142,"Finance",0,null,377,null,null,null,null,24.208854688732394,160347990000,null,"Finance",null],
          [7,0,-1,324,"Health Care",0,null,519,null,null,null,null,27.65928950617285,880540540000,null,"Health Care",null],
          [8,0,-1,50,"Miscellaneous",0,null,843,null,null,null,null,52.63641200000001,200127520000,null,"Miscellaneous",null],
          [9,0,-1,24,"Public Utilities",0,null,893,null,null,null,null,20.892420833333333,26533280000,null,"Public Utilities",null],
          [10,0,-1,303,"Technology",0,null,917,null,null,null,null,28.290387128712844,2911887300000,null,"Technology",null],
          [11,0,-1,27,"Transportation",0,null,1220,null,null,null,null,36.42666666666666,68938850000,null,"Transportation",null]
        ]});

        // expand group Misc
        state = GridDataReducer(state, {
          type: 'data', rowCount: 1000, rows: [
            [0,0,-1,27,"Basic Industries",0,null,0,null,null,null,null,22.489225925925922,30965590000,null,"Basic Industries",null],
            [1,0,-1,79,"Capital Goods",0,null,27,null,null,null,null,27.76405949367088,135023840000,null,"Capital Goods",null],
            [2,0,-1,35,"Consumer Durables",0,null,106,null,null,null,null,19.91088285714286,34227080000,null,"Consumer Durables",null],
            [3,0,-1,40,"Consumer Non-Durables",0,null,141,null,null,null,null,35.002382499999996,76043890000,null,"Consumer Non-Durables",null],
            [4,0,-1,167,"Consumer Services",0,null,181,null,null,null,null,34.78527724610778,698786390026,null,"Consumer Services",null],
            [5,0,-1,29,"Energy",0,null,348,null,null,null,null,20.812041379310344,37013700000,null,"Energy",null],
            [6,0,-1,142,"Finance",0,null,377,null,null,null,null,24.208854688732394,160347990000,null,"Finance",null],
            [7,0,-1,324,"Health Care",0,null,519,null,null,null,null,27.65928950617285,880540540000,null,"Health Care",null],
            [8,0,1,50,"Miscellaneous",0,null,843,null,null,null,null,52.63641200000001,200127520000,null,"Miscellaneous",null],
            [9,0,0,0,"AKAM",0,0,0,0,0,"AKAM","Akamai Technologies, Inc.",68.77,12240000000,"1999","Miscellaneous","Business Services"],
            [10,0,0,0,"ARTX",0,0,0,0,0,"ARTX","Arotech Corporation",2.44,59640000,"1994","Miscellaneous","Industrial Machinery/Components"],
            [11,0,0,0,"ATHN",0,0,0,0,0,"ATHN","athenahealth, Inc.",134.605,5140000000,"2007","Miscellaneous","Business Services"],
            [12,0,0,0,"AVID",0,0,0,0,0,"AVID","Avid Technology, Inc.",14.12,553700000,"1993","Miscellaneous","Industrial Machinery/Components"],
            [13,0,0,0,"BRDR",0,0,0,0,0,"BRDR","Borderfree, Inc.",6.15,195650000,"2014","Miscellaneous","Business Services"],
            [14,0,0,0,"BSQR",0,0,0,0,0,"BSQR","BSQUARE Corporation",4.53,53120000,"1999","Miscellaneous","Business Services"],
            [15,0,0,0,"CATM",0,0,0,0,0,"CATM","Cardtronics, Inc.",37.02,1650000000,"2007","Miscellaneous","Business Services"],
            [16,0,0,0,"JRJC",0,0,0,0,0,"JRJC","China Finance Online Co. Limited",5.46,121370000,"2004","Miscellaneous","Business Services"],
            [17,0,0,0,"CNTF",0,0,0,0,0,"CNTF","China TechFaith Wireless Communication Technology Limited",1.08,57170000,"2005","Miscellaneous","Business Services"],
            [18,0,0,0,"CLCT",0,0,0,0,0,"CLCT","Collectors Universe, Inc.",22.72,201840000,"1999","Miscellaneous","Business Services"],
            [19,0,0,0,"SCOR",0,0,0,0,0,"SCOR","comScore, Inc.",53.35,1820000000,"2007","Miscellaneous","Business Services"],
            [20,0,0,0,"CSGP",0,0,0,0,0,"CSGP","CoStar Group, Inc.",200.535,6490000000,"1998","Miscellaneous","Business Services"],
            [21,0,0,0,"CRAI",0,0,0,0,0,"CRAI","CRA International,Inc.",30.06,286450000,"1998","Miscellaneous","Other Consumer Services"],
            [22,0,0,0,"CTRP",0,0,0,0,0,"CTRP","Ctrip.com International, Ltd.",46.75,6330000000,"2003","Miscellaneous","Business Services"],
            [23,0,0,0,"DTSI",0,0,0,0,0,"DTSI","DTS, Inc.",28.68,492900000,"2003","Miscellaneous","Multi-Sector Companies"],
            [24,0,0,0,"EBAY",0,0,0,0,0,"EBAY","eBay Inc.",56.47,68330000000,"1998","Miscellaneous","Business Services"],
            [25,0,0,0,"EXLS",0,0,0,0,0,"EXLS","ExlService Holdings, Inc.",31.34,1030000000,"2006","Miscellaneous","Business Services"],
            [26,0,0,0,"GPRO",0,0,0,0,0,"GPRO","GoPro, Inc.",45.27,5690000000,"2014","Miscellaneous","Industrial Machinery/Components"],
            [27,0,0,0,"GRVY",0,0,0,0,0,"GRVY","GRAVITY Co., Ltd.",0.5001,13900000,"2005","Miscellaneous","Business Services"],
            [28,0,0,0,"HQY",0,0,0,0,0,"HQY","HealthEquity, Inc.",20.02,1100000000,"2014","Miscellaneous","Business Services"],
            [29,0,0,0,"HMSY",0,0,0,0,0,"HMSY","HMS Holdings Corp",20,1760000000,"1992","Miscellaneous","Business Services"],
            [30,0,0,0,"LLNW",0,0,0,0,0,"LLNW","Limelight Networks, Inc.",2.99,295070000,"2007","Miscellaneous","Business Services"],
            [31,0,0,0,"LIOX",0,0,0,0,0,"LIOX","Lionbridge Technologies, Inc.",5.57,355270000,"1999","Miscellaneous","Business Services"],
            [32,0,0,0,"LQDT",0,0,0,0,0,"LQDT","Liquidity Services, Inc.",9.52,285390000,"2006","Miscellaneous","Business Services"],
            [33,0,0,0,"MCHX",0,0,0,0,0,"MCHX","Marchex, Inc.",4.34,185940000,"2004","Miscellaneous","Business Services"],
            [34,0,0,0,"MELI",0,0,0,0,0,"MELI","MercadoLibre, Inc.",129.99,5740000000,"2007","Miscellaneous","Business Services"]
          ]});

          // The renderBuffer has taken effect, so range has grown
          state = GridDataReducer(state, { type: 'range', range: { lo: 25, hi: 70 } });

          state = GridDataReducer(state, {
            type: 'data', rowCount: 1000, rows: [
              [35,0,0,0,"MOLG",0,0,0,0,0,"MOLG","MOL Global, Inc.",2.46,166050000,"2014","Miscellaneous","Business Services"],
              [36,0,0,0,"LABL",0,0,0,0,0,"LABL","Multi-Color Corporation",63.28,1050000000,"1987","Miscellaneous","Publishing"],
              [37,0,0,0,"ONVI",0,0,0,0,0,"ONVI","Onvia, Inc.",4.5505,33660000,"2000","Miscellaneous","Business Services"],
              [38,0,0,0,"PDII",0,0,0,0,0,"PDII","PDI, Inc.",1.84,28270000,"1998","Miscellaneous","Business Services"],
              [39,0,0,0,"PWRD",0,0,0,0,0,"PWRD","Perfect World Co., Ltd.",18.95,942240000,"2007","Miscellaneous","Business Services"],
              [40,0,0,0,"PFSW",0,0,0,0,0,"PFSW","PFSweb, Inc.",10.23,175480000,"1999","Miscellaneous","Business Services"],
              [41,0,0,0,"QIWI",0,0,0,0,0,"QIWI","QIWI plc",25.16,1310000000,"2013","Miscellaneous","Business Services"],
              [42,0,0,0,"QNST",0,0,0,0,0,"QNST","QuinStreet, Inc.",6.15,273630000,"2010","Miscellaneous","Business Services"],
              [43,0,0,0,"QUNR",0,0,0,0,0,"QUNR","Qunar Cayman Islands Limited",28.42,3380000000,"2013","Miscellaneous","Business Services"],
              [44,0,0,0,"RDWR",0,0,0,0,0,"RDWR","Radware Ltd.",20.85,938860000,"1999","Miscellaneous","Business Services"],
              [45,0,0,0,"RECN",0,0,0,0,0,"RECN","Resources Connection, Inc.",17.46,657290000,"2000","Miscellaneous","Business Services"],
              [46,0,0,0,"RSTI",0,0,0,0,0,"RSTI","Rofin-Sinar Technologies, Inc.",24.12,677590000,"1996","Miscellaneous","Industrial Machinery/Components"],
              [47,0,0,0,"RPXC",0,0,0,0,0,"RPXC","RPX Corporation",13.94,751910000,"2011","Miscellaneous","Multi-Sector Companies"],
              [48,0,0,0,"SREV",0,0,0,0,0,"SREV","ServiceSource International, Inc.",3.65,305820000,"2011","Miscellaneous","Business Services"],
              [49,0,0,0,"SFLY",0,0,0,0,0,"SFLY","Shutterfly, Inc.",44.86,1740000000,"2006","Miscellaneous","Other Consumer Services"],
              [50,0,0,0,"STMP",0,0,0,0,0,"STMP","Stamps.com Inc.",56.92,905630000,"1999","Miscellaneous","Business Services"],
              [51,0,0,0,"TTGT",0,0,0,0,0,"TTGT","TechTarget, Inc.",11.9,392380000,"2007","Miscellaneous","Business Services"],
              [52,0,0,0,"JYNT",0,0,0,0,0,"JYNT","The Joint Corp.",7.03,68360000,"2014","Miscellaneous","Multi-Sector Companies"],
              [53,0,0,0,"PCLN",0,0,0,0,0,"PCLN","The Priceline Group Inc. ",1103.37,57770000000,"1999","Miscellaneous","Business Services"],
              [54,0,0,0,"NCTY",0,0,0,0,0,"NCTY","The9 Limited",1.46,33790000,"2004","Miscellaneous","Business Services"],
              [55,0,0,0,"ULBI",0,0,0,0,0,"ULBI","Ultralife Corporation",3.4,59150000,"1992","Miscellaneous","Industrial Machinery/Components"],
              [56,0,0,0,"WBMD",0,0,0,0,0,"WBMD","WebMD Health Corp",39.12,1460000000,"2005","Miscellaneous","Business Services"],
              [57,0,0,0,"WSTC",0,0,0,0,0,"WSTC","West Corporation",33.92,2860000000,"2013","Miscellaneous","Business Services"],
              [58,0,0,0,"Z",0,0,0,0,0,"Z","Zillow, Inc.",106.5,3670000000,"2011","Miscellaneous","Business Services"],
              [59,0,-1,24,"Public Utilities",0,null,893,null,null,null,null,20.892420833333333,26533280000,null,"Public Utilities",null],
              [60,0,-1,303,"Technology",0,null,917,null,null,null,null,28.290387128712844,2911887300000,null,"Technology",null],
              [61,0,-1,27,"Transportation",0,null,1220,null,null,null,null,36.42666666666666,68938850000,null,"Transportation",null]
            ]});


            state = GridDataReducer(state, { type: 'range', range: { lo: 0, hi: 37 } });
            state = GridDataReducer(state, {
              type: 'data', rowCount: 1000, rows: [
                [0,0,-1,27,"Basic Industries",0,null,0,null,null,null,null,22.489225925925922,30965590000,null,"Basic Industries",null],
                [1,0,-1,79,"Capital Goods",0,null,27,null,null,null,null,27.76405949367088,135023840000,null,"Capital Goods",null],
                [2,0,-1,35,"Consumer Durables",0,null,106,null,null,null,null,19.91088285714286,34227080000,null,"Consumer Durables",null],
                [3,0,-1,40,"Consumer Non-Durables",0,null,141,null,null,null,null,35.002382499999996,76043890000,null,"Consumer Non-Durables",null],
                [4,0,-1,167,"Consumer Services",0,null,181,null,null,null,null,34.78527724610778,698786390026,null,"Consumer Services",null],
                [5,0,-1,29,"Energy",0,null,348,null,null,null,null,20.812041379310344,37013700000,null,"Energy",null],
                [6,0,-1,142,"Finance",0,null,377,null,null,null,null,24.208854688732394,160347990000,null,"Finance",null],
                [7,0,-1,324,"Health Care",0,null,519,null,null,null,null,27.65928950617285,880540540000,null,"Health Care",null],
                [8,0,1,50,"Miscellaneous",0,null,843,null,null,null,null,52.63641200000001,200127520000,null,"Miscellaneous",null],
                [9,0,0,0,"AKAM",0,0,0,0,0,"AKAM","Akamai Technologies, Inc.",68.77,12240000000,"1999","Miscellaneous","Business Services"],
                [10,0,0,0,"ARTX",0,0,0,0,0,"ARTX","Arotech Corporation",2.44,59640000,"1994","Miscellaneous","Industrial Machinery/Components"],
                [11,0,0,0,"ATHN",0,0,0,0,0,"ATHN","athenahealth, Inc.",134.605,5140000000,"2007","Miscellaneous","Business Services"],
                [12,0,0,0,"AVID",0,0,0,0,0,"AVID","Avid Technology, Inc.",14.12,553700000,"1993","Miscellaneous","Industrial Machinery/Components"],
                [13,0,0,0,"BRDR",0,0,0,0,0,"BRDR","Borderfree, Inc.",6.15,195650000,"2014","Miscellaneous","Business Services"],
                [14,0,0,0,"BSQR",0,0,0,0,0,"BSQR","BSQUARE Corporation",4.53,53120000,"1999","Miscellaneous","Business Services"]
              ]});

    })

  })

});