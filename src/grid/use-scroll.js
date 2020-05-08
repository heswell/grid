import { useCallback, useRef } from "react";
export const SCROLL_START = 1;
export const SCROLL_END = 2;
export const SCROLL = 4;
export const SCROLL_START_END = 3;
const ALL_SCROLL_EVENTS = 7;

export default function useScroll(
  scrollPos,
  callback,
  scrollEvents = ALL_SCROLL_EVENTS
) {
  const timeoutHandle = useRef(null);
  const pos = useRef(0);
  const onScrollEnd = useCallback(() => {
    if (scrollEvents & SCROLL_END) {
      callback("scroll-end", pos.current);
    }
    timeoutHandle.current = null;
  }, [callback, scrollEvents]);

  return useCallback(
    e => {
      // important for the horizontal scroll on Canvas
      e.stopPropagation();
      const scrollPosition = e.target[scrollPos];
      if (scrollPosition !== pos.current) {
        pos.current = scrollPosition;
        if (timeoutHandle.current === null) {
          if (scrollEvents & SCROLL_START) {
            callback("scroll-start", scrollPosition);
          }
        } else {
          clearTimeout(timeoutHandle.current);
        }
        if (scrollEvents & SCROLL) {
          callback("scroll", scrollPosition);
        }
        timeoutHandle.current = setTimeout(onScrollEnd, 200);
      }
    },
    [callback, onScrollEnd, scrollEvents, scrollPos]
  );
}
