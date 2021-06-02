const suggestColumnNames = (text) => {
  const columnNames = ['ccy', 'price', 'quantity', 'status', 'timestamp'];
  const result = text
    ? columnNames.filter(col => col.startsWith(text))
    : columnNames;

  console.log(`suggestions computed by suggestion factoty ${JSON.stringify(result)}`)
  // return result;
  return new Promise(resolve => {
    setTimeout(() => resolve(result), 300)
  })

}

const getCurrentColumn = (filters, idx=0) => {
  const f = filters[idx]
  if (!f) {
    return undefined;
  } else {
    if (f.op === 'or' || f.op === 'and'){
      return getCurrentColumn(f.filters, f.filters.length - 1);
    } else {
      return f.column
    }
  }
}

const suggestColumnValues = async (column, text) => {
  let result;
  switch (column) {
    case 'ccy': {
      const values = ['GBP', 'USD', 'SEK', 'EUR', 'JPY']
      if (text) {
        const lcText = text.toLowerCase();
        result = values.filter(col => col.toLowerCase().startsWith(lcText))
      } else {
        result = values;
      }
    }
    break;

    case 'status': {
      const values = ['cancelled', 'complete', 'partial', 'error', 'suspended']
      if (text) {
        const lcText = text.toLowerCase();
        result =  values.filter(col => col.toLowerCase().startsWith(lcText))
      } else {
        result = values;
      }
    }
    break;

    case 'price':
      result =['enter a monetary value'];
      break;

    case 'timestamp':
      result = ['enter a timestamp'];
      break;

    case 'quantity':
      result = ['enter an integer value'];
      break;

    default:
      result = [];
  }

  console.log(`suggestions computed by suggestion factoty ${JSON.stringify(result)}`)
  return Promise.resolve(result);
}

const filterSuggestions = (result, tokenId, text) => {
    switch(tokenId){
    case 'COLUMN-NAME': return suggestColumnNames(text)
    case 'COLUMN-VALUE': return suggestColumnValues(getCurrentColumn(result), text)
    default:
  }
}

export default filterSuggestions;
