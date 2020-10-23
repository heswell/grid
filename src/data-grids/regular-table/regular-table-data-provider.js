import {EventEmitter} from '@heswell/utils';
import {buildData} from './build-data';

// TODO do we need this or should it just be PerspectiveDataProvider ?
export default class RegularDataProvider extends EventEmitter {

  constructor(source, location){
    super();
    console.log(`Regular Table dataSource ${source} ${location}`)
    this.source = source;
    this.location = location;
    buildData(source, location).then((dataModel) => {
      this.dataModel = dataModel;
      this.emit('ready')
    });
  }


  group(columns){
    console.log(`Regular Table Data Provider group`)
  }

  sort(columns){
    console.log(`Regular Table Data Provider sort`)
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
    return `Regular Table DataProvider ${this.source} ${this.location}`;
  }
} 