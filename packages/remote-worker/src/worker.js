import connectWebsocket from '@vuu-ui/data-remote/src/remote-websocket-connection';
import connectDataStore from '@heswell/data-store/src/data-store-connection';
// TEST DATA COLLECTION
import { getTestMessages } from '@vuu-ui/data-remote/src/test-data-collection';
import { ServerProxy } from '@vuu-ui/data-remote/src/servers/vuu/new-server-proxy';
import { createLogger, logColor } from '@heswell/utils/src/logging';

const logger = createLogger('Worker', logColor.brown);

let server;

async function connectToServer(url,useWebsocket) {
  const makeConnection = useWebsocket ? connectWebsocket : connectDataStore;
  const connection = await makeConnection(
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
  server = new ServerProxy(connection, (msg) => sendMessageToClient(msg));
  // TODO handle authentication, login
  if (connection.requiresAuthentication) {
    await server.authenticate('steve', 'pword');
  }
  if (connection.requiresLogin) {
    await server.login();
  }
}

let lastTime = 0;
const timings = [];

function sendMessageToClient(message){
  const now = Math.round(performance.now());
  if (lastTime){
    timings.push(now-lastTime)

    // if (timings.length % 100 === 0){
    //   console.log(timings.join(', : '))
    //   timings.length = 0;
    // }
  }
  postMessage(message);
  lastTime= now;
}

const handleMessageFromClient = async ({ data: message }) => {
  switch (message.type) {
    case 'connect':
      await connectToServer(message.url, message.useWebsocket);
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
