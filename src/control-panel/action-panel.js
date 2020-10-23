import React from 'react';
import cx from 'classnames';

const ActionPanel = ({actions, className, onAction, ...props}) => {
  return (
    <div className={cx('ActionPanel', className)} {...props}>
      {actions.map(({action, label}, idx) => {
        return (
        <div key={idx}>
          <button onClick={e => onAction(action)}>{label}</button>
        </div>
        )
      })}
      </div>
  )
}

export default ActionPanel;