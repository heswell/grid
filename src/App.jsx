import React, {useRef, useState} from "react";
import { Grid } from "./grid";
import { RemoteDataView as RemoteDataSource } from "@heswell/data-remote";

import useStyles from './use-app-styles.js';

const tableName = 'Instruments'
const dataConfig = {url: '127.0.0.1:9090', tableName};

const instrumentColumns = [
  { name: 'Symbol', width: 120} ,
  { name: 'Name', width: 200} ,
  { name: 'Price', 
    type: { 
      name: 'number', 
      renderer: {name: 'background', flashStyle:'arrow-bg'},
      formatting: { decimals:2, zeroPad: true }
    },
    aggregate: 'avg'
  },
  { name: 'MarketCap', type: 'number', aggregate: 'sum' },
  { name: 'IPO'},
  { name: 'Sector'},
  { name: 'Industry', width: 120}
];

const columns = instrumentColumns;
const dataSource = new RemoteDataSource(dataConfig);


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

  const scrollBy = value => {
    console.log(`scrollBy ${value}`)
    const viewport = document.querySelector('.Viewport-0-2-6');
    const scrollTop = viewport.scrollTop;
    viewport.scrollTop = scrollTop + value;

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
      <div>
        <button onClick={() => scrollBy(1)}>Scroll Down 1</button>
        <button onClick={() => scrollBy(-1)}>Scroll Up 1</button>
        <button onClick={() => scrollBy(4)}>Scroll Down 4</button>
        <button onClick={() => scrollBy(-4)}>Scroll Up 4</button>
        <button onClick={() => scrollBy(24)}>Scroll Down 24</button>
        <button onClick={() => scrollBy(-24)}>Scroll Up 24</button>
      </div>
    </div>
    </>
  );
}
