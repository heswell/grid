
import perspective from '@finos/perspective';
import PerspectiveDataModel from './PerspectiveDataModel';

export async function buildData(source, location, columnCount=20, rowCount=100){


  // if (source === 'many-columns'){
    
  //   return getManyColumnsDataSource(columnCount, rowCount);

  // } else if (source === 'ag-grid-demo'){

  //   return getAgGridDataSource();

  if (source === 'psp-superstore'){
    const data = await fetch('/tables/psp-superstore/superstore.arrow');
    const dataRequest = await data.arrayBuffer();
    const worker = perspective.worker();
    const buffer = await dataRequest;
    const table = await worker.table(buffer);
    const view = table.view();

    const dataModel = new PerspectiveDataModel();
    await dataModel.set_view(table, view);

    return dataModel;

  //   return getPerspectiveDataSource(source);

  // } else if (source === 'superstore-arrow'){
    
  //   return getSuperstoreDataSource(source, location);

  // } else if (source === 'instruments') {  

  //   return getInstrumentDataSource(location);  

  // } else if (source === 'order-blotter'){
  //   const tableName = 'OrderBlotter'
  //   const dataConfig = {url: '127.0.0.1:9090', tableName};
  //   const dataSource = new RemoteDataSource(dataConfig);
  //   return [undefined, dataSource]

  } else {
    throw Error('buildData does not recognize data source ${source}')
  }
}

