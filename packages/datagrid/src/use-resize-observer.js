import { useEffect, useRef } from "react";

const observedMap = new Map();

// TODO should we make this create-on-demand
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const { target, contentRect } = entry;
    if (observedMap.has(target)) {
      const { onResize, measurements } = observedMap.get(target);
      let sizeChanged = false;
      for (let [dimension, size] of Object.entries(measurements)) {
        if (contentRect[dimension] !== size) {
          sizeChanged = true;
          measurements[dimension] = contentRect[dimension];
        }
      }
      if (sizeChanged) {
        // TODO only return measured sizes
        // const { height, width } = contentRect;
        onResize && onResize(contentRect);
      }
    }
  }
});

// TODO use an optional lag (default to false) to ask to fire onResize
// with initial size
export default function useResizeObserver(ref, dimensions, onResize) {
  const dimensionsRef = useRef(dimensions);

  // TODO use ref to store resizeHandler here
  // resize handler registered with REsizeObserver will never change
  // use ref to store user onResize callback here
  // resizeHandler will call user callback.current

  // Keep this effect separate in case user inadvertently passes different
  // dimensions or callback instance each time - we only ever want to
  // initiate new observation when ref changes.
  useEffect(() => {
    const target = ref.current;
    async function registerObserver() {
      // Create the map entry immediately. useEffect may fire below
      // before fonts are ready and attempt to update entry
      observedMap.set(target, { onResize, measurements: [] });
      await document.fonts.ready;
      const rect = target.getBoundingClientRect();
      const measurements = dimensionsRef.current.reduce(
        (map, dim) => ((map[dim] = rect[dim]), map),
        {}
      );
      observedMap.get(target).measurements = measurements;
      console.log(`ResizeObserver observe ${target.className}`)
      resizeObserver.observe(target);
    }

    if (target) {
      // TODO might we want multiple callers to attach a listener to the same element ?
      if (observedMap.has(target)) {
        throw Error(
          "useResizeObserver attemping to observe same element twice"
        );
      }
      // TODO set a pending entry on map
      registerObserver();
    }
    return () => {
      if (target && observedMap.has(target)) {
        resizeObserver.unobserve(target);
        observedMap.delete(target);
      }
    };
  }, [dimensionsRef, ref]);

  useEffect(() => {
    const target = ref.current;
    const record = observedMap.get(target);
    if (record) {
      if (dimensionsRef.current !== dimensions) {
        dimensionsRef.current = dimensions;
        const rect = target.getBoundingClientRect();
        const measurements = dimensionsRef.current.reduce(
          (map, dim) => ((map[dim] = rect[dim]), map),
          {}
        );
        record.measurements = measurements;
      }
      // Might not have changed, but no harm ...
      record.onResize = onResize;
    }
  }, [dimensions, ref, onResize]);

  // TODO might be a good idea to ref and return the current measurememnts. That way, derived hooks
  // e.g useBreakpoints don't have to measure and client cn make onResize callback simpler
}
