export const config = {
  columns: [
    {name: "name"},
    {name: "client"},
    {name: "date", type: "date"},
    {name: "lastUpdate", type: "datetime"},
    {name: "chg", type: "number"},
    {name: "bid", type: "number"},
    {name: "ask", type: "number"},
    {name: "vol", type: "number"}
  ],

  dataUrl: '/tables/psp-securities-demo/data-generator.js',
  
  primaryKey: '',

  valueColumns: ['current','previous','pl1','pl2','gainDx','sxPx','_99out']

}
/*
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
*/