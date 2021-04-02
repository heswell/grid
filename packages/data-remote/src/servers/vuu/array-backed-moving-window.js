
class WindowRange {
  constructor(from, to){
    this.from = from;
    this.to = to;
  }

  isWithin(index) {
    return index >= this.from && index < this.to;
  }

  //find the overlap of this range and a new one
  overlap(from, to){
    return (from >= this.to || to < this.from)
      ? [0, 0]
      : [Math.max(from, this.from), Math.min(to, this.to)]
  }

  copy(){
    return new WindowRange(this.from, this.to);
  }
}

export class ArrayBackedMovingWindow {

  constructor(bufferSize){
    this.range = new WindowRange(0, bufferSize)
    //internal data is always 0 based, we add range.from to determine an offset
    this.internalData = new Array(bufferSize);
    this.rowsWithinRange = 0;
  }

  get hasAllRowsWithinRange(){
    return this.rowsWithinRange === this.range.to - this.range.from;
  }

  setAtIndex(index, data){
    //onsole.log(`ingest row at rowIndex ${index} [${index - this.range.from}]`)
    if(this.isWithinRange(index)){
      const internalIndex = index - this.range.from;
      if (!this.internalData[internalIndex]){
        this.rowsWithinRange += 1;
        //onsole.log(`rowsWithinRange is now ${this.rowsWithinRange} out of ${this.range.to - this.range.from}`)
      }
      this.internalData[internalIndex] = data
    }
  }

  getAtIndex(index){
      return this.range.isWithin(index) && this.internalData[index - this.range.from] != null
        ? this.internalData[index - this.range.from]
        : undefined;
  }

  isWithinRange(index){
    return this.range.isWithin(index);
  }

  setRange(from, to){
      const [overlapFrom, overlapTo] = this.range.overlap(from, to);

      const newData = new Array(to - from);
      this.rowsWithinRange = 0;

      for (let i=overlapFrom; i < overlapTo; i++){
        const data = this.getAtIndex(i);
        if (data){
          newData[i - from] = data;
          this.rowsWithinRange += 1;
        }
      }

      this.internalData = newData
      this.range.from = from
      this.range.to = to
  }

  getData(lo=this.range.from, hi=this.range.to){
    const {from, to} = this.range;
    const startOffset = Math.max(0, lo - from);
    const endOffset = Math.min(to-from, to, hi - from);
    //onsole.log(`MovingWindow getData (${lo}, ${hi}) range = ${from} ${to} , so start=${startOffset}, end=${endOffset}`)
    return this.internalData.slice(startOffset,endOffset);
  }

  getRange(){
    return this.range.copy();
  }
}
