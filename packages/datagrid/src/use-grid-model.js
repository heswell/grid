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

export const useGridModel = (props) => {
  const rootRef = useRef(null);
  const firstRender = useRef(true);
  const [dataSource, setDataSource] = useState(props.dataSource);

  const custom = useAdornments(props);

  /** @type {[GridModel, GridModelDispatcher]} */
  const [gridModel, dispatchGridModel] = useReducer(
    modelReducer,
    [props, custom],
    initModel
  );

  useEffectSkipFirst(() => {
      dispatchGridModel({
        type: "resize",
        height: props.height,
        width: props.width,
      });
  }, [props.height, props.width]);



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
  }, [props.rowHeight]);

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
      default:
    }
  }, []);

  // New
  useEffect(() => {
    dataSource.on("*", datasourceHandler);
    return () => {
      dataSource.removeListener("*", datasourceHandler);
    };
  }, [dataSource]);


  return [rootRef, gridModel, dataSource, dispatchGridModel, custom]

}