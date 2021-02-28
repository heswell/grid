import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from "react";

import {useEffectSkipFirst} from "@heswell/utils"
import useAdornments from "./use-adornments";
import modelReducer, { initModel } from "./grid-model-reducer";
import { ROW_HEIGHT } from "./grid-model-actions";
import { useMeasure } from "./measure";
import useResizeObserver, {WidthHeight } from "./use-resize-observer"/*from "@heswell/layout";*/


const useSize = (props) => {
  const [size, _setSize] = useMeasure(props);

  const setSize = useCallback(({height, width}) => {
    console.log(`setSize ${height} x ${width}`)
    _setSize(state => ({
      ...state,
      measuredHeight: height,
      measuredWidth: width
    }));
  },[_setSize])

  return [size, setSize];
}

export const useGridModel = (props) => {
  const rootRef = useRef(null);
  const firstRender = useRef(true);
  const [dataSource, setDataSource] = useState(props.dataSource);

  const custom = useAdornments(props);

  const [size, setSize] = useSize(props);

  const onResize = useCallback(({width, height}) => {
    console.log(`%conReresize width=${width} height=${height}`,'color:green;font-weight:bold;')
    setSize({width, height});
  },[setSize])

  useResizeObserver(rootRef, WidthHeight, onResize, /* reportInitialSize = */ true);

  /** @type {[GridModel, GridModelDispatcher]} */
  const [gridModel, dispatchGridModel] = useReducer(
    modelReducer,
    [props, size, custom],
    initModel
  );

  useEffectSkipFirst(() => {
      dispatchGridModel({
        type: "resize",
        // The totalHeaderHeight will be set as top padding, which will not be included
        // in contentHeight measured by Observer
        height: size.measuredHeight + gridModel.totalHeaderHeight,
        width: size.measuredWidthWidth,
      });
  // }, [props.height, props.width]);
  }, [size.measuredHeight, size.measuredWidthWidth, gridModel.totalHeaderHeight]);

  useEffect(() => {
    if (firstRender.current){
      if (props.rowHeight === undefined){
        const rowHeight = parseInt(getComputedStyle(rootRef.current).getPropertyValue("--hw-grid-row-height"));
        if (!isNaN(rowHeight) && rowHeight !== gridModel.rowHeight){
          dispatchGridModel({type: ROW_HEIGHT, rowHeight})
        }
      }
      firstRender.current = false;
    } else {
      dispatchGridModel({type: ROW_HEIGHT, rowHeight: props.rowHeight})
    }
  }, [props.rowHeight, gridModel.rowHeight]);

  //TODO do we need to useCallback here - can we ever send stale props ?
  useEffectSkipFirst(() => {
    dispatchGridModel({ type: "initialize", props });
    if (props.dataSource !== dataSource) {
      setDataSource(props.dataSource);
    }
  }, [props.columns, props.columnSizing, props.dataSource, props.groupBy]);

  // Should these go in a separate useDataSource hook ?
  const datasourceHandler = useCallback((eventName, ...args) => {
    switch (eventName) {
      case "group":
        return dispatchGridModel({ type: "group", columns: args[0] });
      case "sort":
        return dispatchGridModel({ type: "sort", columns: args[0] });
      case "visual-links":
        return dispatchGridModel({ type: "visual-links", links: args[0] });
      default:
    }
  }, []);

  // New
  useEffect(() => {
    dataSource.on("*", datasourceHandler);
    return () => {
      dataSource.removeListener("*", datasourceHandler);
    };
  }, [dataSource, datasourceHandler]);


  return [rootRef, gridModel, dataSource, dispatchGridModel, custom]

}
