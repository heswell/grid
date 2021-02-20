
import {View} from "@uitk/layout";
import { Grid } from "@vuu-ui/datagrid";

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

const OrdersGrid = ({resizeable, style, ...props}) => {
  return (
    <View resizeable style={style}>
      <Grid {...props} columns={ordersSchema.columns} />
    </View>
  );

}

export default OrdersGrid;
