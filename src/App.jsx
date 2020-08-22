// @ts-nocheck

import React, {useEffect, useMemo, useRef, useState} from "react";
import { Grid } from "./grid";
import MenuContext from './grid/context-menu';
import ControlPanel from './control-panel/control-panel'
import {ThemeProvider} from 'react-jss';
import themes from './themes';
import {buildData} from './data/use-test-data';

// import renderContextMenu from './components/material-ui/context-menu/show-context-menu';

const toolbarHeight = 300;

export default function App() {

  useEffect(() => {

  },[])

  const messageBoard = useRef(null);

  const [state, setState] = useState({
    columnSizing: 'static',
    dataGrid: "heswell",
    dataLocation: "local",
    dataSource: 'instruments',
    height: document.getElementById('root').clientHeight - toolbarHeight,
    width: document.getElementById('root').clientWidth,
    groupBy: null,
    pivotBy: null,
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

  const startStressTest = () => {
    if (dataSource.startStressTest){
      dataSource.startStressTest();
    }
  }
  
  const startLoadTest = () => {
    if (dataSource.startLoadTest){
      dataSource.startLoadTest();
    }
  }
  
  const stopTests = () => {
    if (dataSource.stopTest){
      dataSource.stopTest();
    }
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
    console.log(`changes ${JSON.stringify(stateChanges)}`)
    if (stateChanges.dataSource){
      setState(prevState => {
        return ({...prevState, ...stateChanges, groupBy: undefined, pivotBy: undefined})
      })

    } else {
      setState(prevState => ({...prevState, ...stateChanges}))
    }
  }

  return (
    <ThemeProvider theme={themes[state.theme]}>
      <MenuContext.Provider value={/*renderContextMenu*/ null}>
      <Grid
        columnSizing={state.columnSizing}
        columns={columns}
        dataSource={dataSource}
        groupBy={state.groupBy}
        height={state.height}
        headerHeight={32}
        pivotBy={state.pivotBy}
        width={state.width}
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
