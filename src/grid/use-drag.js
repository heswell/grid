import { useCallback, useRef, useEffect } from 'react';

const DRAG_THRESHOLD = 3;

export const DRAG_START = 1;
export const DRAG_END = 2;
export const DRAG = 4;
const DRAG_ALL = 7;

export function useDragStart(callback){
  return useDrag(callback, DRAG_START);
}

/** @type {DragHook} */
export default function useDrag(callback, dragPhase=DRAG_ALL, initialDragPosition=-1){

  let cleanUp;
  // If user is not tracking 'drag-start', it's assumed that we're already dragging
  const dragging = useRef(false);
  const position = useRef({x:initialDragPosition,y:-1})
  const onMouseMove = useRef(null)
  const onMouseUp = useRef(null)

  onMouseUp.current = useCallback(() => {
    if (dragging.current) {
        callback('drag-end');
        cleanUp();
      } else {
       
        // drag aborted
    }
  },[callback, cleanUp])

  onMouseMove.current = useCallback(e => {
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
        callback('drag', deltaX, position.current.x);
    } else if (dragPhase & DRAG_START){
        if (Math.abs(deltaX) > DRAG_THRESHOLD) {
            dragging.current = true;
            position.current.x = x;
            position.current.y = y;

            callback('drag-start', deltaX, position.current.x);
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

  // Important that these never change for the lifetime of the hook, as they are
  // used to register and register window listeners.
  const mouseMoveHandler = useCallback(e => onMouseMove.current(e),[])
  const mouseUpHandler = useCallback(e => onMouseUp.current(e),[])

  const handleMouseDown = useCallback(e => {
      position.current = {x: e.clientX, y: e.clientY};
      window.addEventListener('mouseup', mouseUpHandler);
      window.addEventListener('mousemove', mouseMoveHandler);
    },[onMouseMove, onMouseUp]);

  useEffect(() => {
    
    if (!(dragPhase & DRAG_START)) {
      if  (dragPhase & DRAG && !dragging.current){
        window.addEventListener('mousemove', mouseMoveHandler);

        if  (dragPhase & DRAG_END){
          window.addEventListener('mouseup', mouseUpHandler);
        }
        dragging.current = true;
      }
      if (dragPhase & DRAG_END  && !dragging.current){
        window.addEventListener('mouseup', mouseUpHandler);
        dragging.current = true;
      }
    }
  
  }, [callback]);

  // TODO extend cleanup to rest references, but careful of order of operations in handlers
  cleanUp = useCallback(() => {
    window.removeEventListener('mouseup', mouseUpHandler);
    window.removeEventListener('mousemove', mouseMoveHandler);
    dragging.current = false;
  },[onMouseMove, onMouseUp])

  return [handleMouseDown, cleanUp];

};