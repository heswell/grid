
import { useRef } from 'react';
import { LocalDataSource } from "@heswell/data-source";
import { RemoteDataSource } from "@heswell/data-remote";
import getAgGridDataSource, {postMessage} from './ag-grid-data-source';


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

export function buildData(source, columnCount=25, rowCount=100){
  console.log(`>>>>> buildData`)
  const data = [];

  if (source === 'local'){
    /** @type {Column[]} */
    const columns = [
      { name: "id", width: 100, locked: true },
      { name: "ccy", width: 100, locked: true }
    ];

    const start = performance.now();
    for (let i = 2, heading= 'Group 1'; i < columnCount; i++) {
      if ((i-2)%3 === 0){
        heading = `Group ${((i-2)/3) + 1}`
      }
      columns.push({ name: `${i - 1}M`, width: 100, heading: [`${i - 1}M`, heading] });
    }

    for (let i = 0; i < rowCount; i++) {
      const row = { id: i, ccy: "USDGBP" };
      for (let j = 2; j < columnCount; j++) {
        row[`${j - 1}M`] = `${i},${j - 1}`;
      }
      data.push(row);
    }

    const end = performance.now();
    console.log(`creating data took ${end - start} ms`);
    const dataSource = new LocalDataSource({ data, columns });
    return [columns, dataSource]

  } else if (source === 'local-instruments') {  

    const tableName = 'Instruments'
    const dataConfig = {url: '/instruments.js', tableName};
    const columns = instrumentColumns;
    const dataSource = new LocalDataSource(dataConfig);
    return [columns, dataSource]

  } else if (source === 'order-blotter'){
    const tableName = 'OrderBlotter'
    const dataConfig = {url: '127.0.0.1:9090', tableName};
    const dataSource = new RemoteDataSource(dataConfig);
    return [undefined, dataSource]
  } else if (source === 'ag-grid'){
    return getAgGridDataSource();
 }  else {
    const tableName = 'Instruments'
    const dataConfig = {url: '127.0.0.1:9090', tableName};
    const columns = instrumentColumns;
    const dataSource = new RemoteDataSource(dataConfig);
    return [columns, dataSource]
  }
}

export const startStressTest = () => {
  postMessage({type: 'startStress'});
}

export const startLoadTest = () => {
  postMessage({type:'startLoad'});
}

export const stopTests = () => {
  postMessage({type: 'stopTest'});
  console.log('Test stopped');
}

export default function useTestData(source='order-blotter'){
  const {current: [columns, dataSource]} = useRef(buildData(source, 10, 100))
  return [columns, dataSource]
}

