import React, {forwardRef} from 'react';
import useStyles from './use-styles';

const InsertIndicator = forwardRef(function InsertIndicator(props, ref){
  const classes = useStyles();
  return (
    <div className={classes.InsertIndicator} ref={ref}/>
  )
});

export default InsertIndicator;