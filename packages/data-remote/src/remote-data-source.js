import { createLogger, DataTypes, EventEmitter, logColor, uuid } from '@heswell/utils';
import {
  msgType as Msg
} from './constants';

// TODO make this dynamic
import ConnectionManager from './connection-manager-worker';

const { ROW_DATA } = DataTypes;

const logger = createLogger('RemoteDataView', logColor.blue);

export const AvailableProxies = {
  Viewserver: 'viewserver',
  Vuu: 'vuu'
}

const NullServer = {
  handleMessageFromClient: message => console.log(`%cNullServer.handleMessageFromClient ${JSON.stringify(message)}`, 'color:red')
}

const defaultRange = { lo: 0, hi: 0 };

/*-----------------------------------------------------------------
 A RemoteDataView manages a single subscription via the ServerProxy
  ----------------------------------------------------------------*/
export default class RemoteDataSource extends EventEmitter {

  constructor({
    bufferSize = 100,
    columns,
    filter,
    group,
    sort,
    tableName,
    serverName = AvailableProxies.Viewserver,
    serverUrl,
    viewport,
    "visual-link": visualLink
  }) {
    super();
    this.bufferSize = bufferSize;
    this.url = serverUrl;
    this.serverName = serverName;
    this.tableName = tableName;
    this.server = NullServer;
    this.columns = columns;
    this.subscription = null;
    this.viewport = viewport;
    this.visualLink = visualLink;
    this.filterDataCallback = null;
    this.filterDataMessage = null;
    this.status = 'initialising'
    this.remoteId = null;
    this.suspended = false;

    this.initialGroup = group;
    this.initialSort = sort;
    this.initialFilter = filter;

    if (!serverUrl) {
      throw Error('RemoteDataSource expects serverUrl')
    }

    this.server = null;
    this.pendingServer = ConnectionManager.connect(this.url, this.serverName);
  }

  async subscribe({
    viewport = this.viewport ?? uuid(),
    tableName = this.tableName,
    columns = this.columns || [],
    range = defaultRange,
    sort = this.initialSort,
    groupBy = this.initialGroup,
    filter = this.initialFilter,
  }, callback) {

    if (!tableName) throw Error("RemoteDataSource subscribe called without table name");

    this.clientCallback = callback;

    if (this.status === 'subscribed') {
      //TODO check if subscription details are still the same
      console.log(`RemoteDataSource.subscribe - already subscribed, early return `)
      return;
    }

    this.viewport = viewport;
    this.tableName = tableName;
    this.columns = columns;

    this.server = await this.pendingServer;

    const { bufferSize } = this;
    this.server.subscribe({
      viewport,
      tablename: tableName,
      columns,
      range,
      sort,
      groupBy,
      filter,
      bufferSize,
      visualLink: this.visualLink
    }, this.handleMessageFromServer);
  }

  handleMessageFromServer = (message) => {
    if (message.dataType === DataTypes.FILTER_DATA) {
      this.filterDataCallback(message);
    } else if (message.type === "subscribed") {
      this.status = 'subscribed';
      this.serverViewportId = message.serverViewportId;
      this.emit("subscribed", message);
      const { viewportId, ...rest } = message
      this.clientCallback(rest);
    } else {
      this.clientCallback(message);
    }
  }

  unsubscribe() {
    if (this.suspended) {
      logger.log(`unsubscribe whilst suspended, ignore - ${this?.tableName ?? 'no table'} (viewport ${this?.viewport})`);
    } else {
      logger.log(`unsubscribe from ${this?.tableName ?? 'no table'} (viewport ${this?.viewport})`);
      this.server?.unsubscribe(this.viewport);
      this.server?.destroy();

    }
  }

  disable() {
    this.suspended = true;
    this.server.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.disable,
    });
    return this;
  }

  enable() {
    if (this.suspended) {
      // should we await this ?s
      this.server.handleMessageFromClient({
        viewport: this.viewport,
        type: Msg.enable,
      });
      this.suspended = false;

    }
    return this;
  }

  setColumns(columns) {
    this.columns = columns;
    return this;
  }

  setSubscribedColumns(columns) {
    if (columns.length !== this.columns.length || !columns.every(columnName => this.columns.includes(columnName))) {
      this.columns = columns;
      // ???
    }
  }


  setRange(lo, hi, dataType = ROW_DATA) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.setViewRange,
      range: { lo, hi},
      dataType
    });
  }

  select(row, rangeSelect, keepExistingSelection, dataType = ROW_DATA) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.select,
      row,
      rangeSelect,
      keepExistingSelection,
      dataType
    });
  }

  selectAll(dataType = ROW_DATA) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.selectAll,
      dataType
    });
  }

  selectNone(dataType = ROW_DATA) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.selectNone,
      dataType
    });

  }

  filter(filter, dataType = ROW_DATA, incremental = false) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.filter,
      filter,
      incremental,
      dataType,
    })
  }

  filterQuery(filter) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.filterQuery,
      filter,
    })
  }

  openTreeNode(key) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.openTreeNode,
      key
    });

  }

  closeTreeNode(key) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.closeTreeNode,
      key
    });
  }

  group(columns) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.groupBy,
      groupBy: columns
    });
  }

  setGroupState(groupState) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.setGroupState,
      groupState
    });
  }

  sort(columns) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.sort,
      sortCriteria: columns
    });
  }

  getFilterData(column, searchText) {
    console.log(`[RemoteDataView] getFilterData`)
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.getFilterData,
      column,
      searchText
    });
  }

  createLink({ parentVpId, link: { fromColumn, toColumn, toTable } }) {
    this.server?.handleMessageFromClient({
      viewport: this.viewport,
      type: Msg.createLink,
      parentVpId: parentVpId,
      childVpId: this.serverViewportId,
      parentColumnName: toColumn,
      childColumnName: fromColumn
    });

  }

  subscribeToFilterData(column, range, callback) {
    logger.log(`<subscribeToFilterData> ${column.name}`)
    this.filterDataCallback = callback;
    this.getFilterData(column, range);

    // this.setFilterRange(range.lo, range.hi);
    // if (this.filterDataMessage) {
    //   callback(this.filterDataMessage);
    //   // do we need to nullify now ?
    // }

  }

  unsubscribeFromFilterData() {
    logger.log(`<unsubscribeFromFilterData>`)
    this.filterDataCallback = null;
  }

  // // To support multiple open filters, we need a column here
  // setFilterRange(lo, hi) {
  //   console.log(`setFilerRange ${lo}:${hi}`)
  //   this.server.handleMessageFromClient({
  //     viewport: this.viewport,
  //     type: Msg.setViewRange,
  //     dataType: DataTypes.FILTER_DATA,
  //     range: { lo, hi }
  //   })

  // }

}

