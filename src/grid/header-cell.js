import React from "react";
import "./header-cell.css";

export default ({ column }) => {
  const { name, width } = column;
  return (
    <div className="HeaderCell" style={{ width }}>
      <div className="inner-header-cell">
        <div className="cell-wrapper">{name}</div>
      </div>
      <div className="resize-handle" />
    </div>
  );
};
