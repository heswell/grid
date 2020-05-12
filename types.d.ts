declare module '@heswell/data-source';

interface Column {
  key?: number;
  name: string;
  width: number;
  locked?: boolean;
}

type ColumnGroup = {
  columns: Column[];
  contentWidth: number;
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

type GridModel = {
  columnGroups: ColumnGroup[];
  columns: Column[];
  headerHeight: number;
  height: number;
  horizontalScrollbarHeight: number;
  meta: ColumnMeta;
  rowHeight: number;
  viewportRowCount: number;
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


type GridModelAction = any;
type GridModelReducerInitializer = (props: GridProps) => gridModelReducer;
type GridModelReducer = (state: GridModel, action: GridModelAction) => GridModel;

type Row = any;

interface ColumnGroupHeaderProps {
  columnGroup: ColumnGroup;
  height: number;
  ref?: React.RefObject<any>;
  width: number;
}
type ColumnGroupHeaderType = React.FC<ColumnGroupHeaderProps>;

interface HeaderCellProps {
  column: Column;
}
type HeaderCellComponent = React.FC<HeaderCellProps>;

type GridData = any;
type DataAction = any;
type DataReducerFactory = (model: GridModel) => (state: GridData, action: DataAction) => GridData;

interface ViewportProps {
  columnHeaders: any;
  dataSource: DataSource;
  gridModel: GridModel;
  ref?: React.RefObject<any>;
}

type ViewportType = React.FC<ViewportProps>;

type CanvasAction = number;

type CanvasReducerState = [Column[], Map<number,number>, ColumnGroup];
type CanvasReducer = (state: CanvasReducerState, action: CanvasAction) => CanvasReducerState;
type CanvasReducerInitializer = (ColumnGroup) => CanvasReducerState;

interface CanvasProps {
  columnGroup: any;
  columnHeader: React.ReactNode;
  contentHeight: number;
  firstVisibleRow: number;
  headerHeight: number;
  height: number;
  horizontalScrollbarHeight: number;
  meta: ColumnMeta;
  ref?: React.RefObject<any>;
  rowHeight: number;
  rows: Row[]
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