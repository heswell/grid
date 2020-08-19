import React from 'react';
import cx from 'classnames';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const availableSources = [
  {label: 'Instruments', id: 'instruments', locations: ['local', 'remote']},
  {label: 'Many Columns', id: 'many-columns', locations: ['local']},
  {label: 'Order Blotter', id: 'order-blotter', locations: ['remote']},
  {label: 'AG Grid Demo', id: 'ag-grid-demo', locations: ['worker']},
  {label: 'PSP Streaming', id: 'psp-streaming', locations: ['worker']},
];

const getDataSource = id => availableSources.find(source => source.id === id);
const getDataLocation = dataSource => {
  const {locations: [location]} = getDataSource(dataSource);
  return location;
}

export default function ControlPanelHeader({
  classes, 
  dataLocation,
  dataSource,
  onChange
}){

  const {locations: availableLocations} = getDataSource(dataSource);

  const handleDataSource = e => onChange({dataSource: e.target.value, dataLocation: getDataLocation(e.target.value)});
  const handleDataLocation = e => onChange({dataLocation: e.target.value});

  return (
      <header className={cx(classes.header, classes.field)}>
      <InputLabel id="control-panel-data-source">Data Source</InputLabel>
      <Select
        labelId="control-panel-data-source"
        value={dataSource}
        onChange={handleDataSource}
      >
        {availableSources.map(({id, label}) =>
          <MenuItem key={id} value={id}>{label}</MenuItem>
        )}
      </Select>

      <RadioGroup 
        row aria-label="position" 
        name="position"
        onChange={handleDataLocation}
        value={dataLocation} 
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
          label="Worker"
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
