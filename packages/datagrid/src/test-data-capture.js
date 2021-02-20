import React from 'react';
import ReactDOM from 'react-dom';

const data = [];

export function storeAction(action) {
  data.push(action);
}


const getTestText = (actions) => {

  const tests = [];

  actions.forEach(action => {
    tests.push(`
    state = GridDataReducer(state, ${JSON.stringify(action)});
    `);
  })


  
return `
import GridDataReducer from '../../src/grid-data-reducer';
describe('grid-data-reducer-generated-test', () => {
    test('init, default bufferSize', () => {
      let state = undefined;

      

      ${tests.join('\n\n')}
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

  const testText = getTestText(data);
  const fileHandle = await getNewFileHandle();
  writeFile(fileHandle, testText)

}

function clearData() {
  data.length = 0;
}

const div = document.createElement('div');
document.body.appendChild(div);

ReactDOM.render(
  <>
    <button onClick={createTest}>Create Test</button>
    <button onClick={clearData}>Clear Data</button>
  </>,
  div
);