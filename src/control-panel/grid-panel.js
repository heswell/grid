import React, {useState} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function GridPanel({classes, height=800, hidden, onAction, onChange, theme, width=1000}){

  const [state, setState] = useState({
    height,
    width
  })

  const setLocalState = stateChanges => {
    setState(prevState => ({...prevState, ...stateChanges}))
}

  const handleTheme = e => onChange({theme: e.target.value || 'light'});
  const handleGridHeight = e => setLocalState({height: e.target.value || '0'});
  const handleGridWidth = e => setLocalState({width: e.target.value || '0'});
  const handleApplyAction = () => onChange(state);

  const setScrollBy = scrollBy => onAction({type: 'scroll-by', scrollBy});

  return (
    <div className={classes.tabPanel} hidden={hidden}>
      <div className={classes.field}>
      <InputLabel id="grid-panel-theme">Theme</InputLabel>
      <Select
        labelId="grid-panel-theme"
        value={theme}
        onChange={handleTheme}
      >
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
      </div>

      <label>Width</label><input type="text" defaultValue={state.width} onChange={handleGridWidth}/>
      <label>Height</label><input type="text" defaultValue={state.height} onChange={handleGridHeight}/>
      <button onClick={handleApplyAction}>Apply</button> 
      <select defaultValue="light" onChange={handleTheme}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <div>
        <button onClick={() => setScrollBy(1)}>Scroll Down 1</button>
        <button onClick={() => setScrollBy(-1)}>Scroll Up 1</button>
        <button onClick={() => setScrollBy(4)}>Scroll Down 4</button>
        <button onClick={() => setScrollBy(-4)}>Scroll Up 4</button>
        <button onClick={() => setScrollBy(24)}>Scroll Down 24</button>
        <button onClick={() => setScrollBy(-24)}>Scroll Up 24</button>
      </div>
    </div>

  )
}