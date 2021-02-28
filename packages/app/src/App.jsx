import React, { useMemo } from 'react';
// import { LocalDataSource } from "@vuu-ui/data-source";
import {DraggableLayout, Flexbox} from "@heswell/layout";
import {ordersSchema, OrdersGrid} from "./orders-grid";
import {pricesSchema, PricesGrid} from "./prices-grid";
import {createDataSource} from "./utils"
import {TableList} from "./table-list";

import './App.css';

function App() {
  // const dataSourceOrders = useMemo(() => createDataSource('orders', ordersSchema), []);
  // const dataSourcePrices = useMemo(() => createDataSource('prices', pricesSchema), []);

  // const handleFilter = (table='orders', filter) => {
  //   console.log(`filter ${table}`);
  //   // dataSourceOrders.filter({type: 'EQ', columnName: 'ric', value: 'AAPL.N'})
  //   dataSourceOrders.filterQuery(filter);
  // }


  return (
    <DraggableLayout>
      <Flexbox className="App" style={{flexDirection: 'column', height: '100vh'}}>
        <div style={{height: 60, borderBottom: 'solid 1px #ccc'}}/>
        <Flexbox style={{flexDirection: 'row', flex: 1}}>
          <TableList style={{width: 120}} />
          <div style={{flex: 1}}/>
          {/* <PricesGrid resizeable style={{flex: 1}} dataSource={dataSourcePrices} />
          <OrdersGrid resizeable style={{flex: 1}} dataSource={dataSourceOrders} onFilter={handleFilter}/> */}
        </Flexbox>
        <div style={{height: 60, borderTop: 'solid 1px #ccc'}}/>
      </Flexbox>
    </DraggableLayout>
  );
}

export default App;
