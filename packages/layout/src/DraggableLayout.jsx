import React, { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { Action } from './layout-action';
import { Draggable, DragContainer } from './drag-drop/draggable';
import useLayout from './useLayout';
import LayoutContext from './LayoutContext';
import { registerComponent } from './registry/ComponentRegistry';

import './DraggableLayout.css';

const EMPTY_OBJECT = {};

// We need to add props to restrict drag behaviour to, for example, popups only
const DraggableLayout = (inputProps) => {
  const [props, ref, layoutDispatch] = useLayout('DraggableLayout', inputProps);

  const prepareToDrag = useCallback(
    (
      { component, dragRect, instructions = EMPTY_OBJECT, path },
      evt,
      xDiff,
      yDiff,
    ) => {
      const dragPos = { x: evt.clientX, y: evt.clientY };
      // we need to wait for this to take effect before we continue with the drag
      console.log(`dispatch drag started`);
      layoutDispatch({
        type: Action.DRAG_STARTED,
        path,
        dragContainerPath: props.path,
        dragRect,
        dragPos,
        component,
        instructions,
      });
    },
    [layoutDispatch],
  );

  const customDispatcher = useCallback(
    (action) => {
      if (action.type === Action.DRAG_START) {
        const path = action.path;
        if (DragContainer.paths.length === 0) {
          DragContainer.register('0');
        } else if (path !== '*') {
          const paths = DragContainer.paths;
          if (!paths.some((p) => path.startsWith(p))) {
            return;
          }
        }
        const { evt, ...options } = action;
        Draggable.handleMousedown(
          evt,
          prepareToDrag.bind(null, options),
          options.instructions,
        );
      } else {
        layoutDispatch(action);
      }
    },
    [prepareToDrag],
  );

  const { className: classNameProp, drag, layoutId, style } = props;

  if (props?.dropTarget) {
    const {
      'data-path': dataPath,
      path: dragContainerPath = dataPath,
    } = props.children[0].props;
    console.log(
      `this container is a draggable root 2) ${props.path} register child path ${dragContainerPath}`,
    );
    DragContainer.register(dragContainerPath);
  }

  const [_, setDrag] = useState(-1.0);
  const dragOperation = useRef(null);

  const handleDrop = useCallback(
    (dropTarget, targetRect) => {
      layoutDispatch({
        type: Action.DRAG_DROP,
        dragContainerPath: props.path,
        dropTarget,
        targetRect,
        targetPosition: dragOperation.current.position,
      });
      dragOperation.current = null;
      setDrag(-1.0);
    },
    [layoutDispatch, drag],
  );

  const dragStart = useCallback(
    (draggable, dragRect, dragPos, dragPath, instructions) => {
      var { top, left } = dragRect;
      // note: by passing null as dragContainer path, we are relying on registered DragContainer. How do we allow an
      // override for this ?
      const dragTransform = Draggable.initDrag(props, null, dragRect, dragPos, {
        drag: handleDrag,
        drop: handleDrop,
      });
      dragOperation.current = {
        draggable,
        dragRect,
        dragTransform,
        position: { left, top },
      };
    },
    [handleDrop, props],
  );

  useEffect(() => {
    if (drag) {
      const { dragRect, dragPos, dragPath, instructions, draggable } = drag;
      dragStart(draggable, dragRect, dragPos, dragPath, instructions);
      setDrag(0.0);
    }
  }, [drag]);

  function handleDrag(x, y) {
    const { position } = dragOperation.current;
    const left = typeof x === 'number' ? x : position.left;
    const top = typeof y === 'number' ? y : position.top;
    if (left !== position.left || top !== position.top) {
      dragOperation.current.position.left = left;
      dragOperation.current.position.top = top;
      setDrag(parseFloat(`${left}.${top}`));
    }
  }

  let dragComponent = undefined;

  if (dragOperation.current) {
    const {
      draggable,
      dragRect,
      dragTransform,
      position,
    } = dragOperation.current;

    dragComponent = React.cloneElement(draggable, {
      className: 'dragging',
      style: {
        backgroundColor: 'white',
        position: 'absolute',
        width: dragRect.width,
        height: dragRect.height,
        ...position,
        ...dragTransform,
      },
    });
  }

  const className = classnames('DraggableLayout', classNameProp);

  return (
    <LayoutContext.Provider value={{ dispatch: customDispatcher }}>
      <div className={className} id={layoutId} ref={ref} style={style}>
        {props.children || props}
        {dragComponent}
      </div>
    </LayoutContext.Provider>
  );
};

export default DraggableLayout;

registerComponent('DraggableLayout', DraggableLayout, 'container');
