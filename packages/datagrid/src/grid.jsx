import React, {forwardRef, useCallback, useEffect, useRef} from "react";
import {PropHelper} from "./prop-helper";
import useResizeObserver, {WidthHeight } from "./use-resize-observer"/*from "@heswell/layout";*/
import Measure, { useMeasure } from "./measure";

import {useForkRef} from "@heswell/utils"
import GridBase from "./grid-base";
import { Footer, Header, InlineHeader } from "./grid-adornments";

import "./grid.css";
// TODO use a null datasource and empty columns defs
// display a warning if loaded with no dataSource


/** @type {Grid} */
const Grid = forwardRef(function Grid(props, ref){
  const [size, _setSize] = useMeasure(props);
  const rootRef = useRef(null);
  const refCallback = useForkRef(rootRef, ref);

  const setSize = useCallback(({height, width}) => {
    _setSize(state => ({
      ...state,
      measuredHeight: height,
      measuredWidth: width
    }));
  },[_setSize])

  const onResize = useCallback(({width, height}) => {
    console.log(`%conReresize width=${width} height=${height}`,'color:green;font-weight:bold;')
  },[])

  useResizeObserver(rootRef, WidthHeight, onResize);

  useEffect(() => {
    if (rootRef.current){
      const {parentNode} = rootRef.current;
      if (parentNode){
        console.log(`>>> parentNode ${parentNode.className}`)
      }
    }
  }, [size]);

  if ((size.height === "100%" && size.measuredHeight === null) || (size.width === "100%" && size.measuredWidth === null)) {
    return <Measure onMeasure={setSize} height={size.height} width={size.width} />;
  } else if (!props.dataSource) {
    return <PropHelper style={{ height: size.height, width: size.width }} />;
  } else {
    return <GridBase {...props} size={size} ref={refCallback}  />;
  }
});

Grid.Header = Header;
Grid.InlineHeader = InlineHeader;
Grid.Footer = Footer;

export default Grid;

