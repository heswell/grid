import * as React from 'react';
import cx from 'classnames';
import {parseFilter} from "@heswell/antlr-parsers";
import './App.css';

function App() {

  const [isValid, setIsValid] = React.useState(true);
  const [completions, setCompletions] = React.useState([]);

  console.log({parseFilter});

  const handleInput = e => {
    const input = e.target.value;
      const start = performance.now();
      const [result,errors, suggestions] = parseFilter(input);
      const end = performance.now();
      console.log(`parse took ${end-start}ms`);
      setCompletions(suggestions);
      setIsValid(errors.length === 0)
  }

  const handleKeyDown = e => {
    const value = e.target.value;
    if (value === '' && completions.length === 0){
      const [result,errors, suggestions] = parseFilter('');
      if (suggestions.length){
        setCompletions(suggestions);
      }
    }
  }

  return (
    <div className="App">

      <input
        className={cx("hwInput", {'hwInput-invalid': !isValid})}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        spellCheck={false}></input>

      <ul className="hwSuggestions">
        {completions.map(suggestion =>
          <li key={suggestion}>{suggestion}</li>
        )}
      </ul>
    </div>
  );
}

export default App;
