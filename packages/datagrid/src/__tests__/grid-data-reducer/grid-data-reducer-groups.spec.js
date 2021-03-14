import GridDataReducer from '../../grid-data-reducer';
import { rows, getRows } from './test-data.js';

const getRowKeys = rows => rows.map(row => row[1]).sort((a, b) => a - b);
const uniqueKeys = rows => {
  const keys = getRowKeys(rows);
  const uniqueKeys = new Set(keys);
  return uniqueKeys.size === keys.length;
}

describe('grid-data-reducer groups', () => {

  describe('single level group', () => {

    test('keys are freed when rowCount reduces because of grouping', () => {

      let state = GridDataReducer(undefined, { type: 'clear', bufferSize: 10, range: { lo: 0, hi: 25 } });

      state = GridDataReducer(state, {
        type: 'data', rowCount: 1247, rows: [
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

      // Group
      state = GridDataReducer(state, {
        type: 'data', rowCount: 12, rows: [
          [0, 0, -1, 27, "Basic Industries", 0, null, 0, null, null, null, null, 22.489225925925922, 30965590000, null, "Basic Industries", null],
          [1, 0, -1, 79, "Capital Goods", 0, null, 27, null, null, null, null, 27.76405949367088, 135023840000, null, "Capital Goods", null],
          [2, 0, -1, 35, "Consumer Durables", 0, null, 106, null, null, null, null, 19.91088285714286, 34227080000, null, "Consumer Durables", null],
          [3, 0, -1, 40, "Consumer Non-Durables", 0, null, 141, null, null, null, null, 35.002382499999996, 76043890000, null, "Consumer Non-Durables", null],
          [4, 0, -1, 167, "Consumer Services", 0, null, 181, null, null, null, null, 34.78527724610778, 698786390026, null, "Consumer Services", null],
          [5, 0, -1, 29, "Energy", 0, null, 348, null, null, null, null, 20.812041379310344, 37013700000, null, "Energy", null],
          [6, 0, -1, 142, "Finance", 0, null, 377, null, null, null, null, 24.208854688732394, 160347990000, null, "Finance", null],
          [7, 0, -1, 324, "Health Care", 0, null, 519, null, null, null, null, 27.65928950617285, 880540540000, null, "Health Care", null],
          [8, 0, -1, 50, "Miscellaneous", 0, null, 843, null, null, null, null, 52.63641200000001, 200127520000, null, "Miscellaneous", null],
          [9, 0, -1, 24, "Public Utilities", 0, null, 893, null, null, null, null, 20.892420833333333, 26533280000, null, "Public Utilities", null],
          [10, 0, -1, 303, "Technology", 0, null, 917, null, null, null, null, 28.290387128712844, 2911887300000, null, "Technology", null],
          [11, 0, -1, 27, "Transportation", 0, null, 1220, null, null, null, null, 36.42666666666666, 68938850000, null, "Transportation", null]
        ]
      });

      expect(state.keys.free.length).toEqual(13)
      expect(state.bufferIdx).toEqual({ lo: 0, hi: 12 })

      // expand
      state = GridDataReducer(state, {
        type: 'data', rowCount: 315, rows: [
          [0, 0, -1, 27, "Basic Industries", 0, null, 0, null, null, null, null, 22.489225925925922, 30965590000, null, "Basic Industries", null],
          [1, 0, -1, 79, "Capital Goods", 0, null, 27, null, null, null, null, 27.76405949367088, 135023840000, null, "Capital Goods", null],
          [2, 0, -1, 35, "Consumer Durables", 0, null, 106, null, null, null, null, 19.91088285714286, 34227080000, null, "Consumer Durables", null],
          [3, 0, -1, 40, "Consumer Non-Durables", 0, null, 141, null, null, null, null, 35.002382499999996, 76043890000, null, "Consumer Non-Durables", null],
          [4, 0, -1, 167, "Consumer Services", 0, null, 181, null, null, null, null, 34.78527724610778, 698786390026, null, "Consumer Services", null],
          [5, 0, -1, 29, "Energy", 0, null, 348, null, null, null, null, 20.812041379310344, 37013700000, null, "Energy", null],
          [6, 0, -1, 142, "Finance", 0, null, 377, null, null, null, null, 24.208854688732394, 160347990000, null, "Finance", null],
          [7, 0, -1, 324, "Health Care", 0, null, 519, null, null, null, null, 27.65928950617285, 880540540000, null, "Health Care", null],
          [8, 0, -1, 50, "Miscellaneous", 0, null, 843, null, null, null, null, 52.63641200000001, 200127520000, null, "Miscellaneous", null],
          [9, 0, -1, 24, "Public Utilities", 0, null, 893, null, null, null, null, 20.892420833333333, 26533280000, null, "Public Utilities", null],
          [10, 0, 1, 303, "Technology", 0, null, 917, null, null, null, null, 28.290387128712844, 2911887300000, null, "Technology", null],
          [11, 0, 0, 0, "VNET", 0, 0, 0, 0, 0, "VNET", "21Vianet Group, Inc.", 19.05, 1250000000, "2011", "Technology", "Computer Software: Programming, Data Processing"],
          [12, 0, 0, 0, "TWOU", 0, 0, 0, 0, 0, "TWOU", "2U, Inc.", 17.11, 693670000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [13, 0, 0, 0, "JOBS", 0, 0, 0, 0, 0, "JOBS", "51job, Inc.", 34.86, 2060000000, "2004", "Technology", "Diversified Commercial Services"],
          [14, 0, 0, 0, "ACTS", 0, 0, 0, 0, 0, "ACTS", "Actions Semiconductor Co., Ltd.", 1.54, 132440000, "2005", "Technology", "Semiconductors"],
          [15, 0, 0, 0, "ADBE", 0, 0, 0, 0, 0, "ADBE", "Adobe Systems Incorporated", 76.51, 38130000000, "1986", "Technology", "Computer Software: Prepackaged Software"],
          [16, 0, 0, 0, "ADVS", 0, 0, 0, 0, 0, "ADVS", "Advent Software, Inc.", 44.18, 2280000000, "1995", "Technology", "EDP Services"],
          [17, 0, 0, 0, "AMCN", 0, 0, 0, 0, 0, "AMCN", "AirMedia Group Inc", 2.28, 135810000, "2007", "Technology", "Advertising"],
          [18, 0, 0, 0, "AFOP", 0, 0, 0, 0, 0, "AFOP", "Alliance Fiber Optic Products, Inc.", 16.51, 307950000, "2000", "Technology", "Semiconductors"],
          [19, 0, 0, 0, "ALLT", 0, 0, 0, 0, 0, "ALLT", "Allot Communications Ltd.", 9.15, 304210000, "2006", "Technology", "Computer Communications Equipment"],
          [20, 0, 0, 0, "AOSL", 0, 0, 0, 0, 0, "AOSL", "Alpha and Omega Semiconductor Limited", 9.05, 241240000, "2010", "Technology", "Semiconductors"],
          [21, 0, 0, 0, "ALTR", 0, 0, 0, 0, 0, "ALTR", "Altera Corporation", 35.66, 10870000000, "1988", "Technology", "Semiconductors"],
          [22, 0, 0, 0, "AMBA", 0, 0, 0, 0, 0, "AMBA", "Ambarella, Inc.", 50.71, 1540000000, "2012", "Technology", "Semiconductors"],
          [23, 0, 0, 0, "AMKR", 0, 0, 0, 0, 0, "AMKR", "Amkor Technology, Inc.", 8.9, 2110000000, "1998", "Technology", "Semiconductors"],
          [24, 0, 0, 0, "ANAD", 0, 0, 0, 0, 0, "ANAD", "ANADIGICS, Inc.", 1.26, 109090000, "1995", "Technology", "Semiconductors"],
          [25, 0, 0, 0, "ANSS", 0, 0, 0, 0, 0, "ANSS", "ANSYS, Inc.", 86.26, 7930000000, "1996", "Technology", "Computer Software: Prepackaged Software"],
          [26, 0, 0, 0, "AAPL", 0, 0, 0, 0, 0, "AAPL", "Apple Inc.", 127.08, 740210000000, "1980", "Technology", "Computer Manufacturing"],
          [27, 0, 0, 0, "AMAT", 0, 0, 0, 0, 0, "AMAT", "Applied Materials, Inc.", 24.12, 29460000000, "1972", "Technology", "Semiconductors"],
          [28, 0, 0, 0, "AMCC", 0, 0, 0, 0, 0, "AMCC", "Applied Micro Circuits Corporation", 5.21, 412320000, "1997", "Technology", "Semiconductors"],
          [29, 0, 0, 0, "AAOI", 0, 0, 0, 0, 0, "AAOI", "Applied Optoelectronics, Inc.", 10.15, 150380000, "2013", "Technology", "Semiconductors"],
          [30, 0, 0, 0, "ARIS", 0, 0, 0, 0, 0, "ARIS", "ARI Network Services, Inc.", 3.63, 51660000, "1991", "Technology", "Computer Software: Programming, Data Processing"],
          [31, 0, 0, 0, "ARUN", 0, 0, 0, 0, 0, "ARUN", "Aruba Networks, Inc.", 17.7, 1940000000, "2007", "Technology", "Computer peripheral equipment"],
          [32, 0, 0, 0, "ASML", 0, 0, 0, 0, 0, "ASML", "ASML Holding N.V.", 104.48, 45680000000, "1995", "Technology", "Industrial Machinery/Components"],
          [33, 0, 0, 0, "AZPN", 0, 0, 0, 0, 0, "AZPN", "Aspen Technology, Inc.", 38.4, 3390000000, "1994", "Technology", "EDP Services"],
          [34, 0, 0, 0, "ATEA", 0, 0, 0, 0, 0, "ATEA", "Astea International, Inc.", 1.76, 6310000, "1995", "Technology", "Computer Software: Prepackaged Software"]
        ]
      });

      expect(state.rows.map(row => row[1])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])

      // jump to end
      state = GridDataReducer(state, { type: 'range', range: { lo: 289, hi: 314 } });
      state = GridDataReducer(state, {
        type: 'data', rowCount: 315, rows: [
          [279, 0, 0, 0, "TSRA", 0, 0, 0, 0, 0, "TSRA", "Tessera Technologies, Inc.", 39.27, 2070000000, "2003", "Technology", "Semiconductors"],
          [280, 0, 0, 0, "KEYW", 0, 0, 0, 0, 0, "KEYW", "The KEYW Holding Corporation", 9.6, 360870000, "2010", "Technology", "EDP Services"],
          [281, 0, 0, 0, "ULTI", 0, 0, 0, 0, 0, "ULTI", "The Ultimate Software Group, Inc.", 163.76, 4650000000, "1998", "Technology", "Computer Software: Prepackaged Software"],
          [282, 0, 0, 0, "TISA", 0, 0, 0, 0, 0, "TISA", "Top Image Systems, Ltd.", 3.2499, 57900000, "1996", "Technology", "Computer peripheral equipment"],
          [283, 0, 0, 0, "TSEM", 0, 0, 0, 0, 0, "TSEM", "Tower Semiconductor Ltd.", 13.96, 889190000, "1994", "Technology", "Semiconductors"],
          [284, 0, 0, 0, "TACT", 0, 0, 0, 0, 0, "TACT", "TransAct Technologies Incorporated", 6.48, 53270000, "1996", "Technology", "Computer peripheral equipment"],
          [285, 0, 0, 0, "TRUE", 0, 0, 0, 0, 0, "TRUE", "TrueCar, Inc.", 19.55, 1550000000, "2014", "Technology", "Computer Software: Programming, Data Processing"],
          [286, 0, 0, 0, "TTMI", 0, 0, 0, 0, 0, "TTMI", "TTM Technologies, Inc.", 8.72, 726770000, "2000", "Technology", "Electrical Products"],
          [287, 0, 0, 0, "TUBE", 0, 0, 0, 0, 0, "TUBE", "TubeMogul, Inc.", 15.69, 467440000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [288, 0, 0, 0, "UBIC", 0, 0, 0, 0, 0, "UBIC", "UBIC, Inc.", 20.8909, 369880000, "2013", "Technology", "EDP Services"],
          [289, 0, 0, 0, "UBNT", 0, 0, 0, 0, 0, "UBNT", "Ubiquiti Networks, Inc.", 28.78, 2530000000, "2011", "Technology", "Radio And Television Broadcasting And Communications Equipment"],
          [290, 0, 0, 0, "UCTT", 0, 0, 0, 0, 0, "UCTT", "Ultra Clean Holdings, Inc.", 9.87, 291490000, "2004", "Technology", "Semiconductors"],
          [291, 0, 0, 0, "UTEK", 0, 0, 0, 0, 0, "UTEK", "Ultratech, Inc.", 17.68, 499830000, "1993", "Technology", "Industrial Machinery/Components"],
          [292, 0, 0, 0, "UPLD", 0, 0, 0, 0, 0, "UPLD", "Upland Software, Inc.", 7.22, 109810000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [293, 0, 0, 0, "VRNS", 0, 0, 0, 0, 0, "VRNS", "Varonis Systems, Inc.", 37.34, 917300000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [294, 0, 0, 0, "VECO", 0, 0, 0, 0, 0, "VECO", "Veeco Instruments Inc.", 30.45, 1220000000, "1994", "Technology", "Industrial Machinery/Components"],
          [295, 0, 0, 0, "VRNT", 0, 0, 0, 0, 0, "VRNT", "Verint Systems Inc.", 55.64, 3380000000, "2002", "Technology", "EDP Services"],
          [296, 0, 0, 0, "VRSN", 0, 0, 0, 0, 0, "VRSN", "VeriSign, Inc.", 62.15, 7530000000, "1998", "Technology", "EDP Services"],
          [297, 0, 0, 0, "VRSK", 0, 0, 0, 0, 0, "VRSK", "Verisk Analytics, Inc.", 67.9, 11200000000, "2009", "Technology", "EDP Services"],
          [298, 0, 0, 0, "VSAT", 0, 0, 0, 0, 0, "VSAT", "ViaSat, Inc.", 62.71, 2990000000, "1996", "Technology", "Radio And Television Broadcasting And Communications Equipment"],
          [299, 0, 0, 0, "VIMC", 0, 0, 0, 0, 0, "VIMC", "Vimicro International Corporation", 8.585, 205790000, "2005", "Technology", "Semiconductors"],
          [300, 0, 0, 0, "VRTU", 0, 0, 0, 0, 0, "VRTU", "Virtusa Corporation", 39.08, 1160000000, "2007", "Technology", "EDP Services"],
          [301, 0, 0, 0, "VISN", 0, 0, 0, 0, 0, "VISN", "VisionChina Media, Inc.", 12.9, 65510000, "2007", "Technology", "Advertising"],
          [302, 0, 0, 0, "VTSS", 0, 0, 0, 0, 0, "VTSS", "Vitesse Semiconductor Corporation", 3.925, 270740000, "1991", "Technology", "Semiconductors"],
          [303, 0, 0, 0, "WAVX", 0, 0, 0, 0, 0, "WAVX", "Wave Systems Corp.", 0.73, 33550000, "1994", "Technology", "Computer peripheral equipment"],
          [304, 0, 0, 0, "WB", 0, 0, 0, 0, 0, "WB", "Weibo Corporation", 13.3, 2660000000, "2014", "Technology", "Computer Software: Programming, Data Processing"],
          [305, 0, 0, 0, "WIX", 0, 0, 0, 0, 0, "WIX", "Wix.com Ltd.", 18.84, 717600000, "2013", "Technology", "Computer Software: Programming, Data Processing"],
          [306, 0, 0, 0, "XLNX", 0, 0, 0, 0, 0, "XLNX", "Xilinx, Inc.", 41.51, 10850000000, "1990", "Technology", "Semiconductors"],
          [307, 0, 0, 0, "XNET", 0, 0, 0, 0, 0, "XNET", "Xunlei Limited", 7.93, 515570000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [308, 0, 0, 0, "YHOO", 0, 0, 0, 0, 0, "YHOO", "Yahoo! Inc.", 44.42, 42080000000, "1996", "Technology", "EDP Services"],
          [309, 0, 0, 0, "YNDX", 0, 0, 0, 0, 0, "YNDX", "Yandex N.V.", 17, 5410000000, "2011", "Technology", "Computer Software: Programming, Data Processing"],
          [310, 0, 0, 0, "YDLE", 0, 0, 0, 0, 0, "YDLE", "Yodlee, Inc.", 13.07, 382060000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [311, 0, 0, 0, "YY", 0, 0, 0, 0, 0, "YY", "YY Inc.", 63.08, 3570000000, "2012", "Technology", "EDP Services"],
          [312, 0, 0, 0, "ZBRA", 0, 0, 0, 0, 0, "ZBRA", "Zebra Technologies Corporation", 90.525, 4610000000, "1991", "Technology", "Industrial Machinery/Components"],
          [313, 0, 0, 0, "ZNGA", 0, 0, 0, 0, 0, "ZNGA", "Zynga Inc.", 2.24, 2020000000, "2011", "Technology", "EDP Services"],
          [314, 0, -1, 27, "Transportation", 0, null, 1220, null, null, null, null, 36.42666666666666, 68938850000, null, "Transportation", null]
        ]
      });

      // and back
      state = GridDataReducer(state, { type: 'range', range: { lo: 6, hi: 31 } });
      state = GridDataReducer(state, {
        type: 'data', rowCount: 315, rows: [
          [0, 0, -1, 27, "Basic Industries", 0, null, 0, null, null, null, null, 22.489225925925922, 30965590000, null, "Basic Industries", null],
          [1, 0, -1, 79, "Capital Goods", 0, null, 27, null, null, null, null, 27.76405949367088, 135023840000, null, "Capital Goods", null],
          [2, 0, -1, 35, "Consumer Durables", 0, null, 106, null, null, null, null, 19.91088285714286, 34227080000, null, "Consumer Durables", null],
          [3, 0, -1, 40, "Consumer Non-Durables", 0, null, 141, null, null, null, null, 35.002382499999996, 76043890000, null, "Consumer Non-Durables", null],
          [4, 0, -1, 167, "Consumer Services", 0, null, 181, null, null, null, null, 34.78527724610778, 698786390026, null, "Consumer Services", null],
          [5, 0, -1, 29, "Energy", 0, null, 348, null, null, null, null, 20.812041379310344, 37013700000, null, "Energy", null],
          [6, 0, -1, 142, "Finance", 0, null, 377, null, null, null, null, 24.208854688732394, 160347990000, null, "Finance", null],
          [7, 0, -1, 324, "Health Care", 0, null, 519, null, null, null, null, 27.65928950617285, 880540540000, null, "Health Care", null],
          [8, 0, -1, 50, "Miscellaneous", 0, null, 843, null, null, null, null, 52.63641200000001, 200127520000, null, "Miscellaneous", null],
          [9, 0, -1, 24, "Public Utilities", 0, null, 893, null, null, null, null, 20.892420833333333, 26533280000, null, "Public Utilities", null],
          [10, 0, 1, 303, "Technology", 0, null, 917, null, null, null, null, 28.290387128712844, 2911887300000, null, "Technology", null],
          [11, 0, 0, 0, "VNET", 0, 0, 0, 0, 0, "VNET", "21Vianet Group, Inc.", 19.05, 1250000000, "2011", "Technology", "Computer Software: Programming, Data Processing"],
          [12, 0, 0, 0, "TWOU", 0, 0, 0, 0, 0, "TWOU", "2U, Inc.", 17.11, 693670000, "2014", "Technology", "Computer Software: Prepackaged Software"],
          [13, 0, 0, 0, "JOBS", 0, 0, 0, 0, 0, "JOBS", "51job, Inc.", 34.86, 2060000000, "2004", "Technology", "Diversified Commercial Services"],
          [14, 0, 0, 0, "ACTS", 0, 0, 0, 0, 0, "ACTS", "Actions Semiconductor Co., Ltd.", 1.54, 132440000, "2005", "Technology", "Semiconductors"],
          [15, 0, 0, 0, "ADBE", 0, 0, 0, 0, 0, "ADBE", "Adobe Systems Incorporated", 76.51, 38130000000, "1986", "Technology", "Computer Software: Prepackaged Software"],
          [16, 0, 0, 0, "ADVS", 0, 0, 0, 0, 0, "ADVS", "Advent Software, Inc.", 44.18, 2280000000, "1995", "Technology", "EDP Services"],
          [17, 0, 0, 0, "AMCN", 0, 0, 0, 0, 0, "AMCN", "AirMedia Group Inc", 2.28, 135810000, "2007", "Technology", "Advertising"],
          [18, 0, 0, 0, "AFOP", 0, 0, 0, 0, 0, "AFOP", "Alliance Fiber Optic Products, Inc.", 16.51, 307950000, "2000", "Technology", "Semiconductors"],
          [19, 0, 0, 0, "ALLT", 0, 0, 0, 0, 0, "ALLT", "Allot Communications Ltd.", 9.15, 304210000, "2006", "Technology", "Computer Communications Equipment"],
          [20, 0, 0, 0, "AOSL", 0, 0, 0, 0, 0, "AOSL", "Alpha and Omega Semiconductor Limited", 9.05, 241240000, "2010", "Technology", "Semiconductors"],
          [21, 0, 0, 0, "ALTR", 0, 0, 0, 0, 0, "ALTR", "Altera Corporation", 35.66, 10870000000, "1988", "Technology", "Semiconductors"],
          [22, 0, 0, 0, "AMBA", 0, 0, 0, 0, 0, "AMBA", "Ambarella, Inc.", 50.71, 1540000000, "2012", "Technology", "Semiconductors"],
          [23, 0, 0, 0, "AMKR", 0, 0, 0, 0, 0, "AMKR", "Amkor Technology, Inc.", 8.9, 2110000000, "1998", "Technology", "Semiconductors"],
          [24, 0, 0, 0, "ANAD", 0, 0, 0, 0, 0, "ANAD", "ANADIGICS, Inc.", 1.26, 109090000, "1995", "Technology", "Semiconductors"],
          [25, 0, 0, 0, "ANSS", 0, 0, 0, 0, 0, "ANSS", "ANSYS, Inc.", 86.26, 7930000000, "1996", "Technology", "Computer Software: Prepackaged Software"],
          [26, 0, 0, 0, "AAPL", 0, 0, 0, 0, 0, "AAPL", "Apple Inc.", 127.08, 740210000000, "1980", "Technology", "Computer Manufacturing"],
          [27, 0, 0, 0, "AMAT", 0, 0, 0, 0, 0, "AMAT", "Applied Materials, Inc.", 24.12, 29460000000, "1972", "Technology", "Semiconductors"],
          [28, 0, 0, 0, "AMCC", 0, 0, 0, 0, 0, "AMCC", "Applied Micro Circuits Corporation", 5.21, 412320000, "1997", "Technology", "Semiconductors"],
          [29, 0, 0, 0, "AAOI", 0, 0, 0, 0, 0, "AAOI", "Applied Optoelectronics, Inc.", 10.15, 150380000, "2013", "Technology", "Semiconductors"],
          [30, 0, 0, 0, "ARIS", 0, 0, 0, 0, 0, "ARIS", "ARI Network Services, Inc.", 3.63, 51660000, "1991", "Technology", "Computer Software: Programming, Data Processing"],
          [31, 0, 0, 0, "ARUN", 0, 0, 0, 0, 0, "ARUN", "Aruba Networks, Inc.", 17.7, 1940000000, "2007", "Technology", "Computer peripheral equipment"],
          [32, 0, 0, 0, "ASML", 0, 0, 0, 0, 0, "ASML", "ASML Holding N.V.", 104.48, 45680000000, "1995", "Technology", "Industrial Machinery/Components"],
          [33, 0, 0, 0, "AZPN", 0, 0, 0, 0, 0, "AZPN", "Aspen Technology, Inc.", 38.4, 3390000000, "1994", "Technology", "EDP Services"],
          [34, 0, 0, 0, "ATEA", 0, 0, 0, 0, 0, "ATEA", "Astea International, Inc.", 1.76, 6310000, "1995", "Technology", "Computer Software: Prepackaged Software"],
          [35, 0, 0, 0, "ALOT", 0, 0, 0, 0, 0, "ALOT", "Astro-Med, Inc.", 14.65, 106060000, "1983", "Technology", "Computer peripheral equipment"],
          [36, 0, 0, 0, "ATML", 0, 0, 0, 0, 0, "ATML", "Atmel Corporation", 8.39, 3500000000, "1991", "Technology", "Semiconductors"],
          [37, 0, 0, 0, "ADNC", 0, 0, 0, 0, 0, "ADNC", "Audience, Inc.", 4.59, 105460000, "2012", "Technology", "Semiconductors"],
          [38, 0, 0, 0, "ABTL", 0, 0, 0, 0, 0, "ABTL", "Autobytel Inc.", 9.88, 89200000, "1999", "Technology", "Computer Software: Programming, Data Processing"],
          [39, 0, 0, 0, "AVGO", 0, 0, 0, 0, 0, "AVGO", "Avago Technologies Limited", 110.15, 28120000000, "2009", "Technology", "Semiconductors"],
          [40, 0, 0, 0, "AWRE", 0, 0, 0, 0, 0, "AWRE", "Aware, Inc.", 4.5, 102620000, "1996", "Technology", "Computer Software: Prepackaged Software"]
        ]
      })

      // collapse
      debugger;
      state = GridDataReducer(state, {
        type: 'data', rowCount: 12, rows: [
          [0, 0, -1, 27, "Basic Industries", 0, null, 0, null, null, null, null, 22.489225925925922, 30965590000, null, "Basic Industries", null],
          [1, 0, -1, 79, "Capital Goods", 0, null, 27, null, null, null, null, 27.76405949367088, 135023840000, null, "Capital Goods", null],
          [2, 0, -1, 35, "Consumer Durables", 0, null, 106, null, null, null, null, 19.91088285714286, 34227080000, null, "Consumer Durables", null],
          [3, 0, -1, 40, "Consumer Non-Durables", 0, null, 141, null, null, null, null, 35.002382499999996, 76043890000, null, "Consumer Non-Durables", null],
          [4, 0, -1, 167, "Consumer Services", 0, null, 181, null, null, null, null, 34.78527724610778, 698786390026, null, "Consumer Services", null],
          [5, 0, -1, 29, "Energy", 0, null, 348, null, null, null, null, 20.812041379310344, 37013700000, null, "Energy", null],
          [6, 0, -1, 142, "Finance", 0, null, 377, null, null, null, null, 24.208854688732394, 160347990000, null, "Finance", null],
          [7, 0, -1, 324, "Health Care", 0, null, 519, null, null, null, null, 27.65928950617285, 880540540000, null, "Health Care", null],
          [8, 0, -1, 50, "Miscellaneous", 0, null, 843, null, null, null, null, 52.63641200000001, 200127520000, null, "Miscellaneous", null],
          [9, 0, -1, 24, "Public Utilities", 0, null, 893, null, null, null, null, 20.892420833333333, 26533280000, null, "Public Utilities", null],
          [10, 0, -1, 303, "Technology", 0, null, 917, null, null, null, null, 28.290387128712844, 2911887300000, null, "Technology", null],
          [11, 0, -1, 27, "Transportation", 0, null, 1220, null, null, null, null, 36.42666666666666, 68938850000, null, "Transportation", null]
        ]
      });

      console.table(state.buffer);
      console.log(JSON.stringify(state.keys))
      console.log(JSON.stringify(state.bufferIdx))

      state = GridDataReducer(state, {
        type: 'data', rowCount: 1247, rows: [

        ]
      });

      state = GridDataReducer(state, {
        type: 'data', rowCount: 1247, rows: [

        ]
      });

      state = GridDataReducer(state, {
        type: 'data', rowCount: 1247, rows: [

        ]
      });


    })


  })



});
