import React from 'react';
import cx from "classnames";
import { Palette, PaletteItem, registerComponent} from "@heswell/layout";
import useViewserver from "../useViewserver";
import {FilteredGrid} from "../filtered-grid";

const TableList = ({className,  ...props}) => {

  const {tables} = useViewserver();
  const tableList = Object.values(tables);

  return (

    <Palette className={cx("TableList", className)} orientation="vertical" title="View Palette" {...props}>
      {tableList.map((item, idx) =>
         <PaletteItem key={item.table} title={item.table} closeable resizeable resize="defer" header>
          <FilteredGrid  schema={tableList[idx]} />
       </PaletteItem>
      )}
    </Palette>

  )
}

export default TableList;

registerComponent("TableList", TableList, "view");
