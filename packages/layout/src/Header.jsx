import React from 'react';
import classnames from 'classnames';
import { Toolbar, Tooltray } from '@uitk/toolkit';
import { Action } from './layout-action';
import ActionButton from './ActionButton';
import { useLayoutContext } from './LayoutContext';

import './Header.css';

const Header = ({
  className: classNameProp,
  density: densityProp,
  collapsed,
  expanded,
  closeable,
  orientation: orientationProp,
  style,
  tearOut,
}) => {
  const { title, dispatch: dispatchViewAction } = useLayoutContext();
  const handleAction = (evt, actionId) =>
    dispatchViewAction({ type: actionId });

  const handleMouseDown = (e) => {
    dispatchViewAction({ type: 'mousedown' }, e);
  };

  const handleButtonMouseDown = (evt) => {
    // do not allow drag to be initiated
    evt.stopPropagation();
  };

  const className = classnames(
    'Header',
    // `Header-${density}Density`,
    classNameProp,
  );

  const orientation = collapsed || orientationProp;

  const getContent = () => {
    const result = [];
    if (collapsed === false) {
      result.push(
        <ActionButton
          accessibleText="Minimize View"
          actionId={Action.MINIMIZE}
          iconName="minimize"
          key={result.length}
          onClick={handleAction}
          onMouseDown={handleButtonMouseDown}
          title="Minimize"
        />,
      );
    } else if (collapsed) {
      result.push(
        <ActionButton
          accessibleText="Restore View"
          actionId={Action.RESTORE}
          iconName="double-chevron-right"
          onClick={handleAction}
          onMouseDown={handleMouseDown}
          title="Restore"
        />,
      );
    }

    if (expanded === false) {
      result.push(
        <ActionButton
          accessibleText="Maximize View"
          actionId={Action.MAXIMIZE}
          iconName="maximize"
          key={result.length}
          onClick={handleAction}
          onMouseDown={handleButtonMouseDown}
          title="Maximize"
        />,
      );
    } else if (expanded) {
      result.push(
        <ActionButton
          accessibleText="Restore View"
          actionId={Action.RESTORE}
          iconName="restore"
          key={result.length}
          onClick={handleAction}
          onMouseDown={handleButtonMouseDown}
          title="Restore"
        />,
      );
    }

    if (tearOut) {
      result.push(
        <ActionButton
          accessibleText="Tear out View"
          actionId={Action.TEAR_OUT}
          iconName="tear-out"
          key={result.length}
          onClick={handleAction}
          onMouseDown={handleButtonMouseDown}
          title="Tear Out"
        />,
      );
    }

    if (closeable) {
      result.push(
        <ActionButton
          accessibleText="Close View"
          actionId={Action.REMOVE}
          iconName="close"
          key={result.length}
          onClick={handleAction}
          onMouseDown={handleButtonMouseDown}
          title="Close"
        />,
      );
    }

    return result;
  };

  const content = getContent();

  return (
    <Toolbar
      className={className}
      orientation={orientation}
      onMouseDown={handleMouseDown}
    >
      <span className="Header-title">{title}</span>
      {content.length > 0 ? <Tooltray align="right">{content}</Tooltray> : null}
    </Toolbar>
  );
};

export default Header;
