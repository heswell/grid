import { useCallback, useRef } from "react";

export default function useScroll(scrollPos, callback, scrollThreshold = 0) {
  const timeoutHandle = useRef(null);
  const pos = useRef(0);
  const checkPos = useRef(0);
  const onScrollEnd = useCallback(() => {
    console.log(`timeout fired (100ms) fire scroll-end`)
    callback("scroll-end", pos.current);
    timeoutHandle.current = null;
  }, [callback]);

  return useCallback(
    e => {
      // important for the horizontal scroll on Canvas
      e.stopPropagation();
      const scrollPosition = e.target[scrollPos];
      console.log(`onScroll scrollPosition=${scrollPosition}`);
      if (scrollPosition !== pos.current) {
        pos.current = scrollPosition;
        if (timeoutHandle.current === null) {
          console.log(`call scroll-start`)
          callback("scroll-start", scrollPosition);
        } else {
          clearTimeout(timeoutHandle.current);
        }
        if (Math.abs(scrollPosition - checkPos.current) > scrollThreshold) {
          console.log(`over the scroll threshold scroll callback`)
          checkPos.current = scrollPosition;
          callback("scroll", scrollPosition);
        }
        timeoutHandle.current = setTimeout(onScrollEnd, 100);
      }
    },
    [callback, onScrollEnd, scrollPos, scrollThreshold]
  );
}
