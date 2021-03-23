import React from 'react';
import cx from "classnames";
import {useLayoutDispatch, Action, registerComponent, DragIcon} from "@heswell/layout";
import { uuid } from "@heswell/utils";
import {List, ListItem} from "@heswell/ui-controls";
import useTables from "../useTables";
import {DataGridView} from "../filtered-grid";

const dragElement = <DragIcon />
const gridElement = <DataGridView />

const TableList = ({className,  ...props}) => {

  const dispatch = useLayoutDispatch();
  const tables = useTables();
  const tableList = Object.values(tables);

  function handleMouseDown(evt) {
    const {idx} = evt.target.dataset;
    const schema = tableList[idx];
    const { left, top, width } = evt.currentTarget.getBoundingClientRect();

    const id = uuid();
    dispatch({
      type: Action.DRAG_START,
      evt,
      path: "*",
      component: React.cloneElement(dragElement, {
        component: React.cloneElement(gridElement, {
          id,
          key: id,
          schema,
        })
      }),
      instructions: {
        DoNotRemove: true,
        DoNotTransform: true,
        dragThreshold: 10,
      },
      dragRect: {
        left,
        top,
        right: left + width,
        bottom: top + 150,
        width,
        height: 100,
      },
    });
  }


  return (
    <List className={cx("TableList", className)} values={[]} {...props}>
      {tableList.map(item =>
         <ListItem key={item.table} onMouseDown={handleMouseDown}>{item.table}</ListItem>
        )}
      </List>
  )
}

export default TableList;

registerComponent("TableList", TableList, "view");
