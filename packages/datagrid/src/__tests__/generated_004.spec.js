
import GridDataReducer from '../../src/grid-data-reducer';
describe('grid-data-reducer-generated-test', () => {
    test('init, default bufferSize', () => {
      let state = undefined;




    state = GridDataReducer(state, {"type":"clear","range":{"lo":0,"hi":74},"bufferSize":50});



    state = GridDataReducer(state, {"type":"clear","range":{"lo":0,"hi":74},"bufferSize":50});



    state = GridDataReducer(state, {"type":"range","range":{"lo":0,"hi":93}});



    state = GridDataReducer(state, {"type":"range","range":{"lo":0,"hi":73}});



    state = GridDataReducer(state, {"type":"data","rows":[[0,0,true,null,null,1,"AAPL.N",0,"AAPL.N",925,934.25,295.81,842.28,233,"walkBidAsk"],
[1,1,true,null,null,1,"VOD.L",0,"VOD.L",197,198.97,294.86,603.96,933,"fastTick"],
[2,2,true,null,null,1,"ATR.OQ",0,"ATR.OQ",472,476.72,720.06,85.82,113,"fastTick"],
[3,3,true,null,null,1,"AMW.AS",0,"AMW.AS",423,466.98,457.98,347.39,500,"fastTick"],
[4,4,true,null,null,1,"ADE.OQ",0,"ADE.OQ",942,951.42,579.49,790.81,72,"walkBidAsk"],
[5,5,true,null,null,1,"AQA.N",0,"AQA.N",960,969.6,956.15,761.51,845,"walkBidAsk"],
[6,6,true,null,null,1,"AKH.N",0,"AKH.N",942,951.42,579.49,790.81,72,"walkBidAsk"],
[7,7,true,null,null,1,"AKH.L",0,"AKH.L",942,951.42,579.49,413.07,72,"walkBidAsk"],
[8,8,true,null,null,1,"AML.AS",0,"AML.AS",942,951.42,579.49,413.07,72,"walkBidAsk"],
[9,9,true,null,null,1,"AQA.L",0,"AQA.L",96,96,96,761.51,845,"fastTick"],
[10,10,true,null,null,1,"AVY.N",0,"AVY.N",696,702.96,401.73,897.85,853,"open"],
[11,11,true,null,null,1,"BHA.N",0,"BHA.N",96,96,96,761.51,845,"fastTick"],
[12,12,true,null,null,1,"BHA.L",0,"BHA.L",96,96,96,761.51,845,"fastTick"],
[13,13,true,null,null,1,"ACN.OQ",0,"ACN.OQ",942,951.42,579.49,413.07,72,"walkBidAsk"],
[14,14,true,null,null,1,"BFV.OQ",0,"BFV.OQ",696,702.96,385.73,897.85,853,"open"],
[15,15,true,null,null,1,"AVY.L",0,"AVY.L",696,702.96,385.73,897.85,853,"open"],
[16,16,true,null,null,1,"ANN.AS",0,"ANN.AS",419,452.98,450.98,347.39,188,"fastTick"],
[17,17,true,null,null,1,"BBH.L",0,"BBH.L",942,951.42,579.49,413.07,72,"walkBidAsk"],
[18,18,true,null,null,1,"AFA.N",0,"AFA.N",472,476.72,845.3,85.82,245,"fastTick"],
[19,19,true,null,null,1,"BBH.N",0,"BBH.N",942,951.42,579.49,413.07,72,"walkBidAsk"],
[20,20,true,null,null,1,"ADP.OQ",0,"ADP.OQ",427,460.98,458.98,347.39,188,"fastTick"],
[21,21,true,null,null,1,"AFA.L",0,"AFA.L",472,476.72,838.3,85.82,245,"fastTick"],
[22,22,true,null,null,1,"BFK.OQ",0,"BFK.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[23,23,true,null,null,1,"ACC.OQ",0,"ACC.OQ",423,466.98,464.98,347.39,188,"fastTick"],
[24,24,true,null,null,1,"ATG.OQ",0,"ATG.OQ",960,969.6,70.38,889.78,973,"walkBidAsk"],
[25,25,true,null,null,1,"AKY.N",0,"AKY.N",4,4,379.46,326.19,858,"walkBidAsk"],
[26,26,true,null,null,1,"AQR.N",0,"AQR.N",428,432.28,272.27,309.04,329,"walkBidAsk"],
[27,27,true,null,null,1,"AKY.L",0,"AKY.L",4,4,379.46,326.19,858,"walkBidAsk"],
[28,28,true,null,null,1,"AQR.L",0,"AQR.L",428,432.28,47,309.04,329,"walkBidAsk"],
[29,29,true,null,null,1,"ALJ.AS",0,"ALJ.AS",423,466.98,464.98,347.39,188,"fastTick"],
[30,30,true,null,null,1,"ANC.AS",0,"ANC.AS",933,942.33,579.49,413.07,567,"walkBidAsk"],
[31,31,true,null,null,1,"BGM.OQ",0,"BGM.OQ",68,78.47999999999999,70.47999999999999,897.85,976,"fastTick"],
[32,32,true,null,null,1,"BCK.L",0,"BCK.L",947,956.47,880.5,989.8,864,"open"],
[33,33,true,null,null,1,"BCK.N",0,"BCK.N",947,956.47,880.5,989.8,864,"open"],
[34,34,true,null,null,1,"BGX.OQ",0,"BGX.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[35,35,true,null,null,1,"AUT.OQ",0,"AUT.OQ",960,969.6,70.38,889.78,973,"walkBidAsk"],
[36,36,true,null,null,1,"BDG.OQ",0,"BDG.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[37,37,true,null,null,1,"ALU.AS",0,"ALU.AS",558,563.58,733.23,413.07,698,"walkBidAsk"],
[38,38,true,null,null,1,"APO.N",0,"APO.N",327,340.09,335.09,84.77,761,"walkBidAsk"],
[39,39,true,null,null,1,"AJV.N",0,"AJV.N",448,462.1,459.1,1009.97,55,"walkBidAsk"],
[40,40,true,null,null,1,"AJV.L",0,"AJV.L",448,462.1,459.1,1009.97,55,"walkBidAsk"],
[41,41,true,null,null,1,"AUI.OQ",0,"AUI.OQ",855,883.3,875.3,85.82,123,"walkBidAsk"],
[42,42,true,null,null,1,"APO.L",0,"APO.L",449,453.49,468.48,78.77,889,"walkBidAsk"],
[43,43,true,null,null,1,"BHR.N",0,"BHR.N",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[44,44,true,null,null,1,"AMA.AS",0,"AMA.AS",398,401.98,947.94,351.39,814,"walkBidAsk"],
[45,45,true,null,null,1,"AVH.L",0,"AVH.L",398,401.98,947.94,351.39,814,"walkBidAsk"],
[46,46,true,null,null,1,"BHR.L",0,"BHR.L",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[47,47,true,null,null,1,"AVH.N",0,"AVH.N",398,401.98,947.94,982.64,814,"walkBidAsk"],
[48,48,true,null,null,1,"BCP.OQ",0,"BCP.OQ",65,65.65,962.28,326.19,858,"walkBidAsk"],
[49,49,true,null,null,1,"BGB.OQ",0,"BGB.OQ",65,65.65,962.28,326.19,858,"walkBidAsk"],
[50,50,true,null,null,1,"BBY.L",0,"BBY.L",65,65.65,962.28,326.19,858,"walkBidAsk"],
[51,51,true,null,null,1,"BBY.N",0,"BBY.N",65,65.65,586.53,326.19,858,"walkBidAsk"],
[52,52,true,null,null,1,"ACY.OQ",0,"ACY.OQ",398,401.98,938.94,982.64,814,"walkBidAsk"],
[53,53,true,null,null,1,"AEO.L",0,"AEO.L",766,813.49,804.49,290.82,698,"walkBidAsk"],
[54,54,true,null,null,1,"AEO.N",0,"AEO.N",771,818.49,809.49,290.82,698,"walkBidAsk"],
[55,55,true,null,null,1,"AQW.OQ",0,"AQW.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[56,56,true,null,null,1,"APR.AS",0,"APR.AS",398,401.98,938.94,982.64,814,"walkBidAsk"],
[57,57,true,null,null,1,"AAJ.OQ",0,"AAJ.OQ",558,563.58,807.79,413.07,307,"walkBidAsk"],
[58,58,true,null,null,1,"BIU.L",0,"BIU.L",771,818.49,809.49,290.82,698,"walkBidAsk"],
[59,59,true,null,null,1,"AGD.L",0,"AGD.L",911,939.81,938.81,550.43,731,"fastTick"],
[60,60,true,null,null,1,"BIU.N",0,"BIU.N",771,818.49,809.49,290.82,698,"walkBidAsk"],
[61,61,true,null,null,1,"AGD.N",0,"AGD.N",911,939.81,938.81,550.43,937,"fastTick"],
[62,62,true,null,null,1,"BAT.AS",0,"BAT.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[63,63,true,null,null,1,"BBK.AS",0,"BBK.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[64,64,true,null,null,1,"ARC.OQ",0,"ARC.OQ",586,591.86,70.38,889.78,973,"walkBidAsk"],
[65,65,true,null,null,1,"ARU.L",0,"ARU.L",777,824.49,815.49,290.82,695,"walkBidAsk"],
[66,66,true,null,null,1,"APG.AS",0,"APG.AS",885,893.85,807.79,417.07,307,"open"],
[67,67,true,null,null,1,"AAU.OQ",0,"AAU.OQ",23,23.23,130,982.64,814,"walkBidAsk"],
[68,68,true,null,null,1,"ARU.N",0,"ARU.N",775,812.49,812.49,290.82,695,"walkBidAsk"],
[69,69,true,null,null,1,"ARN.OQ",0,"ARN.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[70,70,true,null,null,1,"AXN.L",0,"AXN.L",230,232.2,231.2,417.07,307,"fastTick"],
[71,71,true,null,null,1,"AXN.N",0,"AXN.N",230,232.2,231.2,417.07,307,"fastTick"],
[72,72,true,null,null,1,"AHB.OQ",0,"AHB.OQ",149,150.49,160,982.64,128,"walkBidAsk"],
[73,73,true,null,null,1,"AGU.L",0,"AGU.L",572,577.72,602.76,203,61,"walkBidAsk"],
[74,74,true,null,null,1,"AMN.L",0,"AMN.L",149,150.49,160,982.64,128,"walkBidAsk"],
[75,75,true,null,null,1,"BID.N",0,"BID.N",88,108.67,101.67,748.4,658,"walkBidAsk"],
[76,76,true,null,null,1,"AGU.N",0,"AGU.N",572,577.72,602.76,203,61,"walkBidAsk"],
[77,77,true,null,null,1,"AMN.N",0,"AMN.N",149,150.49,148,982.64,126,"walkBidAsk"],
[78,78,true,null,null,1,"BID.L",0,"BID.L",88,108.67,101.67,748.4,658,"walkBidAsk"],
[79,79,true,null,null,1,"ASE.OQ",0,"ASE.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[80,80,true,null,null,1,"BDR.OQ",0,"BDR.OQ",321,324.21,318.1,19.130000000000003,537,"fastTick"],
[81,81,true,null,null,1,"AWK.N",0,"AWK.N",39,39.39,943.12,443.33,254,"fastTick"],
[82,82,true,null,null,1,"ANY.AS",0,"ANY.AS",236,238.2,237.2,546.35,709,"fastTick"],
[83,83,true,null,null,1,"AOE.AS",0,"AOE.AS",149,150.49,143,982.64,131,"walkBidAsk"],
[84,84,true,null,null,1,"AWK.L",0,"AWK.L",940,969.12,959.12,443.33,254,"fastTick"],
[85,85,true,null,null,1,"AHM.OQ",0,"AHM.OQ",236,238.2,237.2,546.35,705,"fastTick"],
[86,86,true,null,null,1,"ABW.OQ",0,"ABW.OQ",236,238.2,237.2,546.35,709,"fastTick"],
[87,87,true,null,null,1,"AYQ.AS",0,"AYQ.AS",91,91,968.52,841.3,123,"walkBidAsk"],
[88,88,true,null,null,1,"ASP.OQ",0,"ASP.OQ",586,591.86,78.38,889.78,599,"walkBidAsk"],
[89,89,true,null,null,1,"ABL.OQ",0,"ABL.OQ",774,781.74,143,982.64,131,"walkBidAsk"],
[90,90,true,null,null,1,"AHX.OQ",0,"AHX.OQ",774,781.74,143,982.64,131,"walkBidAsk"],
[91,91,true,null,null,1,"ALK.N",0,"ALK.N",142,143.42,179.3,641.3,748,"open"],
[92,92,true,null,null,1,"AOP.AS",0,"AOP.AS",236,238.2,237.2,546.35,700,"fastTick"],
[93,0,true,null,null,1,"AFR.N",0,"AFR.N",481,515.49,507.49,1002.93,152,"fastTick"],
[94,0,true,null,null,1,"BJG.L",0,"BJG.L",91,91,968.52,841.3,264,"walkBidAsk"],
[95,0,true,null,null,1,"BJG.N",0,"BJG.N",857,885.3,877.3,218.1,264,"walkBidAsk"],
[96,0,true,null,null,1,"AFR.L",0,"AFR.L",487,521.49,513.49,1002.93,152,"fastTick"],
[97,0,true,null,null,1,"ARY.OQ",0,"ARY.OQ",586,591.86,78.38,889.78,599,"walkBidAsk"],
[98,0,true,null,null,1,"AYF.AS",0,"AYF.AS",907,945.78,942.78,427.23,599,"fastTick"],
[99,0,true,null,null,1,"BAI.AS",0,"BAI.AS",907,945.78,942.78,427.23,599,"fastTick"],
[100,0,true,null,null,1,"BEI.OQ",0,"BEI.OQ",321,324.21,318.1,19.130000000000003,418,"fastTick"],
[101,0,true,null,null,1,"BDN.L",0,"BDN.L",774,781.74,273.24,94.92,260,"walkBidAsk"],
[102,0,true,null,null,1,"ARD.N",0,"ARD.N",198,209.9,200.9,748.4,658,"walkBidAsk"],
[103,0,true,null,null,1,"ALK.L",0,"ALK.L",142,143.42,743.34,641.3,748,"open"],
[104,0,true,null,null,1,"ARD.L",0,"ARD.L",198,209.9,200.9,748.4,593,"walkBidAsk"],
[105,0,true,null,null,1,"BET.OQ",0,"BET.OQ",50,60,53,326.19,694,"fastTick"],
[106,0,true,null,null,1,"BDN.N",0,"BDN.N",774,781.74,273.24,94.92,260,"walkBidAsk"],
[107,0,true,null,null,1,"AAK.N",0,"AAK.N",934,973.12,963.12,446.33,875,"fastTick"],
[108,0,true,null,null,1,"AID.OQ",0,"AID.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"],
[109,0,true,null,null,1,"AAK.L",0,"AAK.L",934,973.12,963.12,446.33,875,"fastTick"],
[110,0,true,null,null,1,"ABA.OQ",0,"ABA.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"],
[111,0,true,null,null,1,"AZH.OQ",0,"AZH.OQ",852,880.3,880.3,218.1,251,"walkBidAsk"],
[112,0,true,null,null,1,"AYQ.N",0,"AYQ.N",119,180.03,179.03,641.3,748,"fastTick"],
[113,0,true,null,null,1,"AHB.AS",0,"AHB.AS",510,515.1,266.24,94.92,255,"open"],
[114,0,true,null,null,1,"AHX.N",0,"AHX.N",783,820.58,811.58,943.29,65,"fastTick"],
[115,0,true,null,null,1,"AYQ.L",0,"AYQ.L",658,714.32,713.32,107.03,748,"fastTick"],
[116,0,true,null,null,1,"BEQ.N",0,"BEQ.N",934,973.12,963.12,446.33,875,"fastTick"],
[117,0,true,null,null,1,"BEQ.L",0,"BEQ.L",39,39.39,941.12,446.33,881,"fastTick"],
[118,0,true,null,null,1,"AXO.AS",0,"AXO.AS",907,935.78,932.78,429.23,696,"walkBidAsk"],
[119,0,true,null,null,1,"BDZ.AS",0,"BDZ.AS",902,920.78,917.78,429.23,696,"walkBidAsk"],
[120,0,true,null,null,1,"AXZ.AS",0,"AXZ.AS",695,701.95,886.3,218.1,251,"fastTick"],
[121,0,true,null,null,1,"BEF.AS",0,"BEF.AS",695,701.95,886.3,218.1,251,"fastTick"],
[122,0,true,null,null,1,"AOH.OQ",0,"AOH.OQ",897,905.78,902.78,429.23,696,"walkBidAsk"],
[123,0,true,null,null,1,"AZS.OQ",0,"AZS.OQ",878,886.78,719.64,429.23,696,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[0,0,true,null,null,1,"NYC-003142",0,"NYC-003142","B","AAPL.N","USD",94065,0,"stevchrs",1615751668987],
[1,1,true,null,null,1,"NYC-003143",0,"NYC-003143","B","AAPL.N","USD",68490,0,"stevchrs",1615751669088],
[2,2,true,null,null,1,"NYC-003144",0,"NYC-003144","B","AAPL.N","USD",12914,10331.2,"stevchrs",1615751669188],
[3,3,true,null,null,1,"NYC-003145",0,"NYC-003145","B","AAPL.N","USD",59292,59292,"stevchrs",1615751669291],
[4,4,true,null,null,1,"NYC-003146",0,"NYC-003146","B","AAPL.N","USD",57676,57676,"stevchrs",1615751669391],
[5,5,true,null,null,1,"NYC-003147",0,"NYC-003147","B","AAPL.N","USD",67684,67684,"stevchrs",1615751669492],
[6,6,true,null,null,1,"NYC-003148",0,"NYC-003148","B","AAPL.N","USD",29842,29842,"stevchrs",1615751669595],
[7,7,true,null,null,1,"NYC-003149",0,"NYC-003149","B","AAPL.N","USD",8476,8476,"stevchrs",1615751669695],
[8,8,true,null,null,1,"NYC-003150",0,"NYC-003150","B","AAPL.N","USD",59400,59400,"stevchrs",1615751669821],
[9,9,true,null,null,1,"NYC-003151",0,"NYC-003151","B","AAPL.N","USD",63090,63090,"stevchrs",1615751669921],
[10,10,true,null,null,1,"NYC-003152",0,"NYC-003152","B","AAPL.N","USD",5945,5945,"stevchrs",1615751670021],
[11,11,true,null,null,1,"NYC-003153",0,"NYC-003153","B","AAPL.N","USD",20527,20527,"stevchrs",1615751670189],
[12,12,true,null,null,1,"NYC-003154",0,"NYC-003154","B","AAPL.N","USD",20182,20182,"stevchrs",1615751670290],
[13,13,true,null,null,1,"NYC-003155",0,"NYC-003155","B","AAPL.N","USD",41034,41034,"stevchrs",1615751670391],
[14,14,true,null,null,1,"NYC-003156",0,"NYC-003156","B","AAPL.N","USD",1486,1486,"stevchrs",1615751670491],
[15,15,true,null,null,1,"NYC-003157",0,"NYC-003157","B","AAPL.N","USD",68561,68561,"stevchrs",1615751670595],
[16,16,true,null,null,1,"NYC-003158",0,"NYC-003158","B","AAPL.N","USD",96565,96565,"stevchrs",1615751670696],
[17,17,true,null,null,1,"NYC-003159",0,"NYC-003159","B","AAPL.N","USD",24875,29020.83333333333,"stevchrs",1615751670796],
[18,18,true,null,null,1,"NYC-003160",0,"NYC-003160","B","AAPL.N","USD",67231,67231,"stevchrs",1615751670900],
[19,19,true,null,null,1,"NYC-003161",0,"NYC-003161","B","AAPL.N","USD",86936,86936,"stevchrs",1615751671000],
[20,20,true,null,null,1,"NYC-003162",0,"NYC-003162","B","AAPL.N","USD",8797,8797.000000000002,"stevchrs",1615751671101],
[21,21,true,null,null,1,"NYC-003163",0,"NYC-003163","B","AAPL.N","USD",37186,37186,"stevchrs",1615751671202],
[22,22,true,null,null,1,"NYC-003164",0,"NYC-003164","B","AAPL.N","USD",66469,66469,"stevchrs",1615751671303],
[23,23,true,null,null,1,"NYC-003165",0,"NYC-003165","B","AAPL.N","USD",99201,99201,"stevchrs",1615751671404],
[24,24,true,null,null,1,"NYC-003166",0,"NYC-003166","B","AAPL.N","USD",53140,53140,"stevchrs",1615751671504],
[25,25,true,null,null,1,"NYC-003167",0,"NYC-003167","B","AAPL.N","USD",442,442,"stevchrs",1615751671605],
[26,26,true,null,null,1,"NYC-003168",0,"NYC-003168","B","AAPL.N","USD",43910,43910,"stevchrs",1615751671705],
[27,27,true,null,null,1,"LDN-003169",0,"LDN-003169","B","VOD.L","GBp",31124,31124,"stevchrs",1615751671806],
[28,28,true,null,null,1,"LDN-003170",0,"LDN-003170","B","VOD.L","GBp",29562,29562.000000000004,"stevchrs",1615751671906],
[29,29,true,null,null,1,"LDN-003171",0,"LDN-003171","B","VOD.L","GBp",44525,44525,"stevchrs",1615751672007],
[30,30,true,null,null,1,"LDN-003172",0,"LDN-003172","B","VOD.L","GBp",46143,46143,"stevchrs",1615751672110],
[31,31,true,null,null,1,"LDN-003173",0,"LDN-003173","B","VOD.L","GBp",17753,17753,"stevchrs",1615751672212],
[32,32,true,null,null,1,"LDN-003174",0,"LDN-003174","B","VOD.L","GBp",40798,40798,"stevchrs",1615751672316],
[33,33,true,null,null,1,"LDN-003175",0,"LDN-003175","B","VOD.L","GBp",40077,40077,"stevchrs",1615751672416],
[34,34,true,null,null,1,"LDN-003176",0,"LDN-003176","B","VOD.L","GBp",14085,14085,"stevchrs",1615751672516],
[35,35,true,null,null,1,"LDN-003177",0,"LDN-003177","B","VOD.L","GBp",49891,49891,"stevchrs",1615751672620],
[36,36,true,null,null,1,"LDN-003178",0,"LDN-003178","B","VOD.L","GBp",40345,40345,"stevchrs",1615751672723],
[37,37,true,null,null,1,"LDN-003179",0,"LDN-003179","B","VOD.L","GBp",70900,70900,"stevchrs",1615751672826],
[38,38,true,null,null,1,"LDN-003180",0,"LDN-003180","B","VOD.L","GBp",52042,52042,"stevchrs",1615751672932],
[39,39,true,null,null,1,"LDN-003181",0,"LDN-003181","B","VOD.L","GBp",12278,12278,"stevchrs",1615751673033],
[40,40,true,null,null,1,"LDN-003182",0,"LDN-003182","B","VOD.L","GBp",60912,60912,"stevchrs",1615751673137],
[41,41,true,null,null,1,"LDN-003183",0,"LDN-003183","B","VOD.L","GBp",21709,21709,"stevchrs",1615751673237],
[42,42,true,null,null,1,"LDN-003184",0,"LDN-003184","B","VOD.L","GBp",23458,23458.000000000004,"stevchrs",1615751673338],
[43,43,true,null,null,1,"LDN-003185",0,"LDN-003185","B","VOD.L","GBp",11722,11722,"stevchrs",1615751673438],
[44,44,true,null,null,1,"LDN-003186",0,"LDN-003186","B","VOD.L","GBp",98506,98506,"stevchrs",1615751673542],
[45,45,true,null,null,1,"LDN-003187",0,"LDN-003187","B","VOD.L","GBp",96848,96848,"stevchrs",1615751673645],
[46,46,true,null,null,1,"LDN-003188",0,"LDN-003188","B","VOD.L","GBp",65863,0,"stevchrs",1615751673746]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[17,17,true,null,null,1,"NYC-003159",0,"NYC-003159","B","AAPL.N","USD",24875,16583.333333333332,"stevchrs",1615751670796]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[17,17,true,null,null,1,"NYC-003159",0,"NYC-003159","B","AAPL.N","USD",24875,24874.999999999996,"stevchrs",1615751670796]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[16,16,true,null,null,1,"NYC-003158",0,"NYC-003158","B","AAPL.N","USD",96565,13795,"stevchrs",1615751670696],
[17,17,true,null,null,1,"NYC-003159",0,"NYC-003159","B","AAPL.N","USD",24875,29020.83333333333,"stevchrs",1615751670796]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[0,0,true,null,null,1,"AAPL.N",0,"AAPL.N",454,458.54,295.81,842.28,233,"open"],
[26,26,true,null,null,1,"AQR.N",0,"AQR.N",428,432.28,272.27,309.04,329,"open"],
[28,28,true,null,null,1,"AQR.L",0,"AQR.L",428,432.28,47,309.04,329,"open"],
[43,43,true,null,null,1,"BHR.N",0,"BHR.N",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[46,46,true,null,null,1,"BHR.L",0,"BHR.L",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[114,0,true,null,null,1,"AHX.N",0,"AHX.N",774,801.58,795.58,943.29,65,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[3,3,true,null,null,1,"AMW.AS",0,"AMW.AS",404,427.98,427.98,347.39,500,"fastTick"],
[16,16,true,null,null,1,"ANN.AS",0,"ANN.AS",404,427.98,427.98,347.39,188,"fastTick"],
[20,20,true,null,null,1,"ADP.OQ",0,"ADP.OQ",412,435.98,435.98,347.39,188,"fastTick"],
[23,23,true,null,null,1,"ACC.OQ",0,"ACC.OQ",412,435.98,435.98,347.39,188,"fastTick"],
[29,29,true,null,null,1,"ALJ.AS",0,"ALJ.AS",412,435.98,435.98,347.39,188,"fastTick"],
[44,44,true,null,null,1,"AMA.AS",0,"AMA.AS",398,401.98,947.94,351.39,814,"walkBidAsk"],
[45,45,true,null,null,1,"AVH.L",0,"AVH.L",398,401.98,947.94,351.39,814,"walkBidAsk"],
[47,47,true,null,null,1,"AVH.N",0,"AVH.N",398,401.98,947.94,982.64,814,"walkBidAsk"],
[52,52,true,null,null,1,"ACY.OQ",0,"ACY.OQ",398,401.98,938.94,982.64,814,"walkBidAsk"],
[56,56,true,null,null,1,"APR.AS",0,"APR.AS",398,401.98,938.94,982.64,814,"walkBidAsk"],
[67,67,true,null,null,1,"AAU.OQ",0,"AAU.OQ",23,23.23,130,982.64,814,"walkBidAsk"],
[72,72,true,null,null,1,"AHB.OQ",0,"AHB.OQ",149,150.49,160,982.64,128,"open"],
[74,74,true,null,null,1,"AMN.L",0,"AMN.L",149,150.49,160,982.64,128,"open"],
[77,77,true,null,null,1,"AMN.N",0,"AMN.N",149,150.49,148,982.64,126,"open"],
[83,83,true,null,null,1,"AOE.AS",0,"AOE.AS",149,150.49,143,982.64,131,"open"],
[89,89,true,null,null,1,"ABL.OQ",0,"ABL.OQ",774,781.74,143,982.64,131,"open"],
[90,90,true,null,null,1,"AHX.OQ",0,"AHX.OQ",774,781.74,143,982.64,131,"open"],
[101,0,true,null,null,1,"BDN.L",0,"BDN.L",774,781.74,273.24,94.92,260,"open"],
[106,0,true,null,null,1,"BDN.N",0,"BDN.N",774,781.74,273.24,94.92,260,"open"],
[113,0,true,null,null,1,"AHB.AS",0,"AHB.AS",774,781.74,266.24,94.92,255,"open"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[16,16,true,null,null,1,"NYC-003158",0,"NYC-003158","B","AAPL.N","USD",96565,41385,"stevchrs",1615751670696]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[75,75,true,null,null,1,"BID.N",0,"BID.N",88,108.67,101.67,748.4,658,"fastTick"],
[78,78,true,null,null,1,"BID.L",0,"BID.L",88,108.67,101.67,748.4,658,"fastTick"],
[102,0,true,null,null,1,"ARD.N",0,"ARD.N",198,209.9,200.9,748.4,658,"fastTick"],
[104,0,true,null,null,1,"ARD.L",0,"ARD.L",198,209.9,200.9,748.4,593,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[16,16,true,null,null,1,"NYC-003158",0,"NYC-003158","B","AAPL.N","USD",96565,68975,"stevchrs",1615751670696]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[10,10,true,null,null,1,"AVY.N",0,"AVY.N",937,946.37,401.73,897.85,853,"open"],
[14,14,true,null,null,1,"BFV.OQ",0,"BFV.OQ",937,946.37,385.73,897.85,853,"open"],
[15,15,true,null,null,1,"AVY.L",0,"AVY.L",937,946.37,385.73,897.85,853,"open"],
[31,31,true,null,null,1,"BGM.OQ",0,"BGM.OQ",48,48.48,388.73,897.85,976,"open"],
[53,53,true,null,null,1,"AEO.L",0,"AEO.L",759,796.49,790.49,290.82,698,"fastTick"],
[54,54,true,null,null,1,"AEO.N",0,"AEO.N",764,801.49,795.49,290.82,698,"fastTick"],
[58,58,true,null,null,1,"BIU.L",0,"BIU.L",764,801.49,795.49,290.82,698,"fastTick"],
[60,60,true,null,null,1,"BIU.N",0,"BIU.N",764,801.49,795.49,290.82,698,"fastTick"],
[65,65,true,null,null,1,"ARU.L",0,"ARU.L",770,807.49,798.49,290.82,695,"fastTick"],
[68,68,true,null,null,1,"ARU.N",0,"ARU.N",775,812.49,803.49,290.82,695,"fastTick"],
[80,80,true,null,null,1,"BDR.OQ",0,"BDR.OQ",76,76.76,318.1,19.130000000000003,537,"fastTick"],
[100,0,true,null,null,1,"BEI.OQ",0,"BEI.OQ",76,76.76,318.1,19.130000000000003,418,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[16,16,true,null,null,1,"NYC-003158",0,"NYC-003158","B","AAPL.N","USD",96565,96565,"stevchrs",1615751670696]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[2,2,true,null,null,1,"ATR.OQ",0,"ATR.OQ",947,956.47,720.06,85.82,113,"fastTick"],
[18,18,true,null,null,1,"AFA.N",0,"AFA.N",947,956.47,845.3,85.82,245,"fastTick"],
[21,21,true,null,null,1,"AFA.L",0,"AFA.L",947,956.47,838.3,85.82,245,"fastTick"],
[41,41,true,null,null,1,"AUI.OQ",0,"AUI.OQ",849,867.3,860.3,85.82,123,"fastTick"],
[55,55,true,null,null,1,"AQW.OQ",0,"AQW.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[62,62,true,null,null,1,"BAT.AS",0,"BAT.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[63,63,true,null,null,1,"BBK.AS",0,"BBK.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[69,69,true,null,null,1,"ARN.OQ",0,"ARN.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[79,79,true,null,null,1,"ASE.OQ",0,"ASE.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[81,81,true,null,null,1,"AWK.N",0,"AWK.N",929,938.12,937.12,443.33,254,"fastTick"],
[84,84,true,null,null,1,"AWK.L",0,"AWK.L",929,938.12,937.12,443.33,254,"fastTick"],
[87,87,true,null,null,1,"AYQ.AS",0,"AYQ.AS",91,91,968.52,841.3,123,"walkBidAsk"],
[94,0,true,null,null,1,"BJG.L",0,"BJG.L",91,91,968.52,841.3,264,"walkBidAsk"],
[95,0,true,null,null,1,"BJG.N",0,"BJG.N",851,869.3,868.3,218.1,264,"fastTick"],
[107,0,true,null,null,1,"AAK.N",0,"AAK.N",923,942.12,941.12,446.33,875,"fastTick"],
[109,0,true,null,null,1,"AAK.L",0,"AAK.L",923,942.12,941.12,446.33,875,"fastTick"],
[111,0,true,null,null,1,"AZH.OQ",0,"AZH.OQ",852,880.3,879.3,218.1,251,"fastTick"],
[116,0,true,null,null,1,"BEQ.N",0,"BEQ.N",923,942.12,941.12,446.33,875,"fastTick"],
[117,0,true,null,null,1,"BEQ.L",0,"BEQ.L",923,942.12,941.12,446.33,881,"fastTick"],
[120,0,true,null,null,1,"AXZ.AS",0,"AXZ.AS",858,886.3,885.3,218.1,251,"fastTick"],
[121,0,true,null,null,1,"BEF.AS",0,"BEF.AS",858,886.3,885.3,218.1,251,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[1,1,true,null,null,1,"VOD.L",0,"VOD.L",701,708.01,294.86,603.96,933,"fastTick"],
[39,39,true,null,null,1,"AJV.N",0,"AJV.N",442,456.1,448.1,1009.97,55,"fastTick"],
[40,40,true,null,null,1,"AJV.L",0,"AJV.L",442,456.1,448.1,1009.97,55,"fastTick"],
[93,0,true,null,null,1,"AFR.N",0,"AFR.N",467,491.49,482.49,1002.93,152,"fastTick"],
[96,0,true,null,null,1,"AFR.L",0,"AFR.L",473,497.49,488.49,1002.93,152,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[15,15,true,null,null,1,"NYC-003157",0,"NYC-003157","B","AAPL.N","USD",68561,15235.777777777777,"stevchrs",1615751670595]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[4,4,true,null,null,1,"ADE.OQ",0,"ADE.OQ",621,627.21,579.49,790.81,72,"open"],
[6,6,true,null,null,1,"AKH.N",0,"AKH.N",621,627.21,579.49,790.81,72,"open"],
[7,7,true,null,null,1,"AKH.L",0,"AKH.L",621,627.21,579.49,413.07,72,"open"],
[8,8,true,null,null,1,"AML.AS",0,"AML.AS",621,627.21,579.49,413.07,72,"open"],
[13,13,true,null,null,1,"ACN.OQ",0,"ACN.OQ",621,627.21,579.49,413.07,72,"open"],
[17,17,true,null,null,1,"BBH.L",0,"BBH.L",621,627.21,579.49,413.07,72,"open"],
[19,19,true,null,null,1,"BBH.N",0,"BBH.N",621,627.21,579.49,413.07,72,"open"],
[30,30,true,null,null,1,"ANC.AS",0,"ANC.AS",933,942.33,579.49,413.07,567,"open"],
[37,37,true,null,null,1,"ALU.AS",0,"ALU.AS",558,563.58,733.23,413.07,698,"open"],
[57,57,true,null,null,1,"AAJ.OQ",0,"AAJ.OQ",558,563.58,807.79,413.07,307,"open"],
[59,59,true,null,null,1,"AGD.L",0,"AGD.L",899,917.81,913.81,550.43,731,"fastTick"],
[61,61,true,null,null,1,"AGD.N",0,"AGD.N",899,917.81,913.81,550.43,937,"fastTick"],
[66,66,true,null,null,1,"APG.AS",0,"APG.AS",558,563.58,807.79,417.07,307,"open"],
[70,70,true,null,null,1,"AXN.L",0,"AXN.L",221,223.2,222.2,417.07,307,"fastTick"],
[71,71,true,null,null,1,"AXN.N",0,"AXN.N",221,223.2,222.2,417.07,307,"fastTick"],
[82,82,true,null,null,1,"ANY.AS",0,"ANY.AS",227,229.2,225.2,546.35,709,"fastTick"],
[85,85,true,null,null,1,"AHM.OQ",0,"AHM.OQ",227,229.2,225.2,546.35,705,"fastTick"],
[86,86,true,null,null,1,"ABW.OQ",0,"ABW.OQ",227,229.2,225.2,546.35,709,"fastTick"],
[92,92,true,null,null,1,"AOP.AS",0,"AOP.AS",227,229.2,225.2,546.35,700,"fastTick"],
[108,0,true,null,null,1,"AID.OQ",0,"AID.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"],
[110,0,true,null,null,1,"ABA.OQ",0,"ABA.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[15,15,true,null,null,1,"NYC-003157",0,"NYC-003157","B","AAPL.N","USD",68561,30471.555555555555,"stevchrs",1615751670595]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[22,22,true,null,null,1,"BFK.OQ",0,"BFK.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[25,25,true,null,null,1,"AKY.N",0,"AKY.N",4,4,379.46,326.19,858,"walkBidAsk"],
[27,27,true,null,null,1,"AKY.L",0,"AKY.L",4,4,379.46,326.19,858,"walkBidAsk"],
[34,34,true,null,null,1,"BGX.OQ",0,"BGX.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[36,36,true,null,null,1,"BDG.OQ",0,"BDG.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[38,38,true,null,null,1,"APO.N",0,"APO.N",327,340.09,335.09,84.77,761,"walkBidAsk"],
[42,42,true,null,null,1,"APO.L",0,"APO.L",449,453.49,468.48,78.77,889,"walkBidAsk"],
[48,48,true,null,null,1,"BCP.OQ",0,"BCP.OQ",4,4,962.28,326.19,858,"walkBidAsk"],
[49,49,true,null,null,1,"BGB.OQ",0,"BGB.OQ",4,4,962.28,326.19,858,"walkBidAsk"],
[50,50,true,null,null,1,"BBY.L",0,"BBY.L",4,4,962.28,326.19,858,"walkBidAsk"],
[51,51,true,null,null,1,"BBY.N",0,"BBY.N",4,4,586.53,326.19,858,"walkBidAsk"],
[73,73,true,null,null,1,"AGU.L",0,"AGU.L",572,577.72,602.76,203,61,"walkBidAsk"],
[76,76,true,null,null,1,"AGU.N",0,"AGU.N",572,577.72,602.76,203,61,"walkBidAsk"],
[105,0,true,null,null,1,"BET.OQ",0,"BET.OQ",45,45,707.69,326.19,694,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[15,15,true,null,null,1,"NYC-003157",0,"NYC-003157","B","AAPL.N","USD",68561,45707.333333333336,"stevchrs",1615751670595]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[5,5,true,null,null,1,"AQA.N",0,"AQA.N",96,96,956.15,761.51,845,"walkBidAsk"],
[9,9,true,null,null,1,"AQA.L",0,"AQA.L",96,96,956.15,761.51,845,"walkBidAsk"],
[11,11,true,null,null,1,"BHA.N",0,"BHA.N",96,96,956.15,761.51,845,"walkBidAsk"],
[12,12,true,null,null,1,"BHA.L",0,"BHA.L",96,96,956.15,761.51,845,"walkBidAsk"],
[24,24,true,null,null,1,"ATG.OQ",0,"ATG.OQ",353,356.53,70.38,889.78,973,"walkBidAsk"],
[32,32,true,null,null,1,"BCK.L",0,"BCK.L",669,675.69,880.5,989.8,864,"open"],
[33,33,true,null,null,1,"BCK.N",0,"BCK.N",669,675.69,880.5,989.8,864,"open"],
[35,35,true,null,null,1,"AUT.OQ",0,"AUT.OQ",353,356.53,70.38,889.78,973,"walkBidAsk"],
[64,64,true,null,null,1,"ARC.OQ",0,"ARC.OQ",481,485.81,70.38,889.78,973,"walkBidAsk"],
[88,88,true,null,null,1,"ASP.OQ",0,"ASP.OQ",481,485.81,78.38,889.78,599,"walkBidAsk"],
[91,91,true,null,null,1,"ALK.N",0,"ALK.N",792,799.92,179.3,641.3,748,"open"],
[97,0,true,null,null,1,"ARY.OQ",0,"ARY.OQ",481,485.81,78.38,889.78,599,"walkBidAsk"],
[98,0,true,null,null,1,"AYF.AS",0,"AYF.AS",901,939.78,938.78,427.23,599,"fastTick"],
[99,0,true,null,null,1,"BAI.AS",0,"BAI.AS",901,939.78,938.78,427.23,599,"fastTick"],
[103,0,true,null,null,1,"ALK.L",0,"ALK.L",792,799.92,743.34,641.3,748,"open"],
[112,0,true,null,null,1,"AYQ.N",0,"AYQ.N",112,163.03,158.03,641.3,748,"fastTick"],
[115,0,true,null,null,1,"AYQ.L",0,"AYQ.L",645,691.32,686.32,107.03,748,"fastTick"],
[118,0,true,null,null,1,"AXO.AS",0,"AXO.AS",907,935.78,932.78,429.23,696,"fastTick"],
[119,0,true,null,null,1,"BDZ.AS",0,"BDZ.AS",902,920.78,917.78,429.23,696,"fastTick"],
[122,0,true,null,null,1,"AOH.OQ",0,"AOH.OQ",897,905.78,902.78,429.23,696,"fastTick"],
[123,0,true,null,null,1,"AZS.OQ",0,"AZS.OQ",878,886.78,719.64,429.23,696,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[15,15,true,null,null,1,"NYC-003157",0,"NYC-003157","B","AAPL.N","USD",68561,60943.11111111112,"stevchrs",1615751670595]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[14,14,true,null,null,1,"NYC-003156",0,"NYC-003156","B","AAPL.N","USD",1486,247.66666666666666,"stevchrs",1615751670491],
[15,15,true,null,null,1,"NYC-003157",0,"NYC-003157","B","AAPL.N","USD",68561,68561,"stevchrs",1615751670595]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[14,14,true,null,null,1,"NYC-003156",0,"NYC-003156","B","AAPL.N","USD",1486,743,"stevchrs",1615751670491]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[14,14,true,null,null,1,"NYC-003156",0,"NYC-003156","B","AAPL.N","USD",1486,1238.3333333333333,"stevchrs",1615751670491]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[0,0,true,null,null,1,"AAPL.N",0,"AAPL.N",925,934.25,295.81,842.28,233,"open"],
[26,26,true,null,null,1,"AQR.N",0,"AQR.N",428,432.28,272.27,309.04,329,"open"],
[28,28,true,null,null,1,"AQR.L",0,"AQR.L",428,432.28,47,309.04,329,"open"],
[43,43,true,null,null,1,"BHR.N",0,"BHR.N",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[46,46,true,null,null,1,"BHR.L",0,"BHR.L",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[114,0,true,null,null,1,"AHX.N",0,"AHX.N",775,802.58,801.58,943.29,65,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[3,3,true,null,null,1,"AMW.AS",0,"AMW.AS",407,440.98,433.98,347.39,500,"fastTick"],
[10,10,true,null,null,1,"AVY.N",0,"AVY.N",723,730.23,401.73,897.85,853,"open"],
[14,14,true,null,null,1,"BFV.OQ",0,"BFV.OQ",348,351.48,385.73,897.85,853,"open"],
[15,15,true,null,null,1,"AVY.L",0,"AVY.L",348,351.48,385.73,897.85,853,"open"],
[16,16,true,null,null,1,"ANN.AS",0,"ANN.AS",407,440.98,433.98,347.39,188,"fastTick"],
[20,20,true,null,null,1,"ADP.OQ",0,"ADP.OQ",415,448.98,441.98,347.39,188,"fastTick"],
[23,23,true,null,null,1,"ACC.OQ",0,"ACC.OQ",415,448.98,441.98,347.39,188,"fastTick"],
[29,29,true,null,null,1,"ALJ.AS",0,"ALJ.AS",415,448.98,441.98,347.39,188,"fastTick"],
[31,31,true,null,null,1,"BGM.OQ",0,"BGM.OQ",56,56.48,52.48,897.85,976,"fastTick"],
[44,44,true,null,null,1,"AMA.AS",0,"AMA.AS",398,401.98,947.94,351.39,814,"walkBidAsk"],
[45,45,true,null,null,1,"AVH.L",0,"AVH.L",398,401.98,947.94,351.39,814,"walkBidAsk"],
[47,47,true,null,null,1,"AVH.N",0,"AVH.N",398,401.98,947.94,982.64,814,"walkBidAsk"],
[52,52,true,null,null,1,"ACY.OQ",0,"ACY.OQ",398,401.98,938.94,982.64,814,"walkBidAsk"],
[56,56,true,null,null,1,"APR.AS",0,"APR.AS",398,401.98,938.94,982.64,814,"walkBidAsk"],
[67,67,true,null,null,1,"AAU.OQ",0,"AAU.OQ",23,23.23,130,982.64,814,"walkBidAsk"],
[72,72,true,null,null,1,"AHB.OQ",0,"AHB.OQ",149,150.49,160,982.64,128,"walkBidAsk"],
[74,74,true,null,null,1,"AMN.L",0,"AMN.L",149,150.49,160,982.64,128,"walkBidAsk"],
[75,75,true,null,null,1,"BID.N",0,"BID.N",88,108.67,101.67,748.4,658,"fastTick"],
[77,77,true,null,null,1,"AMN.N",0,"AMN.N",149,150.49,148,982.64,126,"walkBidAsk"],
[78,78,true,null,null,1,"BID.L",0,"BID.L",88,108.67,101.67,748.4,658,"fastTick"],
[80,80,true,null,null,1,"BDR.OQ",0,"BDR.OQ",348,351.48,318.1,19.130000000000003,537,"fastTick"],
[83,83,true,null,null,1,"AOE.AS",0,"AOE.AS",149,150.49,143,982.64,131,"walkBidAsk"],
[89,89,true,null,null,1,"ABL.OQ",0,"ABL.OQ",774,781.74,143,982.64,131,"walkBidAsk"],
[90,90,true,null,null,1,"AHX.OQ",0,"AHX.OQ",774,781.74,143,982.64,131,"walkBidAsk"],
[100,0,true,null,null,1,"BEI.OQ",0,"BEI.OQ",348,351.48,318.1,19.130000000000003,418,"fastTick"],
[101,0,true,null,null,1,"BDN.L",0,"BDN.L",774,781.74,273.24,94.92,260,"walkBidAsk"],
[102,0,true,null,null,1,"ARD.N",0,"ARD.N",198,209.9,200.9,748.4,658,"fastTick"],
[104,0,true,null,null,1,"ARD.L",0,"ARD.L",198,209.9,200.9,748.4,593,"fastTick"],
[106,0,true,null,null,1,"BDN.N",0,"BDN.N",774,781.74,273.24,94.92,260,"walkBidAsk"],
[113,0,true,null,null,1,"AHB.AS",0,"AHB.AS",687,693.87,266.24,94.92,255,"open"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[13,13,true,null,null,1,"NYC-003155",0,"NYC-003155","B","AAPL.N","USD",41034,5862,"stevchrs",1615751670391],
[14,14,true,null,null,1,"NYC-003156",0,"NYC-003156","B","AAPL.N","USD",1486,1486,"stevchrs",1615751670491]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[13,13,true,null,null,1,"NYC-003155",0,"NYC-003155","B","AAPL.N","USD",41034,17586,"stevchrs",1615751670391]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[53,53,true,null,null,1,"AEO.L",0,"AEO.L",766,813.49,804.49,290.82,698,"fastTick"],
[54,54,true,null,null,1,"AEO.N",0,"AEO.N",771,818.49,809.49,290.82,698,"fastTick"],
[58,58,true,null,null,1,"BIU.L",0,"BIU.L",771,818.49,809.49,290.82,698,"fastTick"],
[60,60,true,null,null,1,"BIU.N",0,"BIU.N",771,818.49,809.49,290.82,698,"fastTick"],
[65,65,true,null,null,1,"ARU.L",0,"ARU.L",777,824.49,815.49,290.82,695,"fastTick"],
[68,68,true,null,null,1,"ARU.N",0,"ARU.N",775,812.49,812.49,290.82,695,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[1,1,true,null,null,1,"VOD.L",0,"VOD.L",497,501.97,294.86,603.96,933,"fastTick"],
[2,2,true,null,null,1,"ATR.OQ",0,"ATR.OQ",731,738.31,720.06,85.82,113,"fastTick"],
[18,18,true,null,null,1,"AFA.N",0,"AFA.N",356,359.56,845.3,85.82,245,"fastTick"],
[21,21,true,null,null,1,"AFA.L",0,"AFA.L",356,359.56,838.3,85.82,245,"fastTick"],
[41,41,true,null,null,1,"AUI.OQ",0,"AUI.OQ",855,883.3,875.3,85.82,123,"fastTick"],
[55,55,true,null,null,1,"AQW.OQ",0,"AQW.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[62,62,true,null,null,1,"BAT.AS",0,"BAT.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[63,63,true,null,null,1,"BBK.AS",0,"BBK.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[69,69,true,null,null,1,"ARN.OQ",0,"ARN.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[79,79,true,null,null,1,"ASE.OQ",0,"ASE.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[81,81,true,null,null,1,"AWK.N",0,"AWK.N",930,949.12,943.12,443.33,254,"fastTick"],
[84,84,true,null,null,1,"AWK.L",0,"AWK.L",929,938.12,937.12,443.33,254,"fastTick"],
[87,87,true,null,null,1,"AYQ.AS",0,"AYQ.AS",91,91,968.52,841.3,123,"walkBidAsk"],
[94,0,true,null,null,1,"BJG.L",0,"BJG.L",91,91,968.52,841.3,264,"walkBidAsk"],
[95,0,true,null,null,1,"BJG.N",0,"BJG.N",857,885.3,877.3,218.1,264,"fastTick"],
[107,0,true,null,null,1,"AAK.N",0,"AAK.N",923,942.12,941.12,446.33,875,"fastTick"],
[109,0,true,null,null,1,"AAK.L",0,"AAK.L",923,942.12,941.12,446.33,875,"fastTick"],
[111,0,true,null,null,1,"AZH.OQ",0,"AZH.OQ",852,880.3,880.3,218.1,251,"fastTick"],
[116,0,true,null,null,1,"BEQ.N",0,"BEQ.N",923,942.12,941.12,446.33,875,"fastTick"],
[117,0,true,null,null,1,"BEQ.L",0,"BEQ.L",923,942.12,941.12,446.33,881,"fastTick"],
[120,0,true,null,null,1,"AXZ.AS",0,"AXZ.AS",858,886.3,886.3,218.1,251,"fastTick"],
[121,0,true,null,null,1,"BEF.AS",0,"BEF.AS",858,886.3,886.3,218.1,251,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[13,13,true,null,null,1,"NYC-003155",0,"NYC-003155","B","AAPL.N","USD",41034,29310,"stevchrs",1615751670391]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[39,39,true,null,null,1,"AJV.N",0,"AJV.N",448,462.1,459.1,1009.97,55,"fastTick"],
[40,40,true,null,null,1,"AJV.L",0,"AJV.L",448,462.1,459.1,1009.97,55,"fastTick"],
[93,0,true,null,null,1,"AFR.N",0,"AFR.N",476,500.49,495.49,1002.93,152,"fastTick"],
[96,0,true,null,null,1,"AFR.L",0,"AFR.L",482,506.49,501.49,1002.93,152,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[13,13,true,null,null,1,"NYC-003155",0,"NYC-003155","B","AAPL.N","USD",41034,41034,"stevchrs",1615751670391]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[4,4,true,null,null,1,"ADE.OQ",0,"ADE.OQ",942,951.42,579.49,790.81,72,"open"],
[6,6,true,null,null,1,"AKH.N",0,"AKH.N",942,951.42,579.49,790.81,72,"open"],
[7,7,true,null,null,1,"AKH.L",0,"AKH.L",942,951.42,579.49,413.07,72,"open"],
[8,8,true,null,null,1,"AML.AS",0,"AML.AS",942,951.42,579.49,413.07,72,"open"],
[13,13,true,null,null,1,"ACN.OQ",0,"ACN.OQ",942,951.42,579.49,413.07,72,"open"],
[17,17,true,null,null,1,"BBH.L",0,"BBH.L",942,951.42,579.49,413.07,72,"open"],
[19,19,true,null,null,1,"BBH.N",0,"BBH.N",942,951.42,579.49,413.07,72,"open"],
[22,22,true,null,null,1,"BFK.OQ",0,"BFK.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[25,25,true,null,null,1,"AKY.N",0,"AKY.N",4,4,379.46,326.19,858,"walkBidAsk"],
[27,27,true,null,null,1,"AKY.L",0,"AKY.L",4,4,379.46,326.19,858,"walkBidAsk"],
[30,30,true,null,null,1,"ANC.AS",0,"ANC.AS",933,942.33,579.49,413.07,567,"open"],
[34,34,true,null,null,1,"BGX.OQ",0,"BGX.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[37,37,true,null,null,1,"ALU.AS",0,"ALU.AS",558,563.58,733.23,413.07,698,"open"],
[57,57,true,null,null,1,"AAJ.OQ",0,"AAJ.OQ",558,563.58,807.79,413.07,307,"open"],
[59,59,true,null,null,1,"AGD.L",0,"AGD.L",900,918.81,917.81,550.43,731,"fastTick"],
[61,61,true,null,null,1,"AGD.N",0,"AGD.N",900,918.81,917.81,550.43,937,"fastTick"],
[66,66,true,null,null,1,"APG.AS",0,"APG.AS",558,563.58,807.79,417.07,307,"open"],
[70,70,true,null,null,1,"AXN.L",0,"AXN.L",229,231.2,227.2,417.07,307,"fastTick"],
[71,71,true,null,null,1,"AXN.N",0,"AXN.N",229,231.2,227.2,417.07,307,"fastTick"],
[82,82,true,null,null,1,"ANY.AS",0,"ANY.AS",235,237.2,233.2,546.35,709,"fastTick"],
[85,85,true,null,null,1,"AHM.OQ",0,"AHM.OQ",235,237.2,233.2,546.35,705,"fastTick"],
[86,86,true,null,null,1,"ABW.OQ",0,"ABW.OQ",235,237.2,233.2,546.35,709,"fastTick"],
[92,92,true,null,null,1,"AOP.AS",0,"AOP.AS",235,237.2,233.2,546.35,700,"fastTick"],
[108,0,true,null,null,1,"AID.OQ",0,"AID.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"],
[110,0,true,null,null,1,"ABA.OQ",0,"ABA.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[11,11,true,null,null,1,"NYC-003153",0,"NYC-003153","B","AAPL.N","USD",20527,3421.1666666666665,"stevchrs",1615751670189],
[12,12,true,null,null,1,"NYC-003154",0,"NYC-003154","B","AAPL.N","USD",20182,20182,"stevchrs",1615751670290]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[32,32,true,null,null,1,"BCK.L",0,"BCK.L",392,395.92,880.5,989.8,864,"open"],
[33,33,true,null,null,1,"BCK.N",0,"BCK.N",392,395.92,880.5,989.8,864,"open"],
[36,36,true,null,null,1,"BDG.OQ",0,"BDG.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[38,38,true,null,null,1,"APO.N",0,"APO.N",327,340.09,335.09,84.77,761,"walkBidAsk"],
[42,42,true,null,null,1,"APO.L",0,"APO.L",449,453.49,468.48,78.77,889,"walkBidAsk"],
[48,48,true,null,null,1,"BCP.OQ",0,"BCP.OQ",4,4,962.28,326.19,858,"walkBidAsk"],
[49,49,true,null,null,1,"BGB.OQ",0,"BGB.OQ",4,4,962.28,326.19,858,"walkBidAsk"],
[50,50,true,null,null,1,"BBY.L",0,"BBY.L",4,4,962.28,326.19,858,"walkBidAsk"],
[51,51,true,null,null,1,"BBY.N",0,"BBY.N",4,4,586.53,326.19,858,"walkBidAsk"],
[73,73,true,null,null,1,"AGU.L",0,"AGU.L",572,577.72,602.76,203,61,"walkBidAsk"],
[76,76,true,null,null,1,"AGU.N",0,"AGU.N",572,577.72,602.76,203,61,"walkBidAsk"],
[91,91,true,null,null,1,"ALK.N",0,"ALK.N",502,507.02,179.3,641.3,748,"open"],
[103,0,true,null,null,1,"ALK.L",0,"ALK.L",502,507.02,743.34,641.3,748,"open"],
[105,0,true,null,null,1,"BET.OQ",0,"BET.OQ",45,45,707.69,326.19,694,"walkBidAsk"],
[112,0,true,null,null,1,"AYQ.N",0,"AYQ.N",114,165.03,164.03,641.3,748,"fastTick"],
[115,0,true,null,null,1,"AYQ.L",0,"AYQ.L",653,699.32,695.32,107.03,748,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[11,11,true,null,null,1,"NYC-003153",0,"NYC-003153","B","AAPL.N","USD",20527,10263.5,"stevchrs",1615751670189]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[11,11,true,null,null,1,"NYC-003153",0,"NYC-003153","B","AAPL.N","USD",20527,17105.833333333332,"stevchrs",1615751670189]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[5,5,true,null,null,1,"AQA.N",0,"AQA.N",96,96,956.15,761.51,845,"walkBidAsk"],
[9,9,true,null,null,1,"AQA.L",0,"AQA.L",96,96,956.15,761.51,845,"walkBidAsk"],
[11,11,true,null,null,1,"BHA.N",0,"BHA.N",96,96,956.15,761.51,845,"walkBidAsk"],
[12,12,true,null,null,1,"BHA.L",0,"BHA.L",96,96,956.15,761.51,845,"walkBidAsk"],
[24,24,true,null,null,1,"ATG.OQ",0,"ATG.OQ",172,173.72,70.38,889.78,973,"walkBidAsk"],
[35,35,true,null,null,1,"AUT.OQ",0,"AUT.OQ",172,173.72,70.38,889.78,973,"walkBidAsk"],
[64,64,true,null,null,1,"ARC.OQ",0,"ARC.OQ",172,173.72,70.38,889.78,973,"walkBidAsk"],
[88,88,true,null,null,1,"ASP.OQ",0,"ASP.OQ",172,173.72,78.38,889.78,599,"walkBidAsk"],
[97,0,true,null,null,1,"ARY.OQ",0,"ARY.OQ",172,173.72,78.38,889.78,599,"walkBidAsk"],
[98,0,true,null,null,1,"AYF.AS",0,"AYF.AS",901,939.78,938.78,427.23,599,"fastTick"],
[99,0,true,null,null,1,"BAI.AS",0,"BAI.AS",901,939.78,938.78,427.23,599,"fastTick"],
[118,0,true,null,null,1,"AXO.AS",0,"AXO.AS",907,935.78,932.78,429.23,696,"fastTick"],
[119,0,true,null,null,1,"BDZ.AS",0,"BDZ.AS",902,920.78,917.78,429.23,696,"fastTick"],
[122,0,true,null,null,1,"AOH.OQ",0,"AOH.OQ",897,905.78,902.78,429.23,696,"fastTick"],
[123,0,true,null,null,1,"AZS.OQ",0,"AZS.OQ",878,886.78,719.64,429.23,696,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[11,11,true,null,null,1,"NYC-003153",0,"NYC-003153","B","AAPL.N","USD",20527,20527,"stevchrs",1615751670189]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[26,26,true,null,null,1,"AQR.N",0,"AQR.N",428,432.28,272.27,309.04,329,"walkBidAsk"],
[28,28,true,null,null,1,"AQR.L",0,"AQR.L",428,432.28,47,309.04,329,"walkBidAsk"],
[43,43,true,null,null,1,"BHR.N",0,"BHR.N",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[46,46,true,null,null,1,"BHR.L",0,"BHR.L",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[114,0,true,null,null,1,"AHX.N",0,"AHX.N",783,820.58,811.58,943.29,65,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[0,0,true,null,null,1,"AAPL.N",0,"AAPL.N",925,934.25,295.81,842.28,233,"open"],
[3,3,true,null,null,1,"AMW.AS",0,"AMW.AS",416,449.98,444.98,347.39,500,"fastTick"],
[16,16,true,null,null,1,"ANN.AS",0,"ANN.AS",416,449.98,444.98,347.39,188,"fastTick"],
[20,20,true,null,null,1,"ADP.OQ",0,"ADP.OQ",424,457.98,452.98,347.39,188,"fastTick"],
[23,23,true,null,null,1,"ACC.OQ",0,"ACC.OQ",420,463.98,455.98,347.39,188,"fastTick"],
[29,29,true,null,null,1,"ALJ.AS",0,"ALJ.AS",420,463.98,455.98,347.39,188,"fastTick"],
[44,44,true,null,null,1,"AMA.AS",0,"AMA.AS",398,401.98,947.94,351.39,814,"walkBidAsk"],
[45,45,true,null,null,1,"AVH.L",0,"AVH.L",398,401.98,947.94,351.39,814,"walkBidAsk"],
[47,47,true,null,null,1,"AVH.N",0,"AVH.N",398,401.98,947.94,982.64,814,"walkBidAsk"],
[52,52,true,null,null,1,"ACY.OQ",0,"ACY.OQ",398,401.98,938.94,982.64,814,"walkBidAsk"],
[56,56,true,null,null,1,"APR.AS",0,"APR.AS",398,401.98,938.94,982.64,814,"walkBidAsk"],
[67,67,true,null,null,1,"AAU.OQ",0,"AAU.OQ",23,23.23,130,982.64,814,"walkBidAsk"],
[72,72,true,null,null,1,"AHB.OQ",0,"AHB.OQ",149,150.49,160,982.64,128,"walkBidAsk"],
[74,74,true,null,null,1,"AMN.L",0,"AMN.L",149,150.49,160,982.64,128,"walkBidAsk"],
[75,75,true,null,null,1,"BID.N",0,"BID.N",88,108.67,101.67,748.4,658,"walkBidAsk"],
[77,77,true,null,null,1,"AMN.N",0,"AMN.N",149,150.49,148,982.64,126,"walkBidAsk"],
[78,78,true,null,null,1,"BID.L",0,"BID.L",88,108.67,101.67,748.4,658,"walkBidAsk"],
[83,83,true,null,null,1,"AOE.AS",0,"AOE.AS",149,150.49,143,982.64,131,"walkBidAsk"],
[89,89,true,null,null,1,"ABL.OQ",0,"ABL.OQ",774,781.74,143,982.64,131,"walkBidAsk"],
[90,90,true,null,null,1,"AHX.OQ",0,"AHX.OQ",774,781.74,143,982.64,131,"walkBidAsk"],
[101,0,true,null,null,1,"BDN.L",0,"BDN.L",774,781.74,273.24,94.92,260,"walkBidAsk"],
[102,0,true,null,null,1,"ARD.N",0,"ARD.N",198,209.9,200.9,748.4,658,"walkBidAsk"],
[104,0,true,null,null,1,"ARD.L",0,"ARD.L",198,209.9,200.9,748.4,593,"walkBidAsk"],
[106,0,true,null,null,1,"BDN.N",0,"BDN.N",774,781.74,273.24,94.92,260,"walkBidAsk"],
[113,0,true,null,null,1,"AHB.AS",0,"AHB.AS",238,240.38,266.24,94.92,255,"open"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[9,9,true,null,null,1,"NYC-003151",0,"NYC-003151","B","AAPL.N","USD",63090,15772.5,"stevchrs",1615751669921],
[10,10,true,null,null,1,"NYC-003152",0,"NYC-003152","B","AAPL.N","USD",5945,5945,"stevchrs",1615751670021]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[9,9,true,null,null,1,"NYC-003151",0,"NYC-003151","B","AAPL.N","USD",63090,47317.5,"stevchrs",1615751669921]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[10,10,true,null,null,1,"AVY.N",0,"AVY.N",406,410.06,401.73,897.85,853,"open"],
[14,14,true,null,null,1,"BFV.OQ",0,"BFV.OQ",406,410.06,385.73,897.85,853,"open"],
[15,15,true,null,null,1,"AVY.L",0,"AVY.L",406,410.06,385.73,897.85,853,"open"],
[31,31,true,null,null,1,"BGM.OQ",0,"BGM.OQ",62,62.48,59.48,897.85,976,"fastTick"],
[53,53,true,null,null,1,"AEO.L",0,"AEO.L",766,813.49,804.49,290.82,698,"fastTick"],
[54,54,true,null,null,1,"AEO.N",0,"AEO.N",771,818.49,809.49,290.82,698,"fastTick"],
[58,58,true,null,null,1,"BIU.L",0,"BIU.L",771,818.49,809.49,290.82,698,"fastTick"],
[60,60,true,null,null,1,"BIU.N",0,"BIU.N",771,818.49,809.49,290.82,698,"fastTick"],
[65,65,true,null,null,1,"ARU.L",0,"ARU.L",777,824.49,815.49,290.82,695,"fastTick"],
[68,68,true,null,null,1,"ARU.N",0,"ARU.N",775,812.49,812.49,290.82,695,"fastTick"],
[80,80,true,null,null,1,"BDR.OQ",0,"BDR.OQ",31,31.31,318.1,19.130000000000003,537,"fastTick"],
[100,0,true,null,null,1,"BEI.OQ",0,"BEI.OQ",31,31.31,318.1,19.130000000000003,418,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[8,8,true,null,null,1,"NYC-003150",0,"NYC-003150","B","AAPL.N","USD",59400,29700,"stevchrs",1615751669821],
[9,9,true,null,null,1,"NYC-003151",0,"NYC-003151","B","AAPL.N","USD",63090,63090,"stevchrs",1615751669921]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[2,2,true,null,null,1,"ATR.OQ",0,"ATR.OQ",472,476.72,720.06,85.82,113,"fastTick"],
[18,18,true,null,null,1,"AFA.N",0,"AFA.N",472,476.72,845.3,85.82,245,"fastTick"],
[21,21,true,null,null,1,"AFA.L",0,"AFA.L",472,476.72,838.3,85.82,245,"fastTick"],
[41,41,true,null,null,1,"AUI.OQ",0,"AUI.OQ",855,883.3,875.3,85.82,123,"fastTick"],
[55,55,true,null,null,1,"AQW.OQ",0,"AQW.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[62,62,true,null,null,1,"BAT.AS",0,"BAT.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[63,63,true,null,null,1,"BBK.AS",0,"BBK.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[69,69,true,null,null,1,"ARN.OQ",0,"ARN.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[79,79,true,null,null,1,"ASE.OQ",0,"ASE.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[81,81,true,null,null,1,"AWK.N",0,"AWK.N",930,949.12,943.12,443.33,254,"fastTick"],
[84,84,true,null,null,1,"AWK.L",0,"AWK.L",931,950.12,944.12,443.33,254,"fastTick"],
[87,87,true,null,null,1,"AYQ.AS",0,"AYQ.AS",91,91,968.52,841.3,123,"walkBidAsk"],
[94,0,true,null,null,1,"BJG.L",0,"BJG.L",91,91,968.52,841.3,264,"walkBidAsk"],
[95,0,true,null,null,1,"BJG.N",0,"BJG.N",857,885.3,877.3,218.1,264,"fastTick"],
[107,0,true,null,null,1,"AAK.N",0,"AAK.N",925,954.12,948.12,446.33,875,"fastTick"],
[109,0,true,null,null,1,"AAK.L",0,"AAK.L",925,954.12,948.12,446.33,875,"fastTick"],
[111,0,true,null,null,1,"AZH.OQ",0,"AZH.OQ",852,880.3,880.3,218.1,251,"fastTick"],
[116,0,true,null,null,1,"BEQ.N",0,"BEQ.N",925,954.12,948.12,446.33,875,"fastTick"],
[117,0,true,null,null,1,"BEQ.L",0,"BEQ.L",923,942.12,941.12,446.33,881,"fastTick"],
[120,0,true,null,null,1,"AXZ.AS",0,"AXZ.AS",858,886.3,886.3,218.1,251,"fastTick"],
[121,0,true,null,null,1,"BEF.AS",0,"BEF.AS",858,886.3,886.3,218.1,251,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[1,1,true,null,null,1,"VOD.L",0,"VOD.L",868,876.68,294.86,603.96,933,"fastTick"],
[39,39,true,null,null,1,"AJV.N",0,"AJV.N",448,462.1,459.1,1009.97,55,"fastTick"],
[40,40,true,null,null,1,"AJV.L",0,"AJV.L",448,462.1,459.1,1009.97,55,"fastTick"],
[93,0,true,null,null,1,"AFR.N",0,"AFR.N",481,515.49,507.49,1002.93,152,"fastTick"],
[96,0,true,null,null,1,"AFR.L",0,"AFR.L",487,521.49,513.49,1002.93,152,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[8,8,true,null,null,1,"NYC-003150",0,"NYC-003150","B","AAPL.N","USD",59400,44550,"stevchrs",1615751669821]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[8,8,true,null,null,1,"NYC-003150",0,"NYC-003150","B","AAPL.N","USD",59400,59400,"stevchrs",1615751669821],
[27,27,true,null,null,1,"LDN-003169",0,"LDN-003169","B","VOD.L","GBp",31124,31124,"stevchrs",1615751671806]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[4,4,true,null,null,1,"ADE.OQ",0,"ADE.OQ",942,951.42,579.49,790.81,72,"open"],
[6,6,true,null,null,1,"AKH.N",0,"AKH.N",942,951.42,579.49,790.81,72,"open"],
[7,7,true,null,null,1,"AKH.L",0,"AKH.L",942,951.42,579.49,413.07,72,"open"],
[8,8,true,null,null,1,"AML.AS",0,"AML.AS",942,951.42,579.49,413.07,72,"open"],
[13,13,true,null,null,1,"ACN.OQ",0,"ACN.OQ",942,951.42,579.49,413.07,72,"open"],
[17,17,true,null,null,1,"BBH.L",0,"BBH.L",942,951.42,579.49,413.07,72,"open"],
[19,19,true,null,null,1,"BBH.N",0,"BBH.N",942,951.42,579.49,413.07,72,"open"],
[30,30,true,null,null,1,"ANC.AS",0,"ANC.AS",933,942.33,579.49,413.07,567,"walkBidAsk"],
[37,37,true,null,null,1,"ALU.AS",0,"ALU.AS",558,563.58,733.23,413.07,698,"walkBidAsk"],
[57,57,true,null,null,1,"AAJ.OQ",0,"AAJ.OQ",558,563.58,807.79,413.07,307,"walkBidAsk"],
[59,59,true,null,null,1,"AGD.L",0,"AGD.L",909,937.81,927.81,550.43,731,"fastTick"],
[61,61,true,null,null,1,"AGD.N",0,"AGD.N",909,937.81,927.81,550.43,937,"fastTick"],
[66,66,true,null,null,1,"APG.AS",0,"APG.AS",361,364.61,807.79,417.07,307,"open"],
[70,70,true,null,null,1,"AXN.L",0,"AXN.L",230,232.2,231.2,417.07,307,"fastTick"],
[71,71,true,null,null,1,"AXN.N",0,"AXN.N",230,232.2,231.2,417.07,307,"fastTick"],
[82,82,true,null,null,1,"ANY.AS",0,"ANY.AS",236,238.2,237.2,546.35,709,"fastTick"],
[85,85,true,null,null,1,"AHM.OQ",0,"AHM.OQ",236,238.2,237.2,546.35,705,"fastTick"],
[86,86,true,null,null,1,"ABW.OQ",0,"ABW.OQ",236,238.2,237.2,546.35,709,"fastTick"],
[92,92,true,null,null,1,"AOP.AS",0,"AOP.AS",236,238.2,237.2,546.35,700,"fastTick"],
[108,0,true,null,null,1,"AID.OQ",0,"AID.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"],
[110,0,true,null,null,1,"ABA.OQ",0,"ABA.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[7,7,true,null,null,1,"NYC-003149",0,"NYC-003149","B","AAPL.N","USD",8476,2119,"stevchrs",1615751669695]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[22,22,true,null,null,1,"BFK.OQ",0,"BFK.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[25,25,true,null,null,1,"AKY.N",0,"AKY.N",4,4,379.46,326.19,858,"walkBidAsk"],
[27,27,true,null,null,1,"AKY.L",0,"AKY.L",4,4,379.46,326.19,858,"walkBidAsk"],
[34,34,true,null,null,1,"BGX.OQ",0,"BGX.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[36,36,true,null,null,1,"BDG.OQ",0,"BDG.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[48,48,true,null,null,1,"BCP.OQ",0,"BCP.OQ",634,640.34,962.28,326.19,858,"walkBidAsk"],
[49,49,true,null,null,1,"BGB.OQ",0,"BGB.OQ",634,640.34,962.28,326.19,858,"walkBidAsk"],
[50,50,true,null,null,1,"BBY.L",0,"BBY.L",634,640.34,962.28,326.19,858,"walkBidAsk"],
[51,51,true,null,null,1,"BBY.N",0,"BBY.N",634,640.34,586.53,326.19,858,"walkBidAsk"],
[105,0,true,null,null,1,"BET.OQ",0,"BET.OQ",47,47,46,326.19,694,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[32,32,true,null,null,1,"BCK.L",0,"BCK.L",947,956.47,880.5,989.8,864,"open"],
[33,33,true,null,null,1,"BCK.N",0,"BCK.N",947,956.47,880.5,989.8,864,"open"],
[38,38,true,null,null,1,"APO.N",0,"APO.N",327,340.09,335.09,84.77,761,"walkBidAsk"],
[42,42,true,null,null,1,"APO.L",0,"APO.L",449,453.49,468.48,78.77,889,"walkBidAsk"],
[73,73,true,null,null,1,"AGU.L",0,"AGU.L",572,577.72,602.76,203,61,"walkBidAsk"],
[76,76,true,null,null,1,"AGU.N",0,"AGU.N",572,577.72,602.76,203,61,"walkBidAsk"],
[91,91,true,null,null,1,"ALK.N",0,"ALK.N",573,578.73,179.3,641.3,748,"open"],
[103,0,true,null,null,1,"ALK.L",0,"ALK.L",573,578.73,743.34,641.3,748,"open"],
[112,0,true,null,null,1,"AYQ.N",0,"AYQ.N",117,178.03,171.03,641.3,748,"fastTick"],
[115,0,true,null,null,1,"AYQ.L",0,"AYQ.L",656,712.32,705.32,107.03,748,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[7,7,true,null,null,1,"NYC-003149",0,"NYC-003149","B","AAPL.N","USD",8476,4238,"stevchrs",1615751669695]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[7,7,true,null,null,1,"NYC-003149",0,"NYC-003149","B","AAPL.N","USD",8476,6357,"stevchrs",1615751669695]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[5,5,true,null,null,1,"AQA.N",0,"AQA.N",960,969.6,956.15,761.51,845,"walkBidAsk"],
[9,9,true,null,null,1,"AQA.L",0,"AQA.L",96,96,96,761.51,845,"fastTick"],
[11,11,true,null,null,1,"BHA.N",0,"BHA.N",96,96,96,761.51,845,"fastTick"],
[12,12,true,null,null,1,"BHA.L",0,"BHA.L",96,96,96,761.51,845,"fastTick"],
[24,24,true,null,null,1,"ATG.OQ",0,"ATG.OQ",960,969.6,70.38,889.78,973,"walkBidAsk"],
[35,35,true,null,null,1,"AUT.OQ",0,"AUT.OQ",960,969.6,70.38,889.78,973,"walkBidAsk"],
[64,64,true,null,null,1,"ARC.OQ",0,"ARC.OQ",586,591.86,70.38,889.78,973,"walkBidAsk"],
[88,88,true,null,null,1,"ASP.OQ",0,"ASP.OQ",586,591.86,78.38,889.78,599,"walkBidAsk"],
[97,0,true,null,null,1,"ARY.OQ",0,"ARY.OQ",586,591.86,78.38,889.78,599,"walkBidAsk"],
[98,0,true,null,null,1,"AYF.AS",0,"AYF.AS",907,945.78,942.78,427.23,599,"fastTick"],
[99,0,true,null,null,1,"BAI.AS",0,"BAI.AS",907,945.78,942.78,427.23,599,"fastTick"],
[118,0,true,null,null,1,"AXO.AS",0,"AXO.AS",907,935.78,932.78,429.23,696,"walkBidAsk"],
[119,0,true,null,null,1,"BDZ.AS",0,"BDZ.AS",902,920.78,917.78,429.23,696,"walkBidAsk"],
[122,0,true,null,null,1,"AOH.OQ",0,"AOH.OQ",897,905.78,902.78,429.23,696,"walkBidAsk"],
[123,0,true,null,null,1,"AZS.OQ",0,"AZS.OQ",878,886.78,719.64,429.23,696,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[7,7,true,null,null,1,"NYC-003149",0,"NYC-003149","B","AAPL.N","USD",8476,8476,"stevchrs",1615751669695]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[5,5,true,null,null,1,"NYC-003147",0,"NYC-003147","B","AAPL.N","USD",67684,33842,"stevchrs",1615751669492],
[6,6,true,null,null,1,"NYC-003148",0,"NYC-003148","B","AAPL.N","USD",29842,29842,"stevchrs",1615751669595]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[4,4,true,null,null,1,"NYC-003146",0,"NYC-003146","B","AAPL.N","USD",57676,8239.42857142857,"stevchrs",1615751669391],
[5,5,true,null,null,1,"NYC-003147",0,"NYC-003147","B","AAPL.N","USD",67684,67684,"stevchrs",1615751669492]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[4,4,true,null,null,1,"NYC-003146",0,"NYC-003146","B","AAPL.N","USD",57676,24718.28571428571,"stevchrs",1615751669391]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[26,26,true,null,null,1,"AQR.N",0,"AQR.N",428,432.28,272.27,309.04,329,"walkBidAsk"],
[28,28,true,null,null,1,"AQR.L",0,"AQR.L",428,432.28,47,309.04,329,"walkBidAsk"],
[43,43,true,null,null,1,"BHR.N",0,"BHR.N",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[46,46,true,null,null,1,"BHR.L",0,"BHR.L",631,637.31,1018.78,312.04,955,"walkBidAsk"],
[114,0,true,null,null,1,"AHX.N",0,"AHX.N",783,820.58,811.58,943.29,65,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[0,0,true,null,null,1,"AAPL.N",0,"AAPL.N",925,934.25,295.81,842.28,233,"walkBidAsk"],
[3,3,true,null,null,1,"AMW.AS",0,"AMW.AS",423,466.98,457.98,347.39,500,"fastTick"],
[16,16,true,null,null,1,"ANN.AS",0,"ANN.AS",419,452.98,450.98,347.39,188,"fastTick"],
[20,20,true,null,null,1,"ADP.OQ",0,"ADP.OQ",427,460.98,458.98,347.39,188,"fastTick"],
[23,23,true,null,null,1,"ACC.OQ",0,"ACC.OQ",423,466.98,464.98,347.39,188,"fastTick"],
[29,29,true,null,null,1,"ALJ.AS",0,"ALJ.AS",423,466.98,464.98,347.39,188,"fastTick"],
[44,44,true,null,null,1,"AMA.AS",0,"AMA.AS",398,401.98,947.94,351.39,814,"walkBidAsk"],
[45,45,true,null,null,1,"AVH.L",0,"AVH.L",398,401.98,947.94,351.39,814,"walkBidAsk"],
[47,47,true,null,null,1,"AVH.N",0,"AVH.N",398,401.98,947.94,982.64,814,"walkBidAsk"],
[52,52,true,null,null,1,"ACY.OQ",0,"ACY.OQ",398,401.98,938.94,982.64,814,"walkBidAsk"],
[56,56,true,null,null,1,"APR.AS",0,"APR.AS",398,401.98,938.94,982.64,814,"walkBidAsk"],
[67,67,true,null,null,1,"AAU.OQ",0,"AAU.OQ",23,23.23,130,982.64,814,"walkBidAsk"],
[72,72,true,null,null,1,"AHB.OQ",0,"AHB.OQ",149,150.49,160,982.64,128,"walkBidAsk"],
[74,74,true,null,null,1,"AMN.L",0,"AMN.L",149,150.49,160,982.64,128,"walkBidAsk"],
[77,77,true,null,null,1,"AMN.N",0,"AMN.N",149,150.49,148,982.64,126,"walkBidAsk"],
[83,83,true,null,null,1,"AOE.AS",0,"AOE.AS",149,150.49,143,982.64,131,"walkBidAsk"],
[89,89,true,null,null,1,"ABL.OQ",0,"ABL.OQ",774,781.74,143,982.64,131,"walkBidAsk"],
[90,90,true,null,null,1,"AHX.OQ",0,"AHX.OQ",774,781.74,143,982.64,131,"walkBidAsk"],
[101,0,true,null,null,1,"BDN.L",0,"BDN.L",774,781.74,273.24,94.92,260,"walkBidAsk"],
[106,0,true,null,null,1,"BDN.N",0,"BDN.N",774,781.74,273.24,94.92,260,"walkBidAsk"],
[113,0,true,null,null,1,"AHB.AS",0,"AHB.AS",510,515.1,266.24,94.92,255,"open"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[4,4,true,null,null,1,"NYC-003146",0,"NYC-003146","B","AAPL.N","USD",57676,41197.142857142855,"stevchrs",1615751669391]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[10,10,true,null,null,1,"AVY.N",0,"AVY.N",696,702.96,401.73,897.85,853,"open"],
[14,14,true,null,null,1,"BFV.OQ",0,"BFV.OQ",696,702.96,385.73,897.85,853,"open"],
[15,15,true,null,null,1,"AVY.L",0,"AVY.L",696,702.96,385.73,897.85,853,"open"],
[31,31,true,null,null,1,"BGM.OQ",0,"BGM.OQ",68,78.47999999999999,70.47999999999999,897.85,976,"fastTick"],
[75,75,true,null,null,1,"BID.N",0,"BID.N",88,108.67,101.67,748.4,658,"walkBidAsk"],
[78,78,true,null,null,1,"BID.L",0,"BID.L",88,108.67,101.67,748.4,658,"walkBidAsk"],
[80,80,true,null,null,1,"BDR.OQ",0,"BDR.OQ",321,324.21,318.1,19.130000000000003,537,"fastTick"],
[100,0,true,null,null,1,"BEI.OQ",0,"BEI.OQ",321,324.21,318.1,19.130000000000003,418,"fastTick"],
[102,0,true,null,null,1,"ARD.N",0,"ARD.N",198,209.9,200.9,748.4,658,"walkBidAsk"],
[104,0,true,null,null,1,"ARD.L",0,"ARD.L",198,209.9,200.9,748.4,593,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[4,4,true,null,null,1,"NYC-003146",0,"NYC-003146","B","AAPL.N","USD",57676,57676,"stevchrs",1615751669391]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[53,53,true,null,null,1,"AEO.L",0,"AEO.L",766,813.49,804.49,290.82,698,"walkBidAsk"],
[54,54,true,null,null,1,"AEO.N",0,"AEO.N",771,818.49,809.49,290.82,698,"walkBidAsk"],
[58,58,true,null,null,1,"BIU.L",0,"BIU.L",771,818.49,809.49,290.82,698,"walkBidAsk"],
[60,60,true,null,null,1,"BIU.N",0,"BIU.N",771,818.49,809.49,290.82,698,"walkBidAsk"],
[65,65,true,null,null,1,"ARU.L",0,"ARU.L",777,824.49,815.49,290.82,695,"walkBidAsk"],
[68,68,true,null,null,1,"ARU.N",0,"ARU.N",775,812.49,812.49,290.82,695,"walkBidAsk"],
[81,81,true,null,null,1,"AWK.N",0,"AWK.N",39,39.39,943.12,443.33,254,"fastTick"],
[84,84,true,null,null,1,"AWK.L",0,"AWK.L",940,969.12,959.12,443.33,254,"fastTick"],
[107,0,true,null,null,1,"AAK.N",0,"AAK.N",934,973.12,963.12,446.33,875,"fastTick"],
[109,0,true,null,null,1,"AAK.L",0,"AAK.L",934,973.12,963.12,446.33,875,"fastTick"],
[116,0,true,null,null,1,"BEQ.N",0,"BEQ.N",934,973.12,963.12,446.33,875,"fastTick"],
[117,0,true,null,null,1,"BEQ.L",0,"BEQ.L",39,39.39,941.12,446.33,881,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[3,3,true,null,null,1,"NYC-003145",0,"NYC-003145","B","AAPL.N","USD",59292,19764,"stevchrs",1615751669291]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[1,1,true,null,null,1,"VOD.L",0,"VOD.L",197,198.97,294.86,603.96,933,"fastTick"],
[2,2,true,null,null,1,"ATR.OQ",0,"ATR.OQ",472,476.72,720.06,85.82,113,"fastTick"],
[18,18,true,null,null,1,"AFA.N",0,"AFA.N",472,476.72,845.3,85.82,245,"fastTick"],
[21,21,true,null,null,1,"AFA.L",0,"AFA.L",472,476.72,838.3,85.82,245,"fastTick"],
[39,39,true,null,null,1,"AJV.N",0,"AJV.N",448,462.1,459.1,1009.97,55,"walkBidAsk"],
[40,40,true,null,null,1,"AJV.L",0,"AJV.L",448,462.1,459.1,1009.97,55,"walkBidAsk"],
[41,41,true,null,null,1,"AUI.OQ",0,"AUI.OQ",855,883.3,875.3,85.82,123,"walkBidAsk"],
[55,55,true,null,null,1,"AQW.OQ",0,"AQW.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[62,62,true,null,null,1,"BAT.AS",0,"BAT.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[63,63,true,null,null,1,"BBK.AS",0,"BBK.AS",14,14,968.52,841.3,123,"walkBidAsk"],
[69,69,true,null,null,1,"ARN.OQ",0,"ARN.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[79,79,true,null,null,1,"ASE.OQ",0,"ASE.OQ",14,14,968.52,841.3,123,"walkBidAsk"],
[87,87,true,null,null,1,"AYQ.AS",0,"AYQ.AS",91,91,968.52,841.3,123,"walkBidAsk"],
[94,0,true,null,null,1,"BJG.L",0,"BJG.L",91,91,968.52,841.3,264,"walkBidAsk"],
[95,0,true,null,null,1,"BJG.N",0,"BJG.N",857,885.3,877.3,218.1,264,"walkBidAsk"],
[111,0,true,null,null,1,"AZH.OQ",0,"AZH.OQ",852,880.3,880.3,218.1,251,"walkBidAsk"],
[120,0,true,null,null,1,"AXZ.AS",0,"AXZ.AS",695,701.95,886.3,218.1,251,"fastTick"],
[121,0,true,null,null,1,"BEF.AS",0,"BEF.AS",695,701.95,886.3,218.1,251,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[3,3,true,null,null,1,"NYC-003145",0,"NYC-003145","B","AAPL.N","USD",59292,39528,"stevchrs",1615751669291]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[4,4,true,null,null,1,"ADE.OQ",0,"ADE.OQ",942,951.42,579.49,790.81,72,"walkBidAsk"],
[6,6,true,null,null,1,"AKH.N",0,"AKH.N",942,951.42,579.49,790.81,72,"walkBidAsk"],
[7,7,true,null,null,1,"AKH.L",0,"AKH.L",942,951.42,579.49,413.07,72,"walkBidAsk"],
[8,8,true,null,null,1,"AML.AS",0,"AML.AS",942,951.42,579.49,413.07,72,"walkBidAsk"],
[13,13,true,null,null,1,"ACN.OQ",0,"ACN.OQ",942,951.42,579.49,413.07,72,"walkBidAsk"],
[17,17,true,null,null,1,"BBH.L",0,"BBH.L",942,951.42,579.49,413.07,72,"walkBidAsk"],
[19,19,true,null,null,1,"BBH.N",0,"BBH.N",942,951.42,579.49,413.07,72,"walkBidAsk"],
[30,30,true,null,null,1,"ANC.AS",0,"ANC.AS",933,942.33,579.49,413.07,567,"walkBidAsk"],
[37,37,true,null,null,1,"ALU.AS",0,"ALU.AS",558,563.58,733.23,413.07,698,"walkBidAsk"],
[57,57,true,null,null,1,"AAJ.OQ",0,"AAJ.OQ",558,563.58,807.79,413.07,307,"walkBidAsk"],
[66,66,true,null,null,1,"APG.AS",0,"APG.AS",885,893.85,807.79,417.07,307,"open"],
[70,70,true,null,null,1,"AXN.L",0,"AXN.L",230,232.2,231.2,417.07,307,"fastTick"],
[71,71,true,null,null,1,"AXN.N",0,"AXN.N",230,232.2,231.2,417.07,307,"fastTick"],
[82,82,true,null,null,1,"ANY.AS",0,"ANY.AS",236,238.2,237.2,546.35,709,"fastTick"],
[85,85,true,null,null,1,"AHM.OQ",0,"AHM.OQ",236,238.2,237.2,546.35,705,"fastTick"],
[86,86,true,null,null,1,"ABW.OQ",0,"ABW.OQ",236,238.2,237.2,546.35,709,"fastTick"],
[92,92,true,null,null,1,"AOP.AS",0,"AOP.AS",236,238.2,237.2,546.35,700,"fastTick"],
[93,0,true,null,null,1,"AFR.N",0,"AFR.N",481,515.49,507.49,1002.93,152,"fastTick"],
[96,0,true,null,null,1,"AFR.L",0,"AFR.L",487,521.49,513.49,1002.93,152,"fastTick"],
[108,0,true,null,null,1,"AID.OQ",0,"AID.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"],
[110,0,true,null,null,1,"ABA.OQ",0,"ABA.OQ",344,347.44,716.72,546.35,695,"walkBidAsk"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[3,3,true,null,null,1,"NYC-003145",0,"NYC-003145","B","AAPL.N","USD",59292,59292,"stevchrs",1615751669291]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[22,22,true,null,null,1,"BFK.OQ",0,"BFK.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[25,25,true,null,null,1,"AKY.N",0,"AKY.N",4,4,379.46,326.19,858,"walkBidAsk"],
[27,27,true,null,null,1,"AKY.L",0,"AKY.L",4,4,379.46,326.19,858,"walkBidAsk"],
[34,34,true,null,null,1,"BGX.OQ",0,"BGX.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[36,36,true,null,null,1,"BDG.OQ",0,"BDG.OQ",4,4,379.46,326.19,858,"walkBidAsk"],
[48,48,true,null,null,1,"BCP.OQ",0,"BCP.OQ",65,65.65,962.28,326.19,858,"walkBidAsk"],
[49,49,true,null,null,1,"BGB.OQ",0,"BGB.OQ",65,65.65,962.28,326.19,858,"walkBidAsk"],
[50,50,true,null,null,1,"BBY.L",0,"BBY.L",65,65.65,962.28,326.19,858,"walkBidAsk"],
[51,51,true,null,null,1,"BBY.N",0,"BBY.N",65,65.65,586.53,326.19,858,"walkBidAsk"],
[59,59,true,null,null,1,"AGD.L",0,"AGD.L",911,939.81,938.81,550.43,731,"fastTick"],
[61,61,true,null,null,1,"AGD.N",0,"AGD.N",911,939.81,938.81,550.43,937,"fastTick"],
[105,0,true,null,null,1,"BET.OQ",0,"BET.OQ",50,60,53,326.19,694,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[2,2,true,null,null,1,"NYC-003144",0,"NYC-003144","B","AAPL.N","USD",12914,5165.6,"stevchrs",1615751669188]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[32,32,true,null,null,1,"BCK.L",0,"BCK.L",947,956.47,880.5,989.8,864,"open"],
[33,33,true,null,null,1,"BCK.N",0,"BCK.N",947,956.47,880.5,989.8,864,"open"],
[38,38,true,null,null,1,"APO.N",0,"APO.N",327,340.09,335.09,84.77,761,"walkBidAsk"],
[42,42,true,null,null,1,"APO.L",0,"APO.L",449,453.49,468.48,78.77,889,"walkBidAsk"],
[73,73,true,null,null,1,"AGU.L",0,"AGU.L",572,577.72,602.76,203,61,"walkBidAsk"],
[76,76,true,null,null,1,"AGU.N",0,"AGU.N",572,577.72,602.76,203,61,"walkBidAsk"],
[91,91,true,null,null,1,"ALK.N",0,"ALK.N",142,143.42,179.3,641.3,748,"open"],
[103,0,true,null,null,1,"ALK.L",0,"ALK.L",142,143.42,743.34,641.3,748,"open"],
[112,0,true,null,null,1,"AYQ.N",0,"AYQ.N",119,180.03,179.03,641.3,748,"fastTick"],
[115,0,true,null,null,1,"AYQ.L",0,"AYQ.L",658,714.32,713.32,107.03,748,"fastTick"]],"rowCount":52211,"offset":0,"range":{"lo":0,"hi":27}});



    state = GridDataReducer(state, {"type":"data","rows":[[2,2,true,null,null,1,"NYC-003144",0,"NYC-003144","B","AAPL.N","USD",12914,10331.2,"stevchrs",1615751669188]],"rowCount":47,"offset":0,"range":{"lo":0,"hi":27}});

    });
  });
