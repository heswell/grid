// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import { WindowRange } from "@heswell/utils/src/range-utils";

//TODO allow subscription details to be set before subscribe call
export default function useDataSource(dataSource, subscriptionDetails, renderBufferSize, callback) {

  const callbackRef = useRef(callback);
  if (callback !== callbackRef.current){
    callbackRef.current = callback;
  }

  const dataWindow = useRef(new MovingWindow(subscriptionDetails.range))
  const [, forceUpdate] = useState(null);
  const setData = updates => {
    console.log(`setData ${updates.length} rows`)
    const movingWindow = dataWindow.current;
    for (const row of updates){
      movingWindow.add(row);
    }
    forceUpdate({});
  }

  const expandRange = useCallback((lo,hi) => {
    return {
        lo: Math.max(0, lo - renderBufferSize),
        hi: hi + renderBufferSize
    };
  },[renderBufferSize]);


  const setRange = useCallback((lo, hi) => {
    const range = expandRange(lo,hi);
    dataSource.setRange(range.lo, range.hi);
    dataWindow.current.setRange(lo, hi)
  }, [dataSource, expandRange]);

  useEffect(() => {
    console.log(`subscribe datasource status ${dataSource.status} (suspended = ${dataSource.suspended}) with `, subscriptionDetails)
    dataSource.subscribe(subscriptionDetails,
      function datasourceMessageHandler({ type: messageType, ...msg }) {
        if (messageType === 'subscribed') {
          return callbackRef.current(messageType, msg);
        } else if (messageType === "viewport-update"){
          const sizeChanged = msg.size !== undefined;
          if (sizeChanged){
            callbackRef.current('size', msg.size);
            dataWindow.current.setRowCount(msg.size);
          }
          if (msg.rows){
            setData(msg.rows);
          } else if (sizeChanged){
            // force a render to reflect the size change
            forceUpdate({})
          }
        } else if (messageType === 'sort'){
          callbackRef.current(messageType, msg.sort);
        } else if (messageType === 'groupBy'){
          callbackRef.current(messageType, msg.groupBy);
        } else if (messageType === 'filter'){
          callbackRef.current(messageType, msg.filter);
          dataSource.emit('filter', msg.filter);
        } else if (messageType === 'VP_VISUAL_LINKS_RESP'){
          callbackRef.current(messageType, msg.links);
        }
      }
    );

    return () => {
        console.log(`%cUNSUBSCRIBE`,'color: green;font-weight: bold;')
        dataSource.unsubscribe();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  useEffect(() => {
    console.log(`subscription details seem to have changed`)
  },[subscriptionDetails])


  return [dataWindow.current.data, setRange];
}


export class MovingWindow {

  // Note, the buffer is already accounted for in the range passed in here
  constructor({lo, hi}){
    console.log(`useDataSource MovingWindow ${lo}:${hi}`)
    this.range = new WindowRange(lo, hi);
    //internal data is always 0 based, we add range.from to determine an offset
    this.data = new Array(hi-lo);
    this.rowCount = 0;
  }

  setRowCount = rowCount => {
    if (rowCount < this.rowCount){
      const [overlapFrom, overlapTo] = this.range.overlap(rowCount, this.rowCount);
      for (let i=overlapFrom;i<overlapTo;i++){
        const rowIndex = i - this.range.from;
        this.data[rowIndex] = undefined;
      }
    }
    this.rowCount = rowCount;
  }

  add(data){
    const [index] = data;
    //onsole.log(`ingest row at rowIndex ${index} [${index - this.range.from}]`)
    if(this.isWithinRange(index)){
      const internalIndex = index - this.range.from;
      this.data[internalIndex] = data
    }
  }

  getAtIndex(index){
      return this.range.isWithin(index) && this.data[index - this.range.from] != null
        ? this.data[index - this.range.from]
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
          const index = i - from;
          newData[index] = data;
        }
      }
      this.data = newData
      this.range.from = from
      this.range.to = to
  }

}
