import React from 'react';
import ReactDOM from 'react-dom';

import "./test-data-capture.css"
let _data;

export function storeData(data) {
  console.log(`got the data ${data.length} messages`);
  _data = data;
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
return `
export const messages = [
  ${_data.join(',\n')}
]
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
