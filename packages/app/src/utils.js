import { RemoteDataSource, Servers } from "@vuu-ui/data-remote";

export const serverUrl = '127.0.0.1:8090/websocket';

export const createDataSource = (tableName, schema, bufferSize=50) => (new RemoteDataSource({
  bufferSize,
  columns: schema.columns.map(col => typeof col === 'string' ? col : col.name),
  serverName: Servers.Vuu,
  tableName,
  serverUrl
}));
