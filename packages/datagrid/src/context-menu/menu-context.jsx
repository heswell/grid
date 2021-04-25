import React, {useContext} from 'react'
import GridContext from "../grid-context";
import GridContextMenu from "./grid-context-menu";
import {GridModel} from '../grid-model-utils';
import { PopupService } from '@heswell/popup';
import {getMenuOptions} from './menu-descriptors';
import * as Action from './context-menu-actions';


const showDefaultContextMenu = (e, menuDescriptors, handleContextMenuAction) => {

    const { clientX: left, clientY: top } = e;
    const component = (
        <GridContextMenu
          menuDescriptors={menuDescriptors}
          doAction={handleContextMenuAction}
        />
    );

    PopupService.showPopup({ left: Math.round(left), top: Math.round(top), component });

}

const MenuContext = React.createContext(null);

const MenuContextProvider = ({children, showMenu}) => {

  const { dispatchGridModelAction, dispatchGridAction, gridModel } = useContext(GridContext);

  const showContextMenu = showMenu || showDefaultContextMenu;

  const processMenuAction = (type, menuDescriptors) => {
    const options = getMenuOptions(menuDescriptors, type);
    switch (type){
      case Action.SortAscending: {
        const {column} = options;
        return dispatchGridAction({
          type: 'sort',
          columns: GridModel.setSortColumn(gridModel, column)
        });
      }
      case Action.SortDescending: {
        const {column} = options;
        return dispatchGridAction({
          type: 'sort',
          columns: GridModel.setSortColumn(gridModel, column, 'D')
        });
      }
      case Action.SortAddAscending: {
        const {column} = options;
        return dispatchGridAction({
          type: 'sort',
          columns: GridModel.addSortColumn(gridModel, column)
        });
      }
      case Action.SortAddDescending: {
        const {column} = options;
        return dispatchGridAction({
          type: 'sort',
          columns: GridModel.addSortColumn(gridModel, column, 'D')
        });
      }
      case Action.SortRemove: {
        const {column} = options;
        return dispatchGridModelAction({type: 'sort', column, remove: true});
      }
      case Action.Group: {
        const {column} = options;
        return dispatchGridAction({
          type: 'group',
          columns: GridModel.addGroupColumn({}, column)
        });
      }
      case Action.GroupAdd: {
        const {column} = options;
        return dispatchGridAction({
          type: 'group',
          columns: GridModel.addGroupColumn(gridModel,column)
        });
      }
      case Action.Pivot: {
        const {column} = options;
        return dispatchGridModelAction({type: 'pivot', column});
      }
      case Action.PivotAdd: {
        const {column} = options;
        return dispatchGridModelAction({type: 'pivot', column, add: true});
      }
      case Action.ColumnHide: {
        const {column} = options;
        return dispatchGridModelAction({type: 'column-hide', column});
      }
      case Action.LinkTable:
        dispatchGridAction({type, link: options})
      break;

      case Action.RpcCall:
        dispatchGridAction({type})
      break;

      default:
    }
  };

  const handleShowContextMenu = (e, menuDescriptors) => {
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e, menuDescriptors, action => processMenuAction(action, menuDescriptors))
  }

  return (
    <MenuContext.Provider value={handleShowContextMenu}>
      {children}
    </MenuContext.Provider>
  )

}

export const MenuProvider = ({ children} ) => {
  return (
    <MenuContext.Consumer>
      {
        parentContext =>
          <MenuContextProvider showMenu={parentContext}>
            {children}
          </MenuContextProvider>
      }
    </MenuContext.Consumer>
  )
}

export default MenuContext;
