import React, { useState} from 'react';
import cx from 'classnames';
import {ActionButton, TextField, ToggleButton} from '@adobe/react-spectrum';
import CloseCircle from "@spectrum-icons/workflow/CloseCircle";
import FilterIcon from "@spectrum-icons/workflow/Filter";
import {Toolbar, Tooltray} from "@heswell/layout";

import "./query-filter.css";

const isValidQuery = filterQuery => true

const buildFilterQuery = filters =>
  Object.values(filters)
    .filter(({enabled}) => enabled)
    .map(({filterQuery}) => filterQuery)
    .join(' or ');


const QueryFilter = ({onChange}) => {

  const [filters, setFilters] = useState({});

  const [filterValue, setFilterValue] = useState('');

  const handleFilterValueChange = (value) => {
    setFilterValue(value)
  }

  const addFilter = filter => {
    let match, filterQuery, filterName;
    /* eslint-disable no-cond-assign */
    if (match = filter.match(/(.*)\s+as\s+(\S+)/)){
      ([, filterQuery, filterName] = match);
    } else{
      filterQuery = filter;
      filterName = filter;
    }

    const newState = {
      ...filters,
      [filterName]: {
        filterQuery,
        enabled: true
      }
    }

    onChange(buildFilterQuery(newState));

    setFilters(newState);
  }

  const removeFilter = filterName => {
    const newState = {
      ...filters
    }

    delete newState[filterName]

    onChange(buildFilterQuery(newState));

    setFilters(newState);

  }

  const handleKeyDown = ({key}) => {
    if (key === "Enter"){
      if (isValidQuery(filterValue)){
        addFilter(filterValue);
        setFilterValue('');
      } else {
        console.log('not valid yet')
      }
    }
  }

  const toggleFilter = filterName => {
    const newState = {
      ...filters,
      [filterName]: {
        ...filters[filterName],
        enabled: !filters[filterName].enabled
      }
    };

    onChange(buildFilterQuery(newState));
    setFilters(newState);


  }

  const handleClearFilters = () => {
    setFilters({});
    setFilterValue('');
    onChange('')
  }

  const handleFilterTagKeyDown = ({key}, filterName) => {
    if (key === 'Backspace') {
      removeFilter(filterName)
    }
  }


  const classBase = "hwQueryFilter";
  const filterKeys = Object.keys(filters);
  return (
    <Toolbar className={cx(classBase)}>
      <FilterIcon />
      <TextField
        labelPosition="side"
        onChange={handleFilterValueChange}
        onKeyDown={handleKeyDown}
        value={filterValue}
        width={150}
        />
        {filterKeys.length > 0 ? (
          <Tooltray>
            {filterKeys.map(filterName => (
              <ToggleButton
                isSelected={filters[filterName].enabled}
                onChange={() => toggleFilter(filterName)}
                onKeyDown={(e) => handleFilterTagKeyDown(e, filterName)}>
                <span>{filterName}</span>
              </ToggleButton>
            ))}
          </Tooltray>
        ) : null}
        <ActionButton onPress={handleClearFilters} align="right">
          <CloseCircle />
        </ActionButton>

    </Toolbar>
  )
}

export default QueryFilter;
