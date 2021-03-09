// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import dataReducer from './grid-data-reducer';
import { resetRange } from "@heswell/utils";



//TODO allow subscription details to be set before subscribe call
export default function useDataSource(dataSource, subscriptionDetails, renderBufferSize, callback) {

  const isRunning = useRef(false);
  const frame = useRef(null);
  const callbackRef = useRef(callback);
  if (callback !== callbackRef.current){
    callbackRef.current = callback;
  }

  const latestState = useRef(null);
  function getLatestState(){
    let instance = latestState.current;
    if (instance !== null){
      return instance;
    }
    let newInstance = dataReducer(undefined, {
      type: 'clear',
      range: subscriptionDetails.range,
      bufferSize: dataSource.bufferSize
    })
    latestState.current = newInstance;
    return newInstance;
  }

  getLatestState();

  const messagesPerRender = useRef(0);

  const [data, setData] = useState(latestState.current.rows);

  const expandRange = useCallback((lo,hi) => {
    return {
        lo: Math.max(0, lo - renderBufferSize),
        hi: hi + renderBufferSize
    };
  },[renderBufferSize]);


  const dispatchData = useCallback(action => {
    latestState.current = dataReducer(latestState.current, action);
    if (latestState.current.rows !== data){
      setData(latestState.current.rows);
    }
  },[data]);

  const dispatchUpdate = useCallback(action => {
    messagesPerRender.current += 1;
    latestState.current = dataReducer(latestState.current, action);
  }, []);

  const applyUpdate = () => {
    if (messagesPerRender.current > 0) {
      setData({rows: latestState.current.rows, offset: latestState.current.offset});
      messagesPerRender.current = 0;
    }

    if (isRunning.current) {
      //TODO disable the timeouts if we're scrolling
      // TODO pair this with a timeout that turns update mode back off if we go a while without updates
      frame.current = requestAnimationFrame(applyUpdate)
    }
  }

  const setRange = useCallback((lo, hi) => {
    const range = expandRange(lo,hi);
    dispatchData({
      type: 'range', range});

    if (latestState.current.dataRequired){
      dataSource.setRange(range.lo, range.hi);
    }
  }, [dataSource, dispatchData]);

  const clearBuffer = () => {
    const {range, bufferSize} = latestState.current;
    dispatchData({
      type:'clear',
      range,
      bufferSize,
    });
  }

  useEffect(() => {
    console.log(`subscribe with `, subscriptionDetails)
    dataSource.subscribe(subscriptionDetails,
      function datasourceMessageHandler({ type: messageType, ...msg }) {
        if (messageType === 'subscribed') {
          return callbackRef.current(messageType, msg);
        } else if (msg.size !== undefined) {
          callbackRef.current('size', msg.size);
        } else if (msg.type === 'pivot') {
          // Callback is for data oriented operations, should this be emitted ?
          callbackRef.current('pivot', msg.columns);
        }

        if (msg.filter !== undefined) {
          dataSource.emit('filter', msg.filter);
        }

        if (msg.rows) {

          dispatchData({
            type: "data",
            rows: msg.rows,
            rowCount: msg.size, // why the discrepance netween rowCount & size ?
            offset: msg.offset,
            range: msg.range,
          });
        } else if (msg.updates) {
          dispatchUpdate({
            type: 'update',
            updates: msg.updates
          })

          if (!isRunning.current) {
            isRunning.current = true;
            applyUpdate();
          }
        }
      }
    );

    dataSource.on('group', clearBuffer)

    return () => {
      console.log(`%cUNSUBSCRIBE`,'color: green;font-weight: bold;')
      dataSource.unsubscribe();
      dataSource.removeListener('group', clearBuffer);
      const {bufferSize, range, renderBufferSize} = latestState.current;
      dispatchData({
        type:'clear',
        range: resetRange(range),
        bufferSize,
        renderBufferSize
      });
    }

  }, [dataSource]);


  return [data, setRange];
}
