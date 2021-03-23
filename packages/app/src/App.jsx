import React, { useCallback, useState } from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import useLayoutConfig from "./use-layout-config";

// import staticLayout from "./layout1";

// import { LocalDataSource } from "@vuu-ui/data-source";
import { Chest, DraggableLayout, Drawer, Flexbox, registerComponent, Stack, View } from "@heswell/layout";

import { TableList } from "./table-list";
// import { orders as ordersSchema, prices as pricesSchema } from "./table-schemas";
import { DataGridView } from "./filtered-grid"

import './App.css';

registerComponent("DataGridView",DataGridView);


// const newPage = (index) => (
//   <View title="New Page" style={{ flexGrow: 1, flexShrink: 0, flexBasis: 0 }} closeable >
//     <div style={{ backgroundColor: "#ccc" }}></div>
//   </View>
// )

function App() {
  const [colorScheme, setColorScheme] = useState('light')
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
                <TableList style={{ width: 120 }} />
              </View>
            </Drawer>
            <DraggableLayout dropTarget style={{ width: '100%', height: '100%' }}>
              <Stack style={{ width: '100%', height: '100%' }} showTabs enableAddTab preserve>
                <View title="Page 1" />
                {/* <Flexbox title="Page 1" style={{ flexDirection: 'column' }}>
                <Flexbox style={{ flexDirection: 'row', flex: 1 }}>
                    <DataGridView resizeable style={{ flex: 1 }} resize="defer" schema={pricesSchema}/>
                    <DataGridView resizeable style={{ flex: 1 }} resize="defer" schema={ordersSchema}/>
                </Flexbox>
              </Flexbox> */}
              </Stack>
            </DraggableLayout>
          </Chest>
        </Flexbox>
      </DraggableLayout>
    </Provider>
  );
}

export default App;
