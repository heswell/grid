import * as Message from './messages';
import {Viewport} from "./new-viewport";

let _requestId = 1;
export const TEST_setRequestId = id => _requestId = id;

const nextRequestId = () => `${_requestId++}`;
// let updateTime = 0;

export class ServerProxy {

  constructor(connection, callback) {
    this.connection = connection;
    this.postMessageToClient = callback;

    this.viewports = new Map();
    this.mapClientToServerViewport = new Map();
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: Message.AUTH, username, password }, "");
      this.pendingAuthentication = { resolve, reject }
    })
  }

  async login() {
    return new Promise((resolve, reject) => {
      this.sendMessageToServer({ type: Message.LOGIN, token: this.loginToken, user: "user" }, "");
      this.pendingLogin = { resolve, reject }
    })
  }

  subscribe(message) {
    const viewport = new Viewport(message);
    this.viewports.set(message.viewport, viewport);
    // use client side viewport as request id, so that when we process the response,
    // with the serverside viewport we can establish a mapping between the two
    const isReady = this.sessionId !== "";
    this.sendIfReady(viewport.subscribe(), message.viewport, isReady)

  }

  handleMessageFromClient(message) {
    const { type, viewport: clientViewportId } = message;
    const serverViewportId = this.mapClientToServerViewport.get(clientViewportId);
    const viewport = this.viewports.get(serverViewportId);
    if (!viewport) {
      switch (type) {
        case Message.GET_TABLE_LIST:
          this.sendMessageToServer({ type }, message.requestId)
          break;
        case Message.GET_TABLE_META:
          this.sendMessageToServer({ type, table: message.table }, message.requestId)
          break;
        default:
      }
      return;
    }
    const isReady = viewport.status === 'subscribed';

    switch (message.type) {
      case 'setViewRange':
        const requestId = nextRequestId();
        const [serverRequest, rows] = viewport.rangeRequest(requestId, message.range.lo, message.range.hi);
        if (serverRequest){
          this.sendIfReady(serverRequest, requestId, isReady)
        }
        if (rows){
          const clientMessage = {
            type: "viewport-updates", viewports: {
              [viewport.clientViewportId]: {rows}
          }};
          this.postMessageToClient(clientMessage);
        }
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


  handleMessageFromServer(message) {
    const { requestId, body: { type, ...body } } = message;
    const { viewports } = this;
    switch (type) {

      case Message.HB:
        this.sendMessageToServer({ type: Message.HB_RESP, ts: +(new Date()) }, "NA");
        break;

      case Message.AUTH_SUCCESS:
        this.loginToken = message.token;
        this.pendingAuthentication.resolve(message.token);
        break;

      case Message.LOGIN_SUCCESS:
        this.sessionId = message.sessionId;
        this.pendingLogin.resolve(message.sessionId);
        break;

      case Message.CREATE_VP_SUCCESS:
        // The clientViewportId was used as requestId for CREATE_VPmessage
        if (viewports.has(requestId)) {
          const viewport = viewports.get(requestId);
          const { viewPortId: serverViewportId } = body;
          viewports.set(serverViewportId, viewport);
          viewports.delete(requestId);
          this.mapClientToServerViewport.set(requestId, serverViewportId);
          viewport.handleSubscribed(body);
        }
        break;

      case Message.TABLE_ROW:
        for (const row of body.rows) {
          const { viewPortId, rowIndex, updateType } = row;
          viewports.get(viewPortId).handleUpdate(updateType, rowIndex, row);
        }
        this.processUpdates();
        break;

      case Message.CHANGE_VP_RANGE_SUCCESS: {
        const { viewPortId, from, to } = body;
        viewports.get(viewPortId).completeOperation(requestId, from, to)
      }
        break;

      case Message.TABLE_LIST_RESP:
        this.postMessageToClient({ type, tables: body.tables, requestId });
        break;
      case Message.TABLE_META_RESP:
        this.postMessageToClient({ type, table: body.table, columns: body.columns, requestId });
        break;


      default:
        console.log(`handleMessageFromServer,${body.type}.`)
    }
  }


  processUpdates() {
    let clientMessage;
    this.viewports.forEach((viewport) => {
      if (viewport.shouldUpdateClient) {
        clientMessage = clientMessage || { type: "viewport-updates", viewports: {} };
        clientMessage.viewports[viewport.clientViewportId] = {
          rows: viewport.getClientRows(),
          size: viewport.getRowCount()
        }
      };
      if (clientMessage) {
        // const now = performance.now();
        // if (updateTime){
        //   console.log(`time between updates ${now - updateTime}`)
        // }
        // updateTime = now;
        this.postMessageToClient(clientMessage);
      }
    })
  }

}


// const time = ts => {
//   const date = new Date(ts);
//   return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMilliseconds()}`
// }

