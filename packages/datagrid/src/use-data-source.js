// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';

//TODO allow subscription details to be set before subscribe call
export default function useDataSource(dataSource, subscriptionDetails, renderBufferSize, callback) {

  const callbackRef = useRef(callback);
  if (callback !== callbackRef.current){
    callbackRef.current = callback;
  }

  const [data, setData] = useState([]);

  const expandRange = useCallback((lo,hi) => {
    return {
        lo: Math.max(0, lo - renderBufferSize),
        hi: hi + renderBufferSize
    };
  },[renderBufferSize]);


  const setRange = useCallback((lo, hi) => {
    const range = expandRange(lo,hi);
    dataSource.setRange(range.lo, range.hi);
  }, [dataSource, expandRange]);

  useEffect(() => {
    console.log(`subscribe datasource ststus ${dataSource.status} (suspended = ${dataSource.suspended}) with `, subscriptionDetails)
    dataSource.subscribe(subscriptionDetails,
      function datasourceMessageHandler({ type: messageType, ...msg }) {
        if (messageType === 'subscribed') {
          return callbackRef.current(messageType, msg);
        } else if (messageType === "viewport-update"){
          if (msg.size !== undefined){
            callbackRef.current('size', msg.size);
          }
          if (msg.rows){
            setData(msg.rows);
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


  return [data, setRange];
}
