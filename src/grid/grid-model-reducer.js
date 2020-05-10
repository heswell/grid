import { metaData } from "@heswell/utils";

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
  const { columns, headerHeight = 32, height, rowHeight = 24, width } = options;
  const columnGroups = buildColumnGroups(columns, width);
  const horizontalScrollbarHeight = columnGroups.some(({width, contentWidth}) => width < contentWidth)
    ? 15
    : 0;
  return {
    columnGroups,
    columns,
    headerHeight,
    height,
    horizontalScrollbarHeight,
    meta: metaData(columns),
    rowHeight,
    viewportRowCount: Math.ceil((height - headerHeight) / rowHeight) + 1
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
    // TODO fixed width may exceed available width. This assumes single fixed width followed by
    // sinfle scrollable
    if (columnGroup.locked) {
      columnGroup.width = columnGroup.contentWidth;
      availableWidth -= width;
    } else {
      columnGroup.width = availableWidth;
    }
  }
  return columnGroups;
}
