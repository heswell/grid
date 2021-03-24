import React, {useCallback, useEffect, useRef} from 'react';
import {View, useLayoutContext} from "@heswell/layout";
import { Grid } from "@vuu-ui/datagrid";
import {QueryFilter} from "@vuu-ui/filter";
import {createDataSource} from "../utils"

export const FilteredGrid = ({schema}) => {
  const {dispatch, load, save, loadSession, saveSession} = useLayoutContext();
  const config = useRef(load());
  const dataSource = useRef(
    loadSession('data-source')?.enable() ??
    createDataSource(schema.table, schema, config.current))
  useEffect(() => () => saveSession(dataSource.current.disable(), "data-source") ,[saveSession])

  const handleConfigChange = useCallback(op => {
    // TODO consolidate these messages
    switch(op.type){
      case "group":
        save(op.options, op.type);
        dispatch({type: 'save'});
        break;
      case"sort":
        save(op.options, op.type);
        dispatch({type: 'save'});
      break;
      case"filter":
        save(op.options, op.type);
        dispatch({type: 'save'});
      break;
      default:
        console.log('unknown config change type ');
    }
    },[dispatch, save]);

  console.log(`restored config ${JSON.stringify(config.current)}`)

  return (
  <>
    <QueryFilter onChange={q => dataSource.current.filterQuery(q)}/>
    <Grid
      dataSource={dataSource.current}
      columns={schema.columns}
      groupBy={config.current?.group}
      onConfigChange={handleConfigChange}
      renderBufferSize={20}
      sort={config.current?.sort}
      showLineNumbers/>
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
