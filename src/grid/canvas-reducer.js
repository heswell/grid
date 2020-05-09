import { PADDING_CELL } from "./row";

const VIRTUALIZATION_THRESHOLD = 0.66;

export const initCanvasReducer = columnGroup => {
  const renderColumns = getRenderColumns(columnGroup);
  return [renderColumns, initialKeys(renderColumns), columnGroup];
};

export default ([_, keys, columnGroup], scrollLeft) => {
  const nextColumns = getRenderColumns(columnGroup, scrollLeft);
  return [nextColumns, nextKeys(nextColumns, keys), columnGroup];
};

function initialKeys(columns) {
  return new Map(columns.map((column, idx) => [column.key, idx]));
}

function nextKeys(columns, prevKeys) {
  if (columns.every(column => prevKeys.has(column.key))) {
    console.log(`SURPRISED to be called with no change of keys !!!`);
    return prevKeys;
  } else {
    const remainingKeys = new Map(prevKeys);
    const nextKeys = new Map();
    const columnsAwaitingKeys = [];

    const nextKey = () => {
      const usedKeys = new Map(
        Array.from(initialKeys(columns).entries()).map(([k, v]) => [v, k])
      );

      nextKeys.forEach(value => {
        if (usedKeys.has(value)) {
          usedKeys.delete(value);
        }
      });

      if (usedKeys.size > 0) {
        return usedKeys.keys().next().value;
      } else {
        return columns.length;
      }
    };

    columns.forEach(column => {
      if (remainingKeys.has(column.key)) {
        nextKeys.set(column.key, remainingKeys.get(column.key));
        remainingKeys.delete(column.key);
      } else {
        columnsAwaitingKeys.push(column.key);
      }
    });

    const freeKeys = Array.from(remainingKeys.values());
    columnsAwaitingKeys.forEach(columnKey => {
      nextKeys.set(columnKey, freeKeys.length ? freeKeys.shift() : nextKey());
    });

    return nextKeys;
  }
}

function getRenderColumns(columnGroup, scrollLeft = 0) {
  if (!isVirtualizationRequired(columnGroup)) {
    return columnGroup.columns;
  }
  const { columns, width } = columnGroup;
  let firstIdx = -1;
  let lastIdx = columns.length - 1;
  let offset = 0;
  let defaultWidth = 200;

  for (let i = 0, currentPosition = 0; i < columns.length; i++) {
    currentPosition += columns[i].width || defaultWidth;
    if (currentPosition <= scrollLeft) {
      offset += columns[i].width;
    } else if (currentPosition > scrollLeft + width) {
      lastIdx = i;
      break;
    } else if (firstIdx === -1 && currentPosition > scrollLeft) {
      firstIdx = i;
    }
  }
  return [
    { key: -1, name: PADDING_CELL, width: offset },
    ...columns.slice(firstIdx, lastIdx + 1)
  ];
}

const isVirtualizationRequired = ({ contentWidth, locked, width }) => {
  return !locked && width / contentWidth < VIRTUALIZATION_THRESHOLD;
};