const NO_PROPS = {};
export const getProp = (component, propName) =>
  component?.props[propName] ?? component?.props[`data-${propName}`];
export const getProps = (component) =>
  component?.props || component || NO_PROPS;
