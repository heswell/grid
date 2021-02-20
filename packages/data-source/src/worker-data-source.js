import {createLogger, DataTypes, EventEmitter, logColor, uuid} from '@heswell/utils';

const {ROW_DATA} = DataTypes;

const logger = createLogger('WorkerDataSource', logColor.blue);


const defaultRange = { lo: 0, hi: 0 };

const workerQueue = () => ({
  queue: [],
  postMessage(message){
    this.queue.push(message);
  }
});

/*-----------------------------------------------------------------
 A RemoteDataView manages a single subscription via the ServerProxy
  ----------------------------------------------------------------*/
export default class WorkerDataSource extends EventEmitter {

  constructor({
    bufferSize=100,
    schema,
    tableName,
    configUrl,
  }) {
    super();

    this.bufferSize = bufferSize;
    this.columns = schema.columns;

    this.tableName = tableName;
    this.subscription = null;
    this.viewport = null;
    this.filterDataCallback = null;
    this.filterDataMessage = null;
    this.worker = workerQueue();
    this.pendingWorker = new Worker(`worker.js#?${configUrl}`, {type: 'module'});
  }

  async subscribe({
    viewport = uuid(),
    tableName = this.tableName,
    columns=this.columns || [],
    range = defaultRange
  }, callback) {

    const {worker: {queue: pendingQueue}, pendingWorker: worker} = this;
    this.viewport = viewport;
    this.tableName = tableName;
    this.columns = columns;
    worker.onmessage = ({data: message}) => {
      if (message.dataType === DataTypes.FILTER_DATA) {
        this.filterDataCallback(message)
      } else if (message.rows || message.updates){
        callback(message)
      } else if (message.type.startsWith('test')){
        callback(message)
      } else if (message.type === 'ready'){

        this.worker.postMessage({type: 'subscribe', range, columns });
      } else {
        this.emit(message.type, message);
      }
    }

    this.pendingWorker = null;
    this.worker = worker;

    pendingQueue.forEach(message => worker.postMessage(message));

  }

  unsubscribe() {
    logger.log(`unsubscribe from ${this.tableName} (viewport ${this.viewport})`);
    // this.server.unsubscribe(this.viewport);
    // do we terminate the worker ?
  }

  setColumns(columns){
    this.columns = columns;
    return this;
  }

  setSubscribedColumns(columns){
    if (columns.length !== this.columns.length || !columns.every(columnName => this.columns.includes(columnName))){
      this.columns = columns;
      // ???
    }
  }

  setRange(lo, hi, dataType=ROW_DATA) {
    const low = Math.max(0, lo - this.bufferSize);
    const high = hi + this.bufferSize;
    this.worker.postMessage({type: 'setRange', range: {lo: low, hi: high}, dataType});
  }

  select(idx, rangeSelect, keepExistingSelection, dataType=ROW_DATA){
    // this.server.handleMessageFromClient({
    //   viewport: this.viewport,
    //   type: Msg.select,
    //   idx,
    //   rangeSelect,
    //   keepExistingSelection,
    //   dataType
    // });
  }

  selectAll(dataType=ROW_DATA){
    // this.server.handleMessageFromClient({
    //   viewport: this.viewport,
    //   type: Msg.selectAll,
    //   dataType
    // });
  }

  selectNone(dataType=ROW_DATA){
    // this.server.handleMessageFromClient({
    //   viewport: this.viewport,
    //   type: Msg.selectNone,
    //   dataType
    // });

  }

  filter(filter, dataType = ROW_DATA, incremental=false) {
    // this.server.handleMessageFromClient({
    //   viewport: this.viewport,
    //   type: Msg.filter,
    //   filter,
    //   incremental,
    //   dataType,
    // })
  }

  group(columns) {
    this.emit('group', columns);
    this.worker.postMessage({type: 'groupBy', groupBy: columns});
  }

  setGroupState(groupState) {
    this.worker.postMessage({
      type: 'setGroupState',
      groupState
    });
  }

  sort(columns) {
    this.emit('sort', columns);
    this.worker.postMessage({
      type: 'sort',
      sortCriteria: columns
    });
  }

  getFilterData(column, searchText) {
    // console.log(`[RemoteDataView] getFilterData`)
    // this.server.handleMessageFromClient({
    //   viewport: this.viewport,
    //   type: Msg.getFilterData,
    //   column,
    //   searchText
    // });
  }

  subscribeToFilterData(column, range, callback) {
    logger.log(`<subscribeToFilterData> ${column.name}`)
    this.filterDataCallback = callback;
    this.getFilterData(column, range);

    // this.setFilterRange(range.lo, range.hi);
    // if (this.filterDataMessage) {
    //   callback(this.filterDataMessage);
    //   // do we need to nullify now ?
    // }

  }

  unsubscribeFromFilterData() {
    logger.log(`<unsubscribeFromFilterData>`)
    this.filterDataCallback = null;
  }

  // // To support multiple open filters, we need a column here
  // setFilterRange(lo, hi) {
  //   console.log(`setFilerRange ${lo}:${hi}`)
  //   this.server.handleMessageFromClient({
  //     viewport: this.viewport,
  //     type: Msg.setViewRange,
  //     dataType: DataTypes.FILTER_DATA,
  //     range: { lo, hi }
  //   })

  // }

  startStressTest(){
    this.worker.postMessage({type: 'startStress'});
  }

  startLoadTest(){
    this.worker.postMessage({type: 'startLoad'});
  }

  stopTest(){
    this.worker.postMessage({type: 'stopTest'});
  }

}

