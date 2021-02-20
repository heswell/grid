import React from 'react';

const GridPropHelper = props => {

  return (
    <div className="prop-helper" style={{ ...props.style, backgroundColor: 'white'}}>
      Looks like we're missing a few required props here
    </div>
  )
}

export default GridPropHelper;
