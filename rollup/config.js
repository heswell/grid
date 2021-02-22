import react from "react";
import reactDom from "react-dom";

export const commonJsConfig = {
  include: "../../node_modules/**",
  namedExports: {
    react: Object.keys(react),
    "react-dom": Object.keys(reactDom),
    "react-is": [
      "isElement",
      "isFragment",
      "isValidElementType",
      "ForwardRef",
      "Memo",
      "typeOf",
      "useRef"
    ],
  },
};
