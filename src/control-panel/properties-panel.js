import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import useStyles from './properties-panel-styles';

const StyledLabel = withStyles({
  root: {
    color: 'red',
    display: 'inline-block',
    marginRight: 6
  }
})(InputLabel)

const initialState = properties => properties.reduce(
  (map, {name, value}) => (map[name] = value, map), {});

const PropertiesPanel = ({properties, onChange, onSubmit}) => {
  const classes = useStyles();
  const [isDirty, setDirtyState] = useState(false)
  const [state, setState] = useState(initialState(properties))
  const handleChange = (name, value) => {
    setState(prevState => ({...prevState, [name]: value}));
    setDirtyState(true);
  }

  const handleSubmit = () => {
    setDirtyState(false);
    onSubmit(state);
  }

 return (
    <div className={classes.root}>
      {properties.map(({name, value, values}) =>
        <div className={classes.property} key={name}>
          <StyledLabel id="grid-panel-theme">{name}</StyledLabel>
          <span className={classes.value}>
            {values ? (
                <Select onChange={e => handleChange(name, e.target.value)} value={state[name]}>
                {values.map(val =>
                  <MenuItem key={val} value={val}>{val}</MenuItem>
                )}
              </Select>

            ) : (
              <Input value={state[name]} onChange={e => handleChange(name, e.target.value)}/>
            )}
          </span>
        </div>
      )}
      {onSubmit ? <Button className={classes.submitButton} color='primary' disabled={!isDirty} onClick={handleSubmit} size='small' variant='contained'>Apply</Button> : undefined}
    </div>
  )
}

export default PropertiesPanel;