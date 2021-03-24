import { createLogger, logColor, EventEmitter, uuid } from '@heswell/utils';

const logger = createLogger('ConnectionManager', logColor.green);

let worker;
let pendingWorker;

const viewportStatus = {};
const pendingRequests = {};

const getWorker = async (url, server) => {

  return pendingWorker || (pendingWorker = new Promise((resolve, reject) => {
    const worker = new Worker('/worker.js', { type: 'module' })
    worker.onmessage = ({ data: message }) => {
      if (message.type === 'ready') {
        worker.postMessage({ type: 'connect', url });
      } else if (message.type === "connected") {
        resolve(worker);
      } else {
        logger.log(`Unexpected message from the worker ${message.type}`)
      }
    }
    // TODO handle error
  }));

}

const messagesToRelayToClient = {
  'table-row': true,
  VP_VISUAL_LINKS_RESP: true,
  sort: true,
  groupBy: true,
  filter: true
}

function handleMessageFromWorker({ data: message }) {
  const { type, clientViewportId, requestId } = message
  const viewport = viewportStatus[clientViewportId];
  if (viewport) {
    const { postMessageToClient } = viewport;
    if (type === "subscribed") {
      postMessageToClient(message);
    } else if (messagesToRelayToClient[type]) {
      postMessageToClient(message);
    } else {
      logger.log(`message from the worker ${type}`)
    }
  } else if (requestId && pendingRequests[requestId]){
    const {resolve} = pendingRequests[requestId];
    delete pendingRequests[requestId];
    const {type:_1, requestId:_2,  ...rest} = message;
    resolve(rest);
  } else {
    logger.log(`Unexpected message from the worker ${message.type} requestId ${requestId}`, pendingRequests)
  }

}


const asyncRequest = (msg) => {
  const requestId = uuid();
  worker.postMessage({
    requestId,
    ...msg
  });
  return new Promise((resolve, reject) => {
    pendingRequests[requestId] = {resolve, reject};
  });

}


const methods = {
  subscribe : (message, callback) => {
    // the session should live at the connection level
    viewportStatus[message.viewport] = {
      status: 'subscribing',
      request: message,
      postMessageToClient: callback
    }
    worker.postMessage({ type: "subscribe", ...message });
  },

  unsubscribe: (viewport) => {
    console.log(`ConnectionManagerWorker, unsubscribe from vp ${viewport}`);
    worker.postMessage({ type: "unsubscribe", viewport });
  },

  handleMessageFromClient: (message) => {
    worker.postMessage(message);
  },

  destroy : () => {
    console.log('destroy')
    // TODO kill all subscriptions
  },

  getTableList: async() => asyncRequest({type: "GET_TABLE_LIST"}),

  getTableMeta: async(table) => asyncRequest({type: "GET_TABLE_META", table}),

}


class ConnectionManager extends EventEmitter {


  async connect(url, serverName) {

    logger.log(`ConnectionManager.connect ${serverName} ${url} waiting for worker`);

    worker = await getWorker(url, serverName);

    worker.onmessage = handleMessageFromWorker;

    logger.log(`worker ready, connected to server`)
    // return new Promise((resolve, reject) => {

    const target = {};
    const handler = {
      get: function (target, methodName) {
        if (typeof methodName === "string" && methods[methodName]) {
          return methods[methodName];
        } else {
          //console.log(`attempto to invoke ${methodName.toStringTag ? methodName.toStringTag() : String(methodName)}`)
        }
      },
    };
    // TODO proxy is overkill here
    return new Proxy(target, handler);

    // });

  }

  // return connectServer(
  //   serverName,
  //   url,
  //   msg => this.onConnectionStatusChanged(serverName, url, msg)
  // );

  onConnectionStatusChanged(serverName, url, msg) {
    const { status } = msg;
    logger.log(`connectionStatusChanged server ${serverName}, url ${url} status ${status} `)
    this.emit('connection-status', msg);
  }

  destroy() {
    worker.teminate();
  }

}

export default new ConnectionManager();
