import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useLayoutContext} from "@heswell/layout";
import { Grid } from "@vuu-ui/datagrid";
import {QueryFilter} from "@vuu-ui/filter";
import {createDataSource} from "../utils"

export const FilteredGrid = ({schema}) => {
  const {id, dispatch, load, save, loadSession, saveSession} = useLayoutContext();
  const config = useRef(load());
  const dataSource = useMemo(() => {
    let ds = loadSession('data-source');
    if (ds){
      return ds;
    }
    ds = createDataSource(schema.table, schema, config.current);
    saveSession(ds, "data-source");
    return ds;
  },[loadSession, saveSession, schema]);

  useEffect(() => () => dataSource.disable() ,[dataSource])

  useEffect(() => {
    console.log(`filtered grin mounted `)
    dataSource.enable();
    return () => {
      console.log(`filtered grin unmounted`)
    }
  },[dataSource])


  const handleConfigChange = useCallback(op => {
    // TODO consolidate these messages
    switch(op.type){
      case "group":
        save(op.groupBy, op.type);
        dispatch({type: 'save'});
        break;
      case"sort":
        save(op.sort, op.type);
        dispatch({type: 'save'});
      break;
      case"filter":
        save(op.filter, op.type);
        dispatch({type: 'save'});
      break;
      default:
        console.log('unknown config change type ');
    }
    },[dispatch, save]);

  console.log(`restored config ${JSON.stringify(config.current)}`)

  return (
  <>
    <QueryFilter onChange={q => dataSource.filterQuery(q)}/>
    <Grid
      dataSource={dataSource}
      columns={schema.columns}
      groupBy={config.current?.group}
      onConfigChange={handleConfigChange}
      renderBufferSize={0}
      sort={config.current?.sort}
      showLineNumbers/>
  </>
  )
}

FilteredGrid.displayName = "FilteredGrid";
