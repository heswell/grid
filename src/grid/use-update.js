import {useLayoutEffect, useRef} from 'react';

export default function useUpdate(callback, dependencies){

  const initialRender = useRef(true);

  useLayoutEffect(() => {
    if (initialRender.current){
      initialRender.current = false;
    } else {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },dependencies)


}