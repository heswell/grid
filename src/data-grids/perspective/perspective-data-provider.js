import perspective from '@finos/perspective';
import {EventEmitter} from "@heswell/utils";


export default class PerspectiveDataProvider extends EventEmitter {

  constructor(source, location){
    super();
    console.log(`Perspective dataSource ${source} ${location}`)
    this.source = source;
    this.location = location;
    const dataUrl = source === 'psp-superstore'
      ? '/tables/psp-superstore/superstore.arrow'
      : '';
    this.data = fetch(dataUrl);
  }

  async fetchData(){
    const data = await fetch('/tables/psp-superstore/superstore.arrow');
    const buffer = await data.arrayBuffer();
    return buffer;
  }

  async table(){
    const data = await this.data;
    const dataRequest = await data.arrayBuffer();
    const worker = perspective.worker();
    const buffer = await dataRequest;
    const table = await worker.table(buffer);
    console.log(await table.columns())
    return table;

  }

  group(columns){
    this.emit('group', columns)
  }

  sort(columns){
    this.emit('sort', columns)
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
    return `Perspective DataProvider ${this.source} ${this.location}`;
  }
} 