import React from 'react';
import { PopupService } from '@heswell/popup';
import GridContextMenu from './grid-context-menu';

const showContextMenu = (e, menuDescriptors, handleContextMenuAction) => {


    const { clientX: left, clientY: top } = e;
    const component = (
      <GridContextMenu
        menuDescriptors={menuDescriptors}
        doAction={handleContextMenuAction}
      />)
      ;

    PopupService.showPopup({ left: Math.round(left), top: Math.round(top), component });

}

export default showContextMenu;

