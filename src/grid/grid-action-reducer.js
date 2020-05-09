export default handlerMap => (state, action) => {
  if (handlerMap[action.type]) {
    switch (action.type) {
      case "scroll-start-horizontal":
        handlerMap[action.type](action.scrollLeft);
        break;

      case "scroll-end-horizontal":
        handlerMap[action.type](action.scrollLeft);
        break;

      default:
        throw Error(
          `GridActionReducer does not recognize action type ${action.type}`
        );
    }
  }
  return state;
};
