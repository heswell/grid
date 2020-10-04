// @ts-nocheck

import React, {Suspense, useEffect, useMemo, useRef, useState} from "react";
import ControlPanel from './control-panel/control-panel'
import DataAdaptor from './data-adaptor';
import gridComponents from './data-grids';

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
    theme: 'light',
    Grid: gridComponents['heswell']
  });

  const dataAdaptor = useMemo(() => 
    new DataAdaptor(state.dataSource, state.dataLocation),
    [state.dataSource, state.dataLocation]
  );

  const scrollBy = value => {
    console.log(`scrollBy ${value}`)
    const viewport = document.querySelector('.Viewport-0-2-6');
    const scrollTop = viewport.scrollTop;
    viewport.scrollTop = scrollTop + value;
  }

  const startStressTest = () => dataAdaptor.startStressTest();
  
  const startLoadTest = () => dataAdaptor.startLoadTest();
  
  const stopTests = () => dataAdaptor.stopTest();
  
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
    console.log(`%cchanges ${JSON.stringify(stateChanges)}`,'color: blue; font-weight: bold;')
    if (stateChanges.dataGrid){
      setState(prevState => {
        return ({
          ...prevState, 
          ...stateChanges, 
          groupBy: undefined, 
          pivotBy: undefined,
          Grid: gridComponents[stateChanges.dataGrid]
        })
      })
    } else if (stateChanges.dataSource){
      setState(prevState => {
        return ({...prevState, ...stateChanges, groupBy: undefined, pivotBy: undefined})
      })
    } else {
      setState(prevState => ({...prevState, ...stateChanges}))
    }
  }

  const {Grid} = state;

  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <div style={{flex: 1}}>
        <Grid dataAdaptor={dataAdaptor}/>
        </div>
        <div style={{height: toolbarHeight}}>
        <ControlPanel
          height={toolbarHeight}
          messageRef={messageBoard}
          onAction={handleAction} 
          onChange={handleChange} 
          state={state}/>
          </div>
        </div>
    </Suspense>
  );
}
