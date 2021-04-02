import { messages } from './messages/messages_004';
import {ServerProxy} from '../servers/vuu/new-server-proxy';

describe('websocket messages', () => {

  it('loads messages', () => {
    const serverProxy = new ServerProxy();
    const tablename = "Instruments";
    const noop = () => undefined;

    serverProxy.subscribe({ viewport: "agFlupLJ4QOulZTMW-7xM", tablename, range: {lo:0, hi: 35}}, noop);

    const start = performance.now()
    for (let message of messages){
      serverProxy.handleMessageFromServer(message);
    }
    const end = performance.now();
    const ms = end-start;
    console.log(`took ${ms}ms to process ${messages.length} server messages = ${Math.round((messages.length/ms) * 1000)} messages/sec`)

    // serverProxy.viewports.forEach(viewport => console.table(viewport.getClientRows()))

    expect(messages).toHaveLength(1081);
  })


})
