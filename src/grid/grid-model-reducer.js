import { addSortColumn, indexOfCol, metadataKeys, partition, removeSortColumn, setSortColumn, updateGroupBy } from '@heswell/utils'
import {getColumnGroup, getColumnGroupColumnIdx, ColumnGroup, GridModel} from './grid-model-utils';

const DEFAULT_COLUMN_WIDTH = 100;
const MIN_COLUMN_WIDTH = 80;

const RESIZING = {resizing: true};
const NOT_RESIZING = {resizing: false};

export const initModel = gridProps => {
  const { columns, defaultColumnWidth, groupBy, headerHeight = 32, height, rowHeight = 24, width } = gridProps;
  const {columnGroups, headingDepth} = buildColumnGroups(columns, null, width, defaultColumnWidth);
  const totalHeaderHeight = headerHeight * headingDepth;
  const horizontalScrollbarHeight = columnGroups.some(({width, contentWidth}) => width < contentWidth)
    ? 15
    : 0;
    console.log(`initial groupBy `, groupBy)
  return {
    columnGroups,
    groupColumns: null,
    groupState: null,
    headerHeight,
    height,
    horizontalScrollbarHeight,
    headingDepth,
    rowHeight,
    sortColumns: null,
    viewportHeight: height - totalHeaderHeight,
    viewportRowCount: Math.ceil((height - totalHeaderHeight) / rowHeight) + 1,
    width
  };
};

/** @type {(s: GridModel, a: GridModelAction) => GridModel} */
export default (state, action) => {
  console.log(`action => `, action)
  // @ts-ignore
  return reducerActionHandlers[action.type](state, action);
};

/** @type {GridModelReducerTable} */
const reducerActionHandlers = {
  'resize': handleResize,
  'resize-col': handleResizeColumn,
  'resize-heading': handleResizeHeading,
  'add-col': handleAddColumn,
  'initialize': initialize,
  'sort': sortRows,
  'group': groupRows,
  'toggle': toggleRow
}

// Do we need this in the model ?
/** @type {GridModelReducer<'toggle'>} */
function toggleRow(state, {row}){
  // TODO does groupState actually need to live in the grid model ?
  const groupState = GridModel.toggleGroupState(state, row);
  return {
    ...state,
    groupState
  }
}


/** @type {GridModelReducer<'sort'>} */
function sortRows(state, {column, direction, add=false, remove=false}){

  const sortColumns = add 
    ? addSortColumn(state.sortColumns, column, direction)
    : remove
      ? removeSortColumn(state.sortColumns, column)
      : setSortColumn(state.sortColumns, column, direction);

  return {
    ...state,
    sortColumns
  };
}

/** @type {GridModelReducer<'group'>} */
function groupRows(state, {column, direction, add, remove}){
  console.log(`group by ${column.name} direction: ${direction} additive ${add}`)
  const { groupColumns: existingGroupColumns } = state;
  const columns = GridModel.columns(state);
  if (existingGroupColumns === null){
    const groupColumns = {
      [column.name]: direction || 'asc' 
    }
    const groupBy = GridModel.groupBy({groupColumns});
    const {columnGroups} = buildColumnGroups(columns, groupBy, state.width);
    console.log(columnGroups)

  return {
      ...state,
      groupColumns,
      columnGroups
    }

  } else if (add){
    const groupColumns = addSortColumn(state.groupColumns, column)
    console.log(groupColumns)
    const groupBy = GridModel.groupBy({groupColumns});
    const {columnGroups} = buildColumnGroups(columns, groupBy, state.width);

    return {
      ...state,
      groupColumns,
      columnGroups
    }
  } else if (remove){
    const groupColumns = removeSortColumn(state.groupColumns, column);
    console.log(groupColumns);
    const groupBy = GridModel.groupBy({groupColumns});
    const {columnGroups} = buildColumnGroups(columns, groupBy, state.width);
    return {
      ...state,
      groupColumns,
      columnGroups
    }
  } else {
    return state;

  }
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

/** @type {GridModelReducer<'initialize'>} */
function initialize(state, {props}){
  return initModel(props);
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
function handleAddColumn(state, {insertIdx: absInsertIdx, targetColumnGroup, column}){
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

  const {columnGroups} = buildColumnGroups(columns, null, state.width);

  return {
    ...state,
    columnGroups
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

function buildColumnGroups(columns, groupBy, gridWidth, defaultColumnWidth=DEFAULT_COLUMN_WIDTH) {
  let column = null;
  let columnGroup = null;
  let columnGroups = [];
  let availableWidth = gridWidth;

  const headingDepth = getMaxHeadingDepth(columns);
  const start = metadataKeys.count;

  const [groupColumn, nonGroupedColumns] = extractGroupColumn(columns, groupBy, MIN_COLUMN_WIDTH);
  if (groupColumn){
    const headings = headingDepth > 1 ? [] : undefined;
    columnGroups.push(columnGroup = { locked: false, columns: [groupColumn], headings, width:0, contentWidth:0 });
    addColumnToHeadings(headingDepth, groupColumn, headings);
  }

  for (let i = 0; i < nonGroupedColumns.length; i++) {
    const { key: columnKey, name, heading=[name], locked = false, width=defaultColumnWidth } = nonGroupedColumns[i];
    const key = typeof columnKey === 'number' 
      ? columnKey
      : start + i;

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
      heading,
      locked,
      name,
      key,
      width
    });

    if (columnGroup.headings){
      addColumnToHeadings(headingDepth, column, columnGroup.headings);
    }

    columnGroup.contentWidth += width;
    // TODO fixed width may exceed available width. This assumes single fixed width followed by
    // single scrollable
    if (columnGroup.locked) {
      columnGroup.width = columnGroup.contentWidth;
      availableWidth -= width;
    } else {
      columnGroup.width = availableWidth;
    }
  }
  return {columnGroups, headingDepth};
}

function extractGroupColumn(columns, groupBy, minColumnWidth){
  if (groupBy && groupBy.length > 0){
      const isGroup = ({name}) => indexOfCol(name, groupBy) !== -1
      // Note: groupedColumns will be in column order, not groupBy order
      const [groupedColumns, rest] = partition(columns, isGroup);
      if (groupedColumns.length !== groupBy.length){
          throw Error(`extractGroupColumn: no column definition found for all groupBy cols ${JSON.stringify(groupBy)} `);
      }
      const groupCount = groupBy.length;
      const groupCols = groupBy.map(([name], idx) => {
          // Keep the cols in same order defined on groupBy
          const column = groupedColumns.find(col => col.name === name);
          return {
              ...column,
              groupLevel: groupCount - idx
          }
      })
      const groupCol = {
          key: -1,
          name: 'group-col',
          heading: ['group-col'],
          isGroup: true,
          columns: groupCols,
          width: Math.max(...groupCols.map(col => col.width || minColumnWidth)) + 50
      };
      return [groupCol, rest];
  }
  return [null, columns]
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
