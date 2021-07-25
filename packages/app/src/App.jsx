/* eslint-disable no-sequences */
import React, { useCallback, useState } from 'react';
import { ThemeProvider } from "@heswell/theme";
import { ContextMenuProvider } from "@heswell/popup";

import useLayoutConfig from "./use-layout-config";
import useViewserver, {buildRpcMenuOptions, RpcCall}  from "./useViewserver";


import { Chest, Dialog, DraggableLayout, Drawer, FlexboxLayout as Flexbox, registerComponent, View } from "@heswell/layout";

import { AppPalette } from "./app-palette";
// import { TableList } from "./table-list";
import { FilteredGrid } from "./filtered-grid"

import './App.css';

registerComponent("FilteredGrid", FilteredGrid);


const defaultLayout = {
  type: "Stack",
  props: {
    style: {
      width: "100%",
      height: "100%"
    },
    showTabs: true,
    enableAddTab: true,
    preserve: true,
    active: 0
  },
  children: [
    {
      type : "View",
      title: "Page 1"
    }
  ]
}

const buildMenuOptions = (location, options) => {
  const results = [];
  if (location === 'grid'){
    results.push(...buildRpcMenuOptions(options))
  }
  return results;
}

function App() {
  const [layoutConfig, setLayoutConfig] = useLayoutConfig("https://localhost:8443/api/vui/steve", defaultLayout)
  const [dialogContent, setDialogContent] = useState(null);
  const {makeRpcCall} = useViewserver({openDialog: setDialogContent});
  const handleLayoutChange = useCallback((layout) => {
    setLayoutConfig(layout)
  }, [setLayoutConfig])

  const handleContextMenuAction = useCallback((type, options) => {
    switch(type){
      case RpcCall: return makeRpcCall(options), true;
      default: return false;
    }
  },[makeRpcCall]);


  const handleClose = () => setDialogContent(null);

  return (
    <ThemeProvider>
      <ContextMenuProvider label="App" menuActionHandler={handleContextMenuAction} menuBuilder={buildMenuOptions}>
      <Dialog className="vuDialog" isOpen={dialogContent !== null} onClose={handleClose}>
          {dialogContent}
        </Dialog>
      <DraggableLayout className="hw" style={{ width: '100vw', height: "100vh" }} onLayoutChange={handleLayoutChange} layout={layoutConfig}>
        <Flexbox className="App" style={{ flexDirection: 'column', height: '100%' }}>
          <div style={{ height: 40, borderBottom: 'solid 1px #ccc' }}>
            {/* <ToggleButton onChange={toggleColorScheme}>
                theme
              </ToggleButton> */}
          </div>
          <Chest style={{ flex: 1 }}>
            <Drawer position="left" inline peekaboo clickToOpen sizeOpen={150} toggleButton="end">
              <View title="Views" header style={{ height: '100%' }}>
                <AppPalette style={{ flex: 1, width: 120 }} />
              </View>
            </Drawer>
            <DraggableLayout dropTarget style={{ width: '100%', height: '100%' }}>
              {/* <Stack style={{ width: '100%', height: '100%' }} showTabs enableAddTab preserve>
                <View title="Page 1" />
              </Stack> */}
            </DraggableLayout>
          </Chest>
        </Flexbox>
      </DraggableLayout>
      </ContextMenuProvider>
    </ThemeProvider>
  );
}

export default App;
