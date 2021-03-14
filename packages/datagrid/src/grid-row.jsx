import React, { memo, useCallback } from "react";
import cx from "classnames";
import { metadataKeys } from "@heswell/utils";
import Cell from "./grid-cell";
import GroupCell from "./grid-group-cell";

import "./grid-row.css";

const { DEPTH, KEY, SELECTED } = metadataKeys;

const Row = memo(function Row({
  columnMap,
  columns,
  height,
  idx,
  row,
  onClick,
  toggleStrategy,
}) {
  const isEmptyRow = row[KEY] === undefined;
  const groupLevel = row[DEPTH];
  const isGroup = !isEmptyRow && groupLevel !== 0;
  const isSelected = row[SELECTED] === 1;

  const className = cx("GridRow", {
    group: isGroup,
    collapsed: isGroup && groupLevel < 0,
    expanded: isGroup && groupLevel >= 0,
    selected: isSelected,
    empty: isEmptyRow,
  });

  // better - make a single call to useGridCellComponent here, with columns

  const handleClick = useCallback(
    (e) => {
      const rangeSelect = e.shiftKey;
      const keepExistingSelection = e.ctrlKey || e.metaKey; /* mac only */
      onClick(idx, row, rangeSelect, keepExistingSelection);
    },
    [idx, onClick, row]
  );

  return (
    <div
      className={className}
      onClick={handleClick}
      style={{
        transform: `translate3d(0px, ${idx * height}px, 0px)`
      }}
    >
      {columns.map((column) =>
        column.isGroup ? (
          <GroupCell
            column={column}
            key={column.key}
            row={row}
            toggleStrategy={toggleStrategy}
          />
        ) : (
          <Cell key={column.key} column={column} columnMap={columnMap} row={row} />
        )
      )}
    </div>
  );
});

export default Row;
