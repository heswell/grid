declare module '@heswell/data-source';

interface Column {
  key?: number;
  heading?: string[];
  label?:string;
  locked?: boolean;
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

interface DraggedColumn extends Column {
  position: number;
}


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
type GridModelAddColumnAction = { type: 'add-col', targetColumnGroup?: ColumnGroup, targetColumn?: Column, column: Column};

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

type onColumnDragHandler = (phase: DragPhase, column: DraggedColumn, targetColumn?: Column) => void;

interface ColumnGroupHeaderProps {
  columnGroup: ColumnGroup;
  depth: number;
  height: number;
  onColumnDrag?: onColumnDragHandler;
  ref?: React.RefObject<any>;
  width: number;
}
type ColumnGroupHeaderType = React.FC<ColumnGroupHeaderProps>;


type DragPhase = 'drag-start' | 'drag' | 'drag-end'
type ResizePhase = 'begin' | 'resize' | 'end';
interface HeaderCellProps {
  className?: string;
  column: Column;
  onDrag?: onColumnDragHandler;
  onResize?: (resizePhase: ResizePhase, column: Column, width?: number) => void;
}
type HeaderCellComponent = React.FC<HeaderCellProps>;

type GridData = any;
type DataAction = any;
type DataReducerFactory = (model: GridModel) => (state: GridData, action: DataAction) => GridData;

interface ViewportProps {
  columnHeaders: any;
  dataSource: DataSource;
  draggedColumn?: DraggedColumn;
  gridModel: GridModel;
  onColumnDrag?: onColumnDragHandler;
  ref?: React.RefObject<any>;
}

type ViewportType = React.FC<ViewportProps>;

type CanvasAction =
  | {type: 'scroll-left', scrollLeft: number}
  | {type: 'refresh', columnGroup: ColumnGroup};

type CanvasReducerState = [Column[], Map<number,number>, ColumnGroup, number];
type CanvasReducer = (state: CanvasReducerState, action: CanvasAction) => CanvasReducerState;
type CanvasReducerInitializer = (ColumnGroup) => CanvasReducerState;

type CanvasRef = React.RefObject<{
  beginHorizontalScroll: (scrollTop: number) => void;
  endDrag: (column: DraggedColumn, targetColumn: Column) => void;
  endHorizontalScroll: (scrollTop: number) => void;
  beginVerticalScroll: () => void;
  hideDraggedColumn: (column: DraggedColumn) => void;
  /**
   * Returns to default display mode.
   * Sets the height of Canvas element and applies a transform to content.
   */
  endVerticalScroll: (scrollTop: number) => void;
  /**
   * Scrolls canvas by amount requested or less if scrollLimit reached.
   * Returns distance actually scrolled.
   */
  makeSpaceForColumn: (column: DraggedColumn, targetColumn: Column) => void;
  scrollBy: (scrollLeft: number) => number;
  scrollLeft: number;
}>;

interface CanvasProps {
  columnGroup: any;
  columnHeader: React.ReactNode;
  contentHeight: number;
  firstVisibleRow: number;
  height: number;
  horizontalScrollbarHeight: number;
  meta: ColumnMeta;
  ref?: CanvasRef;
  rowHeight: number;
  rows: Row[]
  totalHeaderHeight: number;
}

type CanvasType = React.FC<CanvasProps>;

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

interface ColumnBearerProps {
  column: DraggedColumn;
  gridModel: GridModel;
  /**
   * The initial scroll position of scrollable Canvas when Column drag begins.
   * (scroll position may subsequently be changed by column drag itself)
   */
  initialScrollPosition: number;
  onDrag?: onColumnDragHandler;
  onScroll: (scrollDistance: number) => number;
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

type DragCallback = (phase: DragPhase, delta?: number) => void;
type DragHook = (callback: DragCallback) => [React.MouseEventHandler<HTMLDivElement>, () => void];