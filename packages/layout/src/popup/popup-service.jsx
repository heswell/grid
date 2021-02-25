import React, { createElement } from "react";
import ReactDOM from "react-dom";
import cx from "classnames";

import "./popup-service.css";

window.popupReact = React;

let _dialogOpen = false;
const _popups = new Map();

function specialKeyHandler(e) {
  if (e.keyCode === 27 /* ESC */) {
    if (_popups.size) {
      closeAllPopups(e);
      console.log("unmount the open popup(s)");
    } else if (_dialogOpen) {
      console.log("unmount the open dialog");
      ReactDOM.unmountComponentAtNode(
        document.body.querySelector(".react-dialog")
      );
    }
  }
}

function outsideMouseDownHandler(e) {
  if (_popups.size) {
    // onsole.log(`Popup.outsideClickHandler`);
    const popupContainers = document.body.querySelectorAll(".react-popup");
    for (let i = 0; i < popupContainers.length; i++) {
      if (popupContainers[i].contains(e.target)) {
        return;
      }
    }
    closeAllPopups(e);
  }
}

function closeAllPopups(e) {
  if (_popups.size) {
    // onsole.log(`closeAllPopups`);
    const popupContainers = document.body.querySelectorAll(".react-popup");
    for (let i = 0; i < popupContainers.length; i++) {
      ReactDOM.unmountComponentAtNode(popupContainers[i]);
    }
    popupClosed(e, "*");
  }
}

function dialogOpened() {
  if (_dialogOpen === false) {
    console.log("PopupService, dialog opened");
    _dialogOpen = true;
    window.addEventListener("keydown", specialKeyHandler, true);
  }
}

function dialogClosed() {
  if (_dialogOpen) {
    console.log("PopupService, dialog closed");
    _dialogOpen = false;
    window.removeEventListener("keydown", specialKeyHandler, true);
  }
}

function popupOpened(name, onClose) {
  if (!_popups.has(name)) {
    _popups.set(name, { onClose });
    if (_dialogOpen === false) {
      window.addEventListener("keydown", specialKeyHandler, true);
      window.addEventListener("mousedown", outsideMouseDownHandler, true);
    }
  }
}

function popupClosed(e, name) {
  if (_popups.size) {
    if (name === "*") {
      _popups.forEach(({ onClose }) => {
        onClose && onClose(e);
      });
      _popups.clear();
    } else if (_popups.has(name)) {
      const { onClose } = _popups.get(name);
      onClose && onClose(e);
      _popups.delete(name);
    }
    //onsole.log('PopupService, popup closed ' + name + '  popups : ' + _popups);
    if (_popups.size === 0 && _dialogOpen === false) {
      window.removeEventListener("keydown", specialKeyHandler, true);
      window.removeEventListener("mousedown", outsideMouseDownHandler, true);
    }
  }
}

const PopupComponent = ({ children, position, style }) => {
  const className = cx("Popup", "popup-container", position);
  return createElement("div", { className, style }, children);
};

let incrementingKey = 1;

export class PopupService {
  static showPopup({
    name = "anon",
    group = "all" /*, depth=0*/,
    position = "",
    left = 0,
    right = "auto",
    top = 0,
    width = "auto",
    component,
    onClose
  }) {
    // onsole.log(`PopupService.showPopup ${name} in ${group} ${left} ${top} ${width} depth ${depth}`);
    if (!component) {
      throw Error(`PopupService showPopup, no component supplied`);
    }

    popupOpened(name, onClose);

    let el = document.body.querySelector(".react-popup." + group);
    if (el === null) {
      el = document.createElement("div");
      el.className = "react-popup " + group;
      document.body.appendChild(el);
    }

    const style = { left, top, width };

    ReactDOM.render(
      createElement(
        PopupComponent,
        { key: incrementingKey++, position, style },
        component
      ),
      el,
      () => {
        PopupService.keepWithinThePage(el, right);
      }
    );
  }

  static hidePopup(e, name = "anon", group = "all") {
    //onsole.log('PopupService.hidePopup name=' + name + ', group=' + group)

    if (_popups.has(name)) {
      popupClosed(e, name);
      ReactDOM.unmountComponentAtNode(
        document.body.querySelector(`.react-popup.${group}`)
      );
    }
  }

  static movePopup(x, y, name = "anon", group = "all") {
    const container = document.querySelector(
      `.react-popup.${group} .popup-container`
    );
    container.style.top = parseInt(container.style.top, 10) + y + "px";
    container.style.left = parseInt(container.style.left, 10) + x + "px";
  }

  static movePopupTo(x, y, name = "anon", group = "all") {
    const container = document.querySelector(
      `.react-popup.${group} .popup-container`
    );
    container.style.top = `${y}px`;
    container.style.left = `${x}px`;
  }

  static keepWithinThePage(el, right = "auto") {
    console.log(`PopupService.keepWithinThePage`);
    const container = el.querySelector(".popup-container");
    const {
      top,
      left,
      width,
      height,
      right: currentRight
    } = container.firstChild.getBoundingClientRect();

    const w = window.innerWidth;
    const h = window.innerHeight;

    const overflowH = h - (top + height);
    if (overflowH < 0) {
      container.style.top =
        parseInt(container.style.top, 10) + overflowH + "px";
    }

    const overflowW = w - (left + width);
    if (overflowW < 0) {
      container.style.left =
        parseInt(container.style.left, 10) + overflowW + "px";
    }

    if (typeof right === "number" && right !== currentRight) {
      const adjustment = right - currentRight;
      container.style.left = left + adjustment + "px";
    }
  }
}

export class DialogService {
  static showDialog(dialog) {
    const containerEl = ".react-dialog";
    const onClose = dialog.props.onClose;

    dialogOpened();

    ReactDOM.render(
      React.cloneElement(dialog, {
        container: containerEl,
        onClose: () => {
          DialogService.closeDialog();
          if (onClose) {
            onClose();
          }
        }
      }),
      document.body.querySelector(containerEl)
    );
  }

  static closeDialog() {
    dialogClosed();
    ReactDOM.unmountComponentAtNode(
      document.body.querySelector(".react-dialog")
    );
  }
}

export class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.pendingTask = null;
  }

  render() {
    return React.createElement("div", { className: "popup-proxy" });
  }

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);
    if (domNode) {
      const el = domNode.parentElement;
      const boundingClientRect = el.getBoundingClientRect();
      //onsole.log(`%cPopup.componentDidMount about to call show`,'color:green');
      this.show(this.props, boundingClientRect);
    }
  }

  componentWillUnmount() {
    PopupService.hidePopup(this.props.name, this.props.group);
  }

  componentWillReceiveProps(nextProps) {
    const domNode = ReactDOM.findDOMNode(this);
    if (domNode) {
      const el = domNode.parentElement;
      const boundingClientRect = el.getBoundingClientRect();
      //onsole.log(`%cPopup.componentWillReceiveProps about to call show`,'color:green');
      this.show(nextProps, boundingClientRect);
    }
  }

  show(props, boundingClientRect) {
    const { name, group, depth, width } = props;
    let left, top;

    if (this.pendingTask) {
      clearTimeout(this.pendingTask);
      this.pendingTask = null;
    }

    if (props.close === true) {
      console.log(
        "Popup.show hide popup name=" +
          name +
          ", group=" +
          group +
          ",depth=" +
          depth
      );
      PopupService.hidePopup(name, group);
    } else {
      const { position, children: component } = props;
      const {
        left: targetLeft,
        top: targetTop,
        width: clientWidth,
        bottom: targetBottom
      } = boundingClientRect;

      if (position === "below") {
        left = targetLeft;
        top = targetBottom;
      } else if (position === "above") {
        left = targetLeft;
        top = targetTop;
      }

      this.pendingTask = setTimeout(() => {
        PopupService.showPopup({
          name,
          group,
          depth,
          position,
          left,
          top,
          width: width || clientWidth,
          component
        });
      }, 10);
    }
  }
}
