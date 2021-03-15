
import {useCallback, useEffect, useState} from 'react';
import ConnectionManager from '@vuu-ui/data-remote/src/connection-manager-worker';
import {serverUrl} from "./utils"

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

  const [tables, _setTables] = useState([])

  const setTables = useCallback(tables =>
    _setTables(tables.map(table => extendSchema(table)))
  ,[_setTables])

  useEffect(() => {

    async function fetchTableMetadata(){
      const server = await ConnectionManager.connect(serverUrl);
      const {tables} = await server.getTableList();
      setTables(await Promise.all(tables.map(table => server.getTableMeta(table))))
    }

    fetchTableMetadata();

  },[setTables])

  return tables;
}

export default useTables;
