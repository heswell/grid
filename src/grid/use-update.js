import {useEffect, useRef} from 'react';

export default function useUpdate(callback, dependencies){

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current){
      initialRender.current = false;
    } else {
      callback();
    }
  },dependencies)


}