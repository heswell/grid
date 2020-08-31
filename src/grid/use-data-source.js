// @ts-nocheck
import {useCallback, useEffect, useRef, useState} from 'react';
import dataReducer from './grid-data-reducer';

//TODO allow subscription details to be set before subscribe call
export default function useDataSource(dataSource, subscriptionDetails, callback){

  const isRunning = useRef(false);
  const frame = useRef(null);
  const latestState = useRef(null);
  const messagesPerRender = useRef(0);

  // dev stats
  const startTime = useRef(0)
  const messageCount = useRef(0);
  const renderCount = useRef(0);

  const [data, setState] = useState(dataReducer(undefined, {type: 'clear'}));

  const dispatchData = action => setState(state => latestState.current = dataReducer(state, action));

  const dispatchUpdate = useCallback(action => {
    messageCount.current += 1;
    messagesPerRender.current += 1;
    latestState.current = dataReducer(latestState.current, action);
  },[]);

  const init = () => {
    renderCount.current = 0;
    messageCount.current = 0;
  }

  const applyUpdate = () => {
    if (messagesPerRender.current > 0){
      renderCount.current += 1;
      setState(latestState.current);
      // Only
      // dataSource.worker.postMessage({type: 'rate', value: messagesPerRender.current})
      // console.log(`messages per render = ${messagesPerRender.current}`)
      messagesPerRender.current = 0;
    }

    if (isRunning.current){
      // TODO pair this with a timeout that turns update mode back off if we go a while without updates
      frame.current = requestAnimationFrame(applyUpdate)
    }
  }

  useEffect(() => {
    console.log(`%c Viewport useEffect dataSOurce changed - subscribe to new datasource`,'color:blue;font-weight:bold;')
     init();
    // dispatchData({type: 'clear'});

    dataSource.subscribe(subscriptionDetails,
      /* postMessageToClient */
      msg => {
        if (msg.type === 'subscribed'){
          callback('subscribed', msg.columns);
          //dispatchGridModelAction({type: 'set-columns', columns: msg.columns})
        } else if (msg.size !== undefined){
          callback('size', msg.size);
        } else if (msg.type === 'pivot'){
          callback('pivot', msg.columns);
        } else if (msg.type === 'test-started'){
          //----------------- Test Only ----------------------
          init();
            // isRunning.current = true;
            startTime.current = performance.now();
        } else if (msg.type === 'test-ended'){
          isRunning.current = false;
          if (frame.current){
            cancelAnimationFrame(frame.current);
            frame.current = null;
           }
           applyUpdate();
           const {messageCount, updateCount} = msg;
           const end = performance.now();
           const elapsed = Math.round(end - startTime.current);
           const mps = Math.floor(((messageCount * updateCount)/ elapsed) * 1000)
           dataSource.emit('message', `test ended ${messageCount} messages, totalling ${messageCount * updateCount} updates
            took ${elapsed}ms
             ${renderCount.current} renders
             ${Math.round((renderCount.current/ elapsed) * 1000)} frames per second
             ${new Intl.NumberFormat('en-UK', { maximumSignificantDigits: 3 }).format(mps)} updates per second 
          `);
           //----------------- Test Only ----------------------
        }
        
        if (msg.filter !== undefined){
          dataSource.emit('filter', msg.filter);
        }

        if (msg.rows) {
          dispatchData({
            type: "data",
            rows: msg.rows,
            rowCount: msg.size,
            offset: msg.offset,
            range: msg.range,
          });
        } else if (msg.updates){
          dispatchUpdate({
            type: 'update',
            updates: msg.updates
          })

          if (!isRunning.current){
            isRunning.current = true;
            applyUpdate();
          }
        }
      }
    );

    return () => {
      dataSource.unsubscribe();
      dispatchData({
        type: "data",
        rows: [],
        rowCount: 0,
        range: {lo:0, hi:0}
      });
    }
    
  }, [dataSource]);


  return data;
}