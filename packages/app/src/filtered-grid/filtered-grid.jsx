import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLayoutContext } from "@heswell/layout";
import { Button } from "@heswell/ui-controls"
import { Grid } from "@vuu-ui/datagrid";
import { QueryFilter } from "@vuu-ui/filter";
import { createDataSource } from "../create-data-source"

export const FilteredGrid = ({ schema }) => {
  const { id, dispatch, load, save, loadSession, saveSession } = useLayoutContext();
  const config = useMemo(() => load(), [load]);

  const dataSource = useMemo(() => {
    let ds = loadSession('data-source');
    if (ds) {
      return ds;
    }
    ds = createDataSource(schema.table, schema, config);
    saveSession(ds, "data-source");
    return ds;
  }, [config, loadSession, saveSession, schema]);

  useEffect(() => () => dataSource.disable(), [dataSource])

  useEffect(() => {
    console.log(`filtered grid mounted `)
    dataSource.enable();
    return () => {
      console.log(`filtered grid unmounted`)
    }
  }, [dataSource])


  const unlink = () => {
    console.log('unlink')
  }

  const handleConfigChange = useCallback(({type, ...op}) => {
    // TODO consolidate these messages
    switch (type) {
      case "group":
        save(op.groupBy, type);
        dispatch({ type: 'save' });
        break;
      case "sort":
        save(op.sort, type);
        dispatch({ type: 'save' });
        break;
      case "filter":
        save(op.filter, type);
        dispatch({ type: 'save' });
        break;
      case "visual-link-created":
        dispatch({ type: "toolbar-contribution", location: "post-title", content: <Button onClick={unlink}>Linked</Button> })
        save(op, "visual-link");
        dispatch({ type: 'save' });
        break;
      default:
        console.log(`unknown config change type ${type}`);
    }
  }, [dispatch, save]);

  console.log(`restored config ${JSON.stringify(config)}`)

  return (
    <>
      <QueryFilter onChange={q => dataSource.filterQuery(q)} />
      <Grid
        dataSource={dataSource}
        columns={schema.columns}
        groupBy={config?.group}
        onConfigChange={handleConfigChange}
        renderBufferSize={10}
        sort={config?.sort}
        showLineNumbers />
    </>
  )
}

FilteredGrid.displayName = "FilteredGrid";
