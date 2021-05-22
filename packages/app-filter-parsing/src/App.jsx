import * as React from 'react';
import cx from 'classnames';
import {parseFilter} from "@heswell/antlr-parsers";
import './App.css';

function App() {

  const [isValid, setIsValid] = React.useState(true)

  console.log({parseFilter});

  const handleInput = e => {
    const input = e.target.value;
    if (input.length){
      const start = performance.now();
      const [result,errors, candidates] = parseFilter(input);
      const end = performance.now();
      console.log(`parse took ${end-start}ms`);

      console.log({result, candidates})

      setIsValid(errors.length === 0)
    }


  }

  return (
    <div className="App">

      <input className={cx("hwInput", {'hwInput-invalid': !isValid})} onChange={handleInput}></input>

    </div>
  );
}

export default App;
