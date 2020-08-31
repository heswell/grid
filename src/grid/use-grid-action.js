import {useCallback} from 'react';

export default function useGridAction(handlerMap){
  return useCallback(action => {
    const {type, ...args} = action;
    if (handlerMap[action.type]) {
      switch (type) {
        case "scroll-start-horizontal":
          handlerMap[action.type](args.scrollLeft);
          break;
  
        case "scroll-end-horizontal":
          handlerMap[action.type](args.scrollLeft);
          break;

        case "selection":
          handlerMap[action.type](args);
          break;
    
        default:  
      }
    }
  },[handlerMap])
}