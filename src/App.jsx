import React, {useEffect, useMemo, useRef, useState} from "react";
import { Grid } from "./grid";
import {ThemeProvider} from 'react-jss';
import themes from './themes';
import {buildData} from './data/use-test-data';

import useStyles from './use-app-styles.js';


export default function App() {

  useEffect(() => {
    console.log(`App mounted`)
  },[])

  const pendingHeight = useRef(600);
  const pendingWidth = useRef(800);

  const [dataLocation, setDataLocation] = useState('local');
  const [columns, dataSource] = useMemo(() => buildData(dataLocation),[dataLocation]);

  const [theme, setTheme] = useState('light');
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

  const handleSelectTheme = evt => setTheme(evt.target.value);
  const handleSelectDataSource = evt => setDataLocation(evt.target.value)
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
    <ThemeProvider theme={themes[theme]}>
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
      <select defaultValue="light" onChange={handleSelectTheme}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <select defaultValue="local" onChange={handleSelectDataSource}>
        <option value="vs">Viewserver</option>
        <option value="local">Local Test Data</option>
        <option value="local-instruments">Local Instruments</option>
      </select>
    </div>
    </ThemeProvider>
  );
}
