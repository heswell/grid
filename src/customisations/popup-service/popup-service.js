// @ts-nocheck
import React, {createElement} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import useStyles from './use-popup-style';

let _dialogOpen = false;
const _popups = [];

function specialKeyHandler(e) {

    if (e.keyCode === 27 /* ESC */) {
        if (_popups.length) {
            closeAllPopups();
            console.log('unmount the open popup(s)');
        } else if (_dialogOpen) {
            console.log('unmount the open dialog');
            ReactDOM.unmountComponentAtNode(document.body.querySelector('.react-dialog'));
        }
    }
}

function outsideClickHandler(e) {

    if (_popups.length) {
        // onsole.log(`Popup.outsideClickHandler`);
        const popupContainers = document.body.querySelectorAll('.react-popup');
        for (let i = 0; i < popupContainers.length; i++) {
            if (popupContainers[i].contains(e.target)) {
                return;
            }
        }
        console.log(`close all popups`);
        closeAllPopups();
    }
}

function closeAllPopups() {
    if (_popups.length) {

        // onsole.log(`closeAllPopups`);
        const popupContainers = document.body.querySelectorAll('.react-popup');
        for (let i = 0; i < popupContainers.length; i++) {
            console.log(`unmountComponentAtNode`);
            ReactDOM.unmountComponentAtNode(popupContainers[i]);
        }
        popupClosed('*');
    }
}

function dialogOpened() {
    if (_dialogOpen === false) {
        console.log('PopupService, dialog opened');
        _dialogOpen = true;
        window.addEventListener('keydown', specialKeyHandler, true);
    }
}

function dialogClosed() {
    if (_dialogOpen) {
        console.log('PopupService, dialog closed');
        _dialogOpen = false;
        window.removeEventListener('keydown', specialKeyHandler, true);
    }
}

function popupOpened(name/*, group*/) {
    if (_popups.indexOf(name) === -1) {
        _popups.push(name);
        //onsole.log('PopupService, popup opened ' + name + '  popups : ' + _popups);
        if (_dialogOpen === false) {
            window.addEventListener('keydown', specialKeyHandler, true);
            window.addEventListener('click', outsideClickHandler, true);
        }
    }
}

function popupClosed(name/*, group=null*/) {
    if (_popups.length) {

        if (name === '*') {
            _popups.length = 0;
        } else {
            const pos = _popups.indexOf(name);
            if (pos !== -1) {
                _popups.splice(pos, 1);
            }
        }
        //onsole.log('PopupService, popup closed ' + name + '  popups : ' + _popups);
        if (_popups.length === 0 && _dialogOpen === false) {
            window.removeEventListener('keydown', specialKeyHandler, true);
            window.removeEventListener('click', outsideClickHandler, true);
        }

    }
}

const PopupComponent = ({children, position, style}) => {
    const classes = useStyles();
    const className = cx(classes.popup, 'popup-container', position);
    return createElement('div', {className, style }, children);
}

let incrementingKey = 1;

export class PopupService {

    static showPopup({name='anon', group='all'/*, depth=0*/, position='', left=0, top=0, width='auto', component}) {

        console.log(`PopupService.showPopup ${name} in ${group} ${left} ${top} ${width}`);
        if (!component){
            throw Error(`PopupService showPopup, no component supplied`)
        }
        popupOpened(name, group);

        let el = document.body.querySelector('.react-popup.' + group);
        if (el === null) {
            el = document.createElement('div');
            el.className = 'react-popup ' + group;
            document.body.appendChild(el);
        }

        const style = {left, top, width};

        ReactDOM.render(
            createElement(PopupComponent, {key: incrementingKey++, position, style }, component),
            el, 
            () => {PopupService.keepWithinThePage(el);}
        );
    }

    static hidePopup(name='anon', group='all'){
        //onsole.log('PopupService.hidePopup name=' + name + ', group=' + group)

        if (_popups.indexOf(name) !== -1) {
            popupClosed(name, group);
            ReactDOM.unmountComponentAtNode(document.body.querySelector(`.react-popup.${group}`));
        }
    }

    static movePopup(x, y, name='anon', group='all'){
        const container = document.querySelector(`.react-popup.${group} .popup-container`);
        container.style.top = (parseInt(container.style.top,10) + y) + 'px';
        container.style.left = (parseInt(container.style.left,10) + x) + 'px';
    }

    static movePopupTo(x, y, name='anon', group='all'){
        const container = document.querySelector(`.react-popup.${group} .popup-container`);
        container.style.top = `${y}px`;
        container.style.left = `${x}px`;
    }

    static keepWithinThePage(el) {
        //onsole.log(`PopupService.keepWithinThePage`);
        const container = el.querySelector('.popup-container');
        const {top, left, width, height} = container.firstChild.getBoundingClientRect();

        const w = window.innerWidth;
        const h = window.innerHeight;

        const overflowH = h - (top + height);
        if (overflowH < 0) {
            container.style.top = (parseInt(container.style.top,10) + overflowH) + 'px';
        }

        const overflowW = w - (left + width);
        if (overflowW < 0) {
            container.style.left = (parseInt(container.style.left,10) + overflowW) + 'px';
        }

    }
}

export class DialogService {

    static showDialog(dialog) {

        const containerEl = '.react-dialog';
        const onClose = dialog.props.onClose;

        dialogOpened();

        ReactDOM.render(React.cloneElement(dialog, {
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
        ReactDOM.unmountComponentAtNode(document.body.querySelector('.react-dialog'));
    }
}

export class Popup extends React.Component {

    constructor(props){
        super(props);
        this.pendingTask = null;
    }

    render() {
        return React.createElement('div',{className: 'popup-proxy'});
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

        const {name, group, depth, width} = props;
        let left, top;

        if (this.pendingTask) {
            clearTimeout(this.pendingTask);
            this.pendingTask = null;
        }

        if (props.close === true) {
            console.log('Popup.show hide popup name=' + name + ', group=' + group + ',depth=' + depth);
            PopupService.hidePopup(name, group);
        } else {
            const {position, children: component} = props;
            const {left: targetLeft, top: targetTop, width: clientWidth, bottom: targetBottom} = boundingClientRect;

            if (position === 'below') {
                left = targetLeft;
                top = targetBottom;
            } else if (position === 'above') {
                left = targetLeft;
                top = targetTop;
            }

            console.log('%cPopup.show about to setTimeout', 'color:red;font-weight:bold');
            this.pendingTask = setTimeout(() => {
                console.log(`%c...timeout fires`, 'color:red;font-weight:bold');
                PopupService.showPopup({ name, group, depth, position, left, top, width: width || clientWidth, component });
            }, 10);
        }

    }
}
