


export default class PerspectiveDataProvider {

  constructor(source, location){
    console.log(`Perspective dataSource ${source} ${location}`)
    this.source = source;
    this.location = location;
    // const [columns, dataSource] = buildData(source, location);
    // this.columns = columns;
    // this.dataSource = dataSource;
  }

  async fetchData(){
    const data = await fetch('/tables/psp-superstore/superstore.arrow');
    const buffer = await data.arrayBuffer();
    return buffer;

  }

  startLoadTest(){
    console.log(`start load test`)
  }

  startStressTest(){
    console.log(`start stress test`)
  }

  stopTest(){
    console.log(`stop test`)
  }

  toString(){
    console.log(`Perspective DataProvider ${this.source} ${this.location}`)
  }
} 