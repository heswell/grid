import React, { useEffect, useRef } from "react";
import { registerComponent } from "../registry/ComponentRegistry";

import "./Icon.css";

const neverRerender = () => true;

// onClick is temporary until we have a proper Toolbar Field
const AddIcon = ({ onClick }) => {
  const root = useRef(null);
  useEffect(() => {
    root.current.innerHTML = `
    <svg height="100%" viewBox="0 0 18 18" width="100%">
    <path class="icon-path" d="M14.5,8H10V3.5A.5.5,0,0,0,9.5,3h-1a.5.5,0,0,0-.5.5V8H3.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H8v4.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V10h4.5a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,14.5,8Z" />
    </svg>`;
  }, []);

  return <span className="Icon close" ref={root} onClick={onClick} />;
};

export default React.memo(AddIcon, neverRerender);

registerComponent("AddIcon", AddIcon);
