import React, {useContext} from 'react'
import GridContext from "../grid-context";

import showDefaultContextMenu from './show-context-menu';

const MenuContext = React.createContext(null);

const MenuContextProvider = ({children, showMenu}) => {

  const { dispatchGridAction, dispatchGridModelAction } = useContext(GridContext);
  console.log(dispatchGridAction, dispatchGridModelAction)
  
  const showContextMenu = showMenu || showDefaultContextMenu;
  
  const handleContextMenuAction = action => {
    console.log(`action clicked`, action)
    // dispatchGridModelAction({type: 'wooHoo'})
  };

  const handleShowContextMenu = (e, menuDescriptors) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`show menu`, showMenu)
    showContextMenu(e, menuDescriptors, handleContextMenuAction)
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