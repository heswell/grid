import React, {useCallback, useContext, useMemo} from 'react'
import GridContext from "../grid-context";
import GridContextMenu from "./grid-context-menu";
import { PopupService } from '@heswell/popup';

const filterMenuDescriptors = (menuItemDescriptors, location, options) => {

  const descriptors = [];

  for (let descriptor of menuItemDescriptors){
    if (descriptor.location === 'location'){

    }

  }


  return descriptors;

}

const showContextMenu = (e, menuDescriptors, handleContextMenuAction) => {

    const { clientX: left, clientY: top } = e;
    const component = (
        <GridContextMenu
          menuDescriptors={menuDescriptors}
          doAction={handleContextMenuAction}
        />
    );

    PopupService.showPopup({ left: Math.round(left), top: Math.round(top), component });

}

const ContextMenuContext = React.createContext(null);

const NO_INHERITED_CONTEXT = {
  menuItemDescriptors: []
}

// The menuBuilder will always be supplied by the code that will display the local
// context menu. It will be passed all configured menu descriptors. It is free to
// augment, replace or ignore the existing menu descriptors.
export const useContextMenu = () => {
  const {menuActionHandler, menuBuilders} = useContext(ContextMenuContext);

  const buildMenuOptions = useCallback((menuBuilders, location, options) => {
    let results = [];
    for (const menuBuilder of menuBuilders){
      // Maybe we should leave the concatenation to the menuBuilder, then it can control menuItem order
      results = results.concat(menuBuilder(location, options))
    }
    return results;
  },[])

  const handleShowContextMenu = (e, location, options) => {
    e.stopPropagation();
    e.preventDefault();
    const menuItemDescriptors = buildMenuOptions(menuBuilders, location, options);
    if (menuItemDescriptors.length){
      showContextMenu(e, menuItemDescriptors, menuActionHandler)
    }
  }

  return handleShowContextMenu;
}


const Provider = ({
  children,
  context: {
    menuBuilders: inheritedMenuBuilders,
    menuActionHandler: inheritedMenuActionHandler,
  },
  label,
  menuActionHandler,
  menuBuilder,
}) => {

  const menuBuilders = useMemo(() => {
    if (inheritedMenuBuilders && menuBuilder){
      return inheritedMenuBuilders.concat(menuBuilder);
    } else if (menuBuilder){
      return [menuBuilder]
    } else {
      return inheritedMenuBuilders || [];
    }
  },[inheritedMenuBuilders, menuBuilder])

  const handleMenuAction = useCallback((type, options) => {

    if (menuActionHandler && menuActionHandler(type, options)){
      return true;
    }

    if (inheritedMenuActionHandler && inheritedMenuActionHandler(type, options)){
      return true;
    }

  },[inheritedMenuActionHandler, menuActionHandler]);

   return (
    <ContextMenuContext.Provider value={{
      menuActionHandler: handleMenuAction,
      menuBuilders
    }}>
      {children}
    </ContextMenuContext.Provider>
  )

}

export const ContextMenuProvider = ({ children, menuActionHandler, menuBuilder, menuItemDescriptors, label} ) => {
  return (
    <ContextMenuContext.Consumer>
      {
        parentContext =>
          <Provider
            context={parentContext || NO_INHERITED_CONTEXT}
            label={label}
            menuActionHandler={menuActionHandler}
            menuBuilder={menuBuilder}
            menuItemDescriptors={menuItemDescriptors}>
            {children}
          </Provider>
      }
    </ContextMenuContext.Consumer>
  )
}

export default ContextMenuContext;
