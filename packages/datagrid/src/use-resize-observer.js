import { useCallback, useEffect, useRef } from 'react';

export const WidthHeight = ['height', 'width']

const observedMap = new Map();

const isScrollAttribute = {
  scrollHeight: true,
  scrollWidth: true,
};

// TODO should we make this create-on-demand
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const { target, contentRect } = entry;
    if (observedMap.has(target)) {
      const { onResize, measurements } = observedMap.get(target);
      let sizeChanged = false;
      for (let [dimension, size] of Object.entries(measurements)) {
        const newSize = isScrollAttribute[dimension]
          ? target[dimension]
          : contentRect[dimension];
        if (newSize !== size) {
          sizeChanged = true;
          measurements[dimension] = newSize;
        }
      }
      if (sizeChanged) {
        // TODO only return measured sizes
        // const { height, width } = contentRect;
        onResize && onResize(measurements);
      }
    }
  }
});

// TODO use an optional lag (default to false) to ask to fire onResize
// with initial size
export default function useResizeObserver(ref, dimensions, onResize, reportInitialSize) {
  const dimensionsRef = useRef(dimensions);

  const measure = useCallback((target) => {
    const rect = target.getBoundingClientRect();
    return dimensionsRef.current.reduce((map, dim) => {
      if (isScrollAttribute[dim]) {
        map[dim] = target[dim];
      } else {
        map[dim] = rect[dim];
      }
      return map;
    }, {});
  }, []);

  // TODO use ref to store resizeHandler here
  // resize handler registered with REsizeObserver will never change
  // use ref to store user onResize callback here
  // resizeHandler will call user callback.current

  // Keep this effect separate in case user inadvertently passes different
  // dimensions or callback instance each time - we only ever want to
  // initiate new observation when ref changes.
  useEffect(() => {
    const target = ref.current;
    console.log(`resizeObserver useEffect ref=`, ref.current)
    async function registerObserver() {
      // Create the map entry immediately. useEffect may fire below
      // before fonts are ready and attempt to update entry
      observedMap.set(target, { measurements: [] });
      await document.fonts.ready;
      const measurements = measure(target);
      observedMap.get(target).measurements = measurements;
      resizeObserver.observe(target);

      if (reportInitialSize){
        onResize(measurements);
      }
    }

    if (target) {
      // TODO might we want multiple callers to attach a listener to the same element ?
      if (observedMap.has(target)) {
        throw Error(
          'useResizeObserver attemping to observe same element twice',
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
  }, [measure, ref]);

  useEffect(() => {
    const target = ref.current;
    const record = observedMap.get(target);
    if (record) {
      if (dimensionsRef.current !== dimensions) {
        dimensionsRef.current = dimensions;
        const measurements = measure(target);
        record.measurements = measurements;
      }
      // Might not have changed, but no harm ...
      record.onResize = onResize;
    }
  }, [dimensions, measure, ref, onResize]);

}
