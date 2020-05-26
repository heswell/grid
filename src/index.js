import React from "react";
import ReactDOM from "react-dom";
import {create as createJss} from 'jss';
import { JssProvider} from 'react-jss';
import nestedPlugin from 'jss-plugin-nested';
import camelCasePlugin from 'jss-plugin-camel-case';
import defaultUnitPlugin from 'jss-plugin-default-unit';
import globalPlugin from 'jss-plugin-global';
import cachePlugin from 'jss-plugin-cache';

import App from "./App";

const jss = createJss();
jss.use(
  cachePlugin(),
  globalPlugin(),
  nestedPlugin(),
  camelCasePlugin(),
  defaultUnitPlugin()
);

const rootElement = document.getElementById("root");
ReactDOM.render(
 <JssProvider jss={jss}>
    <App />
  </JssProvider>,
  rootElement);
