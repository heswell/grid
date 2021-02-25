import { useCallback } from "react";
import { Action } from "./layout-action";

export const useViewActionDispatcher = (root, viewPath, layoutDispatch) => {
  const handleMouseDown = useCallback(
    (evt, index) => {
      evt.stopPropagation();
      const dragRect = root.current.getBoundingClientRect();
      // TODO should we check if we are allowed to drag ?
      layoutDispatch({
        type: Action.DRAG_START,
        evt,
        path: index === undefined ? viewPath : `${viewPath}.${index}`,
        dragRect,
      });
    },
    [layoutDispatch, viewPath, root]
  );

  // TODO should be event, action, then this method can bea assigned directly to a html element
  // as an event hander
  const dispatchAction = (action, evt) => {
    const { type, index, path = viewPath } = action;
    switch (type) {
      case Action.REMOVE:
      case Action.MINIMIZE:
      case Action.MAXIMIZE:
      case Action.RESTORE:
      case Action.TEAR_OUT:
        return layoutDispatch({ type, path });
      case "mousedown":
        return handleMouseDown(evt, index);
      default: {
        if (Object.values(Action).includes(type)) {
          layoutDispatch(action);
        }
      }
    }
  };

  return dispatchAction;
};
