import React, { useCallback, useContext } from "react";
import cx from "classnames";
import { metadataKeys } from "@heswell/utils";
import GridContext from "./grid-context";
import { getGroupValueAndOffset } from "./grid-model-utils";

import "./grid-group-cell.css";
/** @type {GroupCellType} */
const GroupCell = React.memo(function GroupCell({
  column,
  row,
  toggleStrategy,
}) {
  const { dispatchGridModelAction } = useContext(GridContext);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatchGridModelAction({ type: "toggle", row });
    },
    [dispatchGridModelAction, row]
  );

  const allowToggle =
    toggleStrategy.expand_level_1 !== false || row[metadataKeys.DEPTH] !== 1;
  const isExpanded = row[metadataKeys.DEPTH] > 0;
  const count = row[metadataKeys.COUNT];
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
