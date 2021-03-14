import { ArrayBackedMovingWindow } from '../array-backed-moving-window';

function applyUpdates(movingWindow, rows) {
  rows.forEach(row => {
    const [rowIdx] = row;
    if (movingWindow.isWithinRange(rowIdx)) {
      movingWindow.setAtIndex(rowIdx, row);
    }
  });

}

describe('ArrayBackedMovingWindow', () => {


  describe('VUU type updates', () => {
    test('setRange before data arrives', () => {

      const movingWindow = new ArrayBackedMovingWindow(19);

      const data = [
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
      ];

      applyUpdates(movingWindow, data);

      expect(movingWindow.internalData).toHaveLength(19)

      movingWindow.setRange(12, 31);

      expect(movingWindow.internalData.map(r => r[0])).toEqual([12, 13, 14, 15, 16, 17, 18, , , , , , , , , , , , ,])

      movingWindow.setRange(29, 48);

      expect(movingWindow.internalData.map(r => r[0])).toEqual(new Array(19))

    });

    test('simple update', () => {

      const movingWindow = new ArrayBackedMovingWindow(25);

      const data = [
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

      applyUpdates(movingWindow, data);

      const updates = [
        [2, 0, 0, 0, "AAA.OQ", 0, null, null, null, null, "AAA.OQ", "AAA.OQ Co.", "EUR", "XNYS/NYS-MAIN", 500, 435, 439.35, "", "", "", "noop"],
        [9, 0, 0, 0, "AAC.N", 0, null, null, null, null, "AAC.N", "AAC.N Corporation", "CAD", "XNGS/NAS-GSM", 1000, 72, 102, "", "", "", "fastTick"],
      ]

      applyUpdates(movingWindow, updates);

      // TODO update once we add support for keys
      expect(movingWindow.internalData[2]).toEqual(
        [2, 0, 0, 0, 'AAA.OQ', 0, null, null, null, null, 'AAA.OQ', 'AAA.OQ Co.', 'EUR', 'XNYS/NYS-MAIN', 500, 435, 439.35, '', '', '', 'noop']
      )

      expect(movingWindow.internalData[9]).toEqual(
        [9, 0, 0, 0, 'AAC.N', 0, null, null, null, null, 'AAC.N', 'AAC.N Corporation', 'CAD', 'XNGS/NAS-GSM', 1000, 72, 102, '', '', '', 'fastTick']
      )


    })

    test('mismatched ranges I', () => {

      const movingWindow = new ArrayBackedMovingWindow(25);
      applyUpdates(movingWindow, [
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
      ]);

      movingWindow.setRange(31, 56)

      applyUpdates(movingWindow, [
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
      ]);

      expect(movingWindow.internalData.map(r => r[0])).toEqual([31, 32].concat(new Array(23)))

    });

    test('mismatched ranges II', () => {

      const movingWindow = new ArrayBackedMovingWindow(25);

      applyUpdates(movingWindow, [
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
      ]);

      movingWindow.setRange(2, 21)
      movingWindow.setRange(6, 25)
      movingWindow.setRange(11, 30)


      applyUpdates(movingWindow, [
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
      ]);

      expect(movingWindow.internalData.map(r => r[0])).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29])

    });

  });

  describe('VUU Scrolling', () => {

    test('Scrolling FWD from top, then BWD, many scolls before data response', () => {

      const movingWindow = new ArrayBackedMovingWindow(25);
      applyUpdates(movingWindow, [
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
      ]);

      movingWindow.setRange(6, 31);
      movingWindow.setRange(13, 38);
      movingWindow.setRange(18, 43);
      movingWindow.setRange(28, 53);
      movingWindow.setRange(37, 62);
      movingWindow.setRange(45, 70);
      movingWindow.setRange(53, 78);
      movingWindow.setRange(60, 85);
      movingWindow.setRange(66, 91);
      movingWindow.setRange(72, 97);
      movingWindow.setRange(76, 101);

      // This set of rows is already out of range so will be ignored
      applyUpdates(movingWindow, [
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
      ]);

      applyUpdates(movingWindow, [
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
        // The following are in range . We only have part of the current viewport,
        // so we won't render it
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
      ]);

      expect(movingWindow.internalData.map(r => r[0])).toEqual([76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94].concat(new Array(6)))

      movingWindow.setRange(80, 105);
      movingWindow.setRange(87, 112);

      applyUpdates(movingWindow, [
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
      ]);

      movingWindow.setRange(89, 114);
      movingWindow.setRange(91, 116);
      movingWindow.setRange(92, 117);

      applyUpdates(movingWindow, [
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
      ]);

      applyUpdates(movingWindow, [
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
      ]);

      applyUpdates(movingWindow, [
        [126, 0, 0, 0, "ABF.OQ", 0, null, null, null, null, "ABF.OQ", "ABF.OQ Co.", "GBX", "XNYS/NYS-MAIN", 95]
      ]);

      // Turn around
      movingWindow.setRange(90, 115);
      movingWindow.setRange(82, 107);
      movingWindow.setRange(70, 95);
      movingWindow.setRange(63, 88);
      movingWindow.setRange(48, 73);

      applyUpdates(movingWindow, [
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
      ])

    // We don't get all the rows we need to fill the buffer, we're missing 5 rows from the leading edge of range
    // and the entire leading buffer;
    movingWindow.setRange(34, 59);
    movingWindow.setRange(22, 47);
    movingWindow.setRange(11, 36);

    applyUpdates(movingWindow, [
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
      ]);

      movingWindow.setRange(2, 27);
      movingWindow.setRange(0, 25);

      applyUpdates(movingWindow, [
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
      ]);

      expect(movingWindow.internalData.map(r => r[0])).toEqual([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
    })

  })




})
