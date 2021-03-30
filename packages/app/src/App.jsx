import React, { useCallback, useState } from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import useLayoutConfig from "./use-layout-config";

import { Chest, DraggableLayout, Drawer, Flexbox, registerComponent, Stack, View } from "@heswell/layout";

import { TableList } from "./table-list";
// import { orders as ordersSchema, prices as pricesSchema } from "./table-schemas";
import { FilteredGrid } from "./filtered-grid"

import './App.css';

registerComponent("FilteredGrid",FilteredGrid);


function App() {
  const [colorScheme/*, setColorScheme*/] = useState('light')
  const [layoutConfig, setLayoutConfig] = useLayoutConfig("https://localhost:8443/api/vui/steve")

  // const toggleColorScheme = useCallback(() => {
  //   setColorScheme(color => color === 'light' ? 'dark' : 'light')
  // },[]);

  console.log({ defaultTheme })

  const handleLayoutChange = useCallback((layout) => {
    setLayoutConfig(layout)
  }, [setLayoutConfig])

  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <DraggableLayout style={{ width: '100vw', height: "100vh" }} onLayoutChange={handleLayoutChange}  layout={layoutConfig}>
        <Flexbox className="App" style={{ flexDirection: 'column', height: '100%' }}>
          <div style={{ height: 40, borderBottom: 'solid 1px #ccc' }}>
            {/* <ToggleButton onChange={toggleColorScheme}>
                theme
              </ToggleButton> */}
          </div>
          <Chest style={{ flex: 1 }}>
            <Drawer position="left" inline peekaboo clickToOpen sizeOpen={150} toggleButton="end">
              <View title="Tables" header style={{ height: '100%' }}>
                <TableList style={{ flex:1, width: 120 }} />
              </View>
            </Drawer>
            <DraggableLayout dropTarget style={{ width: '100%', height: '100%' }}>
              <Stack style={{ width: '100%', height: '100%' }} showTabs enableAddTab preserve>
                <View title="Page 1" />
              </Stack>
            </DraggableLayout>
          </Chest>
        </Flexbox>
      </DraggableLayout>
    </Provider>
  );
}

export default App;
