
import {useCallback, useEffect, useState} from 'react';
import ConnectionManager from '@vuu-ui/data-remote/src/connection-manager-worker';
import {serverUrl} from "./create-data-source"

const _tables = {};

const columnConfig = {
  ask: {
    name: 'ask',
    type: {
      name: 'number',
      renderer: { name: 'background', flashStyle: 'arrow-bg' },
      formatting: { decimals: 2, zeroPad: true }
    },
    aggregate: 'avg'
  },
  bid: {
    name: 'bid',
    type: {
      name: 'number',
      renderer: { name: 'background', flashStyle: 'arrow-bg' },
      formatting: { decimals: 2, zeroPad: true }
    },
    aggregate: 'avg'
  },
  currency: {
    name: "currency",
    label: 'ccy',
    width: 60
  },
  filledQuantity : {
    name: 'filledQuantity',
    label: 'filled qty',
    width: 80,
    type: {
      name: 'number',
      renderer: { name: 'progress', associatedField: 'quantity' },
      format: { decimals: 0 }
    }
  },
  lotSize : {
    name: "lotSize",
    width: 80,
    type: {
      name: "number"
    }
  },
  quantity: {
    name: 'quantity',
    width: 80,
    type : {
      name: 'number'
    }
  }
}

const extendSchema = schema => {
  return {
    ...schema,
    columns: schema.columns.map(col => columnConfig[col] ?? col)
  }
}

const useTables = () => {

  const [, forceUpdate] = useState();

  const setTables = useCallback(schemas => {
    schemas.forEach(schema => {
      _tables[schema.table] = extendSchema(schema);
    });
    forceUpdate({});
  }
  ,[forceUpdate])

  const rpcCall = useCallback((options) => {
    console.log(`make RPC call ${JSON.stringify(options)}`)
  },[])


  useEffect(() => {

    async function fetchTableMetadata(){
      const server = await ConnectionManager.connect(serverUrl);
      const {tables} = await server.getTableList();
      setTables(await Promise.all(tables.map(table => server.getTableMeta(table))))
    }

    fetchTableMetadata();

  },[setTables])

  return {tables: _tables, rpcCall};
}

export default useTables;
