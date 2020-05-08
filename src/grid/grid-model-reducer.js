const DEFAULT_COLUMN_WIDTH = 100;

const DEFAULT_STATE = {
  defaultColumnWidth: DEFAULT_COLUMN_WIDTH
};

export const initModel = options => {
  return initialize(DEFAULT_STATE, options);
};

export default (state, _action) => {
  return state;
};

function initialize(initialState, options) {
  const { columns, width } = options;
  return {
    columnGroups: buildColumnGroups(columns, width)
  };
}

function buildColumnGroups(columns, gridWidth) {
  let columnGroup = null;
  let columnGroups = [];
  let availableWidth = gridWidth;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const { name, locked = false, width } = column;
    if (columnGroup === null || columnGroup.locked !== locked) {
      columnGroups.push(
        (columnGroup = {
          locked,
          columns: [],
          width: 0,
          contentWidth: 0
        })
      );
    }
    columnGroup.columns.push({
      name,
      key: i,
      width
    });
    columnGroup.contentWidth += width;
    if (columnGroup.locked) {
      columnGroup.width = columnGroup.contentWidth;
      availableWidth -= width;
    } else {
      columnGroup.width = availableWidth;
    }
  }
  return columnGroups;
}
