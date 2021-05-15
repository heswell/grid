import { createLogger, logColor } from '@heswell/utils/src/logging';
import DataStore from "./data-store";
import Table from "./worker-table";
import {viewportChanges} from './data-store-utils'

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

  connection = new DataStoreConnection(dataStore, url, callback);
  const status = 'connected';
  callback({ type: 'connection-status', status });
  connection.status = status;
  return connection;

}

const createDataStore = async (url) => {
  console.log(`table config url ${url}`);
  const loadTableConfiguration = async () => await import(url);

  const { config } = await loadTableConfiguration();
  console.log(`got config ${JSON.stringify(config, null, 2)}`);
  const { generateData } = await import(config.dataUrl);
  const table = new Table(config);
  table.setData(generateData());
  return new DataStore(table, { columns: config.columns }/*, updateQueue*/);

}

class DataStoreConnection {
  constructor(dataStore, url, callback) {
    this.url = url;
    this.connectionCallback = callback;
    this.viewPortId = undefined;
    this.setDataStore(dataStore);
    this.status = 'ready';
    this.viewportMeta = null;
  }

  setDataStore(dataStore) {
    const { connectionCallback: callback, viewPortId } = this;


    const send = ({ requestId, body }) => {
      console.log(`%c>>>  (DataStoreConnection)  ${JSON.stringify(body)}`, 'color:blue;font-weight:bold;');
      switch (body.type) {
        case "CREATE_VP":
          console.log(`createVP`,{body})
          const viewPortId = this.viewPortId = requestId;
          const { columns, filterSpec, groupBy, sort, range, table } = body;
          callback({ requestId, body: { type: "CREATE_VP_SUCCESS", viewPortId, columns, range, table } });
          const { rows, size: vpSize } = dataStore.setRange({ lo: range.from, hi: range.to }, true);
          const ts = +(new Date());
          callback({
            requestId: "NA",
            body: {
              type: "TABLE_ROW",
              timeStamp: ts,
              rows: [
                { viewPortId, vpSize, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE", sel: 0, ts, data: [] }
              ].concat(rows.map(([rowIndex, , , , , , rowKey, sel, ...data]) => (
                { viewPortId, vpSize, rowIndex, rowKey, updateType: "U", sel, ts, data }
              )))
            }
          })
          this.viewportMeta = {columns, filterSpec, groupBy, sort};
          break;

        case "CHANGE_VP_RANGE": {
          console.log(`changeVP`,{body})
          const { from, to } = body;
          callback({ requestId, body: { type: "CHANGE_VP_RANGE_SUCCESS", viewPortId, from, to } });
          const { rows, size: vpSize } = dataStore.setRange({ lo: from, hi: to }, true);
          const ts = +(new Date());
          callback({
            requestId: "NA",
            body: {
              type: "TABLE_ROW",
              timeStamp: ts,
              rows: [
                { viewPortId, vpSize, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE", sel: 0, ts, data: [] }
              ].concat(rows.map(([rowIndex, , , , , , rowKey, sel, ...data]) => (
                { viewPortId, vpSize, rowIndex, rowKey, updateType: "U", sel, ts, data }
              )))
            }
          })

        }
          break;

        case "CHANGE_VP": {
          const {viewPortId} = this;
          const diff = viewportChanges(this.viewportMeta, body);
          callback({ requestId, body: { type: "CHANGE_VP_SUCCESS", viewPortId } });
          if (diff.sort){
            const sortCriteria = body.sort.sortDefs.map(({column, sortType}) => [column, sortType === 'd' ? 'dsc' : 'asc'])
            const {rows, size: vpSize} = dataStore.sort(sortCriteria)
            const ts = +(new Date());
            callback({
              requestId: "NA",
              body: {
                type: "TABLE_ROW",
                timeStamp: ts,
                rows: rows.map(([rowIndex, , , , , , rowKey, sel, ...data]) => (
                  { viewPortId, vpSize, rowIndex, rowKey, updateType: "U", sel, ts, data }
                ))
              }
            })
          } else if (diff.groupBy){
            const {rows, size: vpSize} = dataStore.groupBy(body.groupBy)
            const ts = +(new Date());
            callback({
              requestId: "NA",
              body: {
                type: "TABLE_ROW",
                timeStamp: ts,
                rows: [
                  { viewPortId, vpSize, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE", sel: 0, ts, data: [] }
                ].concat(rows.map(([rowIndex, ,isLeaf,isExpanded,depth,count, rowKey, sel, ...data]) => (
                  { viewPortId, vpSize, rowIndex, rowKey, updateType: "U", sel, ts, data: [
                    Math.abs(depth), isExpanded, rowKey, isLeaf, "", count, ...data
                  ] }
                )))
                }
            })

          }
        }
        break;

        case "OPEN_TREE_NODE":
        console.log(`OPEN_TREE_NODE`, body)
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
