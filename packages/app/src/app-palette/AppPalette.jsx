import React from 'react';
import cx from "classnames";
import { LayoutConfigurator, Palette, PaletteItem} from "@heswell/layout";
import useViewserver from "../useViewserver";
import {FilteredGrid} from "../filtered-grid";
import * as layout from './Layouts';

export const AppPalette = ({className,  ...props}) => {


  const {tables} = useViewserver();
  const tableList = Object.values(tables);

  return (

    <Palette className={cx("TableList", className)} orientation="vertical" collapsibleHeaders {...props}>

      <div data-header>Pages</div>
      <div data-header>Layouts</div>
      <PaletteItem title="Page 1" template closeable resizeable header>
        {layout.twoColumns}
      </PaletteItem>

      <div data-header>Tables</div>
      {tableList.map((item, idx) =>
         <PaletteItem key={item.table} title={item.table} closeable resizeable resize="defer" header>
          <FilteredGrid  schema={tableList[idx]} />
       </PaletteItem>
      )}
    </Palette>

  )
}
