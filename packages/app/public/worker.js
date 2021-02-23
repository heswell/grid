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

const logger = createLogger('WebsocketConnection', logColor.brown);

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
        logger.log(`Session established clientId: ${msg.clientId}`);
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
      logger.log(`Message cannot be sent, socket closed: ${msg.type}`);
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
const UPDATE = 'U';

function partition(array, test, pass = [], fail = []) {

  for (let i = 0, len = array.length; i < len; i++) {
    (test(array[i], i) ? pass : fail).push(array[i]);
  }

  return [pass, fail];
}

const SORT = { asc: 'D', dsc: 'A' };

const byRowIndex = (row1, row2) => row1[0] - row2[0];

let _requestId = 1;


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
      case 'groupBy':
        viewport.groupByStatus = 'pending';
        this.sendIfReady({
          type: CHANGE_VP,
          viewPortId: viewport.serverViewportId,
          columns: ["ric", "description", "currency", "exchange", "lotSize", "bid", "ask", "last", "open", "close", "scenario"],
          sort: {
            sortDefs: []
          },
          groupBy: message.groupBy.map(([columnName]) => columnName),
          filterSpec: null
        },
          _requestId++,
          isReady);
        break;

      case 'sort':
        this.sendIfReady({
          type: CHANGE_VP,
          viewPortId: viewport.serverViewportId,
          columns: ["ric", "description", "currency", "exchange", "lotSize", "bid", "ask", "last", "open", "close", "scenario"],
          sort: {
            sortDefs: message.sortCriteria.map(([column, dir = 'asc']) => ({ column, sortType: SORT[dir] }))
          },
          groupBy: [],
          filterSpec: null
        },
          _requestId++,
          isReady);
        break;

      case 'filterQuery':
        this.sendIfReady({
          type: CHANGE_VP,
          viewPortId: viewport.serverViewportId,
          columns: viewport.columns,
          sort: null, // need to preserve
          groupBy: [],
          filterSpec: { filter: message.filter }
        },
          _requestId++,
          isReady);
        break;

      case 'select':
        this.sendIfReady({
          type: SET_SELECTION,
          vpId: viewport.serverViewportId,
          selection: [message.idx]
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
    logger$1.log(`subscribe ${JSON.stringify(message)}`);
    // the session should live at the connection level
    const isReady = this.sessionId !== "";
    const { viewport, tablename, columns, range: { lo, hi } } = message;
    this.viewportStatus[viewport] = {
      clientViewportId: viewport,
      status: 'subscribing',
      request: message,
    };

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

      viewport.status = 'subscribed';
      viewport.serverViewportId = serverViewportId;
      viewport.columns = columns;

      const { table, range, sort, groupBy, filterSpec } = message;
      viewport.spec = {
        table, range, columns, sort, groupBy, filterSpec
      };

      // TODO don't think we need to support queued requests any more ? We block
      // now until connection is established
      const byViewport = vp => item => item.viewport === vp;
      const byMessageType = msg => msg.type === CHANGE_VP;
      const [messagesForThisViewport, messagesForOtherViewports] = partition(this.queuedRequests, byViewport(viewport));
      const [rangeMessages, otherMessages] = partition(messagesForThisViewport, byMessageType);

      this.queuedRequests = messagesForOtherViewports;
      rangeMessages.forEach(msg => {
        range = msg.range;
      });

      if (otherMessages.length) {
        console.log(`we have ${otherMessages.length} messages still to process`);
      }

      this.postMessageToClient({ type: "subscribed", clientViewportId, serverViewportId, columns });

      this.sendMessageToServer({ type: "GET_VP_VISUAL_LINKS", vpId: serverViewportId });
    }
  }

  unsubscribe() {
    console.log(`%cserver-proxy<VUU> unsubscribe`, 'color: blue;font-weight:bold;');
  }

  destroy() {
    console.log(`%cserver-proxy<VUU> destroy`, 'color: blue;font-weight:bold;');
  }

  batchByViewport(rows) {
    const viewports = {};
    for (let i = 0; i < rows.length; i++) {
      const { viewPortId, vpSize, rowIndex, rowKey, sel: isSelected, updateType, ts, data } = rows[i];
      //TODO it is probably more efficient to do the groupBy checks at next level
      const { groupByStatus } = this.viewportStatus[viewPortId];
      if (groupByStatus === 'pending' && rowKey !== '$root') {
        console.log(`ignoring ${updateType} message whilst waiting for grouped rows`);
      } else if (groupByStatus === 'pending' && rowKey === '$root') {
        this.viewportStatus[viewPortId].groupByStatus = 'complete';
        console.log(`groupBy in place, $root received`);
      } else if (updateType === UPDATE) {
        const record = (viewports[viewPortId] || (viewports[viewPortId] = { viewPortId, size: vpSize, rows: [] }));
        if (groupByStatus === 'complete') {
          let [depth, expanded, path, unknown, label, count, ...rest] = data;
          if (!expanded) {
            depth = -depth;
          }
          rest.push(rowIndex - 1, 0, depth, count, path, 0);
          record.rows.push(rest);
        } else {
          // TODO populate the key field correctly, i.e. don't just assume first field
          if (isSelected) {
            console.log(`row ${rowIndex} is selected`);
          }
          record.rows.push([rowIndex, 0, 0, 0, data[0], isSelected, , , , ,].concat(data));
        }
      } else ;
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
      case CHANGE_VP_SUCCESS:
        logger$1.log(body.type);
        break;
      case CREATE_VISUAL_LINK_SUCCESS:
      case SET_SELECTION_SUCCESS:
        console.log(`message received ${body.type}`);
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
      case "TABLE_LIST_RESP":
        this.postMessageToClient({ type: "TABLE_LIST_RESP", tables: body.tables, requestId });
        break;
      case "TABLE_META_RESP":
        this.postMessageToClient({ type: "TABLE_META_RESP", table: body.table, columns: body.columns, requestId });
        break;
      case "VP_VISUAL_LINKS_RESP":
        if (body.links.length){
          const { clientViewportId } = this.viewportStatus[body.vpId];
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

const logger$2 = createLogger('Worker', logColor.brown);

let server;

async function connectToServer(url) {

  const connection = await connect(
    url,
    // if this was called during connect, we would get a ReferenceError, but it will
    // never be called until subscriptions have been made, so this is safe.
    msg => server.handleMessageFromServer(msg),
    msg => logger$2.log(JSON.stringify(msg))
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
    default:
      server.handleMessageFromClient(message);
    }
};

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('message',handleMessageFromClient);

postMessage({ type: "ready" });
//# sourceMappingURL=worker.js.map
