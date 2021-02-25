import React from "react";
import cx from "classnames";
import { Column2A, Column2B } from "../icons";
import "./DropMenu.css";

export function computeMenuPosition(dropTarget, offsetTop = 0, offsetLeft = 0) {
  const { pos, clientRect: box } = dropTarget;
  return pos.position.West
    ? [box.left - offsetLeft + 26, pos.y - offsetTop, "left"]
    : pos.position.South
    ? [pos.x - offsetLeft, box.bottom - offsetTop - 26, "bottom"]
    : pos.position.East
    ? [box.right - offsetLeft - 26, pos.y - offsetTop, "right"]
    : /* North | Header*/ [pos.x - offsetLeft, box.top - offsetTop + 26, "top"];
}

const getIcon = (i) => {
  if (i === 0) {
    return <Column2A />;
  } else {
    return <Column2B />;
  }
};

const DropMenu = ({ className, dropTarget, onHover, orientation }) => {
  const dropTargets = dropTarget.toArray();
  // TODO we have all the information here to draw a mini target map
  // but maybe thats overkill ...

  return (
    <div
      className={cx("DropMenu", className, orientation)}
      onMouseLeave={() => onHover(null)}
    >
      {dropTargets.map((target, i) => (
        <div
          key={i}
          className="drop-menu-item"
          onMouseEnter={() => onHover(target)}
        >
          {getIcon(i)}
        </div>
      ))}
    </div>
  );
};

export default DropMenu;
