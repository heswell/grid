import React, { useMemo, useState } from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';

// import { LocalDataSource } from "@vuu-ui/data-source";
import { Chest, DraggableLayout, Drawer, Flexbox, Stack, View } from "@heswell/layout";

import { ordersSchema, OrdersGrid } from "./orders-grid";
import { pricesSchema, PricesGrid } from "./prices-grid";
import { createDataSource } from "./utils"
import { TableList } from "./table-list";

import './App.css';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const data = useMemo(() => ({
    orders: createDataSource('orders', ordersSchema),
    prices: createDataSource('prices', pricesSchema)
  }), []);

  const handleFilterChange = (table = 'orders', filterQuery) => {
    console.log(`set filter on ${table} : ${filterQuery}`)
    data[table].filterQuery(filterQuery);
  }

  const toggleDrawer = () => {

    setDrawerOpen(!drawerOpen)
  }

  return (
    <Provider theme={defaultTheme}>
      <DraggableLayout>
        <Flexbox className="App" style={{ flexDirection: 'column', height: '100vh' }}>
          <div style={{ height: 60, borderBottom: 'solid 1px #ccc' }} />
          <Chest style={{ flex: 1 }}>
            <Drawer position="left" inline peekaboo clickToOpen>
              <TableList style={{ width: 120 }} />
            </Drawer>
            <Stack style={{ width: '100%', height: '100%' }} showTabs enableAddTab>
              <Flexbox title="Page 1" style={{ flexDirection: 'column' }}>
                <Flexbox style={{ flexDirection: 'row', flex: 1 }}>
                  <View resizeable header style={{ flex: 1 }}>
                    <PricesGrid dataSource={data.prices} onFilterChange={handleFilterChange} />
                  </View>
                  <View resizeable header style={{ flex: 1 }}>
                    <OrdersGrid dataSource={data.orders} onFilterChange={handleFilterChange} />
                  </View>
                </Flexbox>
              </Flexbox>
              <View title="Blank Page">
                <div style={{ backgroundColor: "#ccc" }}></div>
              </View>
            </Stack>
          </Chest>
          <div style={{ height: 60, borderTop: 'solid 1px #ccc' }}  onClick={toggleDrawer}/>
        </Flexbox>
      </DraggableLayout>
    </Provider>
  );
}

export default App;
