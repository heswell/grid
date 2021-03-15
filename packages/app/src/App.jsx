import React, { useMemo, useState } from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';

// import { LocalDataSource } from "@vuu-ui/data-source";
import { Chest, DraggableLayout, Drawer, Flexbox, Stack, View } from "@heswell/layout";

import { ordersSchema, OrdersGrid } from "./orders-grid";
import { PricesGrid } from "./prices-grid";
import { createDataSource } from "./utils"
import { TableList } from "./table-list";
import {pricesSchema} from "./table-schemas";

import './App.css';

const newPage = (index) => (
  <View title="New Page" style={{flexGrow: 1, flexShrink: 0, flexBasis: 0}} closeable >
    <div style={{ backgroundColor: "#ccc" }}></div>
  </View>

)

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


  console.log({ defaultTheme })

  return (
    <Provider theme={defaultTheme}>
      <DraggableLayout style={{width: '100vw', height: "100vh"}}>
        <Flexbox className="App" style={{ flexDirection: 'column', height: '100%' }}>
          <div style={{ height: 40, borderBottom: 'solid 1px #ccc' }} />
          <Chest style={{ flex: 1 }}>
            <Drawer position="left" inline peekaboo clickToOpen sizeOpen={150} toggleButton="end">
              <View title="Tables" header style={{ height: '100%' }}>
                <TableList style={{ width: 120 }} />
              </View>
            </Drawer>
            <Stack style={{ width: '100%', height: '100%' }} showTabs enableAddTab createNewChild={newPage} preserve>
              <Flexbox title="Page 1" style={{ flexDirection: 'column' }}>
                <Flexbox style={{ flexDirection: 'row', flex: 1 }}>
                  <View resizeable style={{ flex: 1 }} resize="defer">
                    <PricesGrid dataSource={data.prices} onFilterChange={handleFilterChange} />
                  </View>
                  <View resizeable style={{ flex: 1 }} resize="defer">
                    <OrdersGrid dataSource={data.orders} onFilterChange={handleFilterChange} />
                  </View>
                </Flexbox>
              </Flexbox>
            </Stack>
          </Chest>
        </Flexbox>
      </DraggableLayout>
    </Provider>
  );
}

export default App;
