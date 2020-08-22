import React, {useState} from 'react';
import Properties from './properties-panel';

export default function GridPanel({classes, columnSizing="static", height=800, hidden, onChange, theme, width=1000}){

  const handleChange = (propertyName, propertyValue) => console.log(`handleChange ${propertyName} = ${propertyValue}`)
  const props = [
    {name: 'theme', type: 'string', value: theme, values: ['dark', 'light']},
    {name: 'columnSizing', type: 'string', value: columnSizing, values: ['fill', 'auto', 'static']},
    {name: 'width', type: 'number', value: width},
    {name: 'height', type: 'number', value: height}
  ];

  return (
    <div className={classes.tabPanel} hidden={hidden}>
      <Properties properties={props} onChange={handleChange} onSubmit={onChange} />
    </div>

  )
}