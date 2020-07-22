import { useCallback, useRef } from "react";

export default function useScroll(scrollPos, callback, scrollThreshold = 0) {
  const timeoutHandle = useRef(null);
  const pos = useRef(0);
  const checkPos = useRef(0);
  const onScrollEnd = useCallback(() => {
    console.log('scroll end')
    callback("scroll-end", pos.current);
    timeoutHandle.current = null;
  }, [callback]);

  return useCallback(
    e => {
      // important for the horizontal scroll on Canvas
      e.stopPropagation();
      const scrollPosition = e.target[scrollPos];
      console.log(`useScroll scrollPos ${scrollPosition} prev scroll position ${pos.current}`)
      if (scrollPosition !== pos.current) {
        pos.current = scrollPosition;
        if (timeoutHandle.current === null) {
          callback("scroll-start", scrollPosition);
        } else {
          clearTimeout(timeoutHandle.current);
        }
        if (Math.abs(scrollPosition - checkPos.current) > scrollThreshold) {
          checkPos.current = scrollPosition;
          callback("scroll", scrollPosition);
        }
        timeoutHandle.current = setTimeout(onScrollEnd, 100);
      }
    },
    [callback, onScrollEnd, scrollPos, scrollThreshold]
  );
}
