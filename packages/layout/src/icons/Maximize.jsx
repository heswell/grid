import React from 'react';
import classnames from 'classnames';
import { Button, Icon } from '@uitk/toolkit';

const Maximize = ({ className, ...props }) => (
  <Button
    {...props}
    className={classnames('MaximizeButton', className)}
    title="Maximize View"
    variant="secondary"
  >
    <Icon accessibleText="Maximize View" name="maximize" />
  </Button>
);

export default Maximize;
