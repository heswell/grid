import {useCallback, useContext, useRef} from 'react';
import useResizeObserver from './use-resize-observer';
import { ROW_HEIGHT } from "./grid-model-actions";
import GridContext from "./grid-context";

const dimensions = ['height'];

export const useRowHeight = () => {
  const { dispatchGridModelAction } = useContext(GridContext);
  const ref = useRef();

  const onResize = useCallback(({height}) => {
    dispatchGridModelAction({type: ROW_HEIGHT, rowHeight: height})
  },[dispatchGridModelAction])

  useResizeObserver(ref, dimensions, onResize);

  return ref;

}