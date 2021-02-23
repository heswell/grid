
import {useEffect, useState} from 'react';
import ConnectionManager from '@vuu-ui/data-remote/src/connection-manager-worker';

const useTables = (serverUrl) => {

  const [tables, setTables] = useState([])

  useEffect(() => {

    async function fetchTableMetadata(){
      const server = await ConnectionManager.connect(serverUrl);
      const {tables} = await server.getTableList();
      setTables(await Promise.all(tables.map(table => server.getTableMeta(table))))
    }

    fetchTableMetadata();

  },[serverUrl])

  return tables;
}

export default useTables;
