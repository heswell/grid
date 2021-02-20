import React from 'react';
import { ContextMenu, MenuItem, Separator } from '@heswell/popup';

const GridContextMenu = function GridContextMenu(props) {

    const menuItems = menuDescriptors => {
        const fromDescriptor = ({children, label, action, options},i) => 
            <MenuItem key={i} action={action} data={options} label={label} >
                {children ? children.map(fromDescriptor) : undefined}
            </MenuItem>
        return menuDescriptors.map(fromDescriptor);
    }

    const {doAction, menuDescriptors} = props;

    return (
        <ContextMenu doAction={doAction}>
            {menuItems(menuDescriptors)}
        </ContextMenu>
    );

}

export default GridContextMenu;

