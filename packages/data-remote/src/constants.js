let _connectionId = 0;

export const connectionId = {
  get nextValue(){
    return _connectionId++;
  }
}

export const msgType = {
  connect : 'connect',
  connectionStatus : 'connection-status',
  getFilterData : 'GetFilterData',
  rowData : 'rowData',
  rowSet: 'rowset',
  select : 'select',
  selectAll : 'selectAll',
  selectNone : 'selectNone',
  selected: 'selected',
  snapshot : 'snapshot',
  update: 'update',
  createLink: 'createLink',

  addSubscription: 'AddSubscription',
  collapseGroup : 'CollapseGroup',
  columnList : 'ColumnList',
  data : 'data',
  expandGroup : 'ExpandGroup',
  filter : 'filter',
  filterQuery : 'filterQuery',
  filterData : 'filterData',
  getSearchData : 'GetSearchData',
  groupBy : 'groupBy',
  modifySubscription : 'ModifySubscription',
  searchData : 'searchData',
  setColumns: 'setColumns',
  setGroupState : 'setGroupState',
  setViewRange : 'setViewRange',
  size : 'size',
  sort : 'sort',
  subscribed : 'Subscribed',
  tableList : 'TableList',
  unsubscribe : 'TerminateSubscription',
  viewRangeChanged : 'ViewRangeChanged',
}
