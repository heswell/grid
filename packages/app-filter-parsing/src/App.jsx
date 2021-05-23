import * as React from 'react';
import cx from 'classnames';
import { parseFilter } from "@heswell/antlr-parsers";
import './App.css';

const suggestColumnNames = (text) => {
  const columnNames = ['ccy', 'price', 'quantity', 'timestamp'];
  if (text) {
    return columnNames.filter(col => col.startsWith(text))
  } else {
    return columnNames;
  }
}

const suggestColumnValues = (column, text) => {
  switch (column) {
    case 'ccy': {
      const values = ['GBP', 'USD', 'SEK', 'EUR', 'JPY']
      if (text) {
        const lcText = text.toLowerCase();
        return values.filter(col => col.toLowerCase().startsWith(lcText))
      } else {
        return values;
      }
    }
    case 'price': return ['enter a monetary value']
    case 'timestamp': return ['enter a timestamp']
    case 'quantity': return ['enter an integer value']
    default:
      return [];
  }
}

const getCurrentColumn = (filter) => {
  if (!filter){
    return undefined;
  } else {
    const [{column}] = filter;
    return column;
  }
}


function App() {

  const [isValid, setIsValid] = React.useState(true);
  const [completions, setCompletions] = React.useState([]);
  const filterRef = React.useRef(null);

  const handleInput = e => {
    const input = e.target.value;
    const start = performance.now();
    const [result, errors, suggestions] = parseFilter(input);
    console.log(JSON.stringify(result,null,2))
    filterRef.current = result;
    const end = performance.now();
    console.log(`parse took ${end - start}ms`);
    console.log(JSON.stringify(suggestions))
    setSuggestions(suggestions);
    setIsValid(input === '' || errors.length === 0)
  }

  const setSuggestions = (suggestions) => {
    const expandedSuggestions = suggestions.reduce((acc, suggestion) => {
      if (typeof suggestion === 'string') {
        acc.push(suggestion)
      } else {
        const { token, text } = suggestion;
        switch (token) {
          case 'COLUMN-NAME':
            acc = acc.concat(suggestColumnNames(text));
            break;
          case 'COLUMN-VALUE':
            acc = acc.concat(suggestColumnValues(getCurrentColumn(filterRef.current), text));
            break;
          default:
            console.log(`unknown token type ${token} in completion suggestion`)
        }

      }
      return acc;
    }, [])

    setCompletions(expandedSuggestions);
  }

  const handleKeyDown = e => {
    const value = e.target.value;
    if (value === '' && completions.length === 0) {
      const [result, errors, suggestions] = parseFilter('');
      if (suggestions.length) {
        setSuggestions(suggestions);
      }
      setIsValid(value === '' || errors.length === 0)
    }
  }
  console.log(`render with `, completions)
  return (
    <div className="App">

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
  );
}

export default App;
