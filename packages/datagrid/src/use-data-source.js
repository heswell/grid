// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { metadataKeys } from "@heswell/utils/src/column-utils";
import { WindowRange, getFullRange } from "@heswell/utils/src/range-utils";
const { RENDER_IDX } = metadataKeys;

const byKey = (row1, row2) => row1[RENDER_IDX] - row2[RENDER_IDX];

// const uniqueKeys = rows => {
//   const keys = rows.map(row => row[1]).filter(i => i !== undefined);
//   const uniqueKeys = new Set(keys);
//   return uniqueKeys.size === keys.length;
// }


//TODO allow subscription details to be set before subscribe call
export default function useDataSource(dataSource, subscriptionDetails, renderBufferSize, callback) {

  const [, forceUpdate] = useState(null);
  const isMounted = useRef(true);
  const hasUpdated = useRef(false);
  const rafHandle = useRef(null);
  const callbackRef = useRef(callback);
  if (callback !== callbackRef.current){
    callbackRef.current = callback;
  }

  useEffect(() => () => {
    if (rafHandle.current){
      cancelAnimationFrame(rafHandle.current);
      rafHandle.current = null;
    }
    isMounted.current = false;
  },[])

  const refreshIfUpdated = useCallback(() => {
    if (isMounted.current){
      if (hasUpdated.current){
        forceUpdate({});
        hasUpdated.current = false;
      }
      rafHandle.current = requestAnimationFrame(refreshIfUpdated);
    }
  },[forceUpdate])

  useEffect(() => {
    rafHandle.current = requestAnimationFrame(refreshIfUpdated);
  }, [refreshIfUpdated])

  const data = useRef([])
  const dataWindow = useMemo(
    () => new MovingWindow(getFullRange(subscriptionDetails.range, renderBufferSize)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const setData = updates => {
    for (const row of updates){
      dataWindow.add(row);
    }

    data.current = dataWindow.data.slice().sort(byKey);
    hasUpdated.current = true;
  }


  const setRange = useCallback((lo, hi) => {
    const {from, to} = getFullRange({lo,hi}, renderBufferSize);
    dataSource.setRange(from, to);
    dataWindow.setRange(from, to)
  }, [dataSource, dataWindow, renderBufferSize]);

  useEffect(() => {
    // console.log(`subscribe datasource status ${dataSource.status} (suspended = ${dataSource.suspended}) with `, subscriptionDetails)
    dataSource.subscribe(subscriptionDetails,
      function datasourceMessageHandler({ type: messageType, ...msg }) {
        if (messageType === 'subscribed') {
          return callbackRef.current(messageType, msg);
        } else if (messageType === "viewport-update"){
          const sizeChanged = msg.size !== undefined;
          if (sizeChanged){
            callbackRef.current('size', msg.size);
            dataWindow.setRowCount(msg.size);
          }
          if (msg.rows){
            setData(msg.rows);
          } else if (sizeChanged){
            // force a render to reflect the size change
            // forceUpdate({})
            data.current = dataWindow.data.slice().sort(byKey);
            hasUpdated.current = true;
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
        } else if (messageType === 'visual-link-created'){
          callbackRef.current(messageType, msg);
        }
      }
    );

    return () => {
        console.log(`%cUNSUBSCRIBE`,'color: green;font-weight: bold;')
        dataSource.unsubscribe();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  return [data.current, setRange];
}


export class MovingWindow {

  constructor({from, to}){
    this.range = new WindowRange(from, to);
    //internal data is always 0 based, we add range.from to determine an offset
    this.data = new Array(to-from);
    this.rowCount = 0;
  }

  setRowCount = rowCount => {
    if (rowCount < this.data.length){
      this.data.length = rowCount;
    }

    // if (rowCount < this.rowCount){
    //   const [overlapFrom, overlapTo] = this.range.overlap(rowCount, this.rowCount);
    //   for (let i=overlapFrom;i<overlapTo;i++){
    //     const rowIndex = i - this.range.from;
    //     if (i === rowCount){
    //       break;
    //     }
    //     this.data[rowIndex] = undefined;
    //   }
    // }
    this.rowCount = rowCount;
  }

  add(data){
    const [index] = data;
    //onsole.log(`ingest row at rowIndex ${index} [${index - this.range.from}]`)
    if(this.isWithinRange(index)){
      const internalIndex = index - this.range.from;
      this.data[internalIndex] = data

      // if (!sequential(this.data)){
      //   debugger;
      // }

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
