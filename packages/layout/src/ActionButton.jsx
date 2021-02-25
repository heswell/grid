import React from 'react';
import classnames from 'classnames';
import { Button, Icon } from '@uitk/toolkit';

const ActionButton = ({
  actionId,
  accessibleText,
  className,
  iconName,
  onClick,
  title,
  ...props
}) => {
  const handleClick = (evt) => {
    onClick(evt, actionId);
  };
  return (
    <Button
      {...props}
      className={classnames('ActionButton', className)}
      onClick={handleClick}
      title={title}
      variant="secondary"
    >
      <Icon accessibleText={accessibleText} name={iconName} />
    </Button>
  );
};

export default ActionButton;
