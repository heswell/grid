import {useRef, useState} from 'react';
import {Toolbar, Tooltray, View} from "@heswell/layout";
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

const OrdersGrid = ({id, onFilter, resizeable, style, ...props}) => {

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
    <View resizeable style={style} id={id}>
      <Toolbar style={{borderBottom: 'solid 1px #ccc'}}>
        <label className="hwFormLabel">Filter</label>
          <input className="hwInput" defaultValue="Enter filter query" onChange={handleFilterValueChange} onFocus={handleFocus}/>
        <button className="hwButton" onClick={handleFilter}>Apply</button>
        <input className="hwInput" defaultValue="" onChange={handleFilterNameChange} onFocus={handleFocus}/>
        <button className="hwButton" onClick={saveFilter} variant="secondary">Save</button>
        {filters.length > 0 ? (
          <Tooltray>
            {filters.map(filter => (
              <button className="hwPill" variant="selectable" label={filter.name} />
            ))}
          </Tooltray>
        ) : null}
      </Toolbar>
      <Grid {...props} columns={ordersSchema.columns} />
    </View>
  );

}

export default OrdersGrid;
