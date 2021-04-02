import * as Message from './messages';
import { ArrayBackedMovingWindow } from "./array-backed-moving-window";

let _requestId = 1;
const nextRequestId = () => `${_requestId++}`;

export class ServerProxy {

  constructor(connection, callback) {
    this.connection = connection;
    this.postMessageToClient = callback;

    this.viewports = new Map();
    this.mapClientToServerViewport = new Map();
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: Message.AUTH, username, password }, "");
      this.pendingAuthentication = { resolve, reject }
    })
  }

  async login() {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: Message.LOGIN, token: this.loginToken, user: "user" }, "");
      this.pendingLogin = { resolve, reject }
    })
  }

  subscribe(message) {
    const viewport = new Viewport(message);
    this.viewports.set(message.viewport, viewport);
    // use client side viewport as request id, so that when we process the response,
    // with the serverside viewport we can establish a mapping between the two
    const isReady = this.sessionId !== "";
    this.sendIfReady(viewport.subscribe(), message.viewport, isReady)

  }

  handleMessageFromClient(message) {
    const {type, viewport: clientViewportId} = message;
    const serverViewportId = this.mapClientToServerViewport.get(clientViewportId);
    const viewport = this.viewports.get(serverViewportId);
    if (!viewport) {
      switch (type) {
        case Message.GET_TABLE_LIST:
          this.sendMessageToServer({ type }, message.requestId)
          break;
        case Message.GET_TABLE_META:
          this.sendMessageToServer({ type, table: message.table }, message.requestId)
          break;
        default:
      }
      return;
    }
    const isReady = viewport.status === 'subscribed';

    switch (message.type) {
      case 'setViewRange':
        this.sendIfReady({
          type: Message.CHANGE_VP_RANGE,
          viewPortId: viewport.serverViewportId,
          from: message.range.lo,
          to: message.range.hi
        },
          _requestId++,
          isReady)
        break;

      case 'sort': {
        const requestId = nextRequestId();
        const request = viewport.sortRequest(requestId, message.sortCriteria)
        this.sendIfReady(request, requestId, isReady)
      }
        break

      case 'groupBy': {
        const requestId = nextRequestId();
        const request = viewport.groupByRequest(requestId, message.groupBy)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'filterQuery': {
        const requestId = nextRequestId();
        const request = viewport.filterRequest(requestId, message.filter)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'select': {
        const requestId = nextRequestId();
        const { row, rangeSelect, keepExistingSelection } = message;
        const request = viewport.selectRequest(requestId, row, rangeSelect, keepExistingSelection)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'disable': {
        const requestId = nextRequestId();
        const request = viewport.disable(requestId)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'enable': {
        const requestId = nextRequestId();
        const request = viewport.enable(requestId)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'openTreeNode':
        this.sendIfReady({
          type: Message.OPEN_TREE_NODE,
          vpId: viewport.serverViewportId,
          treeKey: message.key
        },
          _requestId++,
          isReady)
        break;

      case 'closeTreeNode':
        this.sendIfReady({
          type: Message.CLOSE_TREE_NODE,
          vpId: viewport.serverViewportId,
          treeKey: message.key
        },
          _requestId++,
          isReady)

        break;


      case "createLink": {
        const { parentVpId, childVpId, parentColumnName, childColumnName } = message;
        this.sendIfReady({
          type: Message.CREATE_VISUAL_LINK,
          parentVpId,
          childVpId,
          parentColumnName,
          childColumnName
        },
          _requestId++,
          isReady)
      }
        break;

      default:
        console.log(`Vuu ServerProxy Unexpected message from client ${JSON.stringify(message)}`)

    }

  }

  sendIfReady(message, requestId, isReady = true) {
    // TODO implement the message queuing in remote data view
    if (isReady) {
      this.sendMessageToServer(message, requestId);
    } else {
      // TODO need to make sure we keep the requestId
      this.queuedRequests.push(message);
    }
    return isReady;
  }

  sendMessageToServer(body, requestId = _requestId++) {
    // const { clientId } = this.connection;
    this.connection.send({
      requestId,
      sessionId: this.sessionId,
      token: this.loginToken,
      user: "user",
      module: "CORE",
      body
    });
  }


  handleMessageFromServer(message) {
    const { requestId, body: {type, ...body} } = message;
    const { viewports } = this;
    switch (type) {

      case Message.HB:
        this.sendMessageToServer({ type: Message.HB_RESP, ts: +(new Date()) }, "NA");
        break;

      case Message.AUTH_SUCCESS:
        this.loginToken = message.token;
        this.pendingAuthentication.resolve(message.token);
        break;

      case Message.LOGIN_SUCCESS:
        this.sessionId = message.sessionId;
        this.pendingLogin.resolve(message.sessionId);
        break;

      case Message.CREATE_VP_SUCCESS:
        // The clientViewportId was used as requestId for CREATE_VPmessage
        if (viewports.has(requestId)) {
          const viewport = viewports.get(requestId);
          const { viewPortId: serverViewportId } = body;
          viewports.set(serverViewportId, viewport);
          viewports.delete(requestId);
          this.mapClientToServerViewport.set(requestId, serverViewportId);
          viewport.handleSubscribed(body);
        }
        break;

      case Message.TABLE_ROW:
        for (const row of body.rows) {
          const { viewPortId, rowIndex, updateType } = row;
          viewports.get(viewPortId).handleUpdate(updateType, rowIndex, row);
        }
        this.processUpdates();
        break;

      case Message.CHANGE_VP_RANGE_SUCCESS: {
        const { viewPortId, from, to } = body;
        viewports.get(viewPortId).setRange(from, to);
      }
        break;

      case Message.TABLE_LIST_RESP:
        this.postMessageToClient({ type, tables: body.tables, requestId });
        break;
      case Message.TABLE_META_RESP:
        this.postMessageToClient({ type, table: body.table, columns: body.columns, requestId });
        break;


      default:
        console.log(`handleMessageFromServer,${body.type}.`)
    }
  }


  processUpdates() {
    let clientMessage;
    this.viewports.forEach((viewport) => {
      if (viewport.shouldUpdateClient) {
        clientMessage = clientMessage || { type: "viewport-updates", viewports: {} };
        clientMessage.viewports[viewport.clientViewportId] = viewport.getClientRows();
      }
    });
    if (clientMessage) {
      this.postMessageToClient(clientMessage);
    }
  }

}


// const time = ts => {
//   const date = new Date(ts);
//   return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMilliseconds()}`
// }

class Viewport {
  constructor({ viewport, tablename, columns, range }) {
    this.clientViewportId = viewport;
    this.table = tablename;
    this.status = '';
    this.columns = columns;
    this.clientRange = range;
    this.sort = undefined;
    this.groupBy = undefined;
    this.filterSpec = {
      filter: ""
    };
    this.isTree = false;
    this.dataWindow = undefined;
    this.rowCount = 0;
    this.keys = new KeySet();

    this.hasUpdates = false;
    this.requiresKeyAssignment = true;

  }

  get shouldUpdateClient() {
    return this.hasUpdates && this.dataWindow.hasAllRowsWithinRange;
  }

  subscribe(){
    return {
      type: Message.CREATE_VP,
      table: this.table,
      range: {
        from: this.clientRange.lo,
        to: this.clientRange.hi
      },
      columns: this.columns,
      sort: {
        sortDefs: this.sort
      },
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
    this.dataWindow = new ArrayBackedMovingWindow(range.to - range.from);

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

  setRange(lo, hi) {
    this.dataWindow.setRange(lo, hi);
    this.requiresKeyAssignment = true;
    this.hasUpdates = true;
    //onsole.log(`after %csetRange%c ${lo} ${hi}, rowsWithinRange ${this.dataWindow.rowsWithinRange} hasAllRowsWithinRange ? ${this.dataWindow.hasAllRowsWithinRange}`,'color: blue;font-weight: bold;','');
    //onsole.table(this.dataWindow.internalData)

  }

  handleUpdate(updateType, rowIndex, row) {
    this.rowCount = row.vpSize;
    if (updateType === 'U') {
      if (this.dataWindow.isWithinRange(rowIndex)) {
        // We need an additional check isWithinClientViewport
        this.hasUpdates = true;
        this.dataWindow.setAtIndex(rowIndex, row);
      }
    }
  }

  // TODO do we only return a client rowset when server range matches client range ?
  getClientRows() {
    // const { lo, hi } = this.clientRange;
    const records = this.dataWindow.getData();
    const clientRows = [];

    if (this.requiresKeyAssignment) {
      const { from, to } = this.dataWindow.range;
      const keys = this.keys.reset(from, to);
      for (let { rowIndex, rowKey, sel: isSelected, data } of records) {
        clientRows.push([rowIndex, keys.keyFor(rowIndex), true, null, null, 1, rowKey, isSelected].concat(data))
      }
      this.requiresKeyAssignment = false;

    } else {
      for (let { rowIndex, rowKey, sel: isSelected, data } of records) {
        clientRows.push([rowIndex, 0, true, null, null, 1, rowKey, isSelected].concat(data))
      }
    }

    this.hasUpdates = false;
    return clientRows;
  }
}

export class KeySet {
  constructor() {
    this.keys = new Map();
    this.free = [];
    this.nextKeyValue = 0;
  }

  next() {
    if (this.free.length) {
      return this.free.pop();
    } else {
      return this.nextKeyValue++;
    }
  }

  reset(lo, hi) {
    this.keys.forEach((keyValue, rowIndex) => {
      if (rowIndex < lo || rowIndex >= hi) {
        this.free.push(keyValue);
        this.keys.delete(rowIndex);
      }
    });
    for (let rowIndex = lo; rowIndex < hi; rowIndex++) {
      if (!this.keys.has(rowIndex)) {
        const nextKeyValue = this.next();
        this.keys.set(rowIndex, nextKeyValue);
      }
    }
    return this;
  }

  keyFor(rowIndex) {
    return this.keys.get(rowIndex)
  }
}
