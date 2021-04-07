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

const data = [];

const saveTestData = (message, source) => {
  // if (source === 'server' && (
  //   HB.test(message) ||
  //   AUTH_SUCCESS.test(message) ||
  //   LOGIN_SUCCESS.test(message) ||
  //   TABLE_LIST.test(message) ||
  //   TABLE_META.test(message)
  //   )) {
  //   return;
  // } else if (source === 'client') {
  //   if (message.type.startsWith("GET_TABLE_")){
  //     return
  //   }


  //   message = JSON.stringify(message);
  // }
  // data.push(message);
};

const getTestMessages = () => {
  const messages = data.slice();
  data.length = 0;
  return messages;
};

const logger$1 = createLogger('WebsocketConnection', logColor.brown);

const connectionAttempts = {};

const setWebsocket = Symbol('setWebsocket');
const connectionCallback = Symbol('connectionCallback');

async function connect(
  connectionString,
  callback,
  connectionStatusCallback,
) {
  return makeConnection(connectionString, (msg) => {
    const { type } = msg;
    if (type === 'connection-status') {
      connectionStatusCallback(msg);
    } else if (type === 'HB') {
      console.log(`swallowing HB in WebsocketConnection`);
    } else if (type === 'Welcome') {
      // Note: we are actually resolving the connection before we get this session message
      logger$1.log(`Session established clientId: ${msg.clientId}`);
    } else {
      callback(msg);
    }
  });
}

async function reconnect(connection) {
  console.log(`reconnect connection at ${connection.url}`);
  makeConnection(connection.url, connection[connectionCallback], connection);
}

async function makeConnection(url, callback, connection) {
  const connectionStatus =
    connectionAttempts[url] ||
    (connectionAttempts[url] = {
      attemptsRemaining: 5,
      status: 'not-connected',
    });

  try {
    callback({ type: 'connection-status', status: 'connecting' });
    const reconnecting = typeof connection !== 'undefined';
    const ws = await createWebsocket(url);

    console.log(
      `%c⚡ %c${url}`,
      'font-size: 24px;color: green;font-weight: bold;',
      'color:green; font-size: 14px;',
    );

    if (reconnecting) {
      connection[setWebsocket](ws);
    } else {
      connection = new Connection(ws, url, callback);
    }

    const status = reconnecting ? 'reconnected' : 'connected';

    callback({ type: 'connection-status', status });

    connection.status = status;

    return connection;
  } catch (evt) {
    const retry = --connectionStatus.attemptsRemaining > 0;
    callback({
      type: 'connection-status',
      status: 'not-connected',
      reason: 'failed to connect',
      retry,
    });
    if (retry) {
      return makeConnectionIn(url, callback, connection, 10000);
    }
  }
}

const makeConnectionIn = (url, callback, connection, delay) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(makeConnection(url, callback, connection));
    }, delay);
  });

const createWebsocket = (connectionString) =>
  new Promise((resolve, reject) => {
    //TODO add timeout
    const ws = new WebSocket('ws://' + connectionString);
    ws.onopen = () => resolve(ws);
    ws.onerror = (evt) => reject(evt);
  });

class Connection {
  constructor(ws, url, callback) {
    this.url = url;
    this[connectionCallback] = callback;
    this[setWebsocket](ws);
    this.status = 'ready';
  }

  reconnect() {
    reconnect(this);
  }

  [setWebsocket](ws) {
    const callback = this[connectionCallback];

    ws.onmessage = (evt) => {
      // TEST DATA COLLECTION
        saveTestData(evt.data);
      const message = JSON.parse(evt.data);
      // console.log(`%c<<< [${new Date().toISOString().slice(11,23)}]  (WebSocket) ${message.type || JSON.stringify(message)}`,'color:white;background-color:blue;font-weight:bold;');
      callback(message);
    };

    ws.onerror = (evt) => {
      console.log(
        `%c⚡ %c${this.url}`,
        'font-size: 24px;color: red;font-weight: bold;',
        'color:red; font-size: 14px;',
      );
      callback({
        type: 'connection-status',
        status: 'disconnected',
        reason: 'error',
      });
      if (this.status !== 'closed') {
        reconnect(this);
        this.send = queue;
      }
    };

    ws.onclose = (evt) => {
      console.log(
        `%c⚡ %c${this.url}`,
        'font-size: 24px;color: orange;font-weight: bold;',
        'color:orange; font-size: 14px;',
      );
      callback({
        type: 'connection-status',
        status: 'disconnected',
        reason: 'close',
      });
      if (this.status !== 'closed') {
        reconnect(this);
        this.send = queue;
      }
    };

    const send = (msg) => {
      // console.log(`%c>>>  (WebSocket) ${JSON.stringify(msg)}`,'color:blue;font-weight:bold;');
      ws.send(JSON.stringify(msg));
    };

    const warn = (msg) => {
      logger$1.log(`Message cannot be sent, socket closed: ${msg.type}`);
    };

    const queue = (msg) => {
      console.log(
        `queuing message ${JSON.stringify(msg)} until websocket reconnected`,
      );
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
const CHANGE_VP = 'CHANGE_VP';
const CHANGE_VP_SUCCESS = 'CHANGE_VP_SUCCESS';
const CHANGE_VP_RANGE = 'CHANGE_VP_RANGE';
const CHANGE_VP_RANGE_SUCCESS = 'CHANGE_VP_RANGE_SUCCESS';
const CLOSE_TREE_NODE = "CLOSE_TREE_NODE";
const CLOSE_TREE_SUCCESS = "CLOSE_TREE_SUCCESS";
const CREATE_VISUAL_LINK = 'CREATE_VISUAL_LINK';
const CREATE_VISUAL_LINK_SUCCESS = 'CREATE_VISUAL_LINK_SUCCESS';
const CREATE_VP = 'CREATE_VP';
const CREATE_VP_SUCCESS = 'CREATE_VP_SUCCESS';
const DISABLE_VP = "DISABLE_VP";
const DISABLE_VP_SUCCESS = "DISABLE_VP_SUCCESS";
const ENABLE_VP = "ENABLE_VP";
const ENABLE_VP_SUCCESS = "ENABLE_VP_SUCCESS";
const GET_TABLE_LIST = "GET_TABLE_LIST";
const GET_TABLE_META = "GET_TABLE_META";
const HB = "HB";
const HB_RESP = "HB_RESP";
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const OPEN_TREE_NODE = "OPEN_TREE_NODE";
const OPEN_TREE_SUCCESS = "OPEN_TREE_SUCCESS";
const SET_SELECTION = 'SET_SELECTION';
const SET_SELECTION_SUCCESS = 'SET_SELECTION_SUCCESS';
const TABLE_META_RESP = 'TABLE_META_RESP';
const TABLE_LIST_RESP = 'TABLE_LIST_RESP';

const TABLE_ROW = 'TABLE_ROW';

const metadataKeys = {
    IDX: 0,
    RENDER_IDX: 1,
    IS_LEAF: 2,
    IS_EXPANDED: 3,
    DEPTH: 4,
    COUNT: 5,
    KEY: 6,
    SELECTED: 7,
    // PARENT_IDX: 8,
    // IDX_POINTER: 9,
    // FILTER_COUNT: 10,
    // NEXT_FILTER_IDX: 11,
    count: 8
};

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

  reset({from, to}) {
    this.keys.forEach((keyValue, rowIndex) => {
      if (rowIndex < from || rowIndex >= to) {
        this.free.push(keyValue);
        this.keys.delete(rowIndex);
      }
    });
    for (let rowIndex = from; rowIndex < to; rowIndex++) {
      if (!this.keys.has(rowIndex)) {
        const nextKeyValue = this.next();
        this.keys.set(rowIndex, nextKeyValue);
      }
    }
  }

  keyFor(rowIndex) {
    return this.keys.get(rowIndex)
  }
}

function getFullRange({lo,hi}, bufferSize=0, rowCount=Number.MAX_SAFE_INTEGER){
  if (bufferSize === 0){
    return {from: lo, to: Math.min(hi, rowCount)};
  } else if (lo === 0){
    return {from: lo, to: Math.min(hi + bufferSize, rowCount)};
  } else {
    const rangeSize = hi - lo;
    const buff = Math.round(bufferSize / 2);
    const shortfallBefore = lo - buff < 0;
    const shortFallAfter = rowCount - (hi + buff) < 0;

    if (shortfallBefore && shortFallAfter){
      return {from: 0, to: rowCount}
    } else if (shortfallBefore){
      return {from: 0, to: rangeSize + bufferSize}
    } else if (shortFallAfter){
      return {from: Math.max(0,rowCount - (rangeSize + bufferSize)), to: rowCount}
    } else {
      return {from: lo-buff, to: hi + buff}
    }
  }
}


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
  // Note, the buffer is already accounted for in the range passed in here
  constructor({ lo, hi }, { from, to }, bufferSize) {
    this.bufferSize = bufferSize;
    this.clientRange = new WindowRange(lo, hi);
    this.range = new WindowRange(from, to);
    //internal data is always 0 based, we add range.from to determine an offset
    this.internalData = new Array(bufferSize);
    this.rowsWithinRange = 0;
    this.rowCount = 0;
  }

  get hasAllRowsWithinRange() {
    return (
      this.rowsWithinRange === this.clientRange.to - this.clientRange.from ||
      (this.rowCount > 0 && this.rowsWithinRange === this.rowCount)
    );
  }

  setRowCount = (rowCount) => {
    if (rowCount < this.internalData.length) {
      this.internalData.length = rowCount;
    }
    if (rowCount < this.rowCount) {
      // Brute force, works
      this.rowsWithinRange = 0;
      const end = Math.max(rowCount, this.clientRange.to);
      for (let i = this.clientRange.from; i < end; i++) {
        const rowIndex = i - this.range.from;
        if (this.internalData[rowIndex] !== undefined) {
          this.rowsWithinRange += 1;
        }
      }
    }
    this.rowCount = rowCount;
  };

  setAtIndex(index, data) {
    //onsole.log(`ingest row at rowIndex ${index} [${index - this.range.from}]`)
    const isWithinClientRange = this.isWithinClientRange(index);
    if (isWithinClientRange || this.isWithinRange(index)) {
      const internalIndex = index - this.range.from;
      if (!this.internalData[internalIndex] && isWithinClientRange) {
        this.rowsWithinRange += 1;
        //onsole.log(`rowsWithinRange is now ${this.rowsWithinRange} out of ${this.range.to - this.range.from}`)
      }
      this.internalData[internalIndex] = data;
    }
    return isWithinClientRange;
  }

  getAtIndex(index) {
    return this.range.isWithin(index) &&
      this.internalData[index - this.range.from] != null
      ? this.internalData[index - this.range.from]
      : undefined;
  }

  isWithinRange(index) {
    return this.range.isWithin(index);
  }

  isWithinClientRange(index) {
    return this.clientRange.isWithin(index);
  }

  setClientRange(from, to) {
    // const originalRange = this.clientRange.copy();
    this.clientRange.from = from;
    this.clientRange.to = to;
    this.rowsWithinRange = 0;
    for (let i = from; i < to; i++) {
      const internalIndex = i - this.range.from;
      if (this.internalData[internalIndex]) {
        this.rowsWithinRange += 1;
      }
    }

    // let clientRows = undefined;
    // if (this.hasAllRowsWithinRange){
    //   const offset = this.range.from;
    //   if (to > originalRange.to){
    //     const start = Math.max(from, originalRange.to);
    //     clientRows = this.internalData.slice(start-offset, to-offset);
    //   } else {
    //     const end = Math.min(originalRange.to, to);
    //     clientRows = this.internalData.slice(from-offset, end);
    //   }
    // }

    let serverDataRequired = false;

    // Is data required from server ... how close are we to buffer threshold ?
    const bufferPerimeter = this.bufferSize * 0.25;
    if (this.range.to - to < bufferPerimeter) {
      serverDataRequired = true;
    } else if (
      this.range.from > 0 &&
      from - this.range.from < bufferPerimeter
    ) {
      serverDataRequired = true;
    }

    return [serverDataRequired];
  }

  setRange(from, to) {
    const [overlapFrom, overlapTo] = this.range.overlap(from, to);

    const newData = new Array(to - from + this.bufferSize);
    this.rowsWithinRange = 0;

    for (let i = overlapFrom; i < overlapTo; i++) {
      const data = this.getAtIndex(i);
      if (data) {
        const index = i - from;
        newData[index] = data;
        if (this.isWithinClientRange(i)) {
          this.rowsWithinRange += 1;
        }
      }
    }

    this.internalData = newData;
    this.range.from = from;
    this.range.to = to;
  }

  getData() {
    const { from, to } = this.range;
    const { from: lo, to: hi } = this.clientRange;
    const startOffset = Math.max(0, lo - from);
    const endOffset = Math.min(to - from, to, hi - from, this.rowCount);
    // const endOffset = Math.min(to-from, to, hi - from, this.rowCount);
    //onsole.log(`MovingWindow getData (${lo}, ${hi}) range = ${from} ${to} , so start=${startOffset}, end=${endOffset}`)
    return this.internalData.slice(startOffset, endOffset);
  }
}

const { IDX, SELECTED } = metadataKeys;
const EMPTY_ARRAY$1 = [];

class Viewport {
  constructor({
    viewport,
    tablename,
    columns,
    range,
    bufferSize = 0,
    filter = '',
    sort = [],
    groupBy = [],
  }) {
    this.clientViewportId = viewport;
    this.table = tablename;
    this.status = '';
    this.columns = columns;
    this.clientRange = range;
    this.bufferSize = bufferSize;
    this.sort = {
      sortDefs: sort,
    };
    this.groupBy = groupBy;
    this.filterSpec = {
      filter,
    };
    this.isTree = false;
    this.dataWindow = undefined;
    this.rowCountChanged = false;
    this.keys = new KeySet();
    this.pendingOperations = new Map();
    this.hasUpdates = false;
    this.requiresKeyAssignment = true;
  }

  get shouldUpdateClient() {
    return (
      this.rowCountChanged ||
      (this.hasUpdates && this.dataWindow.hasAllRowsWithinRange)
    );
  }

  subscribe() {
    return {
      type: CREATE_VP,
      table: this.table,
      range: getFullRange(this.clientRange, this.bufferSize),
      columns: this.columns,
      sort: this.sort,
      groupBy: this.groupBy,
      filterSpec: this.filterSpec,
    };
  }

  handleSubscribed({
    viewPortId,
    columns,
    table,
    range,
    sort,
    groupBy,
    filterSpec,
  }) {
    this.serverViewportId = viewPortId;
    this.status = 'subscribed';
    this.columns = columns;
    this.table = table;
    this.range = range;
    this.sort = sort;
    this.groupBy = groupBy;
    this.filterSpec = filterSpec;
    this.isTree = groupBy && groupBy.length > 0;
    this.dataWindow = new ArrayBackedMovingWindow(
      this.clientRange,
      range,
      this.bufferSize,
    );

    // console.log(
    //   `%cViewport subscribed
    //     clientVpId: ${this.clientViewportId}
    //     serverVpId: ${this.serverViewportId}
    //     table: ${this.table}
    //     columns: ${columns.join(',')}
    //     range: ${JSON.stringify(range)}
    //     sort: ${JSON.stringify(sort)}
    //     groupBy: ${JSON.stringify(groupBy)}
    //     filterSpec: ${JSON.stringify(filterSpec)}
    //     bufferSize: ${this.bufferSize}
    //   `,
    //   'color: blue',
    // );
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
    if (type === CHANGE_VP_RANGE) {
      const [from, to] = params;
      this.dataWindow.setRange(from, to);
      // this is only true if client range is affected
      this.requiresKeyAssignment = true;
      this.hasUpdates = true;
    } else if (type === 'groupBy') {
      this.isTree = true;
      this.groupBy = data;
      return { clientViewportId, type, groupBy: data };
    } else if (type === 'groupByClear') {
      this.isTree = false;
      this.groupBy = [];
      return { clientViewportId, type: 'groupBy', groupBy: null };
    } else if (type === 'filter') {
      this.filterSpec = { filter: data };
      return { clientViewportId, type, filter: data };
    } else if (type === 'sort') {
      this.sort = { sortDefs: data };
      return { clientViewportId, type, sort: data };
    } else if (type === 'selection') {
      this.selection = data;
    } else if (type === 'disable') {
      this.suspended = true; // assuming its _SUCCESS, of cource
    } else if (type === 'enable') {
      this.suspended = false;
    }
  }

  rangeRequest(requestId, from, to) {
    // If we can satisfy the range request from the buffer, we will.
    // May or may not need to make a server request, depending on status of buffer
    const type = CHANGE_VP_RANGE;
    const [
      serverDataRequired /*, clientRows*/,
    ] = this.dataWindow.setClientRange(from, to);
    const serverRequest = serverDataRequired
      ? {
          type,
          viewPortId: this.serverViewportId,
          ...getFullRange(
            { lo: from, hi: to },
            this.bufferSize,
            this.dataWindow.rowCount,
          ),
        }
      : undefined;
    if (serverRequest) {
      // TODO check that there os not already a pending server request for more data
      this.awaitOperation(requestId, { type });
    }

    const clientRows = this.dataWindow.hasAllRowsWithinRange
      ? this.getClientRows(true)
      : undefined;
    // TODO don't we need to reset keys here ?
    return [serverRequest, clientRows];

    // if (clientRows){
    //   this.keys.reset(this.dataWindow.clientRange);
    //   return [serverRequest, clientRows.map(row => toClientRow(row, this.keys))];
    // } else {
    //   return [serverRequest]
    // }
  }

  enable(requestId) {
    this.awaitOperation(requestId, { type: 'enable' });
    return {
      type: ENABLE_VP,
      viewPortId: this.serverViewportId,
    };
  }

  disable(requestId) {
    this.awaitOperation(requestId, { type: 'disable' });
    return {
      type: DISABLE_VP,
      viewPortId: this.serverViewportId,
    };
  }

  filterRequest(requestId, filter) {
    this.awaitOperation(requestId, { type: 'filter', data: filter });
    return this.createRequest({ filterSpec: { filter } });
  }

  sortRequest(requestId, sortDefs) {
    this.awaitOperation(requestId, { type: 'sort', data: sortDefs });
    return this.createRequest({ sort: { sortDefs } });
  }

  groupByRequest(requestId, groupBy = EMPTY_ARRAY$1) {
    const type = groupBy === EMPTY_ARRAY$1 ? 'groupByClear' : 'groupBy';
    this.awaitOperation(requestId, { type, data: groupBy });
    return this.createRequest({ groupBy });
  }

  selectRequest(requestId, row, rangeSelect, keepExistingSelection) {
    const singleSelect = !rangeSelect && !keepExistingSelection;
    const selection = row[SELECTED]
      ? singleSelect
        ? []
        : this.selection.filter((idx) => idx !== row[IDX])
      : keepExistingSelection
      ? this.selection.concat(row[IDX])
      : [row[IDX]];

    this.awaitOperation(requestId, { type: 'selection', data: selection });
    return {
      type: SET_SELECTION,
      vpId: this.serverViewportId,
      selection,
    };
  }

  handleUpdate(updateType, rowIndex, row) {
    if (this.dataWindow.rowCount !== row.vpSize) {
      this.dataWindow.setRowCount(row.vpSize);
      this.rowCountChanged = true;
    }
    if (updateType === 'U') {
      // Update will return true if row was within client range
      if (this.dataWindow.setAtIndex(rowIndex, row)) {
        this.hasUpdates = true;
      }
    }
  }

  getRowCount = () => {
    if (this.rowCountChanged) {
      this.rowCountChanged = false;
      return this.dataWindow.rowCount;
    }
  };

  // TODO do we only return a client rowset when server range matches client range ?
  getClientRows(force, timeStamp) {
    const readyToSendRows =
      force || (this.hasUpdates && this.dataWindow.hasAllRowsWithinRange);
    if (readyToSendRows) {
      const records = this.dataWindow.getData();
      const clientRows = [];
      const { keys } = this;
      const toClient = this.isTree ? toClientRowTree : toClientRow;

      if (force || this.requiresKeyAssignment) {
        keys.reset(this.dataWindow.clientRange);
        this.requiresKeyAssignment = false;
      }

      for (let row of records) {
        if (force || row.ts >= timeStamp) {
          clientRows.push(toClient(row, keys));
        }
      }
      this.hasUpdates = false;


      // if (!uniqueKeys(clientRows)){
      //   debugger;
      // }

      // if (clientRows.length > 0 && clientRows.length < (this.dataWindow.clientRange.to - this.dataWindow.clientRange.from)){
      //   console.log(`%conly sending ${clientRows.length} rows to client`,'color:red;font-weight: bold;')
      // }

      return clientRows;
    }
  }

  createRequest(params) {
    return {
      type: CHANGE_VP,
      viewPortId: this.serverViewportId,
      columns: this.columns,
      sort: this.sort,
      groupBy: this.groupBy,
      filterSpec: this.filterSpec,
      ...params,
    };
  }
}

const toClientRow = ({ rowIndex, rowKey, sel: isSelected, data }, keys) =>
  [
    rowIndex,
    keys.keyFor(rowIndex),
    true,
    null,
    null,
    1,
    rowKey,
    isSelected,
  ].concat(data);

const toClientRowTree = ({ rowIndex, rowKey, sel: isSelected, data }, keys) => {
  let [depth, isExpanded, path, isLeaf, label, count, ...rest] = data;
  return [
    rowIndex,
    keys.keyFor(rowIndex),
    isLeaf,
    isExpanded,
    depth,
    count,
    rowKey,
    isSelected,
  ].concat(rest);
};

let _requestId = 1;

const nextRequestId = () => `${_requestId++}`;
const EMPTY_ARRAY = [];
class ServerProxy {
  constructor(connection, callback) {
    this.connection = connection;
    this.postMessageToClient = callback;
    this.viewports = new Map();
    this.mapClientToServerViewport = new Map();
    this.currentTimestamp = undefined;
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: AUTH, username, password }, '');
      this.pendingAuthentication = { resolve, reject };
    });
  }

  async login() {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer(
        { type: LOGIN, token: this.loginToken, user: 'user' },
        '',
      );
      this.pendingLogin = { resolve, reject };
    });
  }

  subscribe(message) {
    const viewport = new Viewport(message);
    this.viewports.set(message.viewport, viewport);
    // use client side viewport as request id, so that when we process the response,
    // with the serverside viewport we can establish a mapping between the two
    const isReady = this.sessionId !== '';
    this.sendIfReady(viewport.subscribe(), message.viewport, isReady);
  }

  handleMessageFromClient(message) {
    const { type, viewport: clientViewportId } = message;
    const serverViewportId = this.mapClientToServerViewport.get(
      clientViewportId,
    );
    //---------------------
    const viewport = this.viewports.get(serverViewportId);
    if (!viewport) {
      switch (type) {
        case GET_TABLE_LIST:
          this.sendMessageToServer({ type }, message.requestId);
          break;
        case GET_TABLE_META:
          this.sendMessageToServer(
            { type, table: message.table },
            message.requestId,
          );
          break;
      }
      return;
    }
    const isReady = viewport.status === 'subscribed';

    switch (message.type) {
      case 'setViewRange':
        const requestId = nextRequestId();
        const [serverRequest, rows] = viewport.rangeRequest(
          requestId,
          message.range.lo,
          message.range.hi,
        );
        if (serverRequest) {
          this.sendIfReady(serverRequest, requestId, isReady);
        }
        if (rows) {
          const clientMessage = {
            type: 'viewport-updates',
            viewports: {
              [viewport.clientViewportId]: { rows },
            },
          };
          this.postMessageToClient(clientMessage);
        }
        break;

      case 'sort':
        {
          const requestId = nextRequestId();
          const request = viewport.sortRequest(requestId, message.sortCriteria);
          this.sendIfReady(request, requestId, isReady);
        }
        break;

      case 'groupBy':
        {
          const requestId = nextRequestId();
          const request = viewport.groupByRequest(requestId, message.groupBy);
          this.sendIfReady(request, requestId, isReady);
        }
        break;

      case 'filterQuery':
        {
          const requestId = nextRequestId();
          const request = viewport.filterRequest(requestId, message.filter);
          this.sendIfReady(request, requestId, isReady);
        }
        break;

      case 'select':
        {
          const requestId = nextRequestId();
          const { row, rangeSelect, keepExistingSelection } = message;
          const request = viewport.selectRequest(
            requestId,
            row,
            rangeSelect,
            keepExistingSelection,
          );
          this.sendIfReady(request, requestId, isReady);
        }
        break;

      case 'disable':
        {
          const requestId = nextRequestId();
          const request = viewport.disable(requestId);
          this.sendIfReady(request, requestId, isReady);
        }
        break;

      case 'enable':
        {
          const requestId = nextRequestId();
          const request = viewport.enable(requestId);
          this.sendIfReady(request, requestId, isReady);
        }
        break;

      case 'openTreeNode':
        this.sendIfReady(
          {
            type: OPEN_TREE_NODE,
            vpId: viewport.serverViewportId,
            treeKey: message.key,
          },
          _requestId++,
          isReady,
        );
        break;

      case 'closeTreeNode':
        this.sendIfReady(
          {
            type: CLOSE_TREE_NODE,
            vpId: viewport.serverViewportId,
            treeKey: message.key,
          },
          _requestId++,
          isReady,
        );

        break;

      case 'createLink':
        {
          const {
            parentVpId,
            childVpId,
            parentColumnName,
            childColumnName,
          } = message;
          this.sendIfReady(
            {
              type: CREATE_VISUAL_LINK,
              parentVpId,
              childVpId,
              parentColumnName,
              childColumnName,
            },
            _requestId++,
            isReady,
          );
        }
        break;

      default:
        console.log(
          `Vuu ServerProxy Unexpected message from client ${JSON.stringify(
            message,
          )}`,
        );
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
      user: 'user',
      module: 'CORE',
      body,
    });
  }

  handleMessageFromServer(message) {
    const {
      requestId,
      body: { type, timeStamp, ...body },
    } = message;
    const { viewports } = this;
    switch (type) {
      case HB:
        this.sendMessageToServer(
          { type: HB_RESP, ts: +new Date() },
          'NA',
        );
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
      case SET_SELECTION_SUCCESS:
        if (viewports.has(body.vpId)) {
          viewports.get(body.vpId).completeOperation(requestId);
        }
        break;

      case CHANGE_VP_SUCCESS:
      case DISABLE_VP_SUCCESS:
      case ENABLE_VP_SUCCESS:
        if (viewports.has(body.viewPortId)) {
          const response = this.viewports
            .get(body.viewPortId)
            .completeOperation(requestId);
          if (response) {
            this.postMessageToClient(response);
          }
        }

        break;

      case TABLE_ROW:
        const [{ ts: firstBatchTimestamp } = { ts: timeStamp }] =
          body.rows || EMPTY_ARRAY;
        // console.log(`\nbatch timestamp ${time(timeStamp)} first timestamp ${time(firstBatchTimestamp)} ${body.rows.length} rows in batch`)
        for (const row of body.rows) {
          const { viewPortId, rowIndex, rowKey, updateType } = row;
          const viewport = viewports.get(viewPortId);
          // console.log(`row timestamp ${time(row.ts)}`)
          if (
            viewport.isTree &&
            updateType === 'U' &&
            !rowKey.startsWith('$root')
          ) ; else {
            viewport.handleUpdate(updateType, rowIndex, row);
          }
        }
        this.processUpdates(firstBatchTimestamp);
        break;

      case CHANGE_VP_RANGE_SUCCESS:
        {
          const { viewPortId, from, to } = body;
          viewports.get(viewPortId).completeOperation(requestId, from, to);
        }
        break;

      case OPEN_TREE_SUCCESS:
      case CLOSE_TREE_SUCCESS:
      case CREATE_VISUAL_LINK_SUCCESS:
        break;

      case TABLE_LIST_RESP:
        this.postMessageToClient({ type, tables: body.tables, requestId });
        break;
      case TABLE_META_RESP:
        this.postMessageToClient({
          type,
          table: body.table,
          columns: body.columns,
          requestId,
        });
        break;

      default:
        console.log(`handleMessageFromServer,${body.type}.`);
    }
  }

  processUpdates(timeStamp) {
    let clientMessage;
    this.viewports.forEach((viewport) => {
      if (viewport.shouldUpdateClient) {
        // if (viewport.isTree){
        //   console.table(viewport.getClientRows(false, timeStamp));
        //   return;
        // }

        // onsole.log(`%cviewport will update client`,'color: green;')
        clientMessage = clientMessage || {
          type: 'viewport-updates',
          viewports: {},
        };
        clientMessage.viewports[viewport.clientViewportId] = {
          rows: viewport.getClientRows(false, timeStamp),
          size: viewport.getRowCount(),
        };
      }
      if (clientMessage) {
        // const now = performance.now();
        // if (updateTime){
        //   onsole.log(`time between updates ${now - updateTime}`)
        // }
        // updateTime = now;
        this.postMessageToClient(clientMessage);
      }
    });
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
    (msg) => server.handleMessageFromServer(msg),
    (msg) => logger.log(JSON.stringify(msg)),
    // msg => {
    //   onConnectionStatusMessage(msg);
    //   if (msg.status === 'disconnected'){
    //     server.disconnected();
    //   } else if (msg.status === 'reconnected'){
    //     server.resubscribeAll();
    //   }
    // }
  );
  server = new ServerProxy(connection, (msg) => postMessage(msg));
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
      postMessage({ type: 'websocket-data', data: getTestMessages() });
      break;
    default:
      server.handleMessageFromClient(message);
  }
};

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('message', handleMessageFromClient);

postMessage({ type: 'ready' });
//# sourceMappingURL=worker.js.map
