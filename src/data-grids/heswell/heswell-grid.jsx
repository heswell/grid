import React, {useState, useMemo} from 'react';
import { ComponentContext, Grid, MenuContext } from "@heswell/grid";
import themes from '../../themes';
import DataProvider from './heswell-data-provider';

import './heswell.css';
// import InlineFilter from '../../customisations/inline-filter/inline-filter';

import BackgroundCell from '../../cell-renderers/background-cell';

// import renderContextMenu from './components/material-ui/context-menu/show-context-menu';

const components = {
  // 'background-cell': BackgroundCell,
}

const toolbarHeight = 300;


const HeswellGrid = ({dataAdaptor}) => {

  const {source, location} = dataAdaptor;

  const dataProvider = useMemo(() => {
    const provider = new DataProvider(source, location);
    dataAdaptor.dataProvider = provider;
    return provider;
  }, [dataAdaptor, source, location])

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

  // dataSource.on('message', (evt, message) => {
  //   messageBoard.current.innerText = message;
  // })

  return (
      <MenuContext.Provider value={/*renderContextMenu*/ null}>
        <ComponentContext.Provider value={components}>
        <Grid
          className="heswell"
          columnSizing={state.columnSizing}
          columns={dataProvider.columns}
          dataSource={dataProvider.dataSource}
          groupBy={state.groupBy}
          height={state.height}
          headerHeight={32}
          pivotBy={state.pivotBy}
          width={state.width}>
            {/* <Grid.InlineHeader height={25}>
              <InlineFilter />
            </Grid.InlineHeader> */}
            {/* <Grid.Header height={25}>
              <div style={{height: 25, backgroundColor: 'red'}} />
            </Grid.Header>
            <Grid.Footer height={40}>
              <div style={{height: "100%", backgroundColor: 'green'}} />
            </Grid.Footer> */}
        </Grid>
      </ComponentContext.Provider>
      </MenuContext.Provider>

  )
}

export default HeswellGrid;