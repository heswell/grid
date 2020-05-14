import React, {useRef, useState} from "react";
import { Grid } from "./grid";
import { LocalDataSource } from "@heswell/data-source";

import useStyles from './use-app-styles.js';

const data = [];

/** @type {Column[]} */
const columns = [
  { name: "id", width: 100, locked: true },
  { name: "ccy", width: 100, locked: true }
];

const start = performance.now();
for (let i = 2; i < 25; i++) {
  columns.push({ name: `${i - 1}M`, width: 100 });
}

for (let i = 0; i < 100; i++) {
  const row = { id: i, ccy: "USDGBP" };
  for (let j = 2; j < 25; j++) {
    row[`${j - 1}M`] = `${i},${j - 1}`;
  }
  data.push(row);
}

const end = performance.now();
console.log(`creating data took ${end - start} ms`);

const dataSource = new LocalDataSource({ data });

export default function App() {

  const pendingHeight = useRef(600);
  const pendingWidth = useRef(800);

  const [state, setState] = useState({
    height: 600,
    width: 800
  });

  const setDirty = (e, name) => {
    const value = parseInt(e.target.value || '0');
    if (name === 'width'){
      pendingWidth.current = value;
    } else if (name === 'height'){
      pendingHeight.current = value;
    }
  }

  const applyChanges = () => {
    console.log(`apply height ${pendingHeight.current} width ${pendingWidth.current}`)
    setState({height: pendingHeight.current, width: pendingWidth.current});
  }

  const classes = useStyles();
  return (
    <>
    <Grid
      height={state.height}
      width={state.width}
      headerHeight={32}
      columns={columns}
      dataSource={dataSource}
    />
    <div className={classes.editPanel}>
      <label>Width</label><input type="text" defaultValue={state.width} onChange={e => setDirty(e, 'width')}/>
      <label>Height</label><input type="text" defaultValue={state.height} onChange={e => setDirty(e, 'height')}/>
      <button onClick={applyChanges}>Apply</button> 
    </div>
    </>
  );
}
