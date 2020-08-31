declare module '@heswell/data-source';

type SelectionModel = 'checkbox' | 'single-row' | 'multi-row';
type SortDirection = 'asc' | 'dsc';

type GroupBy = Array<string | [string, SortDirection]>


interface ColumnDescriptor {
  locked?: boolean;
  name: string;
  width?: number;
}

interface Column {
  flex?: number;
  key?: number;
  heading?: string[];
  initialFlex?: number;
  label?:string;
  locked?: boolean;
  // would like to avoid this, it is purely an internal implementation detail
  marginLeft?: number;
  minWidth?: number;
  name: string;
  resizeable?: boolean;
  resizing?: boolean;
  type?: any;
  width: number;
  // Group types, break these out
  isGroup?: true;
  columns?: Column[];
}

interface Heading {
  key: string;
  isHeading: true;
  label: string;
  width: number;
}

interface ColumnGroup {
  columns: Column[];
  contentWidth: number;
  headings?: Heading[];
  locked: boolean;
  left?: number;
  width: number;
};

type MetaDataKeys = {
  [key: string]: number;
}

type DataSource = any;
type ColumnSizing = 'fill' | 'auto' | 'static'; 

interface GridProps {
  className?: string;
  columns: ColumnDescriptor[];
  columnSizing? : ColumnSizing;
  dataSource: DataSource;
  defaultColumnWidth?: number;
  groupBy?: GroupBy;
  headerHeight?: number;
  height: number;
  minColumnWidth?: number;
  pivotBy?: GroupBy;
  rowHeight?: number;
  selectionModel?: SelectionModel;
  width: number;
}

type GridComponent = React.FC<GridProps>;

type GridContext = React.Context<{
  custom: any;
  dataSource: DataSource;
  dispatchGridAction: (action: GridAction) => void;
  dispatchGridModelAction: (action: GridModelAction) => void;
  gridModel: GridModel;
}>;

type SortColumns = {
  [key: string] : any;
  // we can't use this in JavaScript. There are places where TS inference is not smart enough to 
  // work out which variant is valid. In TS we could use type assertions, we have no such option
  // in JS.
  // [key: string] : SortDirection | number;
}

type GroupState = {
  rowIdx?: number,
  [key: string]: boolean | GroupState;
}

type GridModel = {
  columnNames: string[];
  columnSizing: ColumnSizing;
  columnGroups: ColumnGroup[];
  customFooterHeight: number;
  customHeaderHeight: number;
  customInlineHeaderHeight: number;
  defaultColumnWidth?: number;
  groupColumns: SortColumns;// rename - too confusing with columnGroups
  groupState: GroupState;
  headerHeight: number;
  headingDepth: number;
  height: number;
  horizontalScrollbarHeight: number;
  minColumnWidth?: number;
  noColumnHeaders?: boolean;
  pivotColumns: SortColumns;
  rowHeight: number;
  sortColumns: SortColumns;
  viewportHeight: number;
  viewportRowCount: number;
  width: number;
};

type GridAction = 
  | {type: 'scroll-start-horizontal', scrollLeft: number}
  | {type: 'scroll-end-horizontal', scrollLeft: number}
  | {type: 'selection', idx: number, row: any[], rangeSelect: boolean, keepExistingSelection: boolean}

type GridActionHandler<T extends GridAction['type']> = 
  T extends 'scroll-start-horizontal' ? (scrollLeft: number) => void :
  T extends 'scroll-end-horizontal' ? (scrollLeft: number) => void :
  T extends 'selection' ? (action: {idx: number, row: any[], rangeSelect: boolean, keepExistingSelection: boolean}) => void :
  never;

type True = true;

type GridActionHandlerMap = {[key in GridAction['type']]?: GridActionHandler<key>};  
type GridActionReducerFactory = (handlerMap: GridActionHandlerMap) => (state: {}, action: GridAction) => {};

// Grid Model Reducer and Actions
type GridModelResizeAction = { type: 'resize', height: number, width: number};
type GridModelResizeColAction = { type: 'resize-col', phase: ResizePhase, column: Column, width?: number};
type GridModelResizeHeadingAction = { type: 'resize-heading', phase: ResizePhase, column: Column, width?: number};
type GridModelAddColumnAction = { type: 'add-col', targetColumnGroup?: ColumnGroup, column: Column, insertIdx: number};
type GridModelInitializeAction = { type: 'initialize', props};
type GridModelGroupAction = { type: 'group', column: Column, direction?: SortDirection, add?: boolean, remove?: true};
type GridModelGroupAction = { type: 'pivot', column: Column, direction?: SortDirection, add?: boolean, remove?: true};
type GridModelSortAction = { type: 'sort', column: Column, direction?: SortDirection, add?: True, remove?: True};
type GridModelToggleAction = { type: 'toggle', row: any[]};
type GridModelSetColumnsAction = { type: 'set-available-columns', columns: Column[]};
type GridModelHideColumnAction = { type: 'column-hide', column: Column};
type GridModelShowColumnAction = { type: 'column-show', column: Column};
type GridModelPivotColumnsAction = { type: 'set-pivot-columns', columns: string[]};

type GridModelAction =
  | GridModelResizeAction
  | GridModelResizeColAction
  | GridModelResizeHeadingAction
  | GridModelAddColumnAction
  | GridModelInitializeAction
  | GridModelSortAction
  | GridModelGroupAction
  | GridModelPivotAction
  | GridModelToggleAction
  | GridModelSetColumnsAction
  | GridModelShowColumnAction
  | GridModelHideColumnAction
  | GridModelPivotColumnsAction;

type GridModelReducerFn<A=GridModelAction> = (state: GridModel, action: A) => GridModel;  
type GridModelReducerInitializer = (props: GridProps) => GridModel;
type GridModelReducer<T extends GridModelAction['type']> = 
  T extends 'resize' ? GridModelReducerFn<GridModelResizeAction> :
  T extends 'resize-col' ? GridModelReducerFn<GridModelResizeColAction> :
  T extends 'resize-heading' ? GridModelReducerFn<GridModelResizeHeadingAction> :
  T extends 'add-col' ? GridModelReducerFn<GridModelAddColumnAction> :
  T extends 'initialize' ? GridModelReducerFn<GridModelInitializeAction> :
  T extends 'sort' ? GridModelReducerFn<GridModelSortAction> :
  T extends 'group' ? GridModelReducerFn<GridModelGroupAction> :
  T extends 'pivot' ? GridModelReducerFn<GridModelPivotAction> :
  T extends 'toggle' ? GridModelReducerFn<GridModelToggleAction> :
  T extends 'set-columns' ? GridModelReducerFn<GridModelSetColumnsAction> :
  T extends 'column-show' ? GridModelReducerFn<GridModelShowColumnAction> :
  T extends 'column-hide' ? GridModelReducerFn<GridModelHideColumnAction> :
  T extends 'set-pivot-column' ? GridModelReducerFn<GridModelPivotColumnsAction> :
  GridModelReducerFn<GridModelAction>;

type GridModelReducerTable = {[key in GridModelAction['type']]: GridModelReducer<key>};  

type Row = any;

type DragPhase = 'drag-start' | 'drag' | 'drag-pause' | 'drag-end'
type ResizePhase = 'begin' | 'resize' | 'end';

type onHeaderCellDragHandler = (phase: 'drag-start', column: Column, columnPosition: number, mousePosition: number) => void;

type onColumnDragHandler = (phase: 'drag' | 'drag-end', column: Column, insertIdx?: number, insertPos?: number, columnLeft?: number) => void;
type onColumnDragStart = (phase: 'drag-start', columnGroupIdx: number, column: Column, columnPosition: number, mousePosition: number) => void;

interface ColumnGroupHeaderProps {
  columnGroup: ColumnGroup;
  columnGroupIdx: number;
  columns?: Column[];
  onColumnDragStart?: onColumnDragStart;
  ref?: React.RefObject<any>;
}
type ColumnGroupHeaderType = React.FC<ColumnGroupHeaderProps>;


interface HeaderCellProps {
  className?: string;
  column: Column;
  onDrag?: onHeaderCellDragHandler;
  onResize?: (resizePhase: ResizePhase, column: Column, width?: number) => void;
  sorted?: SortDirection | number;
}
type HeaderCellComponent = React.FC<HeaderCellProps>;

type RowsetRange = {
  hi: number;
  lo: number;
}

type RowKeys = {
  free: number[],
  used: {[key: number]: number}
}

type GridData = {
  offset: number;
  rows: any[];
  rowCount: number;
  range: RowsetRange;
  _keys: RowKeys
};

type DataAction = any;
type DataReducer = (state: GridData, action: DataAction) => GridData;

interface ViewportProps {
  columnDragData?: ColumnDragData;
  gridModel: GridModel;
  onColumnDrop?: onColumnDragHandler;
  onColumnDragStart?: onColumnGroupHeaderDragHandler;
  ref?: React.Ref<any>;
}

type ViewportComponent = React.FC<ViewportProps>;

type CanvasAction =
  | {type: 'scroll-left', scrollLeft: number}
  | {type: 'refresh', columnGroup: ColumnGroup};

type CanvasReducerState = [Column[], Map<number,number>, ColumnGroup, number];
type CanvasReducer = (state: CanvasReducerState, action: CanvasAction) => CanvasReducerState;
type CanvasReducerInitializer = (ColumnGroup) => CanvasReducerState;

type Operation = any;

type Handle<T> = T extends React.ForwardRefExoticComponent<React.RefAttributes<infer T2>> ? T2 : never;

type CanvasRef = React.Ref<{
  beginHorizontalScroll: () => void;
  endHorizontalScroll: () => void;
  beginVerticalScroll: () => void;
  endVerticalScroll: (scrollTop: number) => void;
  beginDrag: (column: Column) => number;
  endDrag: (columnDragData: ColumnDragData, insertIdx: number) => void;
  isWithinScrollWindow: (column: Column) => boolean;
  scrollBy: (scrollLeft: number) => number;
  scrollLeft: number;
}>;

type ToggleStrategy = {
  expand_level_1?: false;
};

interface CanvasProps {
  columnGroupIdx: number;
  contentHeight: number;
  firstVisibleRow: number;
  gridModel: GridModel;
  height: number;
  horizontalScrollbarHeight: number;
  onColumnDragStart?: onColumnDragStart;
  ref?: CanvasRef;
  rowHeight: number;
  rows: Row[];
  toggleStrategy: ToggleStrategy;
}

type CanvasType = React.ForwardRefExoticComponent<CanvasProps>;

type CanvasHandle = Handle<CanvasType>;

interface RowProps {
  columns: Column[];
  height: number;
  idx: number;
  keys: any;
  onClick: (idx: number, row: any[], rangeSelect: boolean, keepExistingSelection: boolean) => void;
  row: Row;
  toggleStrategy: ToggleStrategy;
}

type RowType = React.FC<RowProps>;

interface CellProps {
  className?: string;
  column: Column;
  row: Row;
}

interface GroupCellProps extends CellProps {
  toggleStrategy: ToggleStrategy;
}

type CellType = React.FC<CellProps>;
type GroupCellType = React.FC<GroupCellProps>;

type ColumnBearerRef = React.RefObject<{
  setFinalPosition: () => void;
}>;

type ColumnDragData = {
  column: Column;
  columnGroupIdx: number;
  columnIdx: number;
  initialColumnPosition: number;
  columnPositions: [[number]];
  mousePosition: number;
}

interface ColumnBearerProps {
  columnDragData: ColumnDragData;
  gridModel: GridModel;
  /**
   * The initial scroll position of scrollable Canvas when Column drag begins.
   * (scroll position may subsequently be changed by column drag itself)
   */
  initialScrollPosition: number;
  onDrag?: onColumnDragHandler;
  onScroll: (scrollDistance: number) => number;
  ref: ColumBearerRef;
  rows: any[];
}
type ColumnBearerComponent = React.FC<ColumnBearerProps>;

interface DraggableProps {
  className?: string;
  onDrag: (e: React.MouseEvent, deltaX: number, deltaY: number) => void;
  onDragStart?: (e: React.MouseEvent) => any; //  what do we allow here ? Who uses it ?
  onDragEnd?: (e: React.MouseEvent, arg: any) => void;
}

type DraggableComponent = React.ComponentType<DraggableProps>;

type DragCallback = (phase: DragPhase, delta?: number, dragPosition?: number) => void;
type DragHook = (callback: DragCallback, dragPhase?: number, initialDragPosition?: number) => [React.MouseEventHandler<HTMLDivElement>, () => void];

type MenuDescriptor = {
  label: string;
  action: atring;
  children?: MenuDescriptor[];
}