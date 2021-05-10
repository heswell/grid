
import {useCallback, useEffect, useState} from 'react';
import ConnectionManager from '@vuu-ui/data-remote/src/connection-manager-worker';
import {serverUrl} from "./create-data-source"
import {FilteredGrid} from "./filtered-grid";

export const addRowsFromInstruments = "addRowsFromInstruments";
export const RpcCall = 'RPC_CALL';

const Servers = {
  Vuu: "vuu"
}

const _tables = {};
let _status = "";

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

// TODO openDialog feels out of place here ?
const useViewserver = ({openDialog}={}) => {

  const [, forceUpdate] = useState();

  const setTables = useCallback(schemas => {
    schemas.forEach(schema => {
      _tables[schema.table] = extendSchema(schema);
    });
    forceUpdate({});
    _status = "tables-loaded";
  }
  ,[forceUpdate])

  const makeRpcCall = useCallback(async (options) => {
    const server = await ConnectionManager.connect(serverUrl, Servers.Vuu);
    const response= await server.rpcCall(options);
    switch(response.method){
      case addRowsFromInstruments:
        if (!response.orderEntrOpen){
          openDialog && openDialog(
            <FilteredGrid cellSelectionModel='single-cell' schema={_tables.orderEntry} width={700} height={400}/>
          )
        } else {
          console.log('select entries in orderEntry')
        }
      break;
      default:
        console.log(`response from unexpected meyhod ${response.method}`);

    }
  },[openDialog])


  useEffect(() => {

    async function fetchTableMetadata(){
      _status = "tables-loading";
      const server = await ConnectionManager.connect(serverUrl, Servers.Vuu);
      const {tables} = await server.getTableList();
      setTables(await Promise.all(tables.map(table => server.getTableMeta(table))))
    }

    if (_status === ""){
      fetchTableMetadata();
    }

  },[setTables])

  return {tables: _tables, makeRpcCall};
}

export default useViewserver;
