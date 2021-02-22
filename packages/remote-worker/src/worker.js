import connect from '@vuu-ui/data-remote/src/remote-websocket-connection';
import { ServerProxy } from '@vuu-ui/data-remote/src/servers/vuu/server-proxy';
import { createLogger, logColor } from '@heswell/utils/src/logging';

const logger = createLogger('Worker', logColor.brown);

logger.log('hello from the worker')

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
  // How do we handle authentication, login
  if (typeof server.authenticate === 'function') {
    await server.authenticate('steve', 'pword');
  }
  if (typeof server.login === 'function') {
    await server.login();
  }

}

const handleMessageFromServer = message => {
}

const handleMessageFromClient = async ({ data: message }) => {
  switch (message.type) {
    case 'connect':
      await connectToServer(message.url);
      postMessage({ type: 'connected' })
      break;
    case 'subscribe':
      server.subscribe(message);
      break;
    default:
      server.handleMessageFromClient(message);
    }
}

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('message',handleMessageFromClient);


/* eslint-disable-next-line no-restricted-globals */
// self.addEventListener('message', async function ({ data: message }) {
//   switch (message.type) {
//     case 'connect':
//       logger.log(`connect to ${message.url}`)
//       await connectToServer(message.url);
//       postMessage({ type: 'connected' })
//       break;
//     case 'subscribe':
//       logger.log(`subscribe ${JSON.stringify(message)}`)
//       server.subscribe(message, handleMessageFromServer);
//       break;

    // case 'setRange':{
    //     const result = dataStore.setRange(message.range);
    //     postMessage(result);
    // }
    // break;

    // case 'groupBy':{
    //     const result = dataStore.groupBy(message.groupBy);
    //     postMessage(result);
    // }
    // break;

    // case 'rate':
    //     if (message.value > 3){
    //        renderInterval += 1;
    //         // console.log(`current messages/render = ${message.value} increasing renderInterval to ${renderInterval}`);
    //     } else if (message.value < 2){
    //         renderInterval -= 1;
    //     // console.log(`current messages/render = ${message.value} reducing renderInterval to ${renderInterval}`);
    //     }
    // break;

    // case 'startStress':
    //     console.log('starting stress test');
    //     sendMessagesNoThrottle();
    //     break;
    // case 'startLoad':
    //     loadTestRunning = true;
    //     console.log('starting load test');
    //     sendMessagesWithThrottle();
    //     break;
    // case 'stopTest':
    //     console.log('stopping test');
    //     loadTestRunning = false;
    //     break;
  //   default:
  //     console.log('unknown message type ' + message.type);
  //     break;
  // }
// });

postMessage({ type: "ready" })
