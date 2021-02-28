import React, { useMemo } from 'react';
// import { LocalDataSource } from "@vuu-ui/data-source";
import { DraggableLayout, Flexbox, Stack, View } from "@heswell/layout";
import { Grid } from "@vuu-ui/datagrid";

import { ordersSchema, OrdersGrid } from "./orders-grid";
import { pricesSchema, PricesGrid } from "./prices-grid";
import { createDataSource } from "./utils"
import { TableList } from "./table-list";

import './App.css';

function App() {
  const dataSourceOrders = useMemo(() => createDataSource('orders', ordersSchema), []);
  const dataSourcePrices = useMemo(() => createDataSource('prices', pricesSchema), []);
  const dataSourceParentOrders = useMemo(() => createDataSource('parentOrders', ordersSchema), []);
  const dataSourceChildOrders = useMemo(() => createDataSource('childOrders', pricesSchema), []);

  const handleFilter = (table = 'orders', filter) => {
    console.log(`filter ${table}`);
    // dataSourceOrders.filter({type: 'EQ', columnName: 'ric', value: 'AAPL.N'})
    dataSourceOrders.filterQuery(filter);
  }

  return (
    <DraggableLayout>
      <Flexbox className="App" style={{ flexDirection: 'column', height: '100vh' }}>
        <div style={{ height: 60, borderBottom: 'solid 1px #ccc' }} />
        <Flexbox style={{ flexDirection: 'row', flex: 1 }}>
          <TableList style={{ width: 120 }} />
          <Stack style={{ flex: 1 }} showTabs>
            <Flexbox title="Page 1" style={{ flexDirection: 'column' }}>
              <Flexbox style={{ flexDirection: 'row', flex: 1 }}>
                <View resizeable header style={{ flex: 1 }}>
                  <PricesGrid resizeable dataSource={dataSourcePrices} />
                </View>
                <OrdersGrid resizeable style={{ flex: 1 }} dataSource={dataSourceOrders} onFilter={handleFilter} />
              </Flexbox>
              {/* <Flexbox style={{ flexDirection: 'row', flex: 1 }}>
                <View resizeable header style={{ flex: 1 }}>
                  <Grid dataSource={dataSourceParentOrders} columnSizing="fill" renderBufferSize={20} />
                </View>
                <View resizeable header style={{ flex: 1 }}>
                  <Grid dataSource={dataSourceChildOrders} columnSizing="fill" renderBufferSize={20} />
                </View>
              </Flexbox> */}
            </Flexbox>
            <View title="Blank Page">
              <div  style={{ backgroundColor: "#ccc" }}></div>
            </View>
          </Stack>
        </Flexbox>
        <div style={{ height: 60, borderTop: 'solid 1px #ccc' }} />
      </Flexbox>
    </DraggableLayout>
  );
}

export default App;
