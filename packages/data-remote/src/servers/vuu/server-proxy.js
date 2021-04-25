import * as Message from './messages';
import Viewport from "./viewport";

const { SIZE, UPDATE } = Message;

const byRowIndex = (row1, row2) => row1[0] - row2[0];

let _requestId = 1;
const nextRequestId = () => `${_requestId++}`;

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

      case 'sort': {
        const requestId = nextRequestId();
        const request = viewport.sortRequest(requestId, message.sortCriteria)
        this.sendIfReady(request, requestId, isReady)
      }
        break

      case 'groupBy': {
        const requestId = nextRequestId();
        const request = viewport.groupByRequest(requestId, message.groupBy)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'filterQuery': {
        const requestId = nextRequestId();
        const request = viewport.filterRequest(requestId, message.filter)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'select': {
        const requestId = nextRequestId();
        const { row, rangeSelect, keepExistingSelection } = message;
        const request = viewport.selectRequest(requestId, row, rangeSelect, keepExistingSelection)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'disable': {
        const requestId = nextRequestId();
        const request = viewport.disable(requestId)
        this.sendIfReady(request, requestId, isReady)
      }
        break;

      case 'enable': {
        const requestId = nextRequestId();
        const request = viewport.enable(requestId)
        this.sendIfReady(request, requestId, isReady)
      }
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

  subscribe(message) {
    // the session should live at the connection level
    const isReady = this.sessionId !== "";
    // TODO we need to explicitly store all the viewport attributes here
    const { viewport, tablename, columns, range: { lo, hi }, sort = [], groupBy = [], filter = "" } = message;




    this.viewportStatus[viewport] = new Viewport(viewport, message);

    // use client side viewport as request id, so that when we process the response,
    // with the serverside viewport we can establish a mapping between the two
    // this.sendIdReady(viewport.subscribe())
    this.sendIfReady({
      type: Message.CREATE_VP,
      table: tablename,
      range: {
        from: lo,
        to: hi
      },
      columns,
      sort: {
        sortDefs: sort
      },
      groupBy,
      filterSpec: {
        filter
      }
    }, viewport, isReady)

  }

  subscribed(/* server message */ clientViewportId, message) {
    const viewport = this.viewportStatus[clientViewportId];
    const { viewPortId: serverViewportId, columns } = message;
    if (viewport) {
      // key the viewport on server viewport ID as well as client id
      this.viewportStatus[serverViewportId] = viewport;
      viewport.subscribe(message);
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

        if (viewport.isTree && updateType === UPDATE && !rowKey.startsWith('$root')) {
          //console.log(`ignoring ${updateType} message whilst waiting for grouped rows`);
        } else {

          if (updateType === UPDATE) {
            const record = (viewports[viewPortId] || (viewports[viewPortId] = {
              viewPortId,
              size: vpSize,
              rows: []
            }));
            if (viewport.isTree) {
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
          } else if (updateType === SIZE) {
            viewports[viewPortId] = {
              viewPortId,
              size: vpSize,
              rows: []
            };
          }

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

    // storeMessage(message);

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
      case Message.DISABLE_VP_SUCCESS:
      case Message.ENABLE_VP_SUCCESS:
      case Message.SET_SELECTION_SUCCESS: {
        const response = this.viewportStatus[body.viewPortId || body.vpId].completeOperation(requestId);
        if (response) {
          this.postMessageToClient(response);
        }
      }
        break;
      case Message.OPEN_TREE_SUCCESS:
      case Message.CLOSE_TREE_SUCCESS:
        console.log('successful tree operation')
        break;
      case Message.CREATE_VISUAL_LINK_SUCCESS:
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
        break;
      case "TABLE_LIST_RESP":
        this.postMessageToClient({ type: "TABLE_LIST_RESP", tables: body.tables, requestId });
        break;
      case "TABLE_META_RESP":
        this.postMessageToClient({ type: "TABLE_META_RESP", table: body.table, columns: body.columns, requestId });
        break;
      case "VP_VISUAL_LINKS_RESP": {
        const links = this.getActiveLinks(body.links);
        if (links.length) {
          console.log(`${links.length} active links identified`)
          const { clientViewportId } = this.viewportStatus[body.vpId];
          // console.log({links: body.links})
          // //-------------------
          // console.group(`links for (${this.viewportStatus[body.vpId].table})`);
          // body.links.forEach(({parentVpId, link}) => {
          //   console.log(`link parentVpId = ${parentVpId}`);
          //   const vp = this.viewportStatus[parentVpId];
          //   if (vp){
          //     console.log(`   parent table = ${vp.table}`)
          //     console.log(JSON.stringify(link,null,2))
          //   }
          // })
          // console.groupEnd();
          //--------------------
          this.postMessageToClient({ type: "VP_VISUAL_LINKS_RESP", links, clientViewportId });
        }
      }
        break;

      case "ERROR":
        console.error(body.msg)
        break;

      default:
        this.postMessageToClient(message.body);

    }

  }

  // Eliminate links to suspended viewports
  getActiveLinks(links) {
    return links.filter(link => {
      const viewport = this.viewportStatus[link.parentVpId];
      return viewport && !viewport.suspended;
    })
  }

}

