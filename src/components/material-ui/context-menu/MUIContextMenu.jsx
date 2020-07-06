import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NestedMenuItem from './NestedMenuItem'

const GridContextMenu = ({onAction, menuDescriptors, x, y}) => {

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleMenuAction = action => {
    setOpen(false);
    onAction(action);
  }

  const menuItems = menuDescriptors => {
      const fromDescriptor = ({children, label, action},i) => {
      const onClick = e => handleMenuAction(action);  
      return children
          ?  <NestedMenuItem key={i} mainMenuOpen={open} label={label}>
              {children.map(fromDescriptor)}
              </NestedMenuItem>
          :  <MenuItem dense key={i} onClick={onClick} data-value={action}>{label}</MenuItem>
      }
      return menuDescriptors.map(fromDescriptor);
  }

  return (
      <Menu
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: y, left: x }}>
          {menuItems(menuDescriptors)}
      </Menu>
  );

}

export default GridContextMenu;
