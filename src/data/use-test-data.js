
import { useRef } from 'react';
import { LocalDataSource } from "@heswell/data-source";
import { RemoteDataSource } from "@heswell/data-remote";
import getAgGridDataSource from './ag-grid-data-source';
import getPerspectiveDataSource from './perspective-data-source';
import getManyColumnsDataSource from './many-columns-data-source';


const instrumentColumns = [
  { name: 'Symbol', width: 80, flex: 0} ,
  { name: 'Name', width: 200} ,
  { name: 'Price', 
    type: { 
      name: 'number', 
      renderer: {name: 'background', flashStyle:'arrow'},
      format: { decimals: 2, zeroPad: true }
    },
    aggregate: 'avg'
  },
  { name: 'MarketCap', type: 'number', aggregate: 'sum' },
  { name: 'IPO', width: 55, flex: 0},
  { name: 'Sector'},
  { name: 'Industry'}
];

export function buildData(source, location, columnCount=25, rowCount=100){
  console.log(`>>>>> buildData`)

  if (source === 'many-columns'){
    
    return getManyColumnsDataSource(columnCount, rowCount);

  } else if (source === 'ag-grid-demo'){

    return getAgGridDataSource();

  } else if (source === 'psp-streaming'){
    return getPerspectiveDataSource();

  } else if (source === 'instruments') {  
    
    if (location === 'local'){
      
      const tableName = 'Instruments'
      const dataConfig = {columns: instrumentColumns, dataUrl: '/instruments.js', tableName};
      const columns = instrumentColumns;
      const dataSource = new LocalDataSource(dataConfig);
      return [columns, dataSource];

    } else if (location === 'remote'){
      
      const tableName = 'Instruments'
      const dataConfig = {serverUrl: '127.0.0.1:9090', tableName};
      const columns = instrumentColumns;
      const dataSource = new RemoteDataSource(dataConfig);
      return [columns, dataSource]
    
    }

  } else if (source === 'order-blotter'){
    const tableName = 'OrderBlotter'
    const dataConfig = {url: '127.0.0.1:9090', tableName};
    const dataSource = new RemoteDataSource(dataConfig);
    return [undefined, dataSource]

  }
}

export default function useTestData(source='instruments', location='local'){
  const {current: [columns, dataSource]} = useRef(buildData(source, location, 10, 100))
  return [columns, dataSource]
}

