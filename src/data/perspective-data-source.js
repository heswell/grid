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

  let dataSource = new PerspectiveDataSource({
    columns, 
    configUrl: '/tables/psp-securities-demo/config.js',
  });

  return [columns, dataSource];

}
