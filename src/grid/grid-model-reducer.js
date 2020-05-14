import { metaData } from "@heswell/utils";

const DEFAULT_COLUMN_WIDTH = 100;

const DEFAULT_STATE = {
  defaultColumnWidth: DEFAULT_COLUMN_WIDTH
};

/** @type {GridModelReducerInitializer} */
export const initModel = options => {
  return initialize(DEFAULT_STATE, options);
};

/** @type {GridModelReducer} */
export default (state, action) => {
  switch(action.type){
    case 'resize':
      return handleResize(state, action);
    default:
      return state;
  }
};

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

function handleResize(state, {height, width}){
  const {headerHeight, rowHeight} = state;
  const heightDiff = height - state.height;
  const widthDiff = width - state.width;

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
    viewportRowCount: Math.ceil((height - headerHeight) / rowHeight) + 1
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

function endsWith(string, subString){
  const str = typeof string === 'string'
      ? string
      : string.toString();
  
  return subString.length >= str.length
      ? false
      : str.slice(-subString.length) === subString;    
}
