import React from "react";
import useStyles from './use-styles';

/** @type {HeaderCellComponent} */
const HeaderCell = function HeaderCell({ column }){
  const { name, width } = column;
  const classes = useStyles();
  return (
    <div className={classes.HeaderCell} style={{ width }}>
      <div className={classes.innerHeaderCell}>
        <div className={classes.cellWrapper}>{name}</div>
      </div>
      <div className={classes.resizeHandle} />
    </div>
  );
};

export default HeaderCell;
