import React from 'react';
import { ContextMenu, MenuItem, Separator } from '@heswell/popup';

import * as Action from '../actions';

export const ContextMenuActions = {
    SortAscending : 'sort-asc',
    SortAddAscending : 'sort-add-asc',
    SortDescending : 'sort-dsc',
    SortAddDescending : 'sort-add-dsc',
    GroupBy : 'groupby',
    GroupByReplace : 'groupby-replace'
};

const GridContextMenu = function GridContextMenu(props) {

    const handleMenuAction = (action, data) => {
        const {doAction= () => {}} = props;
        switch(action){
            case ContextMenuActions.GroupBy:
                doAction({ type: Action.groupExtend, column: data.column });
                break;
            case ContextMenuActions.GroupByReplace:
                doAction({ type: Action.GROUP, column: data.column });
                break;
            case ContextMenuActions.SortAscending: 
                return sort(data.column, 'asc');
            case ContextMenuActions.SortDescending: 
                return sort(data.column, 'dsc');
            case ContextMenuActions.SortAddAscending:
                return sort(data.column, 'asc', true);
            case ContextMenuActions.SortAddDescending:
                return sort(data.column, 'dsc', true);
    
            default:
                doAction(action, data)
        }
    }

    const sort = (column, direction = null, preserveExistingSort = false) => {
        const {doAction} = props;
        // this will transform the columns which will cause whole grid to re-render down to cell level. All
        // we really need if for headers to rerender. SHould we store sort criteria outside of columns ?
        doAction({ type: Action.SORT, column, direction, preserveExistingSort });
    }


    const menuItems = menuDescriptors => {
        const fromDescriptor = ({children, label, action, options},i) => 
            <MenuItem key={i} action={action} data={options} label={label} >
                {children ? children.map(fromDescriptor) : undefined}
            </MenuItem>
        return menuDescriptors.map(fromDescriptor);
    }

    const {menuDescriptors} = props;

    return (
        // TODO replace the inline function when we move to SFC
        <ContextMenu doAction={handleMenuAction}>
            {menuItems(menuDescriptors)}
        </ContextMenu>
    );

}

export default GridContextMenu;

