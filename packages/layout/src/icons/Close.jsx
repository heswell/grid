import React from 'react';
import classnames from 'classnames';
import { Button, Icon } from '@uitk/toolkit';

const Close = ({ className, ...props }) => (
  <Button
    {...props}
    className={classnames('CloseButton', className)}
    title="Close View"
    variant="secondary"
  >
    <Icon accessibleText="Close View" name="close" />
  </Button>
);

export default Close;
