import React from "react";
import cx from 'classnames';
import useStyles from './use-styles';

/** @type {HeaderCellComponent} */
const HeaderCell = function HeaderCell({ className, column }){
  const { name, label=name, width } = column;
  const classes = useStyles();
  return (
    <div className={cx(classes.HeaderCell, className)} style={{ width }}>
      <div className={classes.innerHeaderCell}>
        <div className={classes.cellWrapper}>{label}</div>
      </div>
      <div className={classes.resizeHandle} />
    </div>
  );
};

export default HeaderCell;
