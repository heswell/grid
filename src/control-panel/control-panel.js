import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Header from './data-source-panel';
import GridPanel from './grid-panel';
import useStyles from './control-panel-styles.js';

export default function ControlPanel({height, messageRef, onAction, onChange, state: stateProp}){

  const classes = useStyles();

  const handleLoadStartAction = e => onAction({type: 'start-load-test'});
  const handleStressStartAction = e => onAction({type: 'start-stress-test'});
  const handleStopTextAction = e => onAction({type: 'stop-test'});
  const setGroupBy = groupBy => onChange({groupBy});

  const [selectedTab, setSetSelectedTab] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setSetSelectedTab(newValue);
  };

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  return (
    <div className={classes.root} style={{height}}>
      <Header
        classes={classes} 
        dataLocation={stateProp.dataLocation}
        dataSource={stateProp.dataSource}
        onChange={onChange}/>
        
      <div className={classes.body}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedTab}
          onChange={handleChangeTab}
          aria-label="Vertical tabs example"
          className={classes.tabs}>
          <Tab label="Grid" {...a11yProps(0)} />
          <Tab label="Columns" {...a11yProps(1)} />
          <Tab label="Test" {...a11yProps(2)} />
          <Tab label="Log" {...a11yProps(3)} />
        </Tabs>
      
        <GridPanel
          classes={classes}
          height={stateProp.gridHeight}
          hidden={selectedTab !== 0}
          onAction={onAction}
          onChange={onChange}
          theme={stateProp.theme}
          width={stateProp.gridWidth}/>
      
        <div className={classes.tabPanel} hidden={selectedTab !== 1}/>
        <div className={classes.tabPanel} hidden={selectedTab !== 2}>
        <div>AG Grid Tests:
              <button onClick={handleLoadStartAction}>Start Load Test</button>
              <button onClick={handleStressStartAction}>Start Stress Text</button>
              <button onClick={handleStopTextAction}>Stop Tests</button>
              <button onClick={() => setGroupBy(['product', 'portfolio', 'book'])}>Group</button>
            </div>
            </div>
          <div className={classes.tabPanel} hidden={selectedTab !== 3}>
            <p ref={messageRef}></p>
          </div>

        </div>
      </div>
  )
}