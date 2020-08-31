import React from 'react';

const NO_STATS = {}

export function FilterCounts({ classes, column, stats=NO_STATS/*, searchText*/ }) {
  const { totalRowCount, filteredRowCount, filteredSelected } = stats;
  return (
      <div className={classes.FilterCounts}>
          <div className="filter-row-counts">
              <div>{`Distinct values for ${column.name}`}</div>
              <div className="filter-row-table">
                  <div>
                      <span>Selected</span>
                      <span>{filteredSelected}</span>
                  </div>
                  <div>
                      <span>Total</span>
                      <span>{filteredRowCount}</span>
                  </div>
              </div>
          </div>
          <div className="data-row-counts">
              <div>{`Data records`}</div>
              <div className="filter-row-table">
                  <div>
                      <span>Total</span>
                      <span>{totalRowCount}</span>
                  </div>
              </div>

          </div>
      </div>
  )
}
