export function addRowsToIndex(rows, index, indexField){
  for (let idx = 0, len=rows.length; idx < len; idx++) {
      index[rows[idx][indexField]] = idx;
  }
  return index;
}

export function indexRows(rows, indexField) {
  return addRowsToIndex(rows, {}, indexField)
}

export function isEmptyRow(row){
  return row[0] === undefined;
}

// TODO rename
export function update(rows, updates, {IDX}) {
  const results = rows.slice();
  const [[offsetIdx]] = rows;
  for (let i = 0; i < updates.length; i++) {
      const idx = updates[i][0] - offsetIdx;
      // slow, refactor for performance
      if (rows[idx]){
        const row = rows[idx].slice();
        for (let j = 1; j < updates[i].length; j += 3) {
            row[updates[i][j]] = updates[i][j+2];
        }
        results[idx] = row;

      } else {
        console.log(`row not found in rows`)
      }
  }

  return results;
}

