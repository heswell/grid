import { createLogger, logColor, EventEmitter, uuid } from '@heswell/utils';
import * as Message from "./servers/vuu/messages";

// import {storeData, setDataCollectionMethod} from "./test-data-capture";

const logger = createLogger('ConnectionManager', logColor.green);

let worker;
let pendingWorker;

const viewports = new Map();;
const pendingRequests = new Map();

const getWorker = async (url, server) => {

  return pendingWorker || (pendingWorker = new Promise((resolve, reject) => {
    const worker = new Worker('/worker.js?debug=all-messages', { type: 'module' });
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
  'visual-link-created': true,
  [Message.VP_VISUAL_LINKS_RESP]: true,
  [Message.RPC_RESP]: true,
  sort: true,
  groupBy: true,
  filter: true
};

function handleMessageFromWorker({ data: message }) {
  if (message.type === "viewport-updates"){
    for (const [clientViewport, {size, rows}] of Object.entries(message.viewports) ){
      if (viewports.has(clientViewport)){
        const { postMessageToClient } = viewports.get(clientViewport);
        postMessageToClient({type: "viewport-update", size, rows})
      }
    }
  } else if (viewports.has(message.clientViewportId)){
    const viewport = viewports.get(message.clientViewportId);
    const { postMessageToClient } = viewport;
    if (message.type === "subscribed") {
      postMessageToClient(message);
    } else if (messagesToRelayToClient[message.type]) {
      postMessageToClient(message);
    } else {
      logger.log(`message from the worker to viewport ${message.clientViewportId} ${message.type}`)
    }
  } else if (pendingRequests.has(message.requestId)){
    const {resolve} = pendingRequests.get(message.requestId);
    pendingRequests.delete(message.requestId);
    const {type:_1, requestId:_2,  ...rest} = message;
    resolve(rest);
  // TEST DATA COLLECTION
  } else if (message.type === "websocket-data"){
    // storeData(message.data);
  } else {
    logger.log(`Unexpected message from the worker ${message.type} requestId ${message.requestId}`, pendingRequests)
  }

}


const asyncRequest = (msg) => {
  const requestId = uuid();
  worker.postMessage({
    requestId,
    ...msg
  });
  return new Promise((resolve, reject) => {
    pendingRequests.set(requestId, {resolve, reject});
  });

}


const methods = {
  subscribe : (message, callback) => {
    // the session should live at the connection level
    viewports.set(message.viewport, {
      status: 'subscribing',
      request: message,
      postMessageToClient: callback
    });
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

    // TEST DATA COLLECTION
      // setDataCollectionMethod(() => {
      //   console.log(`sending 'send-websocket-data' message to worker`)
      //   worker.postMessage({type: "send-websocket-data"})
      // })


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
