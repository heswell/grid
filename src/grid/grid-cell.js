import React from "react";
import useStyles from './use-styles';

export default function GridCell({ column, row }) {
  const {GridCell} = useStyles();
  return (
    <div className={GridCell} style={{ width: column.width }}>
      {row[column.key]}
    </div>
  );
}
