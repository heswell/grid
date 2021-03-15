import { Grid } from "@vuu-ui/datagrid";
import {QueryFilter} from "@vuu-ui/filter";


export const ordersSchema = {
  columns: [
      { name: 'orderId', width: 100} ,
      { name: 'side', width: 50} ,
      { name: 'ric', width: 80} ,
      { name: 'ccy', width: 60} ,
      { name: 'quantity', width: 80} ,
      {
        name: 'filledQuantity',
        label: 'filled qty',
       width: 80,
       type: {
        name: 'number',
        renderer: { name: 'progress', associatedField: 'quantity' },
        format: { decimals: 0 }
      },

      } ,
      { name: 'trader', width: 80} ,
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
