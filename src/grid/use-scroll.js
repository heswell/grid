export const SCROLL_START = 1;
export const SCROLL_END = 2;
export const SCROLL = 4;
export const SCROLL_START_END = 3;
const ALL_SCROLL_EVENTS = 7;

export default function scrollHook(
  scrollPos,
  callback,
  scrollEvents = ALL_SCROLL_EVENTS
) {
  let timeoutHandle = null;
  const pos = { current: 0 };
  const onScrollEnd = () => {
    if (scrollEvents & SCROLL_END) {
      callback("scroll-end", pos.current);
    }
    timeoutHandle = null;
  };
  return e => {
    // important for the horizontal scroll on Canvas
    e.stopPropagation();
    const position = e.target[scrollPos];
    if (position !== pos.current) {
      pos.current = position;
      if (timeoutHandle === null) {
        if (scrollEvents & SCROLL_START) {
          callback("scroll-start", position);
        }
      } else {
        clearTimeout(timeoutHandle);
      }
      timeoutHandle = setTimeout(onScrollEnd, 200);
      if (scrollEvents & SCROLL) {
        callback("scroll", position);
      }
    }
  };
}
