
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

  // Note, the buffer is already accounted for in the range passed in here
  constructor({lo, hi}, {from, to}, bufferSize){
    this.bufferSize = bufferSize;
    this.clientRange = new WindowRange(lo, hi);
    this.range = new WindowRange(from, to);
    //internal data is always 0 based, we add range.from to determine an offset
    this.internalData = new Array(bufferSize);
    this.rowsWithinRange = 0;
  }

  get hasAllRowsWithinRange(){
    return this.rowsWithinRange === this.clientRange.to - this.clientRange.from;
  }

  setAtIndex(index, data){
    //onsole.log(`ingest row at rowIndex ${index} [${index - this.range.from}]`)
    if(this.isWithinRange(index)){
      const internalIndex = index - this.range.from;
      if (!this.internalData[internalIndex] && this.isWithinClientRange(index)){
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

  isWithinClientRange(index){
    return this.clientRange.isWithin(index);
  }

  setClientRange(from, to){
    this.clientRange.from = from;
    this.clientRange.to = to;
    this.rowsWithinRange = 0;
    for (let i=from;i<to;i++){
      const internalIndex = i - this.range.from;
      if (this.internalData[internalIndex]){
        this.rowsWithinRange += 1;
      }
    }

    // Is data required from server ... how close are we to buffer threshold ?
    const bufferPerimeter = this.bufferSize * .25;
    if (this.range.to - to < bufferPerimeter){
      console.log('%cCALL SEREVR FOR MORE DATA','color: blue; font-weight: bold')
      return true;
    } else if (this.range.from > 0 && from - this.range.from < bufferPerimeter){
      console.log('CALL SEREVR FOR MORE DATA')
      return true;
    } else {
      console.log('no server call required')
      return false;
    }
  }

  setRange(from, to){
      const [overlapFrom, overlapTo] = this.range.overlap(from, to);

      const newData = new Array(to - from + this.bufferSize);
      this.rowsWithinRange = 0;

      for (let i=overlapFrom; i < overlapTo; i++){
        const data = this.getAtIndex(i);
        if (data){
          const index = i - from;
          newData[index] = data;
          if (this.isWithinClientRange(i)){
            this.rowsWithinRange += 1;
          }
        }
      }

      this.internalData = newData
      this.range.from = from
      this.range.to = to
  }

  getData(){
    const {from, to} = this.range;
    const {from: lo, to: hi} = this.clientRange;
    const startOffset = Math.max(0, lo - from);
    const endOffset = Math.min(to-from, to, hi - from);
    //onsole.log(`MovingWindow getData (${lo}, ${hi}) range = ${from} ${to} , so start=${startOffset}, end=${endOffset}`)
    return this.internalData.slice(startOffset,endOffset);
  }

}