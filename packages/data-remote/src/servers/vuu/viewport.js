import * as Message from './messages';

const EMPTY_ARRAY = [];
const SORT = { asc: 'D', dsc: 'A' };

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

  // Return a message if we need to communicate this to client UI
  completeOperation(requestId){
    const {clientViewportId, pendingOperations} = this;
    const {type, data} = pendingOperations.get(requestId);
    pendingOperations.delete(requestId);
    if (type === 'groupBy'){
      this.isTree = true;
      this.groupBy = data;
      return {clientViewportId, type, groupBy: data};
    } else if (type === "groupByClear"){
      this.isTree = false;
      this.groupBy = [];
      return { clientViewportId, type: "groupBy", groupBy: null };
    } else if (type === 'filter'){
      this.filterSpec = {
        filter: data
      };
    } else if (type === 'sort'){
      this.sort = {
        sortDefs: data
      }
    }
  }

  filterRequest(requestId, filter ){
    this.awaitOperation(requestId, {type: "filter", data: filter});
    return this.createRequest({filterSpec: { filter }});
  }

  sortRequest(requestId, requestedSort ){
    const sortDefs = requestedSort.map(([column, dir = 'asc']) => ({ column, sortType: SORT[dir] }));
    this.awaitOperation(requestId, {type: "sort", data: sortDefs});
    return this.createRequest({sort: { sortDefs }})
  }

  groupByRequest(requestId, requestedGroupBy ){
    const groupBy = requestedGroupBy?.map(([columnName]) => columnName) ?? EMPTY_ARRAY;
    const type = groupBy === EMPTY_ARRAY ? "groupByClear" : "groupBy";
    this.awaitOperation(requestId, {type, data: groupBy});
    return this.createRequest({groupBy})
  }

  createRequest( params){
    return {
      type: Message.CHANGE_VP,
      viewPortId: this.serverViewportId,
      columns: this.columns,
      sort: this.sort,
      groupBy: this.groupBy,
      filterSpec: this.filterSpec,
      ...params
    }
  }

}

