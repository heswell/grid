import {
  BoxModel,
  positionValues,
  pointPositionWithinRect,
  Position,
} from "./BoxModel";
import { containerOf, getProps, typeOf } from "../utils";

export const isTabstrip = (dropTarget) =>
  dropTarget.pos.tab &&
  typeOf(dropTarget.component) === "Stack" &&
  dropTarget.pos.position.Header;

export class DropTarget {
  constructor({
    component,
    pos,
    clientRect /*, closeToTheEdge*/,
    nextDropTarget,
  }) {
    this.component = component;
    this.pos = pos;
    this.clientRect = clientRect;
    this.nextDropTarget = nextDropTarget;
    this.active = false;
  }

  targetTabRect(lineWidth, offsetTop = 0, offsetLeft = 0) {
    const {
      clientRect: { top, left, right, bottom, header },
      pos: { tab },
    } = this;
    const inset = 0;
    const gap = Math.round(lineWidth / 2) + inset;

    if (tab) {
      const t = Math.round(top - offsetTop);
      const l = Math.round(left - offsetLeft + gap);
      const r = Math.round(right - offsetLeft - gap);
      const b = Math.round(bottom - offsetTop - gap);
      const tabLeft = Math.round(tab.left - offsetLeft + gap);
      const tabWidth = 60;
      const tabHeight = header.bottom - header.top;
      return [l, t, r, b, tabLeft, tabWidth, tabHeight];
    } else {
      const rect = this.targetRect(lineWidth, offsetTop, offsetLeft);
      if (rect) {
        rect.push(0, 0, 0);
      }
      return rect;
    }
  }

  targetRect(lineWidth, offsetTop = 0, offsetLeft = 0) {
    const {
      pos: { width, height, position },
      clientRect: rect,
    } = this;
    let size = null;

    if (width) {
      size = { width };
    } else if (height) {
      size = { height };
    }

    const t = Math.round(rect.top - offsetTop);
    const l = Math.round(rect.left - offsetLeft);
    const r = Math.round(rect.right - offsetLeft);
    const b = Math.round(rect.bottom - offsetTop);

    const inset = 0;
    const gap = Math.round(lineWidth / 2) + inset;

    switch (position) {
      case Position.North:
      case Position.Header: {
        const halfHeight = Math.round((b - t) / 2);
        const sizeHeight = size && size.height ? size.height : 0;
        const height = sizeHeight
          ? Math.min(halfHeight, Math.round(sizeHeight))
          : halfHeight;
        return [l + gap, t + gap, r - gap, t + gap + height];
      }
      case Position.West: {
        const halfWidth = Math.round((r - l) / 2);
        const sizeWidth = size && size.width ? size.width : 0;
        const width = sizeWidth
          ? Math.min(halfWidth, Math.round(sizeWidth))
          : halfWidth;
        return [l + gap, t + gap, l + gap + width, b - gap];
      }
      case Position.East: {
        const halfWidth = Math.round((r - l) / 2);
        const sizeWidth = size && size.width ? size.width : 0;
        const width = sizeWidth
          ? Math.min(halfWidth, Math.round(sizeWidth))
          : halfWidth;
        return [r - gap - width, t + gap, r - gap, b - gap];
      }
      case Position.South: {
        const halfHeight = Math.round((b - t) / 2);
        const sizeHeight = size && size.height ? size.height : 0;
        const height = sizeHeight
          ? Math.min(halfHeight, Math.round(sizeHeight))
          : halfHeight;
        return [l + gap, b - gap - height, r - gap, b - gap];
      }
      case Position.Centre: {
        return [l + gap, t + gap, r - gap, b - gap];
      }
      default:
        console.warn(`DropTarget does not recognize position ${position}`);
        return null;
    }
  }

  activate() {
    this.active = true;
    return this;
  }

  toArray() {
    let dropTarget = this;
    const dropTargets = [dropTarget];
    // eslint-disable-next-line no-cond-assign
    while ((dropTarget = dropTarget.nextDropTarget)) {
      dropTargets.push(dropTarget);
    }
    return dropTargets;
  }

  static getActiveDropTarget(dropTarget) {
    return dropTarget.active
      ? dropTarget
      : DropTarget.getActiveDropTarget(dropTarget.nextDropTarget);
  }
}

// Initial entry to this method is always via the app (may be it should be *on* the app)
export function identifyDropTarget(x, y, model, measurements) {
  let dropTarget = null;

  //onsole.log('Draggable.identifyDropTarget for component  ' + box.name + ' (' + box.nestedBoxes.length + ' children)') ;
  // this could return all boxes containing point, which would make getNextDropTarget almost free
  // Also, if we are over  atabstrip, it could include the actual tab
  var component = BoxModel.smallestBoxContainingPoint(
    model,
    measurements,
    x,
    y
  );

  if (component) {
    const { "data-path": dataPath, path = dataPath } = component.props;
    const clientRect = measurements[path];
    const pos = pointPositionWithinRect(x, y, clientRect);

    // console.log(
    //   `%c[DropTarget] identifyDropTarget target path ${path}
    //     position: ${JSON.stringify(pos)}
    //     measurements : ${JSON.stringify(measurements[path])}
    //     `,
    //   "color:cornflowerblue;font-weight:bold;"
    // );

    const nextDropTarget = getNextDropTarget(
      model,
      component,
      pos,
      measurements,
      x,
      y
    );
    dropTarget = new DropTarget({
      component,
      pos,
      clientRect,
      nextDropTarget,
    }).activate();

    // console.log('%c'+printDropTarget(dropTarget),'color:green');
  }

  //onsole.log(`\n${printDropTarget(dropTarget)}`);

  return dropTarget;
}

// must be cleared when we end the drag
// layout never changes
// component never changes
// pos neve changes
// zone never changes
// measurements never change
export function getNextDropTarget(layout, component, pos, measurements, x, y) {
  const { north, south, east, west } = positionValues;
  const eastwest = east + west;
  const northsouth = north + south;

  return next();

  function next(container = containerOf(layout, component)) {
    if (pos.position.Header || pos.closeToTheEdge) {
      let nextDropTarget = false;

      while (
        container &&
        container.path !== "0" && // TODO this should probably checj container root, not assume o
        positionedAtOuterContainerEdge(container, pos, component, measurements)
      ) {
        // console.log(`next ${getProps(container).path}`);
        const { "data-path": dataPath, path = dataPath } = container.props;
        const clientRect = measurements[path];
        let containerPos = pointPositionWithinRect(x, y, clientRect);

        // if its a VBox and we're close to left or right ...
        if (
          (isVBox(container) || isTabbedContainer(container)) &&
          pos.closeToTheEdge & eastwest
        ) {
          nextDropTarget = true;
          containerPos.width = 120;
        }
        // if it's a HBox and we're close to top or bottom ...
        else if (
          (isHBox(container) || isTabbedContainer(container)) &&
          (pos.position.Header || pos.closeToTheEdge & northsouth)
        ) {
          nextDropTarget = true;
          containerPos.height = 120;
        }
        if (nextDropTarget) {
          if (containerPos.position.Header) {
            containerPos = { ...containerPos, position: north };
          }
          // For each DropTarget, specify which drop operations are appropriate
          return new DropTarget({
            component: container,
            pos: containerPos, // <<<<  a local pos for each container
            clientRect,
            nextDropTarget: next(containerOf(layout, container)),
          });
        }

        container = containerOf(layout, container);
      }
    }
  }
}

function positionedAtOuterContainerEdge(
  containingComponent,
  { closeToTheEdge, position },
  component,
  measurements
) {
  if (containingComponent.type === "DraggableLayout") {
    return false;
  }

  const {
    "data-path": dataPath,
    path: componentPath = dataPath,
  } = component.props;
  const containingBox = measurements[containingComponent.props.path];
  const box = measurements[componentPath];

  const closeToTop = closeToTheEdge & positionValues.north;
  const closeToRight = closeToTheEdge & positionValues.east;
  const closeToBottom = closeToTheEdge & positionValues.south;
  const closeToLeft = closeToTheEdge & positionValues.west;

  if ((closeToTop || position.Header) && box.top === containingBox.top)
    return true;
  if (closeToRight && box.right === containingBox.right) return true;
  if (closeToBottom && box.bottom === containingBox.bottom) return true;
  if (closeToLeft && box.left === containingBox.left) return true;

  return false;
}

function isTabbedContainer(component) {
  return typeOf(component) === "Stack";
}

function isVBox(component) {
  return (
    typeOf(component) === "Flexbox" &&
    component.props.style.flexDirection === "column"
  );
}

function isHBox(component) {
  return (
    typeOf(component) === "Flexbox" &&
    component.props.style.flexDirection === "row"
  );
}

const w = "  ";

function printDropTarget(dropTarget, s = w) {
  if (!dropTarget) {
    return;
  }
  const { pos } = dropTarget;
  const ctte = pos.closeToTheEdge
    ? `=>${printClose(pos.closeToTheEdge)}<=`
    : "";
  const size = pos.width
    ? ` width:${pos.width} `
    : pos.height
    ? ` height:${pos.height} `
    : "";

  var str = `<${dropTarget.component.type}> ${ctte} ${size} $${dropTarget.component.$path}`;
  if (dropTarget.nextDropTarget != null) {
    str += `\n${s} ${printDropTarget(dropTarget.nextDropTarget, s + w)}`;
  }
  return str;
}

function printClose(val) {
  var s = "";
  if (val & 1) s += "N";
  if (val & 4) s += "S";
  if (val & 2) s += "E";
  if (val & 8) s += "W";
  return s;
}
