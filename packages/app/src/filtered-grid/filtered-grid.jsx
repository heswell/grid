import React, {useEffect, useRef} from 'react';
import {View, useLayoutContext, SESSION} from "@heswell/layout";
import { Grid } from "@vuu-ui/datagrid";
import {QueryFilter} from "@vuu-ui/filter";
import {createDataSource} from "../utils"

export const FilteredGrid = ({schema}) => {
  const {loadSession, saveSession} = useLayoutContext();
  const dataSource = useRef(
    loadSession('data-source')?.enable() ??
    createDataSource(schema.table, schema))

  useEffect(() => () => saveSession(dataSource.current.disable(), "data-source") ,[saveSession])

  return (
  <>
    <QueryFilter onChange={q => dataSource.current.filterQuery(q)}/>
    <Grid dataSource={dataSource.current} columns={schema.columns} renderBufferSize={20} showLineNumbers/>
  </>
  )
}

export const DataGridView = ({schema, ...props}) => {
  return (
    <View header closeable resizeable title={schema.table} {...props} resize="defer">
      <FilteredGrid schema={schema}  />
    </View>
  )
}
DataGridView.displayName = "DataGridView";
