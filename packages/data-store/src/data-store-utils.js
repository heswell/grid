const NO_COLUMNS = [];
const NO_SORT = {sortDefs: []}

export const viewportChanges = (
  {
    columns: currentColumns = NO_COLUMNS,
    filterSpec: currentFilterSpec,
    groupBy: currentGroupBy=NO_COLUMNS,
    sort: currentSort=NO_SORT,
    },
    {
      columns: newColumns=NO_COLUMNS,
      filterSpec: newFilterSpec,
      groupBy: newGroupBy=NO_COLUMNS,
      sort: newSort=NO_SORT,
    }) => {

      const result = {};
      if (!sameColumns(currentColumns, newColumns)){
        result.columns = true;
      }

      if (!sameSort(currentSort, newSort)){
        result.sort = true;
      }

      if (!sameColumns(currentGroupBy, newGroupBy)){
        result.groupBy = true;
      }


      return result;
}

function sameColumns(currentColumns, newColumns){
  if (currentColumns.length !== newColumns.length){
    return false;
  }
  if (currentColumns.some(({column,sortType}) => !newColumns.find(colDef =>
      colDef.column === column && colDef.sortType === sortType
    )) ){
    return false;
  }
  return true;
}

function sameSort({sortDefs: currentSortDefs}, {sortDefs: newSortDefs}){
  if (currentSortDefs.length !== newSortDefs.length){
    return false;
  }

  return true;
}
