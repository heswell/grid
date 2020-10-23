import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';

import config, { dataSources } from './config';

const StyledBase = withStyles({
  root: {
    marginLeft: 6,
    '&:not(:last-child)': {
      marginRight: 12
    }
  }
})(InputBase)

const getDataLocation = (dataGridId, dataSourceId) => {
  const [location] = config[dataGridId].dataSources[dataSourceId];
  return location;
};

const getGridSourceLocation = dataGridId =>
  config[dataGridId].defaultDataSource;

export default function DataSourcePanel({
  availableGrids,
  availableLocations,
  classes, 
  dataGridId,
  dataLocationId,
  dataSourceId,
  onChange
}){

  const handleDataGrid = e => onChange({dataGrid: e.target.value, ...getGridSourceLocation(e.target.value)});
  const handleDataSource = e => onChange({dataSource: e.target.value, dataLocation: getDataLocation(dataGridId, e.target.value)});
  const handleDataLocation = e => onChange({dataLocation: e.target.value});

  const availableDataSources = Object.entries(config[dataGridId].dataSources).map(([id, locations]) => ({
    ...dataSources[id],
    locations
  }));

  return (
      <header className={cx(classes.header, classes.field)}>
      <InputLabel id="control-panel-data-grid">Data Grid</InputLabel>
      <Select
        input={<StyledBase />}
        labelId="control-panel-data-grid"
        value={dataGridId}
        onChange={handleDataGrid}
      >
        {availableGrids.map(({id, label}) =>
          <MenuItem key={id} value={id}>{label}</MenuItem>
        )}
      </Select>

      <InputLabel id="control-panel-data-source">Data Source</InputLabel>
      <Select
        input={<StyledBase />}
        labelId="control-panel-data-source"
        value={dataSourceId}
        onChange={handleDataSource}
      >
        {availableDataSources.map(({id, label}) =>
          <MenuItem key={id} value={id}>{label}</MenuItem>
        )}
      </Select>

      <RadioGroup 
        row aria-label="position" 
        name="position"
        onChange={handleDataLocation}
        value={dataLocationId} 
        className={classes.location}>

        <FormControlLabel
          disabled={!availableLocations.includes('local')}
          value="local"
          control={<Radio color="primary" />}
          label="Local"
          labelPlacement="start"
        />
        <FormControlLabel
          disabled={!availableLocations.includes('worker')}
          value="worker"
          control={<Radio color="primary" />}
          label="Local Worker"
          labelPlacement="start"
        />
        <FormControlLabel
          disabled={!availableLocations.includes('remote')}
          value="remote"
          control={<Radio color="primary" />}
          label="Remote"
          labelPlacement="start" />

    </RadioGroup>          
  </header>
  );
}
