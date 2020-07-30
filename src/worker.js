// @ts-nocheck

import { DataStore, Table } from "@heswell/data-store";
import {DataTypes, EventEmitter} from '@heswell/utils';

const flasher = {name: 'number', renderer: {name: 'background', flashStyle: 'background'}};

const columns = [
  {name: 'product'},
  {name: 'portfolio'},
  {name: 'book'},
  {name: 'trade'},
  {name: 'dealType'},
  {name: 'bidFlag'},
  {name: 'current', type: flasher, aggregate: 'sum'},
  {name: 'previous', type: flasher, aggregate: 'sum'},
  {name: 'pl1', type: flasher, aggregate: 'sum'},
  {name: 'pl2', type: flasher, aggregate: 'sum'},
  {name: 'gainDx', type: flasher, aggregate: 'sum'},
  {name: 'sxPx', type: flasher, aggregate: 'sum'},
  {name: '_99out', type: flasher, aggregate: 'sum'},
  {name: 'submitterID'},
  {name: 'submitterDealID'},
  {name: 'batch'},
];

// update these to change the stress test parameters
var STRESS_TEST_MESSAGE_COUNT = 1000;
var STRESS_TEST_UPDATES_PER_MESSAGE = 100;

// update these to change the
var LOAD_TEST_UPDATES_PER_MESSAGE = 100;
var LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES = 100;

// update these to change the size of the data initially loaded into the grid for updating
var BOOK_COUNT = 15;
var TRADE_COUNT = 5;

// add / remove products to change the data set
var PRODUCTS = ['Palm Oil','Rubber','Wool','Amber','Copper','Lead','Zinc','Tin','Aluminium',
    'Aluminium Alloy','Nickel','Cobalt','Molybdenum','Recycled Steel','Corn','Oats','Rough Rice',
    'Soybeans','Rapeseed','Soybean Meal','Soybean Oil','Wheat','Milk','Coca','Coffee C',
    'Cotton No.2','Sugar No.11','Sugar No.14'];

// add / remove portfolios to change the data set
var PORTFOLIOS = ['Aggressive','Defensive','Income','Speculative','Hybrid'];

// these are the list of columns that updates go to
var VALUE_FIELDS = ['current','previous','pl1','pl2','gainDx','sxPx','_99out'];

// start the book id's and trade id's at some future random number,
// looks more realistic than starting them at 0
var nextBookId = 62472;
var nextTradeId = 24287;
var nextBatchId = 101;

class TradeTable extends Table {
    load(){
        const {index, rows} = this;
        var thisBatch = nextBatchId++;

        let idx = 0;
        for (let i = 0; i<PRODUCTS.length; i++) {
            const product = PRODUCTS[i];
            for (let j = 0; j<PORTFOLIOS.length; j++) {
                const portfolio = PORTFOLIOS[j];

                for (let k = 0; k<BOOK_COUNT; k++) {
                    for (let l = 0; l < TRADE_COUNT; l++) {

                        const current = Math.floor(Math.random()*100000) + 100;
                        const previous = current + Math.floor(Math.random()*10000) - 2000;
                        const trade = ++nextTradeId;
                        index[trade] = idx;

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
        console.log('Total number of records sent to grid = ' + rows.length);
    }

    generateBulkUpdates(updateCount){
        const {columnMap,rows} = this;
        const updates = [];
        const rowCount = rows.length;
        if (rowCount > 0){
            for (let k = 0; k<updateCount; k++) {
                const idx = Math.floor(Math.random()*rowCount);
                const field = VALUE_FIELDS[Math.floor(Math.random() * VALUE_FIELDS.length)];
                const colIdx = columnMap[field];
                updates.push([idx, colIdx, Math.floor(Math.random()*100000)]);
            }
            this.bulkUpdate(updates);
        }
    }

}

const tradeTable = new TradeTable({
    name: 'Trades',
    primaryKey: 'trade',
    columns
  });

const start = performance.now();
tradeTable.load();  
const end = performance.now();
console.log(`table load took ${end-start}ms`)

class UpdateQueue extends EventEmitter {
    
    // just until we get typings sorted ...
    constructor(){
        super();
        this._queue = null;
        this.length = 0;
    }
    // not the right name
    update(updates, dataType = DataTypes.ROW_DATA) {
        if (updates.length === 0){
            debugger;
        }
        postMessage({dataType, updates});
    }

    // just until we get the typing sorted
    getCurrentBatch(){

    }

    resize(size) {
        console.log(`localUpdateQueue resize ${JSON.stringify(size)}`)
    }

    append(row, offset) {
        console.log(`localUpdateQueue append ${JSON.stringify(row)} offset ${offset}`)
    }

    replace(message) {
        console.log(`localUpdateQueue replace ${JSON.stringify(size)}`)
        // this.emit(DataTypes.ROW_DATA, message)
    }

    popAll() {
        console.log(`localUpdateQueue popAll`)
        return undefined; // for typescript, until we sort types for UpdateQueue
    }
}


const dataStore = new DataStore(tradeTable, {columns}, new UpdateQueue);
console.log(dataStore)

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function randomBetween(min,max) {
    return Math.floor(Math.random()*(max - min + 1)) + min;
}

// postMessage({
//     type: 'setRowData',
//     records: globalRowData
// });

var latestTestNumber = 0;

function updateSomeItems(updateCount) {
    var itemsToUpdate = [];
    for (var k = 0; k<updateCount; k++) {
        if (globalRowData.length === 0) { continue; }
        var indexToUpdate = Math.floor(Math.random()*globalRowData.length);
        var itemToUpdate = globalRowData[indexToUpdate];

        // make a copy of the item, and make some changes, so we are behaving
        // similar to how the
        var field = VALUE_FIELDS[Math.floor(Math.random() * VALUE_FIELDS.length)];
        itemToUpdate[field] = Math.floor(Math.random()*100000);

        itemsToUpdate.push(itemToUpdate);
    }
    return itemsToUpdate;
}


function sendMessagesWithThrottle(thisTestNumber) {
    var messageCount = null;

    postMessage({
        type: 'start',
        messageCount: messageCount,
        updateCount: LOAD_TEST_UPDATES_PER_MESSAGE,
        interval: LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES
    });

    var intervalId;

    function intervalFunc() {
        postMessage({
            type: 'updateData',
            records: updateSomeItems(LOAD_TEST_UPDATES_PER_MESSAGE)
        });
        if (thisTestNumber!==latestTestNumber) {
            clearInterval(intervalId);
        }
    }

    intervalId = setInterval(intervalFunc, LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES);
}

function sendMessagesNoThrottle() {
    postMessage({
        type: 'start',
        messageCount: STRESS_TEST_MESSAGE_COUNT,
        updateCount: STRESS_TEST_UPDATES_PER_MESSAGE,
        interval: null
    });

    // pump in 1000 messages without waiting
    for (var i = 0; i<=STRESS_TEST_MESSAGE_COUNT; i++) {
        dataStore._table.generateBulkUpdates(STRESS_TEST_UPDATES_PER_MESSAGE);
        // postMessage({
        //     type: 'updateData',
        //     records: updateSomeItems(STRESS_TEST_UPDATES_PER_MESSAGE)
        // });
    }

    postMessage({
        type: 'end',
        messageCount: STRESS_TEST_MESSAGE_COUNT,
        updateCount: STRESS_TEST_UPDATES_PER_MESSAGE
    });
}

self.addEventListener('message', function({data: message}) {


    latestTestNumber++;
    switch (message.type) {
        case 'subscribe': {
            const result = dataStore.setRange(message.range, true);
            console.log(`post back dataset to WorkerDataSource`)
            postMessage(result);
        }
        break;
        
        case 'setRange':{
            const result = dataStore.setRange(message.range);
            postMessage(result);
        }
        break;

        case 'groupBy':{
            const result = dataStore.groupBy(message.groupBy);
            postMessage(result);
        }
        break;

        case 'startStress':
            console.log('starting stress test');
            sendMessagesNoThrottle();
            break;
        case 'startLoad':
            console.log('starting load test');
            sendMessagesWithThrottle(latestTestNumber);
            break;
        case 'stopTest':
            console.log('stopping test');
            // sendMessagesNoThrottle();
            break;
        default:
            console.log('unknown message type ' + e.data);
            break;
    }
});
