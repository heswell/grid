import { useEffect, useRef } from 'react';

const useEffectSkipFirst = (func, deps) => {
    const goodToGo = useRef(false);
    useEffect(() => {
        if (goodToGo.current){
          func();
        } else {
          goodToGo.current = true;
        }
    }, deps);
}

export default useEffectSkipFirst;