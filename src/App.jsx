import React, {useEffect, useMemo, useRef, useState} from "react";
import { Grid } from "./grid";
import MenuContext from './grid/context-menu';
import ControlPanel from './control-panel/control-panel'
import {ThemeProvider} from 'react-jss';
import themes from './themes';
import {buildData, startLoadTest, startStressTest, stopTests} from './data/use-test-data';

// import renderContextMenu from './components/material-ui/context-menu/show-context-menu';

import useStyles from './use-app-styles.js';

const toolbarHeight = 300;

export default function App() {

  useEffect(() => {

  },[])

  const messageBoard = useRef(null);

  const [state, setState] = useState({
    dataLocation: "local",
    dataSource: 'instruments',
    gridHeight: document.getElementById('root').clientHeight - toolbarHeight,
    gridWidth: document.getElementById('root').clientWidth,
    groupBy: null,
    theme: 'light'
  });

  const [columns, dataSource] = useMemo(() => 
    buildData(state.dataSource, state.dataLocation),
    [state.dataSource, state.dataLocation]
  );

  dataSource.on('message', (evt, message) => {
    messageBoard.current.innerText = message;
  })

  const scrollBy = value => {
    console.log(`scrollBy ${value}`)
    const viewport = document.querySelector('.Viewport-0-2-6');
    const scrollTop = viewport.scrollTop;
    viewport.scrollTop = scrollTop + value;

  }

  const handleAction = action => {
    switch(action.type){
      case 'start-load-test': return startLoadTest();
      case 'start-stress-test': return startStressTest();
      case 'stop-test': return stopTests();
      case 'scroll-by': return scrollBy(action.scrollBy);
      default:
    }
  }

  const handleChange = stateChanges => {
    setState(prevState => ({...prevState, ...stateChanges}))
  }

  const classes = useStyles();
  return (
    <ThemeProvider theme={themes[state.theme]}>
      <MenuContext.Provider value={/*renderContextMenu*/ null}>
      <Grid
        // columnSizing="fill"
        columns={columns}
        dataSource={dataSource}
        groupBy={state.groupBy}
        height={state.gridHeight}
        headerHeight={32}
        width={state.gridWidth}
      />
      </MenuContext.Provider>
      <ControlPanel
        height={toolbarHeight}
        messageRef={messageBoard}
        onAction={handleAction} 
        onChange={handleChange} 
        state={state}/>
    </ThemeProvider>
  );
}
