import * as Action from './context-menu-actions';
import {getRpcActions} from "./rpc-actions";

export function buildMenuDescriptors(gridModel, location, options){
  const menuItems = [];
  if (location === 'header') {
    menuItems.push(...buildSortMenuItems(gridModel.sort, options));
    menuItems.push(...buildGroupMenuItems(gridModel.groupBy, options));
    menuItems.push({label: 'Hide Column', action: Action.ColumnHide, options})
  }

  if (gridModel.visualLinks){
    gridModel.visualLinks.forEach(linkDescriptor => {
      menuItems.push({label: `Link to ${linkDescriptor.link.toTable}`, action: Action.LinkTable, options: linkDescriptor})
    })
  }

  if (options?.selectedRowCount){
    // TODO pass the table name
    const rpcActions = getRpcActions();
    for (let {label, method} of rpcActions){
      menuItems.push({action: Action.RpcCall, label,  options: {method}})
    }
  }

  return menuItems;

}

function buildSortMenuItems(sortColumns, options){
    const menuItems = [];
    const {column} = options;
    const sortColumnNames = sortColumns ? Object.keys(sortColumns) : null;
    const existingColumnSort = sortColumns && sortColumns[column.name];

    if (existingColumnSort === 'asc') {
        menuItems.push({label: 'Reverse Sort (DSC)', action: Action.SortDescending, options});
      } else if (existingColumnSort === 'dsc'){
        menuItems.push({label: 'Reverse Sort (ASC)', action: Action.SortAscending, options});
      } else if (typeof existingColumnSort === 'number'){
        // offer to remove if it isn't the lowest sort
        if (existingColumnSort > 0){
            menuItems.push({label: 'Reverse Sort (DSC)', action: Action.SortAddDescending, options});
        } else {
            menuItems.push({label: 'Reverse Sort (ASC)', action: Action.SortAddAscending, options});
        }
        // removing the last column from a sort would be a no-op, so pointless
        if (Math.abs(existingColumnSort) < sortColumnNames.length){
            menuItems.push({label: 'Remove from sort', action: Action.SortRemove, options});
        }

        menuItems.push(
            {label: 'New Sort', children: [
                {label: 'Ascending', action: Action.SortAscending, options},
                {label: 'Descending', action: Action.SortDescending, options}
            ]}
        );

      } else if (sortColumnNames){
            menuItems.push(
                {label: 'Add to sort', children: [
                    {label: 'Ascending', action: Action.SortAddAscending, options},
                    {label: 'Descending', action: Action.SortAddDescending, options}
                ]}
            );
            menuItems.push(
                {label: 'New Sort', children: [
                    {label: 'Ascending', action: Action.SortAscending, options},
                    {label: 'Descending', action: Action.SortDescending, options}
                ]})
      } else {
          menuItems.push(
              {label: 'Sort', children: [
                  {label: 'Ascending', action: Action.SortAscending, options},
                  {label: 'Descending', action: Action.SortDescending, options}
              ]}
          );
      }
      return menuItems;

}

function buildGroupMenuItems(groupBy, options){
    const menuItems = [];
    const {column} = options;

    if (!groupBy){
        menuItems.push({label: `Group by ${column.name}`, action: Action.Group, options})
    } else {
        menuItems.push({label: `Add ${column.name} to group by`, action: Action.GroupAdd, options})
    }

    return menuItems;
}


/*

      if (groupBy && groupBy.length) {
          if (!isGroup){
              menuItems.push({label: `Add ${colName} to Group`, action: 'groupby', options});
          }
      } else {
          menuItems.push({label: `Group by ${colName}`, action: 'groupby', options});
      }


*/

export function getMenuOptions(menuDescriptors, action){
    const menuItem = findMenuItem(menuDescriptors, action)
    return menuItem?.options ?? null;
}

function findMenuItem(menuDescriptors, action){
    for (let menuDescriptor of menuDescriptors){
        if (menuDescriptor.action === action){
            return menuDescriptor;
        } else if (menuDescriptor.children){
            const result = findMenuItem(menuDescriptor.children, action);
            if (result){
                return result;
            }
        }
    }
    return null;
}

