import React, { useCallback, useContext } from "react";
import cx from "classnames";
import { metadataKeys } from "@heswell/utils";
import GridContext from "./grid-context";
import { getGroupValueAndOffset } from "./grid-model-utils";

import "./grid-group-cell.css";

const {DEPTH, KEY, IS_EXPANDED, COUNT} = metadataKeys;

/** @type {GroupCellType} */
const GroupCell = React.memo(function GroupCell({
  column,
  row,
  toggleStrategy,
}) {
  const { dispatchGridAction } = useContext(GridContext);


  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const type = row[IS_EXPANDED] ? "closeTreeNode" : "openTreeNode";
      dispatchGridAction({ type, key: row[KEY] });
      // TEMP UNTIL SERVER FIXED
      row[IS_EXPANDED] = !row[IS_EXPANDED];

    },
    [dispatchGridAction, row]
  );

  const allowToggle =
    toggleStrategy.expand_level_1 !== false || row[DEPTH] !== 1;
  const isExpanded = row[IS_EXPANDED];
  const count = row[COUNT];
  const [value, offset] = getGroupValueAndOffset(column.columns, row);

  return (
    <div
      className={cx("GridCell", { noToggle: !allowToggle })}
      onClick={handleClick}
      style={{ width: column.width }}
      tabIndex={0}
    >
      {offset !== null ? (
        <div
          className={"GridGroupCell"}
          style={{ paddingLeft: offset * 20 }}
          tabIndex={0}
        >
          {allowToggle ? (
            <i className="material-icons icon">
              {isExpanded ? "expand_more" : "chevron_right"}
            </i>
          ) : null}
          <span className="group-value">{value}</span>
          <span> ({count})</span>
        </div>
      ) : null}
    </div>
  );
});

export default GroupCell;
