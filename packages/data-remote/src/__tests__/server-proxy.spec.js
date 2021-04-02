import { ServerProxy } from '../servers/vuu/new-server-proxy';
import {createTableRows} from "./test-utils";

describe('ServerProxy', () => {

  describe("subscription", () => {
    it('creates Viewport on client subscribe', () => {
      const serverProxy = new ServerProxy();
      serverProxy.subscribe({ viewport: "client-vp-1", tablename: "test-table", range: { lo: 0, hi: 10 } });
      expect(serverProxy.viewports.size).toEqual(1);
      const { clientViewportId, status } = serverProxy.viewports.get("client-vp-1");
      expect(clientViewportId).toEqual("client-vp-1");
      expect(status).toEqual("");
    })

    it('initialises Viewport when server ACKS subscription', () => {
      const serverProxy = new ServerProxy();
      serverProxy.subscribe({ viewport: "client-vp-1", tablename: "test-table", range: { lo: 0, hi: 10 } });
      serverProxy.handleMessageFromServer({
        requestId: "client-vp-1", body: {
          type: "CREATE_VP_SUCCESS",
          viewPortId: "server-vp-1",
          columns: ["col-1", "col-2", "col-3", "col-4"],
          range: { from: 0, to: 10 },
          sort: { sortDefs: [] },
          groupBy: [],
          filterSpec: { filter: "" }
        }
      })
      expect(serverProxy.viewports.size).toEqual(1);
      expect(serverProxy.mapClientToServerViewport.get("client-vp-1")).toEqual("server-vp-1");
      const { clientViewportId, serverViewportId, status } = serverProxy.viewports.get("server-vp-1");
      expect(clientViewportId).toEqual("client-vp-1");
      expect(serverViewportId).toEqual("server-vp-1");
      expect(status).toEqual("subscribed");
    })

  })

  describe('Data Handling', () => {
    const clientSubscription1 = { viewport: "client-vp-1", tablename: "test-table", range: { lo: 0, hi: 10 } };
    const serverSubscriptionAck1 = {
      requestId: "client-vp-1", body: {
        type: "CREATE_VP_SUCCESS",
        viewPortId: "server-vp-1",
        columns: ["col-1", "col-2", "col-3", "col-4"],
        range: { from: 0, to: 10 },
        sort: { sortDefs: [] },
        groupBy: [],
        filterSpec: { filter: "" }
      }
    }

    it('sends data to client when initial full dataset is received', () => {
      const callback = jest.fn();
      const serverProxy = new ServerProxy(null, callback);
      serverProxy.subscribe(clientSubscription1);
      serverProxy.handleMessageFromServer(serverSubscriptionAck1);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            { viewPortId: "server-vp-1", vpSize: 100, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE" },
            ...createTableRows("server-vp-1", 0, 10)
          ]
        }
      })

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
        "client-vp-1": [
          [0, 0, true, null, null, 1, "key-00", 0, "key-00", "name 00", 1000, true],
          [1, 1, true, null, null, 1, "key-01", 0, "key-01", "name 01", 1001, true],
          [2, 2, true, null, null, 1, "key-02", 0, "key-02", "name 02", 1002, true],
          [3, 3, true, null, null, 1, "key-03", 0, "key-03", "name 03", 1003, true],
          [4, 4, true, null, null, 1, "key-04", 0, "key-04", "name 04", 1004, true],
          [5, 5, true, null, null, 1, "key-05", 0, "key-05", "name 05", 1005, true],
          [6, 6, true, null, null, 1, "key-06", 0, "key-06", "name 06", 1006, true],
          [7, 7, true, null, null, 1, "key-07", 0, "key-07", "name 07", 1007, true],
          [8, 8, true, null, null, 1, "key-08", 0, "key-08", "name 08", 1008, true],
          [9, 9, true, null, null, 1, "key-09", 0, "key-09", "name 09", 1009, true],
        ]
      }});
    });

    it('only sends data to client when initial full dataset is received', () => {
      const callback = jest.fn();
      const serverProxy = new ServerProxy(null, callback);
      serverProxy.subscribe(clientSubscription1);
      serverProxy.handleMessageFromServer(serverSubscriptionAck1);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            { viewPortId: "server-vp-1", vpSize: 100, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE" },
            ...createTableRows("server-vp-1", 0, 5)
          ]
        }
      })

      expect(callback).toHaveBeenCalledTimes(0);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: createTableRows("server-vp-1", 5, 10)
        }
      })


      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": [
          [0, 0, true, null, null, 1, "key-00", 0, "key-00", "name 00", 1000, true],
          [1, 1, true, null, null, 1, "key-01", 0, "key-01", "name 01", 1001, true],
          [2, 2, true, null, null, 1, "key-02", 0, "key-02", "name 02", 1002, true],
          [3, 3, true, null, null, 1, "key-03", 0, "key-03", "name 03", 1003, true],
          [4, 4, true, null, null, 1, "key-04", 0, "key-04", "name 04", 1004, true],
          [5, 5, true, null, null, 1, "key-05", 0, "key-05", "name 05", 1005, true],
          [6, 6, true, null, null, 1, "key-06", 0, "key-06", "name 06", 1006, true],
          [7, 7, true, null, null, 1, "key-07", 0, "key-07", "name 07", 1007, true],
          [8, 8, true, null, null, 1, "key-08", 0, "key-08", "name 08", 1008, true],
          [9, 9, true, null, null, 1, "key-09", 0, "key-09", "name 09", 1009, true],
        ]
      }});
    });

  });

  describe("Scrolling, no buffer", () => {
    const clientSubscription1 = { viewport: "client-vp-1", tablename: "test-table", range: { lo: 0, hi: 10 } };
    const serverSubscriptionAck1 = {
      requestId: "client-vp-1", body: {
        type: "CREATE_VP_SUCCESS",
        viewPortId: "server-vp-1",
        columns: ["col-1", "col-2", "col-3", "col-4"],
        range: { from: 0, to: 10 },
        sort: { sortDefs: [] },
        groupBy: [],
        filterSpec: { filter: "" }
      }
    }

    it("scrolls forward, partial viewport", () => {
      const callback = jest.fn();
      const serverProxy = new ServerProxy(null, callback);
      serverProxy.subscribe(clientSubscription1);
      serverProxy.handleMessageFromServer(serverSubscriptionAck1);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            { viewPortId: "server-vp-1", vpSize: 100, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE" },
            ...createTableRows("server-vp-1", 0, 10)
          ]
        }
      })

      callback.mockClear();

      serverProxy.handleMessageFromClient({type: "setViewRange", range: {lo: 2, hi: 12}});
      serverProxy.handleMessageFromServer({body: { type: "CHANGE_VP_RANGE_SUCCESS",viewPortId: "server-vp-1", from: 2, to: 12 }});

      expect(callback).toHaveBeenCalledTimes(0);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: createTableRows("server-vp-1", 10, 12)
        }
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": [
          [2, 2, true, null, null, 1, "key-02", 0, "key-02", "name 02", 1002, true],
          [3, 3, true, null, null, 1, "key-03", 0, "key-03", "name 03", 1003, true],
          [4, 4, true, null, null, 1, "key-04", 0, "key-04", "name 04", 1004, true],
          [5, 5, true, null, null, 1, "key-05", 0, "key-05", "name 05", 1005, true],
          [6, 6, true, null, null, 1, "key-06", 0, "key-06", "name 06", 1006, true],
          [7, 7, true, null, null, 1, "key-07", 0, "key-07", "name 07", 1007, true],
          [8, 8, true, null, null, 1, "key-08", 0, "key-08", "name 08", 1008, true],
          [9, 9, true, null, null, 1, "key-09", 0, "key-09", "name 09", 1009, true],
          [10, 1, true, null, null, 1, "key-10", 0, "key-10", "name 10", 1010, true],
          [11, 0, true, null, null, 1, "key-11", 0, "key-11", "name 11", 1011, true],
        ]
      }});
    })

    it("scrolls forward, discrete viewport", () => {
      const callback = jest.fn();
      const serverProxy = new ServerProxy(null, callback);
      serverProxy.subscribe(clientSubscription1);
      serverProxy.handleMessageFromServer(serverSubscriptionAck1);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            { viewPortId: "server-vp-1", vpSize: 100, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE" },
            ...createTableRows("server-vp-1", 0, 10)
          ]
        }
      })

      callback.mockClear();

      serverProxy.handleMessageFromClient({type: "setViewRange", range: {lo: 20, hi: 30}});
      serverProxy.handleMessageFromServer({body: { type: "CHANGE_VP_RANGE_SUCCESS",viewPortId: "server-vp-1", from: 20, to: 30 }});

      expect(callback).toHaveBeenCalledTimes(0);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: createTableRows("server-vp-1", 20, 30)
        }
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": [
          [20, 9, true, null, null, 1, "key-20", 0, "key-20", "name 20", 1020, true],
          [21, 8, true, null, null, 1, "key-21", 0, "key-21", "name 21", 1021, true],
          [22, 7, true, null, null, 1, "key-22", 0, "key-22", "name 22", 1022, true],
          [23, 6, true, null, null, 1, "key-23", 0, "key-23", "name 23", 1023, true],
          [24, 5, true, null, null, 1, "key-24", 0, "key-24", "name 24", 1024, true],
          [25, 4, true, null, null, 1, "key-25", 0, "key-25", "name 25", 1025, true],
          [26, 3, true, null, null, 1, "key-26", 0, "key-26", "name 26", 1026, true],
          [27, 2, true, null, null, 1, "key-27", 0, "key-27", "name 27", 1027, true],
          [28, 1, true, null, null, 1, "key-28", 0, "key-28", "name 28", 1028, true],
          [29, 0, true, null, null, 1, "key-29", 0, "key-29", "name 29", 1029, true],
        ]
      }});
    })
  })


})

