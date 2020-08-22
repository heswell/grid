import React, {lazy, Suspense, useContext} from 'react'
import GridContext from "../grid-context";
import { PopupService } from '@heswell/popup';
import {getMenuOptions} from './menu-descriptors';
import * as Action from './context-menu-actions';

const GridContextMenu = lazy(() => import('./grid-context-menu'));

const showDefaultContextMenu = (e, menuDescriptors, handleContextMenuAction) => {

    const { clientX: left, clientY: top } = e;
    const component = (
      <Suspense fallback={<div/>}>
        <GridContextMenu
          menuDescriptors={menuDescriptors}
          doAction={handleContextMenuAction}
        />
      </Suspense>
    );

    PopupService.showPopup({ left: Math.round(left), top: Math.round(top), component });

}

const MenuContext = React.createContext(null);

const MenuContextProvider = ({children, showMenu}) => {

  const { dispatchGridModelAction } = useContext(GridContext);

  const showContextMenu = showMenu || showDefaultContextMenu;
  
  const processMenuAction = (type, menuDescriptors) => {
    const options = getMenuOptions(menuDescriptors, type);
    switch (type){
      case Action.SortAscending: {
        const {column} = options;
        return dispatchGridModelAction({type: 'sort', column, direction: 'asc'});
      }
      case Action.SortDescending: {
        const {column} = options;
        return dispatchGridModelAction({type: 'sort', column, direction: 'dsc'});
      }
      case Action.SortAddAscending: {
        const {column} = options;
        return dispatchGridModelAction({type: 'sort', column, direction: 'asc', add: true});
      }
      case Action.SortAddDescending: {
        const {column} = options;
        return dispatchGridModelAction({type: 'sort', column, direction: 'dsc', add: true});
      }
      case Action.SortRemove: {
        const {column} = options;
        return dispatchGridModelAction({type: 'sort', column, remove: true});
      }
      case Action.Group: {
        const {column} = options;
        return dispatchGridModelAction({type: 'group', column});
      }
      case Action.GroupAdd: {
        const {column} = options;
        return dispatchGridModelAction({type: 'group', column, add: true});
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