import {useContext} from 'react';
import GridContext from "../grid-context";
import MenuContext from "./menu-context";
import {buildMenuDescriptors} from '../context-menu';


const useContextMenu = (location, options) => {
  const showContextMenu = useContext(MenuContext);
  const {gridModel} = useContext(GridContext);

  return e => {
    showContextMenu(e, buildMenuDescriptors(gridModel, location, options));
  }

}

export default useContextMenu;