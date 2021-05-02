import {useCallback} from 'react';
import ConnectionManager from '@vuu-ui/data-remote/src/connection-manager-worker';
import {serverUrl} from "./create-data-source"

export const addRowsFromInstruments = "addRowsFromInstruments";
export const RpcCall = 'RPC_CALL';

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

export const useRpcService = () => {

  const makeRpcCall = useCallback(() => {
    //return dataSource.rpcCall({type, ...options}), true;

  },[])

  return makeRpcCall;
}
