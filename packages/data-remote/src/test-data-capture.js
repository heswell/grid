import React from 'react';
import ReactDOM from 'react-dom';

import "./test-data-capture.css"
let _data;
let clientViewportId;
let serverViewportId;

export function storeData(data) {
  console.log(`got the data ${data.length} messages`);
  _data = data;
  const [createViewportMessage] = data;
  const message = JSON.parse(createViewportMessage);
  clientViewportId = message.requestId;
  serverViewportId = message.body.viewPortId;

  document.getElementById("btn-create-test").disabled = false;
}

let callWorkerToRequestData;
export const setDataCollectionMethod = (callback) =>  {
  console.log('set data collection method')
  callWorkerToRequestData = callback;
}

const collectData = () => {
  console.log('request data')
  callWorkerToRequestData();
}

const getTestText = () => {

  const testContent = _data.map(message => {
    if (message.startsWith(`{"viewport"`)){
      return `
      serverProxy.handleMessageFromClient(${message});
    `;
    } else {
      return `
      serverProxy.handleMessageFromServer(${message});
    `;
    }

  }).join('\n\n');

return `
import { ServerProxy, TEST_setRequestId } from '../servers/vuu/new-server-proxy';
import { createSubscription } from "./test-utils";

const mockConnection = {
  send: jest.fn()
}
const callback = jest.fn();

describe('server-proxy-generated-test', () => {
    test('test with captures messages', () => {
      let state = undefined;

      const [clientSubscription] = createSubscription({viewport: '${clientViewportId}', bufferSize: 100});
      const serverProxy = new ServerProxy(mockConnection, callback);
      serverProxy.subscribe(clientSubscription);

      ${testContent}


      const viewport = serverProxy.viewports.get('${serverViewportId}')
      expect(viewport.isTree).toBe(false);

    });
  });
`
}



function getNewFileHandle() {
  // For Chrome 86 and later...
  const opts = {
    types: [{
      description: 'JavaScript Test file',
      accept: { 'text/javascript': ['.js'] },
    }],
  };
  return window.showSaveFilePicker(opts);
}


async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}

async function createTest() {
  console.log(`create test`)
  const fileHandle = await getNewFileHandle();
  writeFile(fileHandle, getTestText());

}


const div = document.createElement('div');
div.className = "test-data-capture";
document.body.appendChild(div);

ReactDOM.render(
  <>
    <button onClick={collectData}>Collect Data</button>
    <button id="btn-create-test" onClick={createTest}>Create Test</button>
  </>,
  div
);
