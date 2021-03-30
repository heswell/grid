import React from 'react';
import cx from "classnames";
import { Palette, PaletteItem, registerComponent} from "@heswell/layout";
import useTables from "../useTables";
import {FilteredGrid} from "../filtered-grid";

const TableList = ({className,  ...props}) => {

  const tables = useTables();
  const tableList = Object.values(tables);

  return (

    <Palette className={cx("TableList", className)} title="View Palette" {...props}>
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
