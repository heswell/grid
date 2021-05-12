import React, {forwardRef} from "react";
import {PropHelper} from "./prop-helper";

import GridBase from "./grid-base";
import { Footer, Header, InlineHeader } from "./grid-adornments";

import "./grid.css";
// TODO use a null datasource and empty columns defs
// display a warning if loaded with no dataSource


/** @type {Grid} */
const Grid = forwardRef(function Grid(props, ref){
  if (!props.dataSource) {
    return <PropHelper style={{ height: props.height, width: props.width }} />;
  } else {
    return <GridBase {...props} ref={ref}/>;
  }
});

Grid.Header = Header;
Grid.InlineHeader = InlineHeader;
Grid.Footer = Footer;

Grid.displayName = "Grid";

export default Grid;

