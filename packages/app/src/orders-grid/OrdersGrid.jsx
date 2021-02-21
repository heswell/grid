import {useRef, useState} from 'react';
import {View} from "@uitk/layout";
import { Grid } from "@vuu-ui/datagrid";
import {Button, ControlLabel, Icon, Input, Pill, Toolbar, Tooltray} from "@uitk/toolkit";

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

const OrdersGrid = ({onFilter, resizeable, style, ...props}) => {

  const filterValue = useRef('');
  const filterName = useRef('');
  const [filters, setFilters] = useState([]);

  const handleFilterValueChange = (evt) => {
    const value = evt.target.value;
    filterValue.current = value;
  }
  const handleFilterNameChange = (evt) => {
    const value = evt.target.value;
    filterName.current = value;
  }

  const handleFilter = () => {
    onFilter('orders', filterValue.current)
  }

  const saveFilter = () => {
    const filter = {
      name: filterName.current,
      value: filterValue.current
    }
    setFilters(state => state.concat(filter));
  }

  const handleFocus = evt => {
    console.log(`handleFocus`)
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.select();
  }


  return (
    <View resizeable style={style}>
      <Toolbar style={{borderBottom: 'solid 1px #ccc'}}>
        <ControlLabel label="Filter">
          <Input defaultValue="Enter filter query" onChange={handleFilterValueChange} onFocus={handleFocus}/>
          </ControlLabel>
        <Button onClick={handleFilter}>Apply</Button>
        <Input defaultValue="" onChange={handleFilterNameChange} onFocus={handleFocus}/>
        <Button onClick={saveFilter} variant="secondary"><Icon name="save"/></Button>
        {filters.length > 0 ? (
          <Tooltray>
            {filters.map(filter => (
              <Pill variant="selectable" label={filter.name} />
            ))}
          </Tooltray>
        ) : null}
      </Toolbar>
      <Grid {...props} columns={ordersSchema.columns} />
    </View>
  );

}

export default OrdersGrid;
