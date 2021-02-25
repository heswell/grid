import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import cx from 'classnames';
import Header from './Header';
import { registerComponent } from './registry/ComponentRegistry';
import { useViewActionDispatcher } from './useViewActionDispatcher';
import useLayout from './useLayout';
import LayoutContext from './LayoutContext';
import { useLayoutDispatch } from './LayoutContext';

import './View.css';


const ViewContent = ({ children, resizing = false }) => {
  const root = useRef(null);
  const measureContent = useCallback(() => {
    const { width, height } = root.current.getBoundingClientRect();
    console.log(`%cView child dimensions ${width} x ${height}`, 'color: blue;font-weight: bold;')
    setDimensions({width, height})
  },[]);

  const setRef = useCallback((el) => {
    root.current = el;
    measureContent();
  },[measureContent]);

  const [dimensions, setDimensions] = useState(null)
  useLayoutEffect(() => {
    if (!resizing && root.current) {
      measureContent();
    }

  }, [measureContent, resizing])

  return (
    <div className="view-main" ref={setRef}>
      {dimensions === null ? null : children}
    </div>
  )

}

const View = React.memo(function View(inputProps) {
  const [props, ref] = useLayout('View', inputProps);
  const {
    children,
    className,
    collapsed, // "vertical" | "horizontal" | false | undefined
    closeable,
    expanded,
    layoutId: id,
    header,
    orientation = 'horizontal',
    path,
    resizing,
    tearOut,
    style,
    title,
  } = props;

  const layoutDispatch = useLayoutDispatch();
  const dispatchViewAction = useViewActionDispatcher(ref, path, layoutDispatch);

  const handleClick = () => {
    // need to track focus without actually capturing it
  };

  const headerProps = typeof header === 'object' ? header : {};

  return (
    <div
      className={cx('View', className, {
        'View-collapsed': collapsed,
        'View-expanded': expanded,
        'View-resizing': resizing,
      })}
      id={id}
      ref={ref}
      onClick={handleClick}
      style={style}
      tabIndex={-1}
    >
      <LayoutContext.Provider
        value={{ dispatch: dispatchViewAction, path, title }}
      >
        {header ? (
          <Header
            {...headerProps}
            collapsed={collapsed}
            expanded={expanded}
            closeable={closeable}
            orientation={collapsed || orientation}
            tearOut={tearOut}
          />
        ) : null}
        <ViewContent resizing={resizing}>{children}</ViewContent>
      </LayoutContext.Provider>
    </div>
  );
});
View.displayName = 'View';

export default View;

registerComponent('View', View, 'view');
