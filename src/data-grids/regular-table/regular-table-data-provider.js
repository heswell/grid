
export default class PerspectiveDataProvider {

  constructor(source, location){
    console.log(`Regular Table dataSource ${source} ${location}`)
    this.source = source;
    this.location = location;
    // const [columns, dataSource] = buildData(source, location);
    // this.columns = columns;
    // this.dataSource = dataSource;
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
    console.log(`Regular Table DataProvider ${this.source} ${this.location}`)
  }
} 