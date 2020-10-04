
export default class DataAdaptor {

  constructor(source, location){
    console.log(`DataAdaptor dataSource ${source} ${location}`)
    this.source = source;
    this.location = location;
    this._dataProvider = null;
  }

  get dataProvider(){
    return this._dataProvider;
  }

  set dataProvider(value){
    console.log(`set dataProvider`, value)
    this._dataProvider = value;
  }

  startLoadTest(){
    this._dataProvider.startLoadTest();
  }

  startStressTest(){
    this._dataProvider.startStressTest();
  }

  stopTest(){
    this._dataProvider.stopTest();
  }

  toString(){
    console.log(`DataAdaptor ${this.source} ${this.location} provider: ${this.dataProvider}`)
  }

} 