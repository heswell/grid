// @ts-nocheck
import React from 'react';
import cx from 'classnames';
import {Grid} from '@heswell/grid';

  
export default function CheckList({className, ...props}) {
    return (
        <Grid className={cx('checkbox-list', className)}
            minColumnWidth={80}
            noColumnHeaders
            rowHeight={22}
            selectionModel="checkbox"
            {...props}
            />
    );


}
