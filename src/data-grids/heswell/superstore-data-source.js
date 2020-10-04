import perspective from "@finos/perspective";
import { LocalDataSource } from "@heswell/data-source";

const schema = { 
  columns: [
    {name: "Category", type: "string"},
    {name: "City", type: "string"},
    {name: "Country", type: "string"},
    {name: "Customer ID", type: "string"},
    {name: "Customer Name", type: "string"},
    {name: "Discount", type: "number"},
    {name: "Order Date", type: "datetime"},
    {name: "Order ID", type: "string"},
    {name: "Postal Code", type: "string"},
    {name: "Product ID", type: "string"},
    {name: "Product Name", type: "string"},
    {name: "Profit", type: "number"},
    {name: "Quantity", type: "integer"},
    {name: "Region", type: "string"},
    {name: "Row ID", type: "integer"},
    {name: "Sales", type: "number"},
    {name: "Segment", type: "string"},
    {name: "Ship Date", type: "datetime"},
    {name: "Ship Mode", type: "string"},
    {name: "State", type: "string"},
    {name: "Sub-Category", type: "string"}
    ]
};


const loadFromArrow = async (dataUrl) => {
  return new Promise(async (resolve) => {
    const start = performance.now();
    const data = await fetch(dataUrl);
    const arrayBuffer = await data.arrayBuffer();
    // TODO we must be able to extract the data without perspective ? Use arrow directly
    const table = await perspective.worker().table(arrayBuffer);
    const view = await table.view();
    const schema = await table.schema();
    console.log({schema})
    const json = await view.to_json();
    // this.columns = utils.convertFromPSPSchema(schema);
    // this.columnNames = this.columns.map(c=>c.name)
    const end = performance.now();
    view.delete();
    table.delete();
    console.log(`data load took ${end-start}ms`)
    resolve(json);
  })
}



// TODO this can be a generic get from Arrow
export default function getSuperstoreSource(source, location){
  let dataSource;

  if (location === 'local'){
    dataSource = new LocalDataSource({
      schema,
      data: loadFromArrow('/tables/psp-superstore/superstore.arrow')
    });

  } else if (location === 'remote'){
    throw Error('Superstore Data Source does not yet support remote data');
    // dataSource = new RemoteDataSource({
    //   serverUrl: '127.0.0.1:9090',
    //   tableName
    // });

  }
  return [schema.columns, dataSource];

}