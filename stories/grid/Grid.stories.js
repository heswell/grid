import React, { useMemo, useRef, useState } from "react";

import { Grid } from "@vuu-ui/datagrid";
import { RemoteDataSource, Servers } from "@vuu-ui/data-remote";
import {
  instrumentPriceColumns,
  instrumentSchema,
  instrumentSchemaFixed,
  instrumentSchemaLabels,
  instrumentSchemaHeaders,
  orderColumns,
  pricesColumns} from './columnMetaData';

import "../assets/material-design.css";
import "../assets/fonts.css"
import "./Grid.stories.css"


// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Grid/Default",
  component: Grid,
};


export const EmptyGrid = () => <Grid />;

export const BasicGrid = () => {
  const gridRef = useRef(null)
  const [rowHeight, setRowHeight] = useState(24)

  const dataConfig = useMemo(() => ({
    bufferSize: 100,
    columns: instrumentSchema.columns.map(col => col.name),
    tableName: 'instruments',
    configUrl: '/tables/instruments/config.js',
  }),[]);

  const dataSource = useMemo(() => new RemoteDataSource(dataConfig), [dataConfig]);

  const incrementProp = () => {
    setRowHeight(value => value + 1)
  }

  const decrementProp = () => {
    setRowHeight(value => value - 1)
  }

  const incrementCssProperty = () => {
    const rowHeight = parseInt(getComputedStyle(gridRef.current).getPropertyValue("--hw-grid-row-height"));
    gridRef.current.style.setProperty("--grid-row-height", `${rowHeight + 1}px`)
  }

  const decrementCssProperty = () => {
    const rowHeight = parseInt(getComputedStyle(gridRef.current).getPropertyValue("--hw-grid-row-height"));
    gridRef.current.style.setProperty("--grid-row-height", `${rowHeight - 1}px`)
  }

  const setLowDensity = () => {
    gridRef.current.style.setProperty("--grid-row-height", `32px`)
  }
  const setHighDensity = () => {
    gridRef.current.style.setProperty("--grid-row-height", `20px`)
  }

  return <>
    <div>
      <input defaultValue="Life is" />
    </div>
    <Grid
      dataSource={dataSource}
      columns={instrumentSchema.columns}
      height={600}
      ref={gridRef}
      renderBufferSize={20}
      style={{ margin: 10, border: 'solid 1px #ccc' }}
    />
    <br />
    <button onClick={incrementProp}>Increase row height prop</button>
    <button onClick={decrementProp}>Decrease row height prop</button>
    <button onClick={incrementCssProperty}>Increase row height custom property</button>
    <button onClick={decrementCssProperty}>Decrease row height custom property</button>
    <br />
    <button onClick={setHighDensity}>High Density</button>
    <button onClick={setLowDensity}>Low Density</button>
  </>;
};

export const BasicGridColumnLabels = () => {
  const gridRef = useRef(null)

  const dataConfig = useMemo(() => ({
    bufferSize: 100,
    columns: instrumentSchemaLabels.columns.map(col => col.name),
    tableName: 'instruments',
    configUrl: '/tables/instruments/config.js',
  }),[]);

  const dataSource = useMemo(() => new RemoteDataSource(dataConfig), [dataConfig]);

  return <>
    <div>
      <input defaultValue="Life is" />
    </div>
    <Grid
      dataSource={dataSource}
      columns={instrumentSchemaLabels.columns}
      height={600}
      ref={gridRef}
      renderBufferSize={20}
      style={{ margin: 10, border: 'solid 1px #ccc' }}
    />
  </>;
};

export const BasicGridColumnFixedCols = () => {
  const gridRef = useRef(null)

  const dataConfig = useMemo(() => ({
    bufferSize: 100,
    columns: instrumentSchemaFixed.columns.map(col => col.name),
    tableName: 'instruments',
    configUrl: '/tables/instruments/config.js',
  }),[]);

  const dataSource = useMemo(() => new RemoteDataSource(dataConfig), [dataConfig]);

  return <>
    <div>
      <input defaultValue="Life is" />
    </div>
    <Grid
      dataSource={dataSource}
      columns={instrumentSchemaFixed.columns}
      height={600}
      ref={gridRef}
      renderBufferSize={20}
      style={{ margin: 10, border: 'solid 1px #ccc' }}
    />
  </>;
};

export const BasicGridColumnHeaders = () => {
  const gridRef = useRef(null)

  const dataConfig = useMemo(() => ({
    bufferSize: 100,
    columns: instrumentSchemaHeaders.columns.map(col => col.name),
    tableName: 'instruments',
    configUrl: '/tables/instruments/config.js',
  }),[]);

  const dataSource = useMemo(() => new RemoteDataSource(dataConfig), [dataConfig]);

  return <>
    <div>
      <input defaultValue="Life is" />
    </div>
    <Grid
      dataSource={dataSource}
      columns={instrumentSchemaHeaders.columns}
      height={600}
      ref={gridRef}
      renderBufferSize={20}
      style={{ margin: 10, border: 'solid 1px #ccc' }}
    />
  </>;
};

export const VuuInstruments = () => {
  const gridRef = useRef(null)
  const instrumentColumns = [
    { name: 'ric' },
    { name: 'description' },
    { name: 'currency' },
    { name: 'exchange' },
    { name: 'lotSize' }
  ]

  const dataConfig = {
    bufferSize: 100,
    columns: instrumentColumns.map(col => col.name),
    serverName: Servers.Vuu,
    tableName: 'instruments',
    serverUrl: '127.0.0.1:8090/websocket'
  };

  const dataSource = useMemo(() => new RemoteDataSource(dataConfig), []);

  return <>
    <Grid dataSource={dataSource} columns={instrumentColumns} height={600} ref={gridRef} />
  </>;
};

export const VuuInstrumentPrices = () => {
  const gridRef = useRef(null)


  const dataConfig = {
    bufferSize: 100,
    columns: instrumentPriceColumns.map(col => col.name),
    serverName: Servers.Vuu,
    tableName: 'instrumentPrices',
    serverUrl: '127.0.0.1:8090/websocket'
  };

  const dataSource = useMemo(() => new RemoteDataSource(dataConfig), []);

  return <>
    <Grid dataSource={dataSource} columns={instrumentPriceColumns} height={600} ref={gridRef} />
  </>;
};

const serverUrl = '127.0.0.1:8090/websocket';

const dataConfigPrices = {
  bufferSize: 100,
  columns: pricesColumns.map(col => col.name),
  serverName: Servers.Vuu,
  tableName: 'prices',
  serverUrl
};

const dataConfigOrders = {
  bufferSize: 100,
  columns: orderColumns.map(col => col.name),
  serverName: Servers.Vuu,
  tableName: 'orders',
  serverUrl
};

export const VuuInstrumentPricesOrders = () => {
  const gridRef = useRef(null)

  const dataSourcePrices = useMemo(() => new RemoteDataSource(dataConfigPrices), []);
  const dataSourceOrders = useMemo(() => new RemoteDataSource(dataConfigOrders), []);

  const vp = useRef({ orders: null, prices: null });

  const setViewPort = (name, viewPortId) => {
    console.log(`${name} VP = ${viewPortId}`)
    vp.current[name] = viewPortId;
    if (vp.current.orders && vp.current.prices) {
      const { orders, prices } = vp.current;
      dataSourceOrders.createLink(prices, orders, 'ric');
    }
  }

  const handleOrdersSubscribed = (_, { viewPortId }) => setViewPort('orders', viewPortId);
  const handlePricesSubscribed = (_, { viewPortId }) => setViewPort('prices', viewPortId);


  dataSourcePrices.on("subscribed", handlePricesSubscribed);
  dataSourceOrders.on("subscribed", handleOrdersSubscribed);


  const handleRowClick = (row) => {
    const key = row[4];
  }

  return <>
    <div style={{ display: 'flex', height: 600 }}>
      <Grid dataSource={dataSourcePrices} columns={pricesColumns} height={600} ref={gridRef} onRowClick={handleRowClick} />
      <Grid dataSource={dataSourceOrders} columns={orderColumns} height={600} ref={gridRef} />
    </div>
  </>;
};
