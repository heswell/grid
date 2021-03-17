import React, {useEffect, useRef} from 'react';
import cx from "classnames";
import {useLayoutDispatch, Action, View, registerComponent, DragIcon, useLayoutContext, SESSION} from "@heswell/layout";
import { uuid } from "@heswell/utils";
import { Grid } from "@vuu-ui/datagrid";
import {QueryFilter} from "@vuu-ui/filter";
import {List, ListItem} from "@heswell/ui-controls";
import useTables from "../useTables";
import {createDataSource} from "../utils"

const FilteredGrid = ({schema}) => {
  const {loadState, saveState} = useLayoutContext();
  const dataSource = useRef(
    loadState('data-source', SESSION)?.enable() ??
    createDataSource(schema.table, schema))

  useEffect(() => () => saveState(dataSource.current.disable(), "data-source", SESSION) ,[saveState])

  return (
  <>
    <QueryFilter onChange={q => dataSource.current.filterQuery(q)}/>
    <Grid dataSource={dataSource.current} columns={schema.columns} renderBufferSize={20} showLineNumbers/>
  </>
  )
}

const DataGrid = ({schema, ...props}) => {
  return (
    <View header closeable resizeable title={schema.table} {...props} resize="defer">
      <FilteredGrid schema={schema}  />
    </View>
  )
}


const dragElement = <DragIcon />
const gridElement = <DataGrid />

const TableList = ({className,  ...props}) => {

  const dispatch = useLayoutDispatch();
  const tables = useTables();

  function handleMouseDown(evt) {
    const {idx} = evt.target.dataset;
    const schema = tables[idx];
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
    <List className={cx("TableList", className)} values={tables.map(item => item.table)} {...props}>
      {tables.map(item =>
         <ListItem onMouseDown={handleMouseDown}>{item.table}</ListItem>
        )}
      </List>
  )
}

export default TableList;

registerComponent("TableList", TableList, "view");
