import React from "react";
import DropTargetRenderer from "./DropTargetRenderer";
import DragState from "./DragState";
import { followPath, getProps, typeOf } from "../utils";
import { BoxModel, Position } from "./BoxModel";
import { DropTarget, identifyDropTarget } from "./DropTarget";

let _dragCallback;
let _dragStartX;
let _dragStartY;
let _dragContainer;
let _dragState;
let _dropTarget = null;
let _measurements;
let _simpleDrag;
let _dragThreshold;

const DEFAULT_DRAG_THRESHOLD = 5;
const _dropTargetRenderer = new DropTargetRenderer();
const _dragContainers = [];
const SCALE_FACTOR = 0.4;

export class DragContainer {
  static get paths() {
    return _dragContainers;
  }

  static register(path) {
    if (!_dragContainers.includes(path)) {
      // need to decide how to store these
      _dragContainers.push(path);
    }
  }

  static unregister(/*path*/) {}
}

function getDragContainer(rootContainer, dragContainerPath) {
  var pathToContainer = "";
  var maxSteps = 0;
  const { path: rootPath } = getProps(rootContainer);

  //TODO still to be determined how this will work
  if (rootPath === dragContainerPath) {
    return rootContainer;
  } else if (!dragContainerPath) {
    // If the model has no path (i.e. it hasn't been dragged out of the existing layout)
    // hiow do we decide the dragContainer to use (assuming there may be more than 1)
    pathToContainer = _dragContainers[0];
  } else {
    // find the longest container path that matches path (ie the smallest enclosing container);
    for (var i = 0; i < _dragContainers.length; i++) {
      if (dragContainerPath.indexOf(_dragContainers[i]) === 0) {
        var steps = _dragContainers[i].split(".").length;
        if (steps > maxSteps) {
          maxSteps = steps;
          pathToContainer = _dragContainers[i];
        }
      }
    }
  }

  return followPath(rootContainer, pathToContainer);
}

export const Draggable = {
  handleMousedown(e, dragStartCallback, dragOptions = {}) {
    _dragCallback = dragStartCallback;

    _dragStartX = e.clientX;
    _dragStartY = e.clientY;

    _dragThreshold =
      dragOptions.dragThreshold === undefined
        ? DEFAULT_DRAG_THRESHOLD
        : dragOptions.dragThreshold;

    if (_dragThreshold === 0) {
      // maybe this should be -1
      _dragCallback(e, 0, 0);
    } else {
      window.addEventListener("mousemove", preDragMousemoveHandler, false);
      window.addEventListener("mouseup", preDragMouseupHandler, false);
    }

    e.preventDefault();
  },

  // called from handleDragStart (_dragCallback)
  initDrag(
    rootContainer,
    dragContainerPath,
    { top, left, right, bottom },
    dragPos,
    dragHandler
  ) {
    _dragCallback = dragHandler;
    return initDrag(
      rootContainer,
      dragContainerPath,
      { top, left, right, bottom },
      dragPos
    );
  },
};

function preDragMousemoveHandler(e) {
  var x = true;
  var y = true;

  let x_diff = x ? e.clientX - _dragStartX : 0;
  let y_diff = y ? e.clientY - _dragStartY : 0;
  let mouseMoveDistance = Math.max(Math.abs(x_diff), Math.abs(y_diff));

  // when we do finally move the draggee, we are going to 'jump' by the amount of the drag threshold, should we
  // attempt to animate this ?
  if (mouseMoveDistance > _dragThreshold) {
    window.removeEventListener("mousemove", preDragMousemoveHandler, false);
    window.removeEventListener("mouseup", preDragMouseupHandler, false);
    _dragCallback(e, x_diff, y_diff);
  }
}

function preDragMouseupHandler() {
  window.removeEventListener("mousemove", preDragMousemoveHandler, false);
  window.removeEventListener("mouseup", preDragMouseupHandler, false);
}

function initDrag(rootContainer, dragContainerPath, dragRect, dragPos) {
  _dragContainer = getDragContainer(rootContainer, dragContainerPath);

  const { "data-path": dataPath, path = dataPath } = getProps(_dragContainer);

  var start = window.performance.now();
  console.log(`initDrag ${path} ${dragContainerPath}`);
  // translate the layout $position to drag-oriented co-ordinates, ignoring splitters
  _measurements = BoxModel.measure(_dragContainer);
  console.log({ measurements: _measurements });
  var end = window.performance.now();
  console.log(`[Draggable] measurements took ${end - start}ms`, _measurements);

  var dragZone = _measurements[path];

  _dragState = new DragState(dragZone, dragPos.x, dragPos.y, dragRect);

  var pctX = Math.round(_dragState.x.mousePct * 100);
  var pctY = Math.round(_dragState.y.mousePct * 100);

  window.addEventListener("mousemove", dragMousemoveHandler, false);
  window.addEventListener("mouseup", dragMouseupHandler, false);

  _simpleDrag = false;

  _dropTargetRenderer.prepare(dragZone);

  return {
    // scale factor should be applied in caller, not here
    transform: `scale(${SCALE_FACTOR},${SCALE_FACTOR})`,
    transformOrigin: pctX + "% " + pctY + "%",
  };
}

function dragMousemoveHandler(evt) {
  const x = evt.clientX;
  const y = evt.clientY;
  const dragState = _dragState;
  var currentDropTarget = _dropTarget;
  var dropTarget;

  var newX, newY;

  if (dragState.update("x", x)) {
    newX = dragState.x.pos;
  }

  if (dragState.update("y", y)) {
    newY = dragState.y.pos;
  }

  if (newX === undefined && newY === undefined) {
    //onsole.log('both x and y are unchanged');
  } else {
    _dragCallback.drag(newX, newY);
  }

  if (_simpleDrag) {
    return;
  }

  if (dragState.inBounds()) {
    dropTarget = identifyDropTarget(x, y, _dragContainer, _measurements);
  } else {
    dropTarget = identifyDropTarget(
      dragState.dropX(),
      dragState.dropY(),
      _dragContainer,
      _measurements
    );
  }

  // did we have an existing droptarget which is no longer such ...
  if (currentDropTarget) {
    if (dropTarget == null || dropTarget.box !== currentDropTarget.box) {
      _dropTarget = null;
    }
  }

  if (dropTarget) {
    _dropTargetRenderer.draw(dropTarget, x, y);
    _dropTarget = dropTarget;
  }
}

function dragMouseupHandler(_evt) {
  onDragEnd();
}

function onDragEnd() {
  if (_dropTarget) {
    // why wouldn't the active dropTarget be the hover target - IT ISNT
    const dropTarget =
      _dropTargetRenderer.hoverDropTarget ||
      DropTarget.getActiveDropTarget(_dropTarget);

    const { path } = dropTarget.component.props;
    const targetRect = _measurements[path];
    _dragCallback.drop(dropTarget, targetRect);

    _dropTarget = null;
  } else {
    _dragCallback.drop({
      component: _dragContainer,
      pos: { position: Position.Absolute },
    });
  }

  _dragCallback = null;
  _dragContainer = null;
  _dropTargetRenderer.clear();

  window.removeEventListener("mousemove", dragMousemoveHandler, false);
  window.removeEventListener("mouseup", dragMouseupHandler, false);
}
