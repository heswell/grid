import React, { useEffect, useRef } from "react";

import "./Icon.css";

const neverRerender = () => true;

// onClick is temporary until we have a proper Toolbar Field
const Icon = ({ onClick }) => {
  const root = useRef(null);
  useEffect(() => {
    root.current.innerHTML = `
    <svg height="100%" viewBox="0 0 18 18" width="100%">
    <path class="icon-path icon-path-1" d="M11,1H2A1,1,0,0,0,1,2V16a1,1,0,0,0,1,1h9Z" />
    <path class="icon-path icon-path-2" d="M16,1H13V17h3a1,1,0,0,0,1-1V2A1,1,0,0,0,16,1Z" />
      </svg>`;
  }, []);

  return <span className="Icon column2b" ref={root} onClick={onClick} />;
};

export default React.memo(Icon, neverRerender);
