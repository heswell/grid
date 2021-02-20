import { addSortColumn, metadataKeys, removeSortColumn, sortByToMap } from '@heswell/utils'
import {
  assignKeysToColumns,
  columnKeysToIndices,
  ColumnGroup,
  getColumnGroup,
  getColumnGroupColumnIdx,
  getHorizontalScrollbarHeight,
  extractGroupColumn,
  GridModel,
  splitKeys
} from './grid-model-utils';

import * as Action from "./grid-model-actions";

const DEFAULT_COLUMN_TYPE = {name: 'string'}
const DEFAULT_COLUMN_WIDTH = 100;
const MIN_COLUMN_WIDTH = 80;
const CHECKBOX_COLUMN = {
  name: '',
  key: metadataKeys.SELECTED,
  width: 25,
  sortable: false,
  type: {
    name: 'checkbox',
    renderer: {
      name: 'checkbox-cell'
    }
  }
};

const RESIZING = {resizing: true};
const NOT_RESIZING = {resizing: false};

function sortMap(sortBy){
  if (!sortBy){
    return null;
  }
  return sortBy.reduce((map, group) => {
    if (typeof group === 'string'){
      map[group] = 'asc';
    } else {
      map[group[0]] = group[1] || 'asc';
    }
    return map;
  }, {}) 
}

/** @type {GridModelReducer} */
export default (state, action) => {
  // @ts-ignore
  return reducerActionHandlers[action.type](state, action);
};

/** @type {GridModelReducerTable} */
const reducerActionHandlers = {
  'resize': resizeGrid,
  'resize-col': resizeColumn,
  'resize-heading': resizeHeading,
  'add-col': addColumn,
  'initialize': initialize,
  'sort': sortRows,
  'group': groupRows,
  // 'pivot': pivotRows,
  'toggle': toggleRow,
  'set-available-columns': setAvailableColumns,
  'set-pivot-columns': setPivotColumns,
  'column-hide': hideColumn,
  'column-show': showColumn,
  [Action.ROW_HEIGHT]: setRowHeight
};

export const initModel = ([gridProps, custom]) => {
  const {
    columns,
    columnSizing = 'static',
    defaultColumnWidth = DEFAULT_COLUMN_WIDTH,
    groupBy: groupByProp,
    headerHeight = 32,
    height,
    minColumnWidth = MIN_COLUMN_WIDTH,
    noColumnHeaders=false,
    pivotBy: pivotByProp,
    renderBufferSize=0,
    rowHeight = 24,
    selectionModel, // default should be none
    width } = gridProps;

  const groupColumns = sortMap(groupByProp) || undefined;
  // We won't be able to build the column headers for pivot columns until we start to get data
  const pivotColumns = sortMap(pivotByProp) || undefined;

  // The custom support is all new ... still under review
   const {
      footer: {height: customFooterHeight},
      header: {height: customHeaderHeight},
      inlineHeader: {height: customInlineHeaderHeight}
    } = custom; 

  const state = {
    columnNames: null,
    columnGroups: undefined,
    columnSizing,
    customFooterHeight,
    customHeaderHeight,
    customInlineHeaderHeight,
    defaultColumnWidth,
    groupColumns, 
    groupState: null,
    headerHeight: noColumnHeaders ? 0 : headerHeight,
    headingDepth: undefined,
    height,
    horizontalScrollbarHeight: undefined,
    minColumnWidth,
    pivotColumns,
    renderBufferSize,
    rowHeight,
    selectionModel,
    sortColumns: null,
    viewportHeight: undefined,
    viewportRowCount: undefined,
    width
  };

  const groupBy = GridModel.groupBy({groupColumns});
  const {columnNames, columnGroups, headingDepth} = buildColumnGroups(state, columns, groupBy);
  const totalHeaderHeight = noColumnHeaders 
    ? customHeaderHeight
    : headerHeight * headingDepth + customHeaderHeight;

  state.columnNames = columnNames;
  state.columnGroups = columnGroups;
  state.headingDepth = headingDepth;
  state.horizontalScrollbarHeight = getHorizontalScrollbarHeight(columnGroups);
  state.viewportHeight = height - totalHeaderHeight - customFooterHeight - customInlineHeaderHeight;
  state.viewportRowCount =  Math.ceil((height - totalHeaderHeight) / rowHeight) + 1;

  return state;
};

/** @type {GridModelReducer<GridModelInitializeAction>} */
function initialize(state, {props}){
  const custom = {
    inlineHeader: {height: state.customInlineHeaderHeight},
    header: {height: state.customHeaderHeight},
    footer: {height: state.customFooterHeight}
  }
  return initModel([props, custom]);
}

/** @type {GridModelReducer<GridModelPivotColumnsAction>} */
function setPivotColumns(state, action){

  const groupBy = GridModel.groupBy(state);
  const {columnNames, columnGroups, headingDepth} = buildColumnGroups(state, action.columns, groupBy);
  const totalHeaderHeight = state.headerHeight * headingDepth;

  return {
      ...state,
      columnGroups,
      columnNames,
      headingDepth,
      horizontalScrollbarHeight: getHorizontalScrollbarHeight(columnGroups),
      viewportHeight: state.height - totalHeaderHeight,
      viewportRowCount:  Math.ceil((state.height - totalHeaderHeight) / state.rowHeight) + 1
    };
    
}

/** @type {GridModelReducer<GridModelSetColumnsAction>} */
function setAvailableColumns(state, action){
  if (!state.columnGroups){
    const {columnNames, columnGroups, headingDepth} = buildColumnGroups(state, action.columns);
    const totalHeaderHeight = state.headerHeight * headingDepth;

    return {
      ...state,
      columnGroups,
      columnNames,
      headingDepth,
      horizontalScrollbarHeight: getHorizontalScrollbarHeight(columnGroups),
      viewportHeight: state.height - totalHeaderHeight,
      viewportRowCount:  Math.ceil((state.height - totalHeaderHeight) / state.rowHeight) + 1
    };
    
  } else {
    return state;
  }
}

// Do we need this in the model ?
/** @type {GridModelReducer<GridModelToggleAction>} */
function toggleRow(state, {row}){
  // TODO does groupState actually need to live in the grid model ?
  const groupState = GridModel.toggleGroupState(state, row);
  return {
    ...state,
    groupState
  }
}

/** @type {GridModelReducer<GridModelSortAction>} */
function sortRows(state, {columns}){
  const sortColumns = columns && sortByToMap(columns);

  return {
    ...state,
    sortColumns
  };
}

/** @type {GridModelReducer<GridModelGroupAction>} */
function groupRows(state, {columns=null}){
  const groupColumns = columns && columns.reduce((map, [columnName, direction]) => (map[columnName] = direction, map),{});
  const {columnGroups} = buildColumnGroups(state, GridModel.columns(state), columns);

  return {
      ...state,
      groupColumns,
      columnGroups
    };
}

/** @type {GridModelReducer<'pivot'>} */
function pivotRows(state, {column, direction, add, remove}){

  let pivotColumns;

  if (!state.pivotColumns){
    pivotColumns = {[column.name]: direction || 'asc'};
  } else if (add){
    pivotColumns = addSortColumn(state.pivotColumns, column)
  } else if (remove){
    if (Object.keys(state.pivotColumns).length === 1){
      pivotColumns = null;
    } else {
      pivotColumns = removeSortColumn(state.pivotColumns, column);
    }
  } else {
    return state;
  }

  return {
      ...state,
      pivotColumns,
    };
}

/** @type {GridModelReducer<GridModelResizeHeadingAction>} */
function resizeHeading(state, {phase, column, width}){
  if (phase === 'begin'){
    const {columnGroups} = updateGroupHeadings(state.columnGroups, column, RESIZING, RESIZING, RESIZING);
    let headingResizeState = {lastSizedCol: 0, ...getColumnPositions(columnGroups, splitKeys(column.key))}
    resizeColumnHeaderHeading = (state, column, width) => resizeColumnHeading(state, column, width, headingResizeState);
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

function resizeColumnHeading(state, column, width, headingResizeState){

  const diff = width - column.width;
  const {lastSizedCol: pos, groupIdx, groupColIdx} = headingResizeState;
  const [lastSizedCol,diffs] = getColumnAdjustments(pos,groupColIdx.length,diff);

  headingResizeState.lastSizedCol = lastSizedCol;
    
  let newState = state;
  for (let i=0;i<diffs.length;i++){
      if (typeof diffs[i] === 'number' && diffs[i] !== 0){
          const targetCol = state.columnGroups[groupIdx].columns[groupColIdx[i]];
          newState = resizeColumn(
            {...newState, headingResizeState}, 
            {type: 'resize-col', phase: 'resize', column: targetCol, width: targetCol.width + diffs[i]});
      }
  }
  return newState;
}

/** @type {GridModelReducer<GridModelHideColumnAction>} */
function hideColumn(state, {column}){
  const columns = GridModel.columns(state).filter(col => col.name !== column.name);
  const groupBy = GridModel.groupBy(state);
  const {columnNames, columnGroups} = buildColumnGroups(state, columns, groupBy);
  return {
    ...state,
    columnGroups,
    columnNames
  };
}

/** @type {GridModelReducer<GridModelShowColumnAction>} */
function showColumn(state, {column}){
  console.log(`showColumn ${column.name}`);
  return state;
}

/** @type {GridModelReducer<GridModelAddColumnAction>} */
function addColumn(state, {insertIdx: absInsertIdx, targetColumnGroup, column}){
  if (absInsertIdx !== -1){
    targetColumnGroup = getColumnGroup(state, absInsertIdx);
  }
  const insertIdx = getColumnGroupColumnIdx(state, absInsertIdx);

  const targetIdx = state.columnGroups.indexOf(targetColumnGroup);
  const sourceColumnGroup = getColumnGroup(state, column);
  const sourceIdx = state.columnGroups.indexOf(sourceColumnGroup);
  const sourceColumn = state.columnGroups[sourceIdx].columns.find(col => col.key === column.key);
  const columns = state.columnGroups.flatMap((columnGroup, idx) => {
    if (idx === sourceIdx && sourceIdx !== targetIdx){
      return columnGroup.columns.filter(col => col.key !== column.key);
    } else if (idx === sourceIdx){
      if (sourceIdx === targetIdx){
        const sourceColumnIdx = sourceColumnGroup.columns.findIndex(col => col.key === sourceColumn.key);
        if (insertIdx > sourceColumnIdx){
          return ColumnGroup.moveColumnTo(columnGroup, sourceColumn, insertIdx);
        } else {
          return ColumnGroup.moveColumnTo(columnGroup, sourceColumn, insertIdx);
        }
      } else {
        return ColumnGroup.insertColumnAt(columnGroup, sourceColumn, insertIdx);
      }
    } else if (idx === targetIdx){
      return ColumnGroup.insertColumnAt(columnGroup, sourceColumn, insertIdx);
    } else {
      return columnGroup.columns;
    }
  });

  const {columnGroups} = buildColumnGroups(state, columns, null);

  return {
    ...state,
    columnGroups
  }

}

/** @type {GridModelReducer<'resize-col'>} */
function resizeColumn(state, {phase, column, width}){
  if (phase === 'resize'){

    const columnGroups = GridModel.updateGroupColumnWidth(state, column, width);
    return {...state, columnGroups};

  } else if (phase === 'begin'){
    const [columnGroups] = GridModel.updateGroupColumn(state, column, RESIZING);
    return {...state, columnGroups};

  } else {
    const [columnGroups] = GridModel.updateGroupColumn(state, column, NOT_RESIZING);
    return {...state, columnGroups};
  }
}

/** @type {GridModelReducer<GridModelRowHeightAction>} */
function setRowHeight(state, {rowHeight}){
  const {height, headerHeight, headingDepth, viewportHeight} = state;
  const totalHeaderHeight = headerHeight * headingDepth;
  return {
    ...state,
    rowHeight,
    viewportRowCount: Math.ceil((height - totalHeaderHeight) / rowHeight) + 1
  }

  //TODO what abl=our scroll bar calculations

}

/** @type {GridModelReducer<GridModelResizeAction>} */
function resizeGrid(state, {height, width}){
  const {columnSizing, headerHeight, headingDepth, rowHeight, viewportHeight} = state;
  const heightDiff = height - state.height;
  const widthDiff = width - state.width;
  const totalHeaderHeight = headerHeight * headingDepth;

  let columnGroups;

  if (widthDiff === 0){
    columnGroups = state.columnGroups;
  } else if (columnSizing === 'fill'){

    ({columnGroups} = buildColumnGroups({...state, width}, GridModel.columns(state)));

  } else {
    columnGroups = state.columnGroups.map(columnGroup => {
      if (columnGroup.locked){
        return columnGroup;
      } else {
        return {
          ...columnGroup,
          width: columnGroup.width + widthDiff
        }
      }
    });
  }

  return {
    ...state,
    columnGroups,
    height,
    width,
    viewportHeight: viewportHeight + heightDiff,
    viewportRowCount: Math.ceil((height - totalHeaderHeight) / rowHeight) + 1
  }
}

const NO_COLUMN_GROUPS = {headingDepth: 0}

function buildColumnGroups(state, columns, groupBy) {
  if (!columns){
    return NO_COLUMN_GROUPS;
  }
  const {columnSizing, defaultColumnWidth, minColumnWidth, selectionModel, width: gridWidth} = state;
  let column = null;
  let columnGroup = null;
  let columnGroups = [];

  let gridContentWidth = gridWidth - 15;// how do we know about vertical scrollbar
  let availableWidth = gridContentWidth; 

  const preCols = selectionModel === 'checkbox' ? [CHECKBOX_COLUMN]: [];

  //const _columns = preCols.concat(keyedColumns.map(addLabel));


  const headingDepth = getMaxHeadingDepth(columns);
  // TODO separate keys from columns
  const keyedColumns = assignKeysToColumns(columns, defaultColumnWidth)
  const columnNames = keyedColumns.map(col => col.name);

  const [groupColumn, nonGroupedColumns] = extractGroupColumn(keyedColumns, groupBy);
  if (groupColumn){
    const headings = headingDepth > 1 ? [] : undefined;
    columnGroups.push(columnGroup = { locked: false, columns: [groupColumn], headings, width:0, contentWidth:0 });
    addColumnToHeadings(headingDepth, groupColumn, headings);
  }

  // TODO we need a min Width on the group column as well
  let minTotalColumnWidth = groupColumn ? groupColumn.width : 0;
  let totalColumnWidth = minTotalColumnWidth;
  let flexTotal = 0;
  let flexCount = 0;
  const initialFlex = {$count:0, $total: 0};

  for (let {
    flex=undefined,
    key,
    name,
    heading=[name],
    locked = false,
    minWidth=minColumnWidth,
    type, // normalize this here
    width=defaultColumnWidth 
  } of preCols.concat(nonGroupedColumns)) {

    if (columnGroup === null || columnGroup.locked !== locked) {
      const headings = headingDepth > 1 ? [] : undefined;

      columnGroups.push(
        (columnGroup = {
          headings,
          locked,
          columns: [],
          left: totalColumnWidth, // TODO this won't be right if we introduce more than one locked group
          width: 0,
          contentWidth: 0
        })
      );
    }

    // TODO we are losing a lot of column information here
    columnGroup.columns.push(column = {
      flex,
      heading,
      locked,
      name,
      key,
      type: typeof type === 'string' ? {name:type} : type ? type : DEFAULT_COLUMN_TYPE,
      width
    });

    if (columnGroup.headings){
      addColumnToHeadings(headingDepth, column, columnGroup.headings);
    }

    columnGroup.contentWidth += width;
    minTotalColumnWidth += minWidth;
    totalColumnWidth += width;

    if (flex){
      initialFlex.$count += 1;
      initialFlex.$total += flex;
      initialFlex[name] = flex;
    }

    if (flex){
      flexTotal += flex;
    }

    if (flex !== 0){
      flexCount += 1;
    }

    // TODO fixed width may exceed available width. This assumes single fixed width followed by
    // single scrollable
    if (columnGroup.locked) {
      columnGroup.width = columnGroup.contentWidth;
      availableWidth -= width;
    } else {
      columnGroup.width = availableWidth;
    }
  }

  const noInitialFlex = initialFlex.$count === 0;

  if (columnSizing === 'fill'){
    // spread the diff ...
    const diff =  gridContentWidth - totalColumnWidth;
    if ((diff < 0 && minTotalColumnWidth <= gridContentWidth) || diff > 0){
      const columnWidthAdjustment = initialFlex.$total > 0
        ? diff / initialFlex.$total
        : flexTotal > 0
          ? diff / flexTotal
          : diff / flexCount;

     for (let columnGroup of columnGroups){
        for (let column of columnGroup.columns){
          let columnAdjustment = 0;
          if (initialFlex[column.name]){
            columnAdjustment = columnWidthAdjustment * initialFlex[column.name];
          } else if (noInitialFlex && column.flex === undefined){
            columnAdjustment = columnWidthAdjustment;
          } else if (noInitialFlex && column.flex > 0){
            columnAdjustment = columnWidthAdjustment * column.flex;
          }
          column.width += columnAdjustment;
          columnGroup.contentWidth += columnAdjustment;
        }
      }
    }
  }

  return {columnNames, columnGroups, headingDepth};
}

const getMaxHeadingDepth = columns => {
  if (columns.length === 0){
    return 0;
  }
  let max = 1;
  for (let i=0;i<columns.length;i++){
    const {heading} = columns[i];
    if (Array.isArray(heading) && heading.length > max){
       max = heading.length; 
    }
  }
  return max;
}
  
function addColumnToHeadings(maxHeadingDepth, column, headings, collapsedColumns=null){
      const sortable = false;
      const collapsible = true;
      const isHeading = true;
  
      const {key, heading: colHeader, width} = column;
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
                  heading.push({key,label: '',width, isHeading});
              }
          }
      }
  
}

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
