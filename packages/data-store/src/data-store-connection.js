import { createLogger, logColor } from '@heswell/utils/src/logging';
import {DataTypes, EventEmitter, uuid} from '@heswell/utils';
import DataStore from "./data-store";
import Table from "./worker-table";

const logger = createLogger('DataStoreConnection', logColor.brown);

export default async function connectDataStore(
  connectionString,
  callback,
  connectionStatusCallback,
) {
  return makeConnection(connectionString, (msg) => {
    const { type } = msg;
    if (type === 'connection-status') {
      connectionStatusCallback(msg);
    } else {
      callback(msg);
    }
  });
}

async function makeConnection(url, callback, connection) {

    callback({ type: 'connection-status', status: 'connecting' });
    const dataStore = await createDataStore(url);

    console.log(
      `%c⚡ %c${url}`,
      'font-size: 24px;color: green;font-weight: bold;',
      'color:green; font-size: 14px;',
    );

    connection = new Connection(dataStore, url, callback);
    const status = 'connected';
    callback({ type: 'connection-status', status });
    connection.status = status;
    return connection;

}

const createDataStore = async(url) => {
  console.log(`table config url ${url}`);
  const loadTableConfiguration = async () => await import(url);

  const {config} = await loadTableConfiguration();
  console.log(`got config ${JSON.stringify(config,null,2)}`);
  const {generateData} = await import(config.dataUrl);
  const table = new Table(config);
  table.setData(generateData());
  return new DataStore(table, {columns: config.columns}/*, updateQueue*/);

  }

class Connection {
  constructor(dataStore, url, callback) {
    this.url = url;
    this.connectionCallback = callback;
    this.viewPortId = uuid();
    this.setDataStore(dataStore);
    this.status = 'ready';
  }

  setDataStore(dataStore) {
    const {connectionCallback: callback, viewPortId} = this;


    const send = ({requestId, body}) => {
      console.log(`%c>>>  (DataStoreConnection)  ${JSON.stringify(body)}`,'color:blue;font-weight:bold;');
      switch(body.type){
        case "CREATE_VP":
          const {columns, range, table} = body;
          callback({requestId, body: { type: "CREATE_VP_SUCCESS", viewPortId, columns, range, table }});
          const {rows, size: vpSize} = dataStore.setRange({lo: range.from, hi: range.to}, true);
          const ts = +(new Date());
          callback({
            requestId: "NA",
            body: {
              type: "TABLE_ROW",
              timeStamp: ts,
              rows: [
                {viewPortId, vpSize, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE", sel:0, ts, data: []}
              ].concat(rows.map(([rowIndex,,,,,,rowKey, sel, ...data]) => (
                {viewPortId, vpSize, rowIndex, rowKey, updateType: "U", sel, ts, data }
              )))
            }
          })
          break;

        case "CHANGE_VP_RANGE": {
          const {from, to} = body;
          callback({requestId, body: { type: "CHANGE_VP_RANGE_SUCCESS", viewPortId, from, to }});
          const {rows, size: vpSize} = dataStore.setRange({lo: from, hi: to}, true);
          const ts = +(new Date());
          callback({
            requestId: "NA",
            body: {
              type: "TABLE_ROW",
              timeStamp: ts,
              rows: [
                {viewPortId, vpSize, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE", sel:0, ts, data: []}
              ].concat(rows.map(([rowIndex,,,,,,rowKey, sel, ...data]) => (
                {viewPortId, vpSize, rowIndex, rowKey, updateType: "U", sel, ts, data }
              )))
            }
          })

        }

          break;
        default:
          logger.log(`Unknown message type from client ${body.type}`)


      }
    };


    this.send = send;

    const warn = (msg) => {
      logger.log(`Message cannot be sent, socket closed: ${msg.type}`);
    };

    this.close = () => {
      console.log('[Connection] close websocket');
      this.status = 'closed';
      this.send = warn;
    };
  }
}
