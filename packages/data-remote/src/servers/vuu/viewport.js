import { metadataKeys } from "@heswell/utils/src/column-utils";
import * as Message from './messages';

const { IDX, SELECTED } = metadataKeys;
const EMPTY_ARRAY = [];
const SORT = { asc: 'D', dsc: 'A' };

export default class Viewport {

  constructor(clientViewportId, request, status = 'subscribing') {
    this.clientViewportId = clientViewportId;
    this.request = request;
    this.status = status;
    this.serverViewportId = null;
    this.pendingOperations = []
    this.columns = null;
    this.table = null;
    this.range = null;
    this.sort = null;
    this.groupBy = null;
    this.filterSpec = null;
    this.pendingOperations = new Map();
    this.isTree = false;
    this.suspended = false;
    this.selection = [];
  }

  subscribe({ viewPortId, columns, table, range, sort, groupBy, filterSpec }) {
    this.serverViewportId = viewPortId;
    this.status = 'subscribed';
    this.columns = columns;
    this.table = table;
    this.range = range;
    this.sort = sort;
    this.groupBy = groupBy;
    this.filterSpec = filterSpec;
    this.isTree = groupBy && groupBy.length > 0;

    console.log(`%cViewport subscribed
      clientVpId: ${this.clientViewportId}
      serverVpId: ${this.serverViewportId}
      table: ${this.table}
      columns: ${columns.join(',')}
      range: ${JSON.stringify(range)}
      sort: ${JSON.stringify(sort)}
      groupBy: ${JSON.stringify(groupBy)}
      filterSpec: ${JSON.stringify(filterSpec)}
    `, 'color: blue')
  }

  awaitOperation(requestId, type) {
    //TODO set uip a timeout mechanism here
    this.pendingOperations.set(requestId, type);
  }

  // Return a message if we need to communicate this to client UI
  completeOperation(requestId) {
    const { clientViewportId, pendingOperations } = this;
    const { type, data } = pendingOperations.get(requestId);
    pendingOperations.delete(requestId);
    if (type === 'groupBy') {
      this.isTree = true;
      this.groupBy = data;
      return { clientViewportId, type, groupBy: data };
    } else if (type === "groupByClear") {
      this.isTree = false;
      this.groupBy = [];
      return { clientViewportId, type: "groupBy", groupBy: null };
    } else if (type === 'filter') {
      this.filterSpec = { filter: data };
      return { clientViewportId, type, filter: data };
    } else if (type === 'sort') {
      this.sort = { sortDefs: data };
      return { clientViewportId, type, sort: data };
    } else if (type === "selection") {
      this.selection = data;
    } else if (type === "disable") {
      this.suspended = true; // assuming its _SUCCESS, of cource
    } else if (type === "enable") {
      this.suspended = false;
    }
  }


  enable(requestId) {
    this.awaitOperation(requestId, { type: "enable" });
    return {
      type: Message.ENABLE_VP,
      viewPortId: this.serverViewportId,
    }
  }

  disable(requestId) {
    this.awaitOperation(requestId, { type: "disable" });
    return {
      type: Message.DISABLE_VP,
      viewPortId: this.serverViewportId,
    }
  }


  filterRequest(requestId, filter) {
    this.awaitOperation(requestId, { type: "filter", data: filter });
    return this.createRequest({ filterSpec: { filter } });
  }

  sortRequest(requestId, sortDefs) {
    this.awaitOperation(requestId, { type: "sort", data: sortDefs });
    return this.createRequest({ sort: { sortDefs } })
  }

  groupByRequest(requestId, groupBy=EMPTY_ARRAY) {
    const type = groupBy === EMPTY_ARRAY ? "groupByClear" : "groupBy";
    this.awaitOperation(requestId, { type, data: groupBy });
    return this.createRequest({ groupBy })
  }

  selectRequest(requestId, row, rangeSelect, keepExistingSelection) {
    const singleSelect = !rangeSelect && !keepExistingSelection;
    const selection = row[SELECTED]
      ? singleSelect
        ? []
        : this.selection.filter(idx => idx !== row[IDX])
      : keepExistingSelection
        ? this.selection.concat(row[IDX])
        : [row[IDX]];

    this.awaitOperation(requestId, { type: "selection", data: selection });
    return {
      type: Message.SET_SELECTION,
      vpId: this.serverViewportId,
      selection
    }
  }

  createRequest(params) {
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

