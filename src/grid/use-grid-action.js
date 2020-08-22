import {useCallback} from 'react';

export default function useGridAction(handlerMap){
  return useCallback(action => {
    if (handlerMap[action.type]) {
      switch (action.type) {
        case "scroll-start-horizontal":
          handlerMap[action.type](action.scrollLeft);
          break;
  
        case "scroll-end-horizontal":
          handlerMap[action.type](action.scrollLeft);
          break;
  
        case "set-available-columns":
          handlerMap[action.type](action.columns);
          break;
  
        case "column-hide":
          handlerMap[action.type](action.column);
          break;
  
        default:  
      }
    }
  },[handlerMap])
}