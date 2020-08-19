import perspective from '@finos/perspective';
import { PerspectiveDataSource } from "@heswell/data-source";

export default function getPerspectivesDataSource(){

  let columns = [
    {name: "name"},
    {name: "client"},
    {name: "date"},
    {name: "lastUpdate"},
    {name: "chg", type: "number"},
    {name: "bid", type: "number"},
    {name: "ask", type: "number"},
    {name: "vol", type: "number"}
  ]

  const table = perspective.worker().table(
    {
        name: "string",
        client: "string",
        date: "date",
        lastUpdate: "datetime",
        chg: "float",
        bid: "float",
        ask: "float",
        vol: "float"
    },
    {
        limit: 5000
    }
  );

  let dataSource = new PerspectiveDataSource({
    columns, 
    table
  });

  return [columns, dataSource];

}
