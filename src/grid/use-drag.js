import { useCallback, useRef } from 'react';

const DRAG_THRESHOLD = 3;

export const DRAG_START = 1;
export const DRAG_END = 2;
export const DRAG = 4;
const DRAG_ALL = 7;

export function useDragStart(callback){
  return useDrag(callback, DRAG_START);
}

/** @type {DragHook} */
export default function useDrag(callback, dragPhase=DRAG_ALL){
  let cleanUp;
  // If user is not tracking 'drag-start', it's assumed that we're already dragging
  const dragging = useRef(false);
  const position = useRef({x:-1,y:-1})

  const onMouseUp = useCallback(() => {
    if (dragging.current) {
        // shouldn't we set dragging to false ?
        callback('drag-end');
        cleanUp();
      } else {
       
        // drag aborted
    }
  },[callback, cleanUp])

  const onMouseMove = useCallback(e => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (e.preventDefault) {
        e.preventDefault();
    }

    const x = e.clientX;
    const y = e.clientY;
    const deltaX = x - position.current.x;

    if (dragging.current) {
        position.current.x = x;
        position.current.y = y;
        callback('drag', deltaX);
    } else if (dragPhase & DRAG_START){
        if (Math.abs(deltaX) > DRAG_THRESHOLD) {
            dragging.current = true;
            position.current.x = x;
            position.current.y = y;
            callback('drag-start', deltaX);
            if (dragPhase === DRAG_START){
              cleanUp();
            }
        }
    } else {
      // if we are tracking drag only, we're going to miss the first drag callback as we have to
      // establish our start point before we can begin to derive deltas.
      dragging.current = true;
      position.current.x = x;
      position.current.y = y;
    }
  },[callback, cleanUp, dragPhase])

  const handleMouseDown = useCallback(e => {
      position.current = {x: e.clientX, y: e.clientY};
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
    },[onMouseMove, onMouseUp]);

  if (!(dragPhase & DRAG_START)) {
    if  (dragPhase & DRAG){
      // How do we initialize the start ?
      window.addEventListener('mousemove', onMouseMove);
    }
    if  (dragPhase & DRAG_END){
      window.addEventListener('mouseup', onMouseUp);
    }
  }

  // TODO extend cleanup to rest references, but careful of order of operations in handlers
  cleanUp = useCallback(() => {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
    dragging.current = false;
  },[onMouseMove, onMouseUp])

  return [handleMouseDown, cleanUp];

};