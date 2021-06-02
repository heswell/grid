import * as React from 'react';
import cx from 'classnames';
import { parseFilter } from "@heswell/antlr-input";
import filterSuggestions from './filter-suggestion-factory';
import './App.css';

const sameSuggestions = (s1, s2) => {
  if (s1.length === s2.length){
    return s1.every(s => s2.includes(s))
  }
}

function App() {

  const [{isValid, filter}, setFilterState] = React.useState({isValid: true, filter: {}})
  const [completions, setCompletions] = React.useState([]);

  const handleInput = async e => {
    const input = e.target.value;
    const start = performance.now();
    const [result, errors, suggestions, tokens] = parseFilter(input, filterSuggestions);
    const end = performance.now();
    console.log(`parse took ${end - start}ms`);

    console.log({errors})

    setFilterState({filter: result, isValid: input === '' || errors.length === 0});

    const newSuggestions = await suggestions;
    if (!sameSuggestions(completions, newSuggestions)){
      setCompletions(newSuggestions);
    }
  }

  const handleKeyDown = async e => {
    const value = e.target.value;
    const key = e.key;
    if (e.key === 'ArrowDown' && value === '' && completions.length === 0) {
      const [, errors, suggestions] = parseFilter('', filterSuggestions);
      setCompletions(await suggestions);
      setFilterState({filter:{}, isValid: true})
    }
  }
  console.log(`render with `, completions)
  return (
    <div className="App">

        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            className={cx("hwInput", { 'hwInput-invalid': !isValid })}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            spellCheck={false}></input>
        <ul className="hwSuggestions">
          {completions.map(suggestion =>
            <li key={suggestion}>{suggestion}</li>
          )}
        </ul>
        </div>
        <textarea value={JSON.stringify(filter, 0, 2)} readOnly style={{height: 400, width: 300}}/>
      </div>


    </div>
  );
}

export default App;
