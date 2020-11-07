import { WorkerDataSource } from "@heswell/data-source";

let testStartTime;
let dataSource;

const flasher = {name: 'number', renderer: {name: 'background-cell', flashStyle: 'background'}};
// const flasher = {name: 'number'};

const schema = {
  columns: [
    {name: 'product'},
    {name: 'portfolio'},
    {name: 'book'},
    {name: 'trade'},
    {name: 'dealType'},
    {name: 'bidFlag'},
    {name: 'current', type: flasher, aggregate: 'avg'},
    {name: 'previous', type: flasher, aggregate: 'avg'},
    {name: 'pl1', type: flasher},
    {name: 'pl2', type: flasher},
    {name: 'gainDx', type: flasher},
    {name: 'sxPx', type: flasher},
    {name: '_99out', type: flasher},
    {name: 'submitterDealID'},
    {name: 'submitterID'},
    {name: 'batch'}
  ]
}

export default function getAgGridDataSource(){

  // startWorker();
  const columns = schema.columns;
  dataSource = new WorkerDataSource({
    schema, 
    primaryKey: 'trade', 
    configUrl: '/tables/ag-grid-demo/config.js'
  });
  dataSource.on('start', (type, msg) => {
    testStartTime = new Date().getTime();
    logTestStart(msg.messageCount, msg.updateCount, msg.interval);
    
  });
  dataSource.on('end', (type, msg) => {
    logStressResults(msg.messageCount, msg.updateCount);
  });

  return [columns, dataSource];

}

export const postMessage = message => dataSource.worker.postMessage(message);

function logStressResults(messageCount, updateCount) {

  var testEndTime = new Date().getTime();
  var duration = testEndTime - testStartTime;
  var totalUpdates = messageCount * updateCount;

  var updatesPerSecond = Math.floor((totalUpdates / duration) * 1000);

  console.log('Processed ' + totalUpdates.toLocaleString() + ' updates in ' + duration.toLocaleString() + 'ms, that\'s ' + updatesPerSecond.toLocaleString() + ' updates per second.')

  console.log('###################################')
  console.log('#       Stress test results')
  console.log('# The grid was pumped with ' + messageCount.toLocaleString() + ' messages. Each message had ' + updateCount.toLocaleString() + ' record updates which gives a total number of updates of ' + totalUpdates.toLocaleString() + '.');
  console.log('# Time taken to execute the test was ' + duration.toLocaleString() + ' milliseconds which gives ' + updatesPerSecond.toLocaleString() + ' updates per second.');
  console.log('###################################')
}


function logTestStart(messageCount, updateCount, interval) {
  let message = messageCount ?
      'Sending '+messageCount+' messages at once with '+updateCount+' record updates each.' :
      'Sending 1 message with '+updateCount+' updates every '+interval+' milliseconds, that\'s ' +(1000/interval*updateCount).toLocaleString()+ ' updates per second.';

  console.log(message);
}

