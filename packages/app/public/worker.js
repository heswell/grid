const logColor = {
  plain : 'color: black; font-weight: normal',
  blue : 'color: blue; font-weight: bold',
  brown : 'color: brown; font-weight: bold',
  green : 'color: green; font-weight: bold',
};

const {plain} = logColor;
const createLogger = (source, labelColor=plain, msgColor=plain) => ({
  log: (msg, args='') => console.log(`[${Date.now()}]%c[${source}] %c${msg}`,labelColor, msgColor, args),
  warn: (msg) => console.warn(`[${source}] ${msg}`)
});

const logger$1 = createLogger('WebsocketConnection', logColor.brown);

const connectionAttempts = {};

const setWebsocket = Symbol('setWebsocket');
const connectionCallback = Symbol('connectionCallback');

async function connect(connectionString, callback, connectionStatusCallback) {
    return makeConnection(connectionString, msg => {
      const {type} = msg;
      if (type === 'connection-status'){
        connectionStatusCallback(msg);
      } else if (type === 'HB'){
          console.log(`swallowing HB in WebsocketConnection`);
      } else if (type === 'Welcome'){
        // Note: we are actually resolving the connection before we get this session message
        logger$1.log(`Session established clientId: ${msg.clientId}`);
      } else {
        callback(msg);
      }
    });
}

async function reconnect(connection){
  console.log(`reconnect connection at ${connection.url}`);
  makeConnection(connection.url, connection[connectionCallback], connection);
}

async function makeConnection(url, callback, connection){

  const connectionStatus = connectionAttempts[url] || (connectionAttempts[url] = {
    attemptsRemaining: 5,
    status: 'not-connected'
  });

  try {
    callback({type: 'connection-status', status: 'connecting'});
    const reconnecting = typeof connection !== 'undefined';
    const ws = await createWebsocket(url);

    console.log(`%c⚡ %c${url}`, 'font-size: 24px;color: green;font-weight: bold;','color:green; font-size: 14px;');

    if (reconnecting){
      connection[setWebsocket](ws);
    } else {
      connection = new Connection(ws, url, callback);
    }

    const status = reconnecting ? 'reconnected' : 'connected';

    callback({type: 'connection-status', status});

    connection.status = status;

    return connection;

  } catch(evt){
    const retry = --connectionStatus.attemptsRemaining > 0;
    callback({type: 'connection-status', status: 'not-connected', reason: 'failed to connect', retry});
    if (retry){
      return makeConnectionIn(url, callback, connection, 10000);
    }
  }
}

const makeConnectionIn = (url, callback, connection, delay) => new Promise(resolve => {
  setTimeout(() => {
    resolve(makeConnection(url, callback, connection));
  }, delay);
});

const createWebsocket = connectionString => new Promise((resolve, reject) => {
  //TODO add timeout
    const ws = new WebSocket('ws://' + connectionString);
    ws.onopen = () => resolve(ws);
    ws.onerror = evt => reject(evt);
});

// TEST DATA COLLECTION
const websocket_messages = [];
const getWebsocketData = () => {
  const messages = websocket_messages.slice();
  websocket_messages.length = 0;
  return messages;
};

class Connection {

  constructor(ws, url, callback) {

    this.url = url;
    this[connectionCallback] = callback;
    this[setWebsocket](ws);
    this.status = 'ready';

  }

  reconnect(){
    reconnect(this);
  }

  [setWebsocket](ws){

    const callback = this[connectionCallback];

    ws.onmessage = evt => {
      // TEST DATA COLLECTION
      // if (!/"type":"HB"/.test(evt.data)){
      //   websocket_messages.push(evt.data);
      // }
      const message = JSON.parse(evt.data);
      // console.log(`%c<<< [${new Date().toISOString().slice(11,23)}]  (WebSocket) ${message.type || JSON.stringify(message)}`,'color:white;background-color:blue;font-weight:bold;');
      callback(message);
    };

    ws.onerror = evt => {
      console.log(`%c⚡ %c${this.url}`, 'font-size: 24px;color: red;font-weight: bold;','color:red; font-size: 14px;');
      callback({type: 'connection-status', status: 'disconnected', reason: 'error'});
      if (this.status !== 'closed'){
        reconnect(this);
        this.send = queue;
      }
    };

    ws.onclose = evt => {
      console.log(`%c⚡ %c${this.url}`, 'font-size: 24px;color: orange;font-weight: bold;','color:orange; font-size: 14px;');
      callback({type: 'connection-status', status: 'disconnected', reason: 'close'});
      if (this.status !== 'closed'){
        reconnect(this);
        this.send = queue;
      }
    };

    const send = msg => {
      // console.log(`%c>>>  (WebSocket) ${JSON.stringify(msg)}`,'color:blue;font-weight:bold;');
      ws.send(JSON.stringify(msg));
    };

    const warn = msg => {
      logger$1.log(`Message cannot be sent, socket closed: ${msg.type}`);
    };

    const queue = msg => {
      console.log(`queuing message ${JSON.stringify(msg)} until websocket reconnected`);
    };

    this.send = send;

    this.close = () => {
      console.log('[Connection] close websocket');
      this.status = 'closed';
      ws.close();
      this.send = warn;
    };

  }

}

const AUTH = 'AUTH';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const CHANGE_VP_RANGE = 'CHANGE_VP_RANGE';
const CHANGE_VP_RANGE_SUCCESS = 'CHANGE_VP_RANGE_SUCCESS';
const CLOSE_TREE_NODE = "CLOSE_TREE_NODE";
const CREATE_VISUAL_LINK = 'CREATE_VISUAL_LINK';
const CREATE_VP = 'CREATE_VP';
const CREATE_VP_SUCCESS = 'CREATE_VP_SUCCESS';
const GET_TABLE_LIST = "GET_TABLE_LIST";
const GET_TABLE_META = "GET_TABLE_META";
const HB = "HB";
const HB_RESP = "HB_RESP";
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const OPEN_TREE_NODE = "OPEN_TREE_NODE";
const TABLE_META_RESP = 'TABLE_META_RESP';
const TABLE_LIST_RESP = 'TABLE_LIST_RESP';

const TABLE_ROW = 'TABLE_ROW';

class WindowRange {
  constructor(from, to){
    this.from = from;
    this.to = to;
  }

  isWithin(index) {
    return index >= this.from && index < this.to;
  }

  //find the overlap of this range and a new one
  overlap(from, to){
    return (from >= this.to || to < this.from)
      ? [0, 0]
      : [Math.max(from, this.from), Math.min(to, this.to)]
  }

  copy(){
    return new WindowRange(this.from, this.to);
  }
}

class ArrayBackedMovingWindow {

  constructor(bufferSize){
    this.range = new WindowRange(0, bufferSize);
    //internal data is always 0 based, we add range.from to determine an offset
    this.internalData = new Array(bufferSize);
    this.rowsWithinRange = 0;
  }

  get hasAllRowsWithinRange(){
    return this.rowsWithinRange === this.range.to - this.range.from;
  }

  setAtIndex(index, data){
    //onsole.log(`ingest row at rowIndex ${index} [${index - this.range.from}]`)
    if(this.isWithinRange(index)){
      const internalIndex = index - this.range.from;
      if (!this.internalData[internalIndex]){
        this.rowsWithinRange += 1;
        //onsole.log(`rowsWithinRange is now ${this.rowsWithinRange} out of ${this.range.to - this.range.from}`)
      }
      this.internalData[internalIndex] = data;
    }
  }

  getAtIndex(index){
      return this.range.isWithin(index) && this.internalData[index - this.range.from] != null
        ? this.internalData[index - this.range.from]
        : undefined;
  }

  isWithinRange(index){
    return this.range.isWithin(index);
  }

  setRange(from, to){
      const [overlapFrom, overlapTo] = this.range.overlap(from, to);

      const newData = new Array(to - from);
      this.rowsWithinRange = 0;

      for (let i=overlapFrom; i < overlapTo; i++){
        const data = this.getAtIndex(i);
        if (data){
          newData[i - from] = data;
          this.rowsWithinRange += 1;
        }
      }

      this.internalData = newData;
      this.range.from = from;
      this.range.to = to;
  }

  getData(lo=this.range.from, hi=this.range.to){
    const {from, to} = this.range;
    const startOffset = Math.max(0, lo - from);
    const endOffset = Math.min(to-from, to, hi - from);
    //onsole.log(`MovingWindow getData (${lo}, ${hi}) range = ${from} ${to} , so start=${startOffset}, end=${endOffset}`)
    return this.internalData.slice(startOffset,endOffset);
  }

  getRange(){
    return this.range.copy();
  }
}

let _requestId = 1;
const nextRequestId = () => `${_requestId++}`;

class ServerProxy {

  constructor(connection, callback) {
    this.connection = connection;
    this.postMessageToClient = callback;

    this.viewports = new Map();
    this.mapClientToServerViewport = new Map();
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: AUTH, username, password }, "");
      this.pendingAuthentication = { resolve, reject };
    })
  }

  async login() {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: LOGIN, token: this.loginToken, user: "user" }, "");
      this.pendingLogin = { resolve, reject };
    })
  }

  subscribe(message) {
    const viewport = new Viewport(message);
    this.viewports.set(message.viewport, viewport);
    // use client side viewport as request id, so that when we process the response,
    // with the serverside viewport we can establish a mapping between the two
    const isReady = this.sessionId !== "";
    this.sendIfReady(viewport.subscribe(), message.viewport, isReady);

  }

  handleMessageFromClient(message) {
    const {type, viewport: clientViewportId} = message;
    const serverViewportId = this.mapClientToServerViewport.get(clientViewportId);
    const viewport = this.viewports.get(serverViewportId);
    if (!viewport) {
      switch (type) {
        case GET_TABLE_LIST:
          this.sendMessageToServer({ type }, message.requestId);
          break;
        case GET_TABLE_META:
          this.sendMessageToServer({ type, table: message.table }, message.requestId);
          break;
      }
      return;
    }
    const isReady = viewport.status === 'subscribed';

    switch (message.type) {
      case 'setViewRange':
        this.sendIfReady({
          type: CHANGE_VP_RANGE,
          viewPortId: viewport.serverViewportId,
          from: message.range.lo,
          to: message.range.hi
        },
          _requestId++,
          isReady);
        break;

      case 'sort': {
        const requestId = nextRequestId();
        const request = viewport.sortRequest(requestId, message.sortCriteria);
        this.sendIfReady(request, requestId, isReady);
      }
        break

      case 'groupBy': {
        const requestId = nextRequestId();
        const request = viewport.groupByRequest(requestId, message.groupBy);
        this.sendIfReady(request, requestId, isReady);
      }
        break;

      case 'filterQuery': {
        const requestId = nextRequestId();
        const request = viewport.filterRequest(requestId, message.filter);
        this.sendIfReady(request, requestId, isReady);
      }
        break;

      case 'select': {
        const requestId = nextRequestId();
        const { row, rangeSelect, keepExistingSelection } = message;
        const request = viewport.selectRequest(requestId, row, rangeSelect, keepExistingSelection);
        this.sendIfReady(request, requestId, isReady);
      }
        break;

      case 'disable': {
        const requestId = nextRequestId();
        const request = viewport.disable(requestId);
        this.sendIfReady(request, requestId, isReady);
      }
        break;

      case 'enable': {
        const requestId = nextRequestId();
        const request = viewport.enable(requestId);
        this.sendIfReady(request, requestId, isReady);
      }
        break;

      case 'openTreeNode':
        this.sendIfReady({
          type: OPEN_TREE_NODE,
          vpId: viewport.serverViewportId,
          treeKey: message.key
        },
          _requestId++,
          isReady);
        break;

      case 'closeTreeNode':
        this.sendIfReady({
          type: CLOSE_TREE_NODE,
          vpId: viewport.serverViewportId,
          treeKey: message.key
        },
          _requestId++,
          isReady);

        break;


      case "createLink": {
        const { parentVpId, childVpId, parentColumnName, childColumnName } = message;
        this.sendIfReady({
          type: CREATE_VISUAL_LINK,
          parentVpId,
          childVpId,
          parentColumnName,
          childColumnName
        },
          _requestId++,
          isReady);
      }
        break;

      default:
        console.log(`Vuu ServerProxy Unexpected message from client ${JSON.stringify(message)}`);

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

      case HB:
        this.sendMessageToServer({ type: HB_RESP, ts: +(new Date()) }, "NA");
        break;

      case AUTH_SUCCESS:
        this.loginToken = message.token;
        this.pendingAuthentication.resolve(message.token);
        break;

      case LOGIN_SUCCESS:
        this.sessionId = message.sessionId;
        this.pendingLogin.resolve(message.sessionId);
        break;

      case CREATE_VP_SUCCESS:
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

      case TABLE_ROW:
        for (const row of body.rows) {
          const { viewPortId, rowIndex, updateType } = row;
          viewports.get(viewPortId).handleUpdate(updateType, rowIndex, row);
        }
        this.processUpdates();
        break;

      case CHANGE_VP_RANGE_SUCCESS: {
        const { viewPortId, from, to } = body;
        viewports.get(viewPortId).setRange(from, to);
      }
        break;

      case TABLE_LIST_RESP:
        this.postMessageToClient({ type, tables: body.tables, requestId });
        break;
      case TABLE_META_RESP:
        this.postMessageToClient({ type, table: body.table, columns: body.columns, requestId });
        break;


      default:
        console.log(`handleMessageFromServer,${body.type}.`);
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
      type: CREATE_VP,
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
    `, 'color: blue');
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
        clientRows.push([rowIndex, keys.keyFor(rowIndex), true, null, null, 1, rowKey, isSelected].concat(data));
      }
      this.requiresKeyAssignment = false;

    } else {
      for (let { rowIndex, rowKey, sel: isSelected, data } of records) {
        clientRows.push([rowIndex, 0, true, null, null, 1, rowKey, isSelected].concat(data));
      }
    }

    this.hasUpdates = false;
    return clientRows;
  }
}

class KeySet {
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

/* eslint-disable no-restricted-globals */
const url = new URL(self.location);
const urlParams = url.hash.slice(2);
console.log(`urlParams: ${urlParams}`);


const logger = createLogger('Worker', logColor.brown);

let server;

async function connectToServer(url) {

  const connection = await connect(
    url,
    // if this was called during connect, we would get a ReferenceError, but it will
    // never be called until subscriptions have been made, so this is safe.
    msg => server.handleMessageFromServer(msg),
    msg => logger.log(JSON.stringify(msg))
    // msg => {
    //   onConnectionStatusMessage(msg);
    //   if (msg.status === 'disconnected'){
    //     server.disconnected();
    //   } else if (msg.status === 'reconnected'){
    //     server.resubscribeAll();
    //   }
    // }
  );
  server = new ServerProxy(connection, msg => postMessage(msg));
  // TODO handle authentication, login
  if (typeof server.authenticate === 'function') {
    await server.authenticate('steve', 'pword');
  }
  if (typeof server.login === 'function') {
    await server.login();
  }

}

const handleMessageFromClient = async ({ data: message }) => {
  switch (message.type) {
    case 'connect':
      await connectToServer(message.url);
      postMessage({ type: 'connected' });
      break;
    case 'subscribe':
      server.subscribe(message);
      break;
    case 'unsubscribe':
      server.unsubscribe(message.viewport);
      break;
    // TEST DATA COLLECTION
    case 'send-websocket-data':
      postMessage({type: "websocket-data", data: getWebsocketData()});
      break;
    default:
      server.handleMessageFromClient(message);
    }
};

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('message',handleMessageFromClient);

postMessage({ type: "ready" });
//# sourceMappingURL=worker.js.map
