import React, {forwardRef} from "react";
import {PropHelper} from "./prop-helper";
import Measure, { useMeasure } from "./measure";
import GridBase from "./grid-base";
import { Footer, Header, InlineHeader } from "./grid-adornments";

import "./grid.css";
// TODO use a null datasource and empty columns defs
// display a warning if loaded with no dataSOurce

/** @type {Grid} */
const Grid = forwardRef(function Grid(props, ref){
  const [{ height, width }, setSize] = useMeasure(props);
  if (height === "100%" || width === "100%") {
    return <Measure onMeasure={setSize} height={height} width={width} />;
  } else if (!props.dataSource) {
    return <PropHelper style={{ height, width }} />;
  } else {
    return <GridBase {...props} height={height} ref={ref} width={width} />;
  }
});

Grid.Header = Header;
Grid.InlineHeader = InlineHeader;
Grid.Footer = Footer;

export default Grid;

