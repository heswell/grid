import { LocalDataSource, WorkerDataSource } from "@heswell/data-source";
import { RemoteDataSource } from "@heswell/data-remote";

const schema = { 
  columns: [
    { name: 'Symbol', width: 80, flex: 0} ,
    { name: 'Name', width: 200} ,
    { name: 'Price', 
      type: { 
        name: 'number', 
        renderer: {name: 'background-cell', flashStyle:'arrow'},
        format: { decimals: 2, zeroPad: true }
      },
      aggregate: 'avg'
    },
    { name: 'MarketCap', type: 'number', aggregate: 'sum' },
    { name: 'IPO', width: 55, flex: 0},
    { name: 'Sector'},
    { name: 'Industry'}
  ]
};

const tableName = 'Instruments'

export default function getInstrumentSource(location){

  let dataSource;

  if (location === 'local'){

    dataSource = new LocalDataSource({
      schema, 
      dataUrl: '/instruments.js',
      tableName
    });

  } else if (location === 'remote'){

    dataSource = new RemoteDataSource({
      serverUrl: '127.0.0.1:9090',
      tableName
    });

  } else if (location === 'worker'){
    dataSource = new WorkerDataSource({
      schema, 
      configUrl: '/tables/instruments/config.js',
      tableName
    });

  } else {
    throw Error(`Unknown data location ${location}`)
  }
  return [schema.columns, dataSource];

}