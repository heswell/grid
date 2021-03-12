import * as Message from './messages';
import { ServerApiMessageTypes as API } from '../../messages.js';

function partition(array, test, pass = [], fail = []) {

  for (let i = 0, len = array.length; i < len; i++) {
    (test(array[i], i) ? pass : fail).push(array[i]);
  }

  return [pass, fail];
}

const SORT = { asc: 'D', dsc: 'A' };

const byRowIndex = (row1, row2) => row1[0] - row2[0];

let _requestId = 1;


const logger = console;

export class ServerProxy {

  constructor(connection, callback) {
    this.connection = connection;
    this.postMessageToClient = callback;
    this.queuedRequests = [];
    this.viewportStatus = {};

    this.queuedRequests = [];
    this.loginToken = "";
    this.sessionId = "";
    this.pendingLogin = null;
    this.pendingAuthentication = null;

  }

  handleMessageFromClient(message) {

    const viewport = this.viewportStatus[message.viewport];
    if (!viewport) {
      switch (message.type) {
        case "GET_TABLE_LIST":
          this.sendMessageToServer({ type: "GET_TABLE_LIST" }, message.requestId)
          break;
        case "GET_TABLE_META":
          this.sendMessageToServer({ type: "GET_TABLE_META", table: message.table }, message.requestId)
          break;
        default:
      }
      return;
    }
    const isReady = viewport.status === 'subscribed';

    switch (message.type) {
      case 'setViewRange':
        this.sendIfReady({
          type: Message.CHANGE_VP_RANGE,
          viewPortId: viewport.serverViewportId,
          from: message.range.lo,
          to: message.range.hi
        },
          _requestId++,
          isReady)
        break;
      case 'groupBy':
        if (viewport.groupByStatus !== 'complete') {
          viewport.groupByStatus = 'pending';
        }
        this.sendIfReady({
          type: Message.CHANGE_VP,
          viewPortId: viewport.serverViewportId,
          columns: viewport.columns,
          sort: {
            sortDefs: []
          },
          groupBy: message.groupBy.map(([columnName]) => columnName),
          filterSpec: null
        },
          _requestId++,
          isReady)
        break;

      case 'openTreeNode':
        this.sendIfReady({
          type: Message.OPEN_TREE_NODE,
          vpId: viewport.serverViewportId,
          treeKey: message.key
        },
          _requestId++,
          isReady)
        break;

      case 'closeTreeNode':
        this.sendIfReady({
          type: Message.CLOSE_TREE_NODE,
          vpId: viewport.serverViewportId,
          treeKey: message.key
        },
          _requestId++,
          isReady)

        break;
      case 'sort':
        this.sendIfReady({
          type: Message.CHANGE_VP,
          viewPortId: viewport.serverViewportId,
          columns: viewport.columns,
          sort: {
            sortDefs: message.sortCriteria.map(([column, dir = 'asc']) => ({ column, sortType: SORT[dir] }))
          },
          groupBy: [],
          filterSpec: null
        },
          _requestId++,
          isReady)
        break;

      case 'filterQuery':
        this.sendIfReady({
          type: Message.CHANGE_VP,
          viewPortId: viewport.serverViewportId,
          columns: viewport.columns,
          sort: null, // need to preserve
          groupBy: [],
          filterSpec: { filter: message.filter }
        },
          _requestId++,
          isReady)
        break;

      case 'select':
        this.sendIfReady({
          type: Message.SET_SELECTION,
          vpId: viewport.serverViewportId,
          selection: [message.idx]
        },
          _requestId++,
          isReady)

        break;

      case "createLink": {
        const { parentVpId, childVpId, parentColumnName, childColumnName } = message;
        this.sendIfReady({
          type: Message.CREATE_VISUAL_LINK,
          parentVpId,
          childVpId,
          parentColumnName,
          childColumnName
        },
          _requestId++,
          isReady)
      }
        break;

      default:
        console.log(`Vuu ServerProxy Unexpected message from client ${JSON.stringify(message)}`)

    }

  }

  sendMessageToServer(body, requestId = _requestId++) {
    // const { clientId } = this.connection;
    this.connection.send({
      requestId,
      sessionId: this.sessionId,
      token: this.loginToken,
      user: "user",
      module: "CORE",
      body
    });
  }

  sendIfReady(message, requestId, isReady = true) {
    // TODO implement the message queuing in remote data view
    if (isReady) {
      this.sendMessageToServer(message, requestId);
    } else {
      // TODO need to make sure we keep the requestId
      this.queuedRequests.push(message);
    }

    return isReady;

  }

  disconnected() {
    logger.log(`disconnected`);
    for (let [viewport, { postMessageToClient }] of Object.entries(this.viewportStatus)) {
      postMessageToClient({
        rows: [],
        size: 0,
        range: { lo: 0, hi: 0 }
      })
    }
  }

  resubscribeAll() {
    logger.log(`resubscribe all`)
    // for (let [viewport, {request}] of Object.entries(this.viewportStatus)) {
    //     this.sendMessageToServer({
    //         type: API.addSubscription,
    //         ...request
    //     });
    // }
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: Message.AUTH, username, password }, "");
      this.pendingAuthentication = { resolve, reject }
    })
  }

  authenticated(token) {
    this.loginToken = token;
    this.pendingAuthentication.resolve(token);
  }

  async login() {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: Message.LOGIN, token: this.loginToken, user: "user" }, "");
      this.pendingLogin = { resolve, reject }
    })
  }

  loggedIn(sessionId) {
    this.sessionId = sessionId;
    this.pendingLogin.resolve(sessionId);
  }

  subscribe(message, callback) {
    // the session should live at the connection level
    const isReady = this.sessionId !== "";
    const { viewport, tablename, columns, range: { lo, hi } } = message;
    this.viewportStatus[viewport] = {
      clientViewportId: viewport,
      status: 'subscribing',
      request: message,
    }

    // use client side viewport as request id, so that when we process the response,
    // with the serverside viewport we can establish a mapping between the two
    this.sendIfReady({
      type: Message.CREATE_VP,
      table: tablename,
      range: {
        from: lo,
        to: hi
      },
      columns,
      sort: {
        sortDefs: []
      },
      groupBy: [],
      filterSpec: {
        filter: ""
      }
    }, viewport, isReady)

  }

  subscribed(/* server message */ clientViewportId, message) {
    const viewport = this.viewportStatus[clientViewportId];
    const { viewPortId: serverViewportId, columns } = message;

    if (viewport) {
      // key the viewport on server viewport ID as well as client id
      this.viewportStatus[serverViewportId] = viewport;

      viewport.status = 'subscribed';
      viewport.serverViewportId = serverViewportId;
      viewport.columns = columns;

      const { table, range, sort, groupBy, filterSpec } = message;
      viewport.spec = {
        table, range, columns, sort, groupBy, filterSpec
      };

      // TODO don't think we need to support queued requests any more ? We block
      // now until connection is established
      const byViewport = vp => item => item.viewport === vp;
      const byMessageType = msg => msg.type === Message.CHANGE_VP;
      const [messagesForThisViewport, messagesForOtherViewports] = partition(this.queuedRequests, byViewport(viewport));
      const [rangeMessages, otherMessages] = partition(messagesForThisViewport, byMessageType);

      this.queuedRequests = messagesForOtherViewports;
      rangeMessages.forEach(msg => {
        range = msg.range;
      });

      if (otherMessages.length) {
        console.log(`we have ${otherMessages.length} messages still to process`);
      }

      this.postMessageToClient({ type: "subscribed", clientViewportId, serverViewportId, columns });

      this.sendMessageToServer({ type: "GET_VP_VISUAL_LINKS", vpId: serverViewportId })
    }
  }

  unsubscribe(clientViewportId) {
    const viewport = this.viewportStatus[clientViewportId];
    console.log(`%cserver-proxy<VUU> unsubscribe`, 'color: blue;font-weight:bold;')
    if (viewport) {
      this.sendMessageToServer({ type: "REMOVE_VP", viewPortId: viewport.serverViewportId })
    } else {
      console.error(`unable to unsubscribe from ${clientViewportId}, viewport not found`);
    }

  }

  destroy() {
    console.log(`%cserver-proxy<VUU> destroy`, 'color: blue;font-weight:bold;')
  }

  batchByViewport(rows) {
    const viewports = {};
    for (let i = 0; i < rows.length; i++) {
      const { viewPortId, vpSize, rowIndex, rowKey, sel: isSelected, updateType, ts, data } = rows[i];
      //TODO it is probably more efficient to do the groupBy checks at next level
      const viewport = this.viewportStatus[viewPortId];
      if (viewport) {
        let { groupByStatus } = viewport;

        if (groupByStatus === 'pending' && !rowKey.startsWith('$root')) {
          console.log(`ignoring ${updateType} message whilst waiting for grouped rows`);
        } else if (groupByStatus === 'pending' && rowKey.startsWith('$root')) {
          groupByStatus = this.viewportStatus[viewPortId].groupByStatus = 'complete';
          console.log(`groupBy in place, $root received`)
        }

        if (updateType === Message.UPDATE) {
          const record = (viewports[viewPortId] || (viewports[viewPortId] = {
            viewPortId,
            // VUU sends the root row, which we discard
            size: vpSize,
            rows: []
          }));
          if (groupByStatus === 'complete') {
            let [depth, isExpanded, path, isLeaf, label, count, ...rest] = data;
            record.rows.push([rowIndex, 0, isLeaf, isExpanded, depth, count, rowKey, isSelected].concat(rest));
          } else {
            record.rows.push([rowIndex, 0, true, null, null, 1, rowKey, isSelected].concat(data));
            // We get a SIZE record when vp size changes but not in every batch - not if the size hasn't changed. Hence
            // we take the size from TABLE. However, if size does change, it might do so part way through a batch.
            if (vpSize > record.size) {
              record.size = vpSize;
            }
          }
        } else if (updateType === Message.SIZE) {
          viewports[viewPortId] = {
            viewPortId,
            size: vpSize,
            rows: []
          };
        }

      } else {
        // If we are missing the viewport, bail now
        break;
      }
    }
    return Object.values(viewports);
  }

  handleMessageFromServer(message) {
    if (!message.body) {
      console.error('invalid message', message)
      return;
    } else if (message.body.type === Message.HB) {
      this.sendMessageToServer({ type: Message.HB_RESP, ts: +(new Date()) }, "NA");
      return;
    }

    const { requestId, sessionId, token, body } = message;

    switch (body.type) {
      case Message.AUTH_SUCCESS:
        return this.authenticated(token);
      case Message.LOGIN_SUCCESS:
        return this.loggedIn(sessionId);
      case Message.CREATE_VP_SUCCESS:
        return this.subscribed(requestId, body);
      case Message.CHANGE_VP_RANGE_SUCCESS:
        break;
      case Message.CHANGE_VP_SUCCESS:
        console.log('change VP success')
        break;
      case Message.OPEN_TREE_SUCCESS:
      case Message.CLOSE_TREE_SUCCESS:
        console.log('successful tree operation')
        break;
      case Message.CREATE_VISUAL_LINK_SUCCESS:
      case Message.SET_SELECTION_SUCCESS:
        break;
      case Message.TABLE_ROW: {
        const { batch, isLast, timestamp, rows } = body;
        const rowsByViewport = this.batchByViewport(rows);
        rowsByViewport.forEach(({ viewPortId, size, rows }) => {
          const { clientViewportId } = this.viewportStatus[viewPortId];
          rows.sort(byRowIndex)
          const clientMessage = {
            type: "table-row",
            clientViewportId,
            size,
            offset: 0,
            range: { lo: 0, hi: 27 },
            rows
          }
          this.postMessageToClient(clientMessage);
        })
      }

        break;
      case "REMOVE_VP_SUCCESS": {
        const { clientViewportId } = this.viewportStatus[body.viewPortId];
        delete this.viewportStatus[body.viewPortId];
        delete this.viewportStatus[clientViewportId];
      }
        console.log(`REMOVE_VP_SUCCESS ${JSON.stringify(body)}`)
        break;
      case "TABLE_LIST_RESP":
        this.postMessageToClient({ type: "TABLE_LIST_RESP", tables: body.tables, requestId });
        break;
      case "TABLE_META_RESP":
        this.postMessageToClient({ type: "TABLE_META_RESP", table: body.table, columns: body.columns, requestId });
        break;
      case "VP_VISUAL_LINKS_RESP":
        if (body.links.length) {
          const { clientViewportId } = this.viewportStatus[body.vpId];
          // console.group(`links for (${this.viewportStatus[body.vpId].spec.table})`);
          // body.links.forEach(({parentVpId, link}) => {
          //   console.log(`link parentVpId = ${parentVpId}`);
          //   const vp = this.viewportStatus[parentVpId];
          //   if (vp){
          //     console.log(`   parent table = ${vp.spec.table}`)
          //     console.log(JSON.stringify(link,null,2))
          //   }

          // })
          // console.groupEnd();
          this.postMessageToClient({ type: "VP_VISUAL_LINKS_RESP", links: body.links, clientViewportId });
        }
        break;

      case "ERROR":
        console.error(body.msg)
        break;
      // case Message.FILTER_DATA:
      // case Message.SEARCH_DATA:
      //     const { data: filterData } = message;
      //     // const { rowset: data } = subscription.putData(type, filterData);

      //     // if (data.length || filterData.size === 0) {
      //     this.postMessageToClient({
      //         type,
      //         viewport,
      //         [type]: filterData
      //     });
      //     // }

      //     break;

      default:
        this.postMessageToClient(message.body);

    }

  }

}

