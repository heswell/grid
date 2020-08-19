var SECURITIES = ["AAPL.N", "AMZN.N", "QQQ.N", "NVDA.N", "TSLA.N", "FB.N", "MSFT.N", "TLT.N", "XIV.N", "YY.N", "CSCO.N", "GOOGL.N", "PCLN.N"];

var CLIENTS = ["Homer", "Marge", "Bart", "Lisa", "Maggie", "Moe", "Lenny", "Carl", "Krusty"];

// TODO we want to be able to generate data suitable for loading into PSP as well as viewserver
export function generateData(){

  var rows = [];
  for (var x = 0; x < 100; x++) {
      rows.push({
          name: SECURITIES[Math.floor(Math.random() * SECURITIES.length)],
          client: CLIENTS[Math.floor(Math.random() * CLIENTS.length)],
          lastUpdate: new Date(),
          date: new Date(),
          chg: Math.random() * 20 - 10,
          bid: Math.random() * 10 + 90,
          ask: Math.random() * 10 + 100,
          vol: Math.random() * 10 + 100
      });
  }
  return rows;

}