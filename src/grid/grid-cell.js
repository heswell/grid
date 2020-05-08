import React from "react";

import "./grid-cell.css";

export default function GridCell({ column, row }) {
  return (
    <div className="GridCell" style={{ width: column.width }}>
      {row[column.key]}
    </div>
  );
}
