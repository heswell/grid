import { Grid } from "@vuu-ui/datagrid";
import {QueryFilter} from "@vuu-ui/filter";


export const ordersSchema = {
  columns: [
      { name: 'orderId', width: 120} ,
      { name: 'side', width: 100} ,
      { name: 'ric', width: 100} ,
      { name: 'ccy', width: 100} ,
      { name: 'quantity', width: 100} ,
      { name: 'filledQuantity', width: 100} ,
      { name: 'trader', width: 100} ,
      { name: 'lastUpdate', width: 100} ,
      ]
};

const OrdersGrid = ({id, onFilterChange, resizeable, style, ...props}) => {

  return (
    <>
      <QueryFilter onChange={q => onFilterChange('orders', q)}/>
      <Grid {...props} columns={ordersSchema.columns} />
      </>
  );

}

export default OrdersGrid;
