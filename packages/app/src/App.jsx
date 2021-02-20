import React, { useMemo } from 'react';
// import { LocalDataSource } from "@vuu-ui/data-source";
import { RemoteDataSource, Servers } from "@vuu-ui/data-remote";
import {Flexbox} from "@uitk/layout";

import {ordersSchema, OrdersGrid} from "./orders-grid";
import {pricesSchema, PricesGrid} from "./prices-grid";

import './App.css';

const createDataSource = (tableName, schema, bufferSize=100) => (new RemoteDataSource({
  bufferSize,
  columns: schema.columns.map(col => col.name),
  serverName: Servers.Vuu,
  tableName,
  serverUrl: '127.0.0.1:8090/websocket'
}));


function App() {
  const dataSourceOrders = useMemo(() => createDataSource('orders', ordersSchema), []);
  const dataSourcePrices = useMemo(() => createDataSource('prices', pricesSchema), []);

  return (
    <Flexbox className="App" style={{flexDirection: 'column', height: '100vh'}}>
      <div style={{height: 60, borderBottom: 'solid 1px #ccc'}}/>
      <Flexbox style={{flexDirection: 'row', flex: 1}}>
        <PricesGrid resizeable style={{flex: 1}} dataSource={dataSourcePrices} />
        <OrdersGrid resizeable style={{flex: 1}} dataSource={dataSourceOrders} />
      </Flexbox>
    </Flexbox>
  );
}

export default App;
