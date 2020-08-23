
import { useRef } from 'react';
import { RemoteDataSource } from "@heswell/data-remote";
import getAgGridDataSource from './ag-grid-data-source';
import getPerspectiveDataSource from './perspective-data-source';
import getInstrumentDataSource from './instrument-data-source';
import getManyColumnsDataSource from './many-columns-data-source';



export function buildData(source, location, columnCount=100, rowCount=1000){

  if (source === 'many-columns'){
    
    return getManyColumnsDataSource(columnCount, rowCount);

  } else if (source === 'ag-grid-demo'){

    return getAgGridDataSource();

  } else if (source.startsWith('psp')){
    
    return getPerspectiveDataSource(source);

  } else if (source === 'instruments') {  

    return getInstrumentDataSource(location);  

  } else if (source === 'order-blotter'){
    const tableName = 'OrderBlotter'
    const dataConfig = {url: '127.0.0.1:9090', tableName};
    const dataSource = new RemoteDataSource(dataConfig);
    return [undefined, dataSource]

  } else {
    throw Error('useTestData does not recognize data source ${source}')
  }
}

export default function useTestData(source='instruments', location='local'){
  const {current: [columns, dataSource]} = useRef(buildData(source, location, 10, 100))
  return [columns, dataSource]
}

