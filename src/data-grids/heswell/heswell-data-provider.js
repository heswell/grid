import {buildData} from './build-data';

export default class HeswellDataProvider {

  constructor(source, location){
    console.log(`Heswell dataSource ${source} ${location}`)
    this.source = source;
    this.location = location;
    const [columns, dataSource] = buildData(source, location);
    this.columns = columns;
    this.dataSource = dataSource;
  }

  startLoadTest(){
    this.dataSource.startLoadTest();
  }

  startStressTest(){
    this.dataSource.startStressTest();
  }

  stopTest(){
    this.dataSource.stopTest();
  }

  toString(){
    console.log(`Heswell DataProvider ${this.source} ${this.location}`)
  }

} 