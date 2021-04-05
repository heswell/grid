
import { WindowRange } from "@heswell/utils/src/range-utils";
export class ArrayBackedMovingWindow {

  // Note, the buffer is already accounted for in the range passed in here
  constructor({lo, hi}, {from, to}, bufferSize){
    this.bufferSize = bufferSize;
    this.clientRange = new WindowRange(lo, hi);
    this.range = new WindowRange(from, to);
    //internal data is always 0 based, we add range.from to determine an offset
    this.internalData = new Array(bufferSize);
    this.rowsWithinRange = 0;
    this.rowCount = 0;
  }

  get hasAllRowsWithinRange(){
    return (this.rowsWithinRange === this.clientRange.to - this.clientRange.from) ||
      (this.rowCount > 0 && this.rowsWithinRange === this.rowCount);
  }

  setRowCount = rowCount => {
    if (rowCount < this.rowCount){
      const [overlapFrom, overlapTo] = this.range.overlap(rowCount, this.rowCount);
      for (let i=overlapFrom;i<overlapTo;i++){
        const rowIndex = i - this.range.from;
        this.internalData[rowIndex] = undefined;
        if (this.isWithinClientRange(rowIndex)){
          this.rowsWithinRange -= 1;
        }
      }
    }
    this.rowCount = rowCount;
  }

  setAtIndex(index, data){
    //onsole.log(`ingest row at rowIndex ${index} [${index - this.range.from}]`)
    const isWithinClientRange = this.isWithinClientRange(index);
    if(isWithinClientRange || this.isWithinRange(index)){
      const internalIndex = index - this.range.from;
      if (!this.internalData[internalIndex] && isWithinClientRange){
        this.rowsWithinRange += 1;
        //onsole.log(`rowsWithinRange is now ${this.rowsWithinRange} out of ${this.range.to - this.range.from}`)
      }
      this.internalData[internalIndex] = data
    }
    return isWithinClientRange;
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

    // const originalRange = this.clientRange.copy();
    this.clientRange.from = from;
    this.clientRange.to = to;
    this.rowsWithinRange = 0;
    for (let i=from;i<to;i++){
      const internalIndex = i - this.range.from;
      if (this.internalData[internalIndex]){
        this.rowsWithinRange += 1;
      }
    }

    // let clientRows = undefined;
    // if (this.hasAllRowsWithinRange){
    //   const offset = this.range.from;
    //   if (to > originalRange.to){
    //     const start = Math.max(from, originalRange.to);
    //     clientRows = this.internalData.slice(start-offset, to-offset);
    //   } else {
    //     const end = Math.min(originalRange.to, to);
    //     clientRows = this.internalData.slice(from-offset, end);
    //   }
    // }

    let serverDataRequired = false;

    // Is data required from server ... how close are we to buffer threshold ?
    const bufferPerimeter = this.bufferSize * .25;
    if (this.range.to - to < bufferPerimeter){
      serverDataRequired = true;
    } else if (this.range.from > 0 && from - this.range.from < bufferPerimeter){
      serverDataRequired = true;
    }

    return [serverDataRequired]
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
    const endOffset = Math.min(to-from, to, hi - from, this.rowCount);
    // const endOffset = Math.min(to-from, to, hi - from, this.rowCount);
    //onsole.log(`MovingWindow getData (${lo}, ${hi}) range = ${from} ${to} , so start=${startOffset}, end=${endOffset}`)
    return this.internalData.slice(startOffset,endOffset);
  }

}
