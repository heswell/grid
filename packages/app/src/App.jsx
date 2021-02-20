import React, { useMemo } from 'react';
import { Grid } from "@vuu-ui/datagrid";
// import { LocalDataSource } from "@vuu-ui/data-source";
import { RemoteDataSource, Servers } from "@vuu-ui/data-remote";

import './App.css';

const pricesSchema = {
  columns: [
    { name: 'ric', width: 100 },
    {
      name: 'bid',
      type: {
        name: 'number',
        renderer: { name: 'background', flashStyle: 'arrow-bg' },
        formatting: { decimals: 2, zeroPad: true }
      },
      aggregate: 'avg'
    },
    {
      name: 'ask',
      type: {
        name: 'number',
        renderer: { name: 'background', flashStyle: 'arrow-bg' },
        formatting: { decimals: 2, zeroPad: true }
      },
      aggregate: 'avg'
    },
    { name: 'last', type: { name: 'number' } },
    { name: 'open', type: { name: 'number' } },
    { name: 'close', type: { name: 'number' } },
    { name: 'scenario' }
  ]
};

const schema = {
  columns: [
    { name: "Symbol", width: 120 },
    { name: "Name", width: 200 },
    {
      name: "Price",
      type: {
        name: "number",
        renderer: { name: "background", flashStyle: "arrow-bg" },
        formatting: { decimals: 2, zeroPad: true },
      },
      aggregate: "avg",
    },
    { name: "MarketCap", type: "number", aggregate: "sum" },
    { name: "IPO" },
    { name: "Sector" },
    { name: "Industry" },
  ],
};
const dataConfig = { bufferSize: 10, dataUrl: "/data/instruments.js", schema };

const serverUrl = '127.0.0.1:8090/websocket';

const dataConfigPrices = {
  bufferSize: 100,
  columns: pricesSchema.columns.map(col => col.name),
  serverName: Servers.Vuu,
  tableName: 'prices',
  serverUrl
};


function App() {
  const dataSourcePrices = useMemo(() => new RemoteDataSource(dataConfigPrices), []);
  // const dataSource = useMemo(() => new LocalDataSource(dataConfig), []);

  return (
    <div className="App">
      <Grid dataSource={dataSourcePrices} columns={pricesSchema.columns} height={600} />
    </div>
  );
}

export default App;
