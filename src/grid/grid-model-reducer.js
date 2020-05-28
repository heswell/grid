import { metaData } from "@heswell/utils";
import {addColumn, getColumnGroup, moveColumn, removeColumn} from './grid-model-utils';

const DEFAULT_COLUMN_WIDTH = 100;

const DEFAULT_STATE = {
  defaultColumnWidth: DEFAULT_COLUMN_WIDTH
};

const RESIZING = {resizing: true};
const NOT_RESIZING = {resizing: false};

/** @type {GridModelReducerInitializer} */
export const initModel = options => {
  return initialize(DEFAULT_STATE, options);
};

/** @type {(s: GridModel, a: GridModelAction) => GridModel} */
export default (state, action) => {
  // @ts-ignore
  return reducerActionHandlers[action.type](state, action);
};

/** @type {GridModelReducerTable} */
const reducerActionHandlers = {
  'move-col': handleMoveColumn,
  'resize': handleResize,
  'resize-col': handleResizeColumn,
  'resize-heading': handleResizeHeading,
  'add-col': handleAddColumn
}

function initialize(initialState, options) {
  const { columns, headerHeight = 32, height, rowHeight = 24, width } = options;
  const {columnGroups, headingDepth} = buildColumnGroups(columns, width);
  const totalHeaderHeight = headerHeight * headingDepth;
  const horizontalScrollbarHeight = columnGroups.some(({width, contentWidth}) => width < contentWidth)
    ? 15
    : 0;
  return {
    columnGroups,
    columns,
    headerHeight,
    height,
    horizontalScrollbarHeight,
    headingDepth,
    meta: metaData(columns),
    rowHeight,
    viewportHeight: height - totalHeaderHeight,
    viewportRowCount: Math.ceil((height - totalHeaderHeight) / rowHeight) + 1,
    width
  };
}

/** @type {GridModelReducer<'move-col'>} */
function handleMoveColumn(state, {column, targetColumn}){
  const {columnGroups} = state;
  if (columnGroups.length === 1){

  } else {
    const sourceColumnGroup = getColumnGroup(state, column);
    const targetColumnGroup = getColumnGroup(state,targetColumn);

    if (sourceColumnGroup === targetColumnGroup){
      return {
        ...state,
        columnGroups: columnGroups.map(columnGroup => {
          if (columnGroup === sourceColumnGroup){
            return moveColumn(columnGroup, column, targetColumn)
          } else {
            return columnGroup;
          }
        })
      }
    }
  }

  return state;
}


/** @type {GridModelReducer<'resize-heading'>} */
function handleResizeHeading(state, {phase, column, width}){

  if (phase === 'begin'){
    const {columnGroups} = updateGroupHeadings(state.columnGroups, column, RESIZING, RESIZING, RESIZING);
    let headingResizeState = {lastSizedCol: 0, ...getColumnPositions(columnGroups, splitKeys(column.key))}
    resizeColumnHeaderHeading = (state, column, width) => resizeHeading(state, column, width, headingResizeState);
    return {...state, columnGroups};
  } else if (phase === 'resize'){
    return resizeColumnHeaderHeading(state, column, width);
  } else {
    const {columnGroups} = updateGroupHeadings(state.columnGroups, column, NOT_RESIZING, NOT_RESIZING, NOT_RESIZING);
    resizeColumnHeaderHeading = null;
    return {...state, columnGroups};
  }
}

let resizeColumnHeaderHeading = null;

function resizeHeading(state, column, width, headingResizeState){

  const diff = width - column.width;
  const {lastSizedCol: pos, groupIdx, groupColIdx} = headingResizeState;
  const [lastSizedCol,diffs] = getColumnAdjustments(pos,groupColIdx.length,diff);

  headingResizeState.lastSizedCol = lastSizedCol;
    
  let newState = state;
  for (let i=0;i<diffs.length;i++){
      if (typeof diffs[i] === 'number' && diffs[i] !== 0){
          const targetCol = state.columnGroups[groupIdx].columns[groupColIdx[i]];
          newState = handleResizeColumn({...newState, headingResizeState}, {type: 'resize-col', phase: 'resize', column: targetCol, width: targetCol.width + diffs[i]});
      }
  }
  return newState;

}


/** @type {GridModelReducer<'add-col'>} */
function handleAddColumn(state, {columnGroup: targetColumnGroup, column}){
  // TODO allow the columnGroup to be optional and default it
  const {columnGroups} =state;
  const targetIdx = columnGroups.indexOf(targetColumnGroup);
  const sourceColumnGroup = getColumnGroup(state, column);
  const sourceIdx = columnGroups.indexOf(sourceColumnGroup);

  if (sourceColumnGroup === targetColumnGroup){
    return state;
  }

  const idx = targetIdx > sourceIdx
    ? 0
    : targetColumnGroup.columns.length;

  const sourceWithColumnRemoved = removeColumn(sourceColumnGroup, column, true);
  const targetWithColumnAdded = addColumn(targetColumnGroup, column, idx, true);

  const newColumnGroups = columnGroups.slice();
  newColumnGroups[sourceIdx] = sourceWithColumnRemoved;
  newColumnGroups[targetIdx] = targetWithColumnAdded;

  console.log(newColumnGroups)

  return {
    ...state,
    columnGroups: newColumnGroups
  }

}

/** @type {GridModelReducer<'resize-col'>} */
function handleResizeColumn(state, {phase, column, width}){
  if (phase === 'resize'){
    
    // if (column.width <= state.minColumnWidth && width <= column.width) {
    //   return state;
    // }

    const [columnGroups, groupIdx] = updateGroupColumn(state.columnGroups, column, {width});
    const updatedGroup = columnGroups[groupIdx];
    updateColumnHeading(updatedGroup);
    const widthAdjustment = width - column.width;
    // const totalColumnWidth = state.totalColumnWidth + widthAdjustment;

    // if (totalColumnWidth < state.displayWidth) {
    //     // what do we do about empty space
    // }

    updatedGroup.contentWidth += widthAdjustment;

    if (updatedGroup.locked) {
        updatedGroup.width += widthAdjustment;
        for (let i = groupIdx + 1; i < columnGroups.length; i++) {
            const {locked, width} = columnGroups[i];
            columnGroups[i] = {
                ...columnGroups[i],
                width: locked ? width : width - widthAdjustment
            };
        }
    }


    return {...state, columnGroups};

  } else if (phase === 'begin'){
    const [columnGroups] = updateGroupColumn(state.columnGroups, column, RESIZING);
    return {...state, columnGroups};

  } else {
    const [columnGroups] = updateGroupColumn(state.columnGroups, column, NOT_RESIZING);
    return {...state, columnGroups};
  }
}

function handleResize(state, {height, width}){
  const {headerHeight, headingDepth, rowHeight, viewportHeight} = state;
  const heightDiff = height - state.height;
  const widthDiff = width - state.width;
  const totalHeaderHeight = headerHeight * headingDepth;

  const columnGroups = widthDiff !== 0
    ? state.columnGroups.map(columnGroup => {
      if (columnGroup.locked){
        return columnGroup;
      } else {
        return {
          ...columnGroup,
          width: columnGroup.width + widthDiff
        }
      }
    })
    : state.columnGroups;

  return {
    ...state,
    columnGroups,
    height,
    width,
    viewportHeight: viewportHeight + heightDiff,
    viewportRowCount: Math.ceil((height - totalHeaderHeight) / rowHeight) + 1
  }
}

function buildColumnGroups(columns, gridWidth) {
  let column = null;
  let columnGroup = null;
  let columnGroups = [];
  let availableWidth = gridWidth;

  const headingDepth = getMaxHeadingDepth(columns);
  console.log(`maxHeadingDepth ${headingDepth}`)

  for (let i = 0; i < columns.length; i++) {
    const { name, locked = false, width } = columns[i];
    if (columnGroup === null || columnGroup.locked !== locked) {
      const headings = headingDepth > 1 ? [] : undefined;

      columnGroups.push(
        (columnGroup = {
          headings,
          locked,
          columns: [],
          width: 0,
          contentWidth: 0
        })
      );

    }

    columnGroup.columns.push(column = {
      name,
      key: i,
      width
    });

    if (columnGroup.headings){
      addColumnToHeadings(headingDepth, {...columns[i],...column}, columnGroup.headings);
    }

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
  console.log(columnGroups)
  return {columnGroups, headingDepth};
}

const getMaxHeadingDepth = columns =>
  columns.length === 0
    ? 0
    : Math.max(...columns.map(({heading}) => Array.isArray(heading) ? heading.length : 1));

function addColumnToHeadings(maxHeadingDepth, column, headings, collapsedColumns=null){
      const sortable = false;
      const collapsible = true;
      const isHeading = true;
  
      const {key, heading: colHeader=[column.name], width} = column;
      for (let depth = 1; depth < maxHeadingDepth; depth++) {
  
          const heading = headings[depth-1] || (headings[depth-1] = []);
          const colHeaderLabel = colHeader[depth];
          const lastHeading = heading.length > 0
              ? heading[heading.length-1]
              : null;
  
          if (colHeaderLabel !== undefined){
  
              if (lastHeading && lastHeading.label === colHeader[depth]){
                  lastHeading.width += width;
                  lastHeading.key += `:${key}`;
              } else {
                  const collapsed = collapsedColumns && collapsedColumns.indexOf(colHeaderLabel) !== -1;
                  let hide = false;
                  if (collapsed){
                      // lower depth headings are subheadings, nested subheadings below a collapsed heading
                      // will be hidden. Q: would it be better to iterate higher to lower ? When we encounter
                      // a collapsed heading for a given column, the first subheading at any lower level 
                      // will already have been created, so we need to hide them.
                      for (let d=0;d<depth-1;d++){
                          const head = headings[d];
                          head[head.length-1].hidden = true;
                      } 
  
                  } else if (depth < maxHeadingDepth-1){
                      // ...likewise if we encounter a subheading, which is not the first for a given
                      // higher -level heading, and that higher-level heading is collapsed, we need to hide it.
                      for (let d=depth;d<maxHeadingDepth;d++){
                          const head = headings[d];
                          const colHeadingLabel = colHeader[d+1];
                          if (head && head.length && colHeaderLabel){
                              const {collapsed: isCollapsed,hidden,label} = head[head.length - 1];
                              if ((isCollapsed || hidden) && label === colHeadingLabel){
                                  hide = true;
                              }
                          }
                      } 
  
                  }
                  heading.push({key,label: colHeaderLabel,width,sortable,collapsible,collapsed,hidden: hide,isHeading});
              }
          } else {
  
              const lowerDepth = headings[depth-2];
              const lastLowerDepth = lowerDepth
                  ? lowerDepth[lowerDepth.length-1]
                  : null;
  
              if (lastLowerDepth && lastLowerDepth.key === key){
              // Need to check whether a heading at level below is collapsed
                  heading.push({key,label: '',width,collapsed: lastLowerDepth.collapsed,sortable,isHeading});
              } else if (lastLowerDepth && endsWith(lastLowerDepth.key,`:${key}`)){
                  lastHeading.width += width;
                  lastHeading.key += `:${key}`;
              } else {
                  heading.push({key,label: '',width,isHeading});
              }
          }
      }
  
}

const splitKeys = compositeKey => `${compositeKey}`.split(':').map(k => parseInt(k,10));

function updateGroupHeadings(groups, column, headingUpdates, subHeadingUpdates, columnUpdates){
  const keys = splitKeys(column.key);
  const { groupIdx, groupHeadingIdx, headingColIdx } = getHeadingPosition(groups, column);

  const group = groups[groupIdx];
  const updatedGroup = { ...group, headings: [...group.headings]};

  // 1) Apply changes to the target heading ...
  const heading = updatedGroup.headings[groupHeadingIdx];
  const updatedHeading = [...heading];
  updatedGroup.headings[groupHeadingIdx] = updatedHeading;
  updatedHeading[headingColIdx] = {...column, ...headingUpdates};
  
  // 2) Optionally, apply updates to nested sub-headings ...
  if (subHeadingUpdates){
      for (let i=0;i<groupHeadingIdx;i++){
          const h = updatedGroup.headings[i];
          let updatedH = null;
          for (let j = 0; j < h.length; j++) {
              if (column.key.indexOf(h[j].key) !== -1) {
                  updatedH = updatedH || [...h];
                  updatedH[j] = { ...h[j], ...subHeadingUpdates };
              }
          }
          if (updatedH !== null) {
              updatedGroup.headings[i] = updatedH;
          }
      }
  }

  // 3) Optionally, apply updates to underlying columns ...
  if (columnUpdates){
      const { groupColIdx } = getColumnPositions(groups, keys);
      updatedGroup.columns = [...group.columns];
      groupColIdx.forEach(idx => {
          const updatedColumn = { ...updatedGroup.columns[idx], ...columnUpdates };
          updatedGroup.columns[idx] = updatedColumn;
      });
  }

  const columnGroups = [...groups];
  columnGroups[groupIdx] = updatedGroup;
  return {columnGroups, updatedGroup};

}

function updateColumnHeading(group){
  if (group.headings){
      const columns = group.columns;
      group.headings = group.headings.map(heading => heading.map(colHeading => {
          const indices = columnKeysToIndices(splitKeys(colHeading.key),columns);
          const colWidth = indices.reduce((sum, idx) => sum + (columns[idx].width), 0);
          return colWidth === colHeading.width 
              ? colHeading
              : {...colHeading, width: colWidth};
      }));
  }
}

const columnKeysToIndices = (keys,columns) =>
    keys.map(key => columns.findIndex(c => c.key === key));

function updateGroupColumn(groups, column, updates){
  const { groupIdx: idx, groupColIdx: colIdx } = getColumnPosition(groups, column);
  const {columns, ...rest} = groups[idx];
  const updatedGroups = groups.map((group,i) => i === idx 
    ? { ...rest, columns: columns.map((col,i) => i === colIdx ? { ...col, ...updates } : col)} 
    : group);
  return [updatedGroups, idx];
}

function getHeadingPosition(groups, column) {
  for (let i = 0; i < groups.length; i++) {
      const {headings=null} = groups[i];
      for (let j=0;headings && j<headings.length;j++){
          const idx = headings[j].findIndex(h => h.key === column.key && h.label === column.label);
          if (idx !== -1) {
              return { groupIdx: i, groupHeadingIdx: j, headingColIdx: idx };
          }
      }
  }
  return { groupIdx: -1, groupHeadingIdx: -1, headingColIdx: -1 };
}

function getColumnPosition(groups, column) {
  for (let i = 0; i < groups.length; i++) {
      const idx = groups[i].columns.findIndex(c => c.key === column.key);
      if (idx !== -1) {
          return {groupIdx: i, groupColIdx: idx };
      }
  }
  return { groupIdx: -1, groupColIdx: -1 };
}

function getColumnPositions(groups, keys) {
  for (let i = 0; i < groups.length; i++) {
      const indices = columnKeysToIndices(keys, groups[i].columns);
      if (indices.every(key => key !== -1)) {
          return { groupIdx: i, groupColIdx: indices };
      }
  }
  return { groupIdx: -1, groupColIdx: [] };
}

function getColumnAdjustments(pos, numCols, diff){
  const sign = diff < 0 ?-1 : 1;
  const absDiff = diff*sign;
  const numSlotsToFill = Math.min(absDiff,numCols);
  const each = Math.floor(absDiff/numCols);
  let diffs = absDiff % numCols;
  const results = [];

  for (let i=0;i<numSlotsToFill;i++,pos++){
      if (pos === numCols){
          pos = 0;
      }
      results[pos] = sign * (each + (diffs ? 1 : 0));
      if (diffs){
          diffs -=1;
      }
  }
  return [pos, results];
}

function endsWith(string, subString){
  const str = typeof string === 'string'
      ? string
      : string.toString();
  
  return subString.length >= str.length
      ? false
      : str.slice(-subString.length) === subString;    
}
