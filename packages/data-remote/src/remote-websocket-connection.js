import { createLogger, logColor } from '@heswell/utils';
import { ConnectionStatus } from './messages';

const logger = createLogger('WebsocketConnection', logColor.brown);

const connectionAttempts = {};

const setWebsocket = Symbol('setWebsocket');
const connectionCallback = Symbol('connectionCallback');

export default async function connect(connectionString, callback, connectionStatusCallback) {
    return makeConnection(connectionString, msg => {
      const {type} = msg;
      if (type === 'connection-status'){
        connectionStatusCallback(msg);
      } else if (type === 'HB'){
          console.log(`swallowing HB in WebsocketConnection`);
      } else if (type === 'Welcome'){
        // Note: we are actually resolving the connection before we get this session message
        logger.log(`Session established clientId: ${msg.clientId}`)
      } else {
        callback(msg)
      }
    });
}

async function reconnect(connection){
  console.log(`reconnect connection at ${connection.url}`)
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
    resolve(makeConnection(url, callback, connection))
  }, delay)
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
        message.map(callback)
      } else {
        callback(message);
      }
    }

    ws.onerror = evt => {
      console.log(`%c⚡ %c${this.url}`, 'font-size: 24px;color: red;font-weight: bold;','color:red; font-size: 14px;');
      callback({type: 'connection-status', status: 'disconnected', reason: 'error'});
      if (this.status !== 'closed'){
        reconnect(this);
        this.send = queue;
      }
    }

    ws.onclose = evt => {
      console.log(`%c⚡ %c${this.url}`, 'font-size: 24px;color: orange;font-weight: bold;','color:orange; font-size: 14px;');
      callback({type: 'connection-status', status: 'disconnected', reason: 'close'});
      if (this.status !== 'closed'){
        reconnect(this);
        this.send = queue;
      }
    }

    const send = msg => {
      // console.log(`%c>>>  (WebSocket) ${JSON.stringify(msg)}`,'color:blue;font-weight:bold;');
      ws.send(JSON.stringify(msg));
    }

    const warn = msg => {
      logger.log(`Message cannot be sent, socket closed: ${msg.type}`);
    }

    const queue = msg => {
      console.log(`queuing message ${JSON.stringify(msg)} until websocket reconnected`)
    }

    const abort = msg => {
      throw Error('This connection is dead');
    }

    this.send = send;

    this.close = () => {
      console.log('[Connection] close websocket')
      this.status = 'closed';
      ws.close();
      this.send = warn;
    }

  }

}

