import React from 'react';
import { ContextMenu, MenuItem, Separator } from '@heswell/popup';

export const ContextMenuActions = {
    SortAscending : 'sort-asc',
    SortAddAscending : 'sort-add-asc',
    SortDescending : 'sort-dsc',
    SortAddDescending : 'sort-add-dsc',
    GroupBy : 'groupby',
    GroupByReplace : 'groupby-replace'
};

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
        // TODO replace the inline function when we move to SFC
        <ContextMenu doAction={doAction}>
            {menuItems(menuDescriptors)}
        </ContextMenu>
    );

}

export default GridContextMenu;

