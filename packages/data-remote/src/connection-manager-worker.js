import { createLogger, logColor, EventEmitter } from '@heswell/utils';

const logger = createLogger('ConnectionManager', logColor.green);

let worker;
let pendingWorker;

const viewportStatus = {};

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

function handleMessageFromWorker({ data: message }) {
  const { type, clientViewportId } = message
  const viewport = viewportStatus[clientViewportId];
  if (viewport) {
    const { postMessageToClient } = viewport;
    if (type === "subscribed") {
      postMessageToClient(message);
    } else if (type === 'table-row') {
      postMessageToClient(message);
    } else {
      logger.log(`message from the worker ${type}`)
    }
  } else {
    logger.log(`Unexpected message from the worker ${message.type}`)
  }

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

  unsubscribe: () => {
    console.log(`unsubscribe`, args)
  },

  handleMessageFromClient: (message) => {
    worker.postMessage(message);
  },

  destroy : () => {
    console.log('destroy')
    // TODO kill all subscriptions
  }


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
        if (methods[methodName]) {
          return methods[methodName];
        } else {
          console.log(`attempto to invoke ${methodName}`)
        }
      },
    };

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
