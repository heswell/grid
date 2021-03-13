import * as Message from './messages';

const EMPTY_ARRAY = [];

export default class Viewport {

  constructor(clientViewportId, request, status = 'subscribing'){
    this.clientViewportId = clientViewportId;
    this.request = request;
    this.status = status;
    this.serverViewportId = null;
    this.pendingOperations= []
    this.columns = null;
    this.table = null;
    this.range = null;
    this.sort = null;
    this.groupBy = null;
    this.filterSpec = null;
    this.pendingOperations = new Map();
    this.isTree = false;
  }

  subscribe({viewPortId, columns, table, range, sort, groupBy, filterSpec}){
    this.serverViewportId = viewPortId;
    this.status = 'subscribed';
    this.columns = columns;
    this.table = table;
    this.range = range;
    this.sort = sort;
    this.groupBy = groupBy;
    this.filterSpec = filterSpec;

    console.log(`%cViewport subscribed
      clientVpId: ${this.clientViewportId}
      serverVpId: ${this.serverViewportId}
      table: ${this.table}
      columns: ${columns.join(',')}
      range: ${JSON.stringify(range)}
      sort: ${JSON.stringify(sort)}
      groupBy: ${JSON.stringify(groupBy)}
      filterSpec: ${JSON.stringify(filterSpec)}
    `,'color: blue')
  }

  awaitOperation(requestId, type){
    console.log(`await ${type} operation ${requestId}`)
    //TODO set uip a timeout mechanism here
    this.pendingOperations.set(requestId, type);
  }

  completeOperation(requestId){
    const {clientViewportId, pendingOperations} = this;
    const {type, data} = pendingOperations.get(requestId);
    pendingOperations.delete(requestId);
    console.log(`operation ${requestId} (${type}) complete`);
    if (type === 'groupBy'){
      this.isTree = true;
      this.groupBy = data;
      return {clientViewportId, type, groupBy: data};
    } else if (type === "groupByClear"){
      this.isTree = false;
      this.groupBy = [];
      return { clientViewportId, type: "groupBy", groupBy: null };
    }
  }

  groupByRequest(requestId, requestedGroupBy ){
    const groupBy = requestedGroupBy?.map(([columnName]) => columnName) ?? EMPTY_ARRAY;
    const type = groupBy === EMPTY_ARRAY ? "groupByClear" : "groupBy";
    this.awaitOperation(requestId, {type, data: groupBy});
    return {
      type: Message.CHANGE_VP,
      viewPortId: this.serverViewportId,
      columns: this.columns,
      sort: {
        sortDefs: []
      },
      groupBy,
      filterSpec: null
    }
  }
}
