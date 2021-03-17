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

const logger$2 = createLogger('WebsocketConnection', logColor.brown);

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
        logger$2.log(`Session established clientId: ${msg.clientId}`);
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
      const message = JSON.parse(evt.data);
      // console.log(`%c<<< [${new Date().toISOString().slice(11,23)}]  (WebSocket) ${message.type || JSON.stringify(message)}`,'color:white;background-color:blue;font-weight:bold;');
      if (Array.isArray(message)){
        message.map(callback);
      } else {
        callback(message);
      }
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
      logger$2.log(`Message cannot be sent, socket closed: ${msg.type}`);
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
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const CREATE_VP = 'CREATE_VP';
const CREATE_VP_SUCCESS = 'CREATE_VP_SUCCESS';
const CHANGE_VP = 'CHANGE_VP';
const CHANGE_VP_SUCCESS = 'CHANGE_VP_SUCCESS';
const CREATE_VISUAL_LINK = 'CREATE_VISUAL_LINK';
const CREATE_VISUAL_LINK_SUCCESS = 'CREATE_VISUAL_LINK_SUCCESS';
const SET_SELECTION = 'SET_SELECTION';
const SET_SELECTION_SUCCESS = 'SET_SELECTION_SUCCESS';
const CHANGE_VP_RANGE = 'CHANGE_VP_RANGE';
const CHANGE_VP_RANGE_SUCCESS = 'CHANGE_VP_RANGE_SUCCESS';
const TABLE_ROW = 'TABLE_ROW';
const HB = "HB";
const HB_RESP = "HB_RESP";
const OPEN_TREE_NODE = "OPEN_TREE_NODE";
const OPEN_TREE_SUCCESS = "OPEN_TREE_SUCCESS";
const OPEN_TREE_REJECT = "OPEN_TREE_REJECT";
const CLOSE_TREE_NODE = "CLOSE_TREE_NODE";
const CLOSE_TREE_SUCCESS = "CLOSE_TREE_SUCCESS";
const CLOSE_TREE_REJECT = "CLOSE_TREE_REJECT";
const ENABLE_VP = "ENABLE_VP";
const ENABLE_VP_SUCCESS = "ENABLE_VP_SUCCESS";
const ENABLE_VP_REJECT = "ENABLE_VP_REJECT";
const DISABLE_VP = "DISABLE_VP";
const DISABLE_VP_SUCCESS = "DISABLE_VP_SUCCESS";
const DISABLE_VP_REJECT = "DISABLE_VP_REJECT";

const SIZE$1 = 'SIZE';
const UPDATE$1 = 'U';

var Message = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AUTH: AUTH,
  AUTH_SUCCESS: AUTH_SUCCESS,
  LOGIN: LOGIN,
  LOGIN_SUCCESS: LOGIN_SUCCESS,
  CREATE_VP: CREATE_VP,
  CREATE_VP_SUCCESS: CREATE_VP_SUCCESS,
  CHANGE_VP: CHANGE_VP,
  CHANGE_VP_SUCCESS: CHANGE_VP_SUCCESS,
  CREATE_VISUAL_LINK: CREATE_VISUAL_LINK,
  CREATE_VISUAL_LINK_SUCCESS: CREATE_VISUAL_LINK_SUCCESS,
  SET_SELECTION: SET_SELECTION,
  SET_SELECTION_SUCCESS: SET_SELECTION_SUCCESS,
  CHANGE_VP_RANGE: CHANGE_VP_RANGE,
  CHANGE_VP_RANGE_SUCCESS: CHANGE_VP_RANGE_SUCCESS,
  TABLE_ROW: TABLE_ROW,
  HB: HB,
  HB_RESP: HB_RESP,
  OPEN_TREE_NODE: OPEN_TREE_NODE,
  OPEN_TREE_SUCCESS: OPEN_TREE_SUCCESS,
  OPEN_TREE_REJECT: OPEN_TREE_REJECT,
  CLOSE_TREE_NODE: CLOSE_TREE_NODE,
  CLOSE_TREE_SUCCESS: CLOSE_TREE_SUCCESS,
  CLOSE_TREE_REJECT: CLOSE_TREE_REJECT,
  ENABLE_VP: ENABLE_VP,
  ENABLE_VP_SUCCESS: ENABLE_VP_SUCCESS,
  ENABLE_VP_REJECT: ENABLE_VP_REJECT,
  DISABLE_VP: DISABLE_VP,
  DISABLE_VP_SUCCESS: DISABLE_VP_SUCCESS,
  DISABLE_VP_REJECT: DISABLE_VP_REJECT,
  SIZE: SIZE$1,
  UPDATE: UPDATE$1
});

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

const { IDX, SELECTED } = metadataKeys;
const EMPTY_ARRAY = [];
const SORT = { asc: 'D', dsc: 'A' };

class Viewport {

  constructor(clientViewportId, request, status = 'subscribing') {
    this.clientViewportId = clientViewportId;
    this.request = request;
    this.status = status;
    this.serverViewportId = null;
    this.pendingOperations = [];
    this.columns = null;
    this.table = null;
    this.range = null;
    this.sort = null;
    this.groupBy = null;
    this.filterSpec = null;
    this.pendingOperations = new Map();
    this.isTree = false;
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

  awaitOperation(requestId, type) {
    console.log(`await ${type} operation ${requestId}`);
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
      this.filterSpec = {
        filter: data
      };
    } else if (type === 'sort') {
      this.sort = {
        sortDefs: data
      };
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
      type: ENABLE_VP,
      viewPortId: this.serverViewportId,
    }
  }

  disable(requestId) {
    this.awaitOperation(requestId, { type: "disable" });
    return {
      type: DISABLE_VP,
      viewPortId: this.serverViewportId,
    }
  }


  filterRequest(requestId, filter) {
    this.awaitOperation(requestId, { type: "filter", data: filter });
    return this.createRequest({ filterSpec: { filter } });
  }

  sortRequest(requestId, requestedSort) {
    const sortDefs = requestedSort.map(([column, dir = 'asc']) => ({ column, sortType: SORT[dir] }));
    this.awaitOperation(requestId, { type: "sort", data: sortDefs });
    return this.createRequest({ sort: { sortDefs } })
  }

  groupByRequest(requestId, requestedGroupBy) {
    const groupBy = requestedGroupBy?.map(([columnName]) => columnName) ?? EMPTY_ARRAY;
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
      type: SET_SELECTION,
      vpId: this.serverViewportId,
      selection
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
      ...params
    }
  }

}

const { SIZE, UPDATE } = Message;

const byRowIndex = (row1, row2) => row1[0] - row2[0];

let _requestId = 1;
const nextRequestId = () => `${_requestId++}`;

const logger$1 = console;

class ServerProxy {

  constructor(connection, callback) {
    this.connection = connection;
    this.postMessageToClient = callback;
    this.queuedRequests = [];
    this.viewportStatus = {};

    this.queuedRequests = [];
    this.loginToken = "";
    this.sessionId = "";
    this.pendingLogin = null;
    this.pendingAuthentication = null;

  }

  handleMessageFromClient(message) {

    const viewport = this.viewportStatus[message.viewport];
    if (!viewport) {
      switch (message.type) {
        case "GET_TABLE_LIST":
          this.sendMessageToServer({ type: "GET_TABLE_LIST" }, message.requestId);
          break;
        case "GET_TABLE_META":
          this.sendMessageToServer({ type: "GET_TABLE_META", table: message.table }, message.requestId);
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

  sendIfReady(message, requestId, isReady = true) {
    // TODO implement the message queuing in remote data view
    if (isReady) {
      console.log(`sendMessageToServer ${message.type} reqId: ${requestId}`);
      this.sendMessageToServer(message, requestId);
    } else {
      // TODO need to make sure we keep the requestId
      this.queuedRequests.push(message);
    }

    return isReady;

  }

  disconnected() {
    logger$1.log(`disconnected`);
    for (let [viewport, { postMessageToClient }] of Object.entries(this.viewportStatus)) {
      postMessageToClient({
        rows: [],
        size: 0,
        range: { lo: 0, hi: 0 }
      });
    }
  }

  resubscribeAll() {
    logger$1.log(`resubscribe all`);
    // for (let [viewport, {request}] of Object.entries(this.viewportStatus)) {
    //     this.sendMessageToServer({
    //         type: API.addSubscription,
    //         ...request
    //     });
    // }
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: AUTH, username, password }, "");
      this.pendingAuthentication = { resolve, reject };
    })
  }

  authenticated(token) {
    this.loginToken = token;
    this.pendingAuthentication.resolve(token);
  }

  async login() {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: LOGIN, token: this.loginToken, user: "user" }, "");
      this.pendingLogin = { resolve, reject };
    })
  }

  loggedIn(sessionId) {
    this.sessionId = sessionId;
    this.pendingLogin.resolve(sessionId);
  }

  subscribe(message, callback) {
    // the session should live at the connection level
    const isReady = this.sessionId !== "";
    // TODO we need to explicitly store all the viewport attributes here
    const { viewport, tablename, columns, range: { lo, hi } } = message;
    this.viewportStatus[viewport] = new Viewport(viewport, message);

    // use client side viewport as request id, so that when we process the response,
    // with the serverside viewport we can establish a mapping between the two
    this.sendIfReady({
      type: CREATE_VP,
      table: tablename,
      range: {
        from: lo,
        to: hi
      },
      columns,
      sort: {
        sortDefs: []
      },
      groupBy: [],
      filterSpec: {
        filter: ""
      }
    }, viewport, isReady);

  }

  subscribed(/* server message */ clientViewportId, message) {
    const viewport = this.viewportStatus[clientViewportId];
    const { viewPortId: serverViewportId, columns } = message;
    if (viewport) {
      // key the viewport on server viewport ID as well as client id
      this.viewportStatus[serverViewportId] = viewport;
      viewport.subscribe(message);
      this.postMessageToClient({ type: "subscribed", clientViewportId, serverViewportId, columns });
      this.sendMessageToServer({ type: "GET_VP_VISUAL_LINKS", vpId: serverViewportId });
    }
  }

  unsubscribe(clientViewportId) {
    const viewport = this.viewportStatus[clientViewportId];
    console.log(`%cserver-proxy<VUU> unsubscribe`, 'color: blue;font-weight:bold;');
    if (viewport) {
      this.sendMessageToServer({ type: "REMOVE_VP", viewPortId: viewport.serverViewportId });
    } else {
      console.error(`unable to unsubscribe from ${clientViewportId}, viewport not found`);
    }

  }

  destroy() {
    console.log(`%cserver-proxy<VUU> destroy`, 'color: blue;font-weight:bold;');
  }

  batchByViewport(rows) {
    const viewports = {};
    for (let i = 0; i < rows.length; i++) {
      const { viewPortId, vpSize, rowIndex, rowKey, sel: isSelected, updateType, ts, data } = rows[i];
      //TODO it is probably more efficient to do the groupBy checks at next level
      const viewport = this.viewportStatus[viewPortId];
      if (viewport) {

        if (viewport.isTree && updateType === UPDATE && !rowKey.startsWith('$root')) ; else {

          if (updateType === UPDATE) {
            const record = (viewports[viewPortId] || (viewports[viewPortId] = {
              viewPortId,
              size: vpSize,
              rows: []
            }));
            if (viewport.isTree) {
              let [depth, isExpanded, path, isLeaf, label, count, ...rest] = data;
              record.rows.push([rowIndex, 0, isLeaf, isExpanded, depth, count, rowKey, isSelected].concat(rest));
            } else {
              record.rows.push([rowIndex, 0, true, null, null, 1, rowKey, isSelected].concat(data));
              // We get a SIZE record when vp size changes but not in every batch - not if the size hasn't changed. Hence
              // we take the size from TABLE. However, if size does change, it might do so part way through a batch.
              if (vpSize > record.size) {
                record.size = vpSize;
              }
            }
          } else if (updateType === SIZE) {
            viewports[viewPortId] = {
              viewPortId,
              size: vpSize,
              rows: []
            };
          }

        }

      } else {
        // If we are missing the viewport, bail now
        break;
      }
    }
    return Object.values(viewports);
  }

  handleMessageFromServer(message) {
    if (!message.body) {
      console.error('invalid message', message);
      return;
    } else if (message.body.type === HB) {
      this.sendMessageToServer({ type: HB_RESP, ts: +(new Date()) }, "NA");
      return;
    }

    const { requestId, sessionId, token, body } = message;

    switch (body.type) {
      case AUTH_SUCCESS:
        return this.authenticated(token);
      case LOGIN_SUCCESS:
        return this.loggedIn(sessionId);
      case CREATE_VP_SUCCESS:
        return this.subscribed(requestId, body);
      case CHANGE_VP_RANGE_SUCCESS:
        break;
      case CHANGE_VP_SUCCESS:
      case SET_SELECTION_SUCCESS: {
        const response = this.viewportStatus[body.viewPortId || body.vpId].completeOperation(requestId);
        if (response) {
          this.postMessageToClient(response);
        }
      }
        break;
      case OPEN_TREE_SUCCESS:
      case CLOSE_TREE_SUCCESS:
        console.log('successful tree operation');
        break;
      case CREATE_VISUAL_LINK_SUCCESS:
        break;
      case TABLE_ROW: {
        const { batch, isLast, timestamp, rows } = body;
        const rowsByViewport = this.batchByViewport(rows);
        rowsByViewport.forEach(({ viewPortId, size, rows }) => {
          const { clientViewportId } = this.viewportStatus[viewPortId];
          rows.sort(byRowIndex);
          const clientMessage = {
            type: "table-row",
            clientViewportId,
            size,
            offset: 0,
            range: { lo: 0, hi: 27 },
            rows
          };
          this.postMessageToClient(clientMessage);
        });
      }

        break;
      case "REMOVE_VP_SUCCESS": {
        const { clientViewportId } = this.viewportStatus[body.viewPortId];
        delete this.viewportStatus[body.viewPortId];
        delete this.viewportStatus[clientViewportId];
      }
        console.log(`REMOVE_VP_SUCCESS ${JSON.stringify(body)}`);
        break;
      case "TABLE_LIST_RESP":
        this.postMessageToClient({ type: "TABLE_LIST_RESP", tables: body.tables, requestId });
        break;
      case "TABLE_META_RESP":
        this.postMessageToClient({ type: "TABLE_META_RESP", table: body.table, columns: body.columns, requestId });
        break;
      case "VP_VISUAL_LINKS_RESP":
        if (body.links.length) {
          const { clientViewportId } = this.viewportStatus[body.vpId];
          // console.group(`links for (${this.viewportStatus[body.vpId].spec.table})`);
          // body.links.forEach(({parentVpId, link}) => {
          //   console.log(`link parentVpId = ${parentVpId}`);
          //   const vp = this.viewportStatus[parentVpId];
          //   if (vp){
          //     console.log(`   parent table = ${vp.spec.table}`)
          //     console.log(JSON.stringify(link,null,2))
          //   }

          // })
          // console.groupEnd();
          this.postMessageToClient({ type: "VP_VISUAL_LINKS_RESP", links: body.links, clientViewportId });
        }
        break;

      case "ERROR":
        console.error(body.msg);
        break;
      // case Message.FILTER_DATA:
      // case Message.SEARCH_DATA:
      //     const { data: filterData } = message;
      //     // const { rowset: data } = subscription.putData(type, filterData);

      //     // if (data.length || filterData.size === 0) {
      //     this.postMessageToClient({
      //         type,
      //         viewport,
      //         [type]: filterData
      //     });
      //     // }

      //     break;

      default:
        this.postMessageToClient(message.body);

    }

  }

}

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
    default:
      server.handleMessageFromClient(message);
    }
};

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('message',handleMessageFromClient);

postMessage({ type: "ready" });
//# sourceMappingURL=worker.js.map
