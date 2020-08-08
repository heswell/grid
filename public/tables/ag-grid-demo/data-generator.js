const BOOK_COUNT = 15;
const TRADE_COUNT = 5;

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function randomBetween(min,max) {
  return Math.floor(Math.random()*(max - min + 1)) + min;
}

var PRODUCTS = ['Palm Oil','Rubber','Wool','Amber','Copper','Lead','Zinc','Tin','Aluminium',
    'Aluminium Alloy','Nickel','Cobalt','Molybdenum','Recycled Steel','Corn','Oats','Rough Rice',
    'Soybeans','Rapeseed','Soybean Meal','Soybean Oil','Wheat','Milk','Coca','Coffee C',
    'Cotton No.2','Sugar No.11','Sugar No.14'];

// add / remove portfolios to change the data set
const PORTFOLIOS = ['Aggressive','Defensive','Income','Speculative','Hybrid'];

// start the book id's and trade id's at some future random number,
// looks more realistic than starting them at 0
var nextBookId = 62472;
var nextTradeId = 24287;
var nextBatchId = 101;

export function generateData(){

  var thisBatch = nextBatchId++;
  const rows = [];

  let idx = 0;
  const start = performance.now();
  for (let i = 0; i<PRODUCTS.length; i++) {
      const product = PRODUCTS[i];
      for (let j = 0; j<PORTFOLIOS.length; j++) {
          const portfolio = PORTFOLIOS[j];

          for (let k = 0; k<BOOK_COUNT; k++) {
              for (let l = 0; l < TRADE_COUNT; l++) {

                  const current = Math.floor(Math.random()*100000) + 100;
                  const previous = current + Math.floor(Math.random()*10000) - 2000;
                  const trade = ++nextTradeId;
                  const row = [
                      idx, 
                      trade, 
                      product,
                      portfolio,
                      `GL-${++nextBookId}`,
                      trade,
                      (Math.random()<.2) ? 'Physical' : 'Financial', // dealType
                      (Math.random()<.5) ? 'Buy' : 'Sell', // bidFlag
                      current,
                      previous,
                      randomBetween(100,1000),  // pl1
                      randomBetween(100,1000),  // pl2
                      randomBetween(100,1000),  // gainDx
                      randomBetween(100,1000),  // sxPx
                      randomBetween(100,1000),  // _99out
                      randomBetween(10,1000),   // submitterID
                      randomBetween(10,1000),   // submitterDealID
                      thisBatch,
                  ]

                  rows.push(row);
                  idx += 1;
              }
          }
      }
  }
  const end = performance.now();
  console.log(`data creation took ${end-start}ms (${rows.length} rows)`)
  return rows;
}

