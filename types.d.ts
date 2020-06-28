declare module '@heswell/data-source';

interface Column {
  key?: number;
  heading?: string[];
  label?:string;
  locked?: boolean;
  // would like to avoid this, it is purely an internal implementation detail
  marginLeft?: number;
  name: string;
  resizeable?: boolean;
  resizing?: boolean;
  width: number;
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
  width: number;
};

type ColumnMeta = {
  [key: string]: number;
}

type DataSource = any;

interface GridProps {
  columns: Column[];
  dataSource: DataSource;
  headerHeight?: number;
  height: number;
  width: number;
}

type GridComponent = React.FC<GridProps>;

type GridContext = React.Context<{
  dispatchGridAction: (action: GridAction) => void;
  dispatchGridModelAction: (action: GridModelAction) => void;
  // showContextMenu: any;
}>;

type GridModel = {
  columnGroups: ColumnGroup[];
  columns: Column[];
  headerHeight: number;
  headingDepth: number;
  height: number;
  horizontalScrollbarHeight: number;
  meta: ColumnMeta;
  rowHeight: number;
  viewportHeight: number;
  viewportRowCount: number;
  width: number;
};

type GridAction = 
  | {type: 'scroll-start-horizontal', scrollLeft: number}
  | {type: 'scroll-end-horizontal', scrollLeft: number};

type GridActionHandler<T extends GridAction['type']> = 
  T extends 'scroll-start-horizontal' ? (scrollLeft: number) => void :
  T extends 'scroll-end-horizontal' ? (scrollLeft: number) => void :
  never;

type GridActionHandlerMap = {[key in GridAction['type']]?: GridActionHandler<key>};  
type GridActionReducerFactory = (handlerMap: GridActionHandlerMap) => (state: {}, action: GridAction) => {};

// Grid Model Reducer and Actions
type GridModelResizeAction = { type: 'resize', height: number, width: number};
type GridModelResizeColAction = { type: 'resize-col', phase: ResizePhase, column: Column, width?: number};
type GridModelResizeHeadingAction = { type: 'resize-heading', phase: ResizePhase, column: Column, width?: number};
type GridModelAddColumnAction = { type: 'add-col', targetColumnGroup?: ColumnGroup, column: Column, insertIdx: number};

type GridModelAction =
  | GridModelResizeAction
  | GridModelResizeColAction
  | GridModelResizeHeadingAction
  | GridModelAddColumnAction;

type GridModelReducerFn<A=GridModelAction> = (state: GridModel, action: A) => GridModel;  
type GridModelReducerInitializer = (props: GridProps) => GridModel;
type GridModelReducer<T extends GridModelAction['type']> = 
  T extends 'resize' ? GridModelReducerFn<GridModelResizeAction> :
  T extends 'resize-col' ? GridModelReducerFn<GridModelResizeColAction> :
  T extends 'resize-heading' ? GridModelReducerFn<GridModelResizeHeadingAction> :
  T extends 'add-col' ? GridModelReducerFn<GridModelAddColumnAction> :
  GridModelReducerFn<GridModelAction>;
type GridModelReducerTable = {[key in GridModelAction['type']]: GridModelReducer<key>};  

type Row = any;

type onHeaderCellDragHandler = (phase: 'drag-start', column: Column, columnPosition: number, mousePosition: number) => void;
type onColumnDragHandler = (phase: DragPhase, column: Column, insertIdx?: number, insertPos?: number, columnLeft?: number) => void;
type onColumnGroupHeaderDragHandler = (phase: 'drag-start', columnGroupIdx: number, column: Column, columnPosition: number, mousePosition: number) => void;

interface ColumnGroupHeaderProps {
  columnGroup: ColumnGroup;
  columnGroupIdx: number;
  columns?: Column[];
  depth: number;
  height: number;
  onColumnDrag?: onColumnGroupHeaderDragHandler;
  ref?: React.RefObject<any>;
  width: number;
}
type ColumnGroupHeaderType = React.FC<ColumnGroupHeaderProps>;


type DragPhase = 'drag-start' | 'drag' | 'drag-pause' | 'drag-end'
type ResizePhase = 'begin' | 'resize' | 'end';
interface HeaderCellProps {
  className?: string;
  column: Column;
  onDrag?: onHeaderCellDragHandler;
  onResize?: (resizePhase: ResizePhase, column: Column, width?: number) => void;
}
type HeaderCellComponent = React.FC<HeaderCellProps>;

type GridData = any;
type DataAction = any;
type DataReducerFactory = (model: GridModel) => (state: GridData, action: DataAction) => GridData;

interface ViewportProps {
  dataSource: DataSource;
  columnDragData?: ColumnDragData;
  gridModel: GridModel;
  onColumnDrag?: onColumnDragHandler;
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


interface CanvasProps {
  columnGroupIdx: number;
  contentHeight: number;
  firstVisibleRow: number;
  gridModel: GridModel;
  height: number;
  horizontalScrollbarHeight: number;
  meta: ColumnMeta;
  ref?: CanvasRef;
  rowHeight: number;
  rows: Row[]
  totalHeaderHeight: number;
}

type CanvasType = React.ForwardRefExoticComponent<CanvasProps>;

type CanvasHandle = Handle<CanvasType>;

interface RowProps {
  columns: Column[];
  height: number;
  idx: number;
  keys: any;
  meta: ColumnMeta;
  row: Row;
}

type RowType = React.FC<RowProps>;

interface CellProps {
  column: Column;
  meta: ColumnMeta;
  row: Row;
}

type CellType = React.FC<CellProps>;

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