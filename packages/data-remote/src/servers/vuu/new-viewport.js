import {KeySet} from "./keyset";
import * as Message from './messages';
import { ArrayBackedMovingWindow } from "./array-backed-moving-window";
import { getFullRange } from "./range-utils";

export class Viewport {
  constructor({ viewport, tablename, columns, range, bufferSize=0 }) {
    this.clientViewportId = viewport;
    this.table = tablename;
    this.status = '';
    this.columns = columns;
    this.clientRange = range;
    this.bufferSize = bufferSize;
    this.sort = {
      sortDefs: []
    };
    this.groupBy = undefined;
    this.filterSpec = {
      filter: ""
    };
    this.isTree = false;
    this.dataWindow = undefined;
    this.rowCount = 0;
    this.rowCountChanged = false;
    this.keys = new KeySet();
    this.pendingOperations = new Map();
    this.hasUpdates = false;
    this.requiresKeyAssignment = true;

  }

  get shouldUpdateClient() {
    return this.rowCountChanged || (this.hasUpdates && this.dataWindow.hasAllRowsWithinRange);
  }

  subscribe() {
    return {
      type: Message.CREATE_VP,
      table: this.table,
      range: getFullRange(this.clientRange, this.bufferSize),
      columns: this.columns,
      sort: this.sort,
      groupBy: this.groupBy,
      filterSpec: this.filterSpec
    }
  }

  handleSubscribed({ viewPortId, columns, table, range, sort, groupBy, filterSpec }) {
    this.serverViewportId = viewPortId;
    this.status = 'subscribed';
    this.columns = columns;
    this.table = table;
    this.range = range;
    this.sort = sort;
    this.groupBy = groupBy;
    this.filterSpec = filterSpec;
    this.isTree = groupBy && groupBy.length > 0;
    this.dataWindow = new ArrayBackedMovingWindow(this.clientRange, range, this.bufferSize);

    console.log(`%cViewport subscribed
      clientVpId: ${this.clientViewportId}
      serverVpId: ${this.serverViewportId}
      table: ${this.table}
      columns: ${columns.join(',')}
      range: ${JSON.stringify(range)}
      sort: ${JSON.stringify(sort)}
      groupBy: ${JSON.stringify(groupBy)}
      filterSpec: ${JSON.stringify(filterSpec)}
      bufferSize: ${this.bufferSize}
    `, 'color: blue')
  }

  awaitOperation(requestId, type) {
    //TODO set uip a timeout mechanism here
    this.pendingOperations.set(requestId, type);
  }

    // Return a message if we need to communicate this to client UI
    completeOperation(requestId, ...params) {
      const { clientViewportId, pendingOperations } = this;
      const { type, data } = pendingOperations.get(requestId);
      pendingOperations.delete(requestId);
      if (type === Message.CHANGE_VP_RANGE){
        const [from,to] = params;
        this.dataWindow.setRange(from, to);
        // this is only true if client range is affected
        this.requiresKeyAssignment = true;
        this.hasUpdates = true;
      } else if (type === 'groupBy') {
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

  rangeRequest(requestId, from, to){
    // If we can satisfy the range request from the buffer, we will.
    // May or may not need to make a server request, depending on status of buffer
    const type = Message.CHANGE_VP_RANGE;
    const serverDataRequired = this.dataWindow.setClientRange(from, to);
    const serverRequest = serverDataRequired
      ? { type, viewPortId: this.serverViewportId, ...getFullRange({lo:from, hi:to}, this.bufferSize)}
      : undefined;
    if (serverRequest){
      this.awaitOperation(requestId,{type});
    }
    const clientRows = this.dataWindow.hasAllRowsWithinRange
      ? this.getClientRows(true)
      : undefined;
    return [serverRequest, clientRows];
  }

  handleUpdate(updateType, rowIndex, row) {
    if (this.rowCount !== row.vpSize) {
      this.rowCount = row.vpSize;
      this.rowCountChanged = true;
    }
    if (updateType === 'U') {
      if (this.dataWindow.isWithinRange(rowIndex)) {
        // We need an additional check isWithinClientViewport
        if (this.dataWindow.isWithinClientRange(rowIndex)){
          this.hasUpdates = true;
        }
        this.dataWindow.setAtIndex(rowIndex, row);
      }
    }
  }


  getRowCount = () => {
    if (this.rowCountChanged) {
      this.rowCountChanged = false;
      return this.rowCount;
    }
  }

  // TODO do we only return a client rowset when server range matches client range ?
  getClientRows(force) {
    const readyToSendRows = force || (this.hasUpdates && this.dataWindow.hasAllRowsWithinRange);
    if (readyToSendRows) {
      const records = this.dataWindow.getData();
      const clientRows = [];
      const { keys } = this;

      if (force || this.requiresKeyAssignment) {
        keys.reset(this.dataWindow.clientRange);
        this.requiresKeyAssignment = false;
      }

      for (let { rowIndex, rowKey, sel: isSelected, data } of records) {
        clientRows.push([rowIndex, keys.keyFor(rowIndex), true, null, null, 1, rowKey, isSelected].concat(data))
      }
      this.hasUpdates = false;
      return clientRows;
    }
  }
}