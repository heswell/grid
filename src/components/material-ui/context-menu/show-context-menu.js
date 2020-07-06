import React, { useState, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
const GridContextMenu = lazy(() => import('./MUIContextMenu.jsx'));

const modalRoot = document.getElementById('modal-root');
let incrementingKey = 1;

const showContextMenu = (e, menuDescriptors, handleContextMenuAction) => {

  const { clientX: left, clientY: top } = e;

  ReactDOM.render(
    <Suspense fallback={<div/>}>
      <GridContextMenu
        key={incrementingKey++}
        menuDescriptors={menuDescriptors}
        onAction={handleContextMenuAction}
        x={left}
        y={top}/>
    </Suspense>,
     modalRoot);

}

export default showContextMenu;
