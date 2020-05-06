import React from "react";
import { Grid } from "./grid";
import {LocalDataSource} from '@heswell/data-source';

import "./styles.css";


const data = [];
const columns = [{name: 'id', width: 200, locked: true}, {name:'ccy', width: 200, locked: true}];

const start = performance.now();
for (let i = 2 ; i < 100; i++){
  columns.push({name: `${i-1}M`, width: 200});
}

for (let i=0;i<1000;i++){
  const row = {id: i, ccy: 'USDGBP'};
  for (let j=2;j<100;j++){
    row[`${j-1}M`] = `${i},${j-1}`;
  }
  data.push(row);
}

const end = performance.now();
console.log(`creating data took ${(end-start)} ms`)

const dataView = new LocalDataSource({data});
console.log(dataView)

/**
 * First Cut
 */
export default function App() {
  return <Grid height={600} width={800} headerHeight={32} />;
}
