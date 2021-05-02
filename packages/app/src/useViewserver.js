
import {useCallback, useEffect, useState} from 'react';
import ConnectionManager from '@vuu-ui/data-remote/src/connection-manager-worker';
import {serverUrl} from "./create-data-source"

export const addRowsFromInstruments = "addRowsFromInstruments";
export const RpcCall = 'RPC_CALL';

const Servers = {
  Vuu: "vuu"
}

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

export const buildRpcMenuOptions = (options) => {
  const {viewport} = options;
  const results = [];
  if (options?.selectedRowCount){
    // TODO pass the table name
    results.push({
      action: RpcCall,
      label: "Create Order Entries",
      options: {
        method: addRowsFromInstruments,
        viewport
      },

    });
  }
  return results;
}


const useViewserver = () => {

  const [, forceUpdate] = useState();

  const setTables = useCallback(schemas => {
    schemas.forEach(schema => {
      _tables[schema.table] = extendSchema(schema);
    });
    forceUpdate({});
  }
  ,[forceUpdate])

  const makeRpcCall = useCallback(async (options) => {
    console.log(`make RPC call ${JSON.stringify(options)}`)
    const server = await ConnectionManager.connect(serverUrl, Servers.Vuu);
    const response= await server.rpcCall(options);
    console.log({rpcResp: response})
  },[])


  useEffect(() => {

    async function fetchTableMetadata(){
      const server = await ConnectionManager.connect(serverUrl, Servers.Vuu);
      const {tables} = await server.getTableList();
      setTables(await Promise.all(tables.map(table => server.getTableMeta(table))))
    }

    fetchTableMetadata();

  },[setTables])

  return {tables: _tables, makeRpcCall};
}

export default useViewserver;
