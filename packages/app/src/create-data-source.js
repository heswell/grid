import { RemoteDataSource, Servers } from "@vuu-ui/data-remote";

export const serverUrl = '127.0.0.1:8090/websocket';

const DEFAULT_BUFFER_SIZE = 300;

export const createDataSource = (id, tableName, schema, config, bufferSize=DEFAULT_BUFFER_SIZE) => (new RemoteDataSource({
  bufferSize,
  columns: schema.columns.map(col => typeof col === 'string' ? col : col.name),
  serverName: Servers.Vuu,
  tableName,
  serverUrl,
  viewport: id,
  ...config
}));
