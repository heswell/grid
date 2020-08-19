/** @type {GridActionReducerFactory} */
const reducerFactory = handlerMap => (state, action) => {
  if (handlerMap[action.type]) {
    switch (action.type) {
      case "scroll-start-horizontal":
        handlerMap[action.type](action.scrollLeft);
        break;

      case "scroll-end-horizontal":
        handlerMap[action.type](action.scrollLeft);
        break;

      case "set-available-columns":
        handlerMap[action.type](action.columns);
        break;

      case "column-hide":
        handlerMap[action.type](action.column);
        break;

      default:  
    }
  }
  return state;
};

export default reducerFactory;
