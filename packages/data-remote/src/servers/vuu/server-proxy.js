import * as Message from './messages';
import { ServerApiMessageTypes as API } from '../../messages.js';

function partition(array, test, pass = [], fail = []) {

    for (let i = 0, len = array.length; i < len; i++) {
        (test(array[i], i) ? pass : fail).push(array[i]);
    }
  
    return [pass, fail];
  }
  
const SORT = { asc: 'D', dsc : 'A' };

const byRowIndex = (row1, row2) => row1[0] - row2[0];

let _requestId = 1;


const logger = console;

export class ServerProxy {

    constructor(connection) {
        this.connection = connection;
        this.queuedRequests = [];
        this.viewportStatus = {};

        this.queuedRequests = [];
        this.loginToken = "";
        this.sessionId= "";
        this.pendingLogin = null;
        this.pendingAuthentication = null;

    }

    handleMessageFromClient(message) {

        const viewport = this.viewportStatus[message.viewport];
        const isReady = viewport.status === 'subscribed';

        switch (message.type){
            case 'setViewRange':
                this.sendIfReady({
                    type : Message.CHANGE_VP_RANGE,
                    viewPortId : viewport.serverId,
                    from : message.range.lo,
                    to : message.range.hi
                },
                _requestId++,
                isReady)
                break;
            case 'groupBy':
                viewport.groupByStatus = 'pending';
                this.sendIfReady({
                    type : Message.CHANGE_VP,
                    viewPortId : viewport.serverId,
                    columns : [ "ric", "description", "currency", "exchange", "lotSize", "bid", "ask", "last", "open", "close", "scenario" ],
                    sort : {
                        sortDefs: []
                    },
                    groupBy : message.groupBy.map(([columnName]) => columnName),
                    filterSpec : null
                },
                _requestId++,
                isReady)
                break;
                
            case 'sort':
                this.sendIfReady({
                    type : Message.CHANGE_VP,
                    viewPortId : viewport.serverId,
                    columns : [ "ric", "description", "currency", "exchange", "lotSize", "bid", "ask", "last", "open", "close", "scenario" ],
                    sort : {
                        sortDefs: message.sortCriteria.map(([column, dir='asc']) => ({column, sortType: SORT[dir]}))
                    },
                    groupBy : [ ],
                    filterSpec : null
                },
                _requestId++,
                isReady)
                break;

            case 'select':
                this.sendIfReady({
                    type : Message.SET_SELECTION,
                    vpId : viewport.serverId,
                    selection: [message.idx]
                },
                _requestId++,
                isReady)
                
                break;

            case "createLink": {
                const {parentVpId, childVpId, parentColumnName, childColumnName} = message;
                this.sendIfReady({
                    type : Message.CREATE_VISUAL_LINK,
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
                console.log(`send message to server ${JSON.stringify(message)}`)

            }

    }

    sendMessageToServer(body, requestId=_requestId++) {
        // const { clientId } = this.connection;
        this.connection.send({
            requestId,
            sessionId : this.sessionId,
            token : this.loginToken,
            user : "user",
            module : "CORE",
            body
        });
    }

    sendIfReady(message, requestId, isReady=true) {
        // TODO implement the message queuing in remote data view
        if (isReady) {
            this.sendMessageToServer(message, requestId);
        } else {
            // TODO need to make sure we keep the requestId
            this.queuedRequests.push(message);
        }

        return isReady;

    }

    disconnected(){
        logger.log(`disconnected`);
        for (let [viewport, {postMessageToClient}] of Object.entries(this.viewportStatus)) {
            postMessageToClient({
                rows: [],
                size: 0,
                range: {lo:0, hi:0}
            })
        }
    }

    resubscribeAll(){
        logger.log(`resubscribe all`)
        // for (let [viewport, {request}] of Object.entries(this.viewportStatus)) {
        //     this.sendMessageToServer({
        //         type: API.addSubscription,
        //         ...request
        //     });
        // }
    }

    async authenticate(username, password){
        return new Promise((resolve, reject) => {
            this.sendMessageToServer({type : Message.AUTH, username, password}, "");
            this.pendingAuthentication = {resolve, reject}
        })
    }

    authenticated(token){
        this.loginToken = token;
        this.pendingAuthentication.resolve(token);
    }

    async login(){
        return new Promise((resolve, reject) => {
            this.sendMessageToServer({type : Message.LOGIN, token: this.loginToken, user: "user"}, "");
            this.pendingLogin = {resolve, reject}
        })
    }

    loggedIn(sessionId){
        this.sessionId = sessionId;
        this.pendingLogin.resolve(sessionId);
    }

    subscribe(message, callback) {
        // the session should live at the connection level
        const isReady = this.sessionId !== "";
        const {viewport, tablename, columns, range: {lo, hi}} = message;
        this.viewportStatus[viewport] = {
            status: 'subscribing',
            request: message,
            postMessageToClient: callback
        }

        // use client side viewport as request id, so that when we process the response,
        // with the serverside viewport we can establish a mapping between the two
        this.sendIfReady({
            type : Message.CREATE_VP,
            table : tablename,
            range : {
                from : lo,
                to : hi
            },
            columns,
            sort : {
                sortDefs : [ ]
            },
            groupBy : [ ],
            filterSpec : {
                filter : ""
            }
        }, viewport, isReady)
     
    }

    subscribed(/* server message */ clientViewport, message) {
        const viewport = this.viewportStatus[clientViewport];
        const { viewPortId, columns } = message;

        if (viewport) {
            // key the viewport on server viewport ID as well as client id
            this.viewportStatus[viewPortId] = viewport;

            viewport.status = 'subscribed';
            viewport.serverId = viewPortId;

            const {table, range, columns, sort, groupBy, filterSpec} = message;
            viewport.spec = {
                table, range, columns, sort, groupBy, filterSpec
            };

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
            viewport.postMessageToClient({type: "subscribed", viewPortId, columns})
        }
    }

    unsubscribe(){
        console.log(`%cserver-proxy<VUU> unsubscribe`,'color: blue;font-weight:bold;')
    }

    destroy(){
        console.log(`%cserver-proxy<VUU> destroy`,'color: blue;font-weight:bold;')
    }

    batchByViewport(rows){
        const viewports = {};
        for (let i=0; i < rows.length; i++){
            const {viewPortId, vpSize, rowIndex, rowKey, sel: isSelected, updateType, ts, data} = rows[i];
            //TODO it is probably more efficient to do the groupBy checks at next level
            const {groupByStatus} = this.viewportStatus[viewPortId];
            if (groupByStatus === 'pending' && rowKey !== '$root'){
                console.log(`ignoring ${updateType} message whilst waiting for grouped rows`);
            } else if (groupByStatus === 'pending' && rowKey === '$root'){
                this.viewportStatus[viewPortId].groupByStatus = 'complete';
                console.log(`groupBy in place, $root received`)
            } else if (updateType === Message.UPDATE){
                const record = (viewports[viewPortId] || (viewports[viewPortId] = {viewPortId, size: vpSize, rows: []}));
                if (groupByStatus === 'complete'){
                    let [depth, expanded, path, unknown, label, count, ...rest] = data;
                    if (!expanded){
                        depth = -depth;
                    }
                    rest.push(rowIndex-1, 0, depth, count, path, 0)
                    record.rows.push(rest);
                } else {
                    // TODO populate the key field correctly, i.e. don't just assume first field
                    if (isSelected){
                        console.log(`row ${rowIndex} is selected`)
                    }
                    record.rows.push([rowIndex, 0, 0, 0, data[0],isSelected,,,,,].concat(data));
                }
            } else if (updateType === Message.SIZE){
                console.log(`size record ${JSON.stringify(rows[i],null,2)}`)
            }
        }
        return Object.values(viewports);
    }

    handleMessageFromServer(message) {
        if (!message.body){
            console.error('invalid message', message)
            return;
        } else if (message.body.type === Message.HB){
            this.sendMessageToServer({type : Message.HB_RESP, ts : +(new Date())},"NA");
            return;
        }

        const {requestId, sessionId, token, body} = message; 

        switch (body.type) {
            case Message.AUTH_SUCCESS:
                return this.authenticated(token);
            case Message.LOGIN_SUCCESS:
                return this.loggedIn(sessionId);   
            case Message.CREATE_VP_SUCCESS:
                return this.subscribed(requestId, body);
            case Message.CHANGE_VP_RANGE_SUCCESS:
            case Message.CHANGE_VP_SUCCESS:
                break;
            case Message.CREATE_VISUAL_LINK_SUCCESS:
            case Message.SET_SELECTION_SUCCESS:
                console.log(`message received ${body.type}`)
                break;
            case Message.TABLE_ROW: {
                const {batch, isLast, timestamp, rows} = body;
                const rowsByViewport = this.batchByViewport(rows);
                rowsByViewport.forEach(({viewPortId, size, rows}) => {
                    const {postMessageToClient} = this.viewportStatus[viewPortId];
                    rows.sort(byRowIndex)
                    const output = {
                        size,
                        offset: 0,
                        range: {lo: 0, hi: 27},
                        rows
                    }
                    postMessageToClient(output);
                })                
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

