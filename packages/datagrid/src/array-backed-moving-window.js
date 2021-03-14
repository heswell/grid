
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
    this.internalData = new Array(bufferSize)
  }

  setAtIndex(index, data){
    if(this.isWithinRange(index)){
      this.internalData[index - this.range.from] = data
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

      for (let i=overlapFrom; i < overlapTo; i++){
        const data = this.getAtIndex(i);
        if (data){
          newData[i - from] = data;
        }
      }

      this.internalData = newData

      this.range.from = from
      this.range.to = to
  }

  getRange(){
    return this.range.copy();
  }
}
