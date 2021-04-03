import { ServerProxy, TEST_setRequestId } from '../servers/vuu/new-server-proxy';
import { createTableRows, createSubscription, updateTableRow } from "./test-utils";

const mockConnection = {
  send: jest.fn()
}

describe('ServerProxy', () => {

  describe("subscription", () => {
    it('creates Viewport on client subscribe', () => {
      const [clientSubscription] = createSubscription();
      const serverProxy = new ServerProxy(mockConnection);
      serverProxy.subscribe(clientSubscription);
      expect(serverProxy.viewports.size).toEqual(1);
      const { clientViewportId, status } = serverProxy.viewports.get("client-vp-1");
      expect(clientViewportId).toEqual("client-vp-1");
      expect(status).toEqual("");
    })

    it('initialises Viewport when server ACKS subscription', () => {
      const [clientSubscription, serverSubscription] = createSubscription();
      const serverProxy = new ServerProxy(mockConnection);
      serverProxy.subscribe(clientSubscription);
      serverProxy.handleMessageFromServer(serverSubscription);
      expect(serverProxy.viewports.size).toEqual(1);
      expect(serverProxy.mapClientToServerViewport.get("client-vp-1")).toEqual("server-vp-1");
      const { clientViewportId, serverViewportId, status } = serverProxy.viewports.get("server-vp-1");
      expect(clientViewportId).toEqual("client-vp-1");
      expect(serverViewportId).toEqual("server-vp-1");
      expect(status).toEqual("subscribed");
    })

  })

  describe('Data Handling', () => {
    const [clientSubscription1, serverSubscriptionAck1] = createSubscription();

    it('sends data to client when initial full dataset is received', () => {
      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
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
          "client-vp-1": {
            size: 100,
            rows: [
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
          }
        }
      });
    });

    it('only sends data to client when initial full dataset is received', () => {
      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
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


      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            size: 100,
          }
        }
      });

      callback.mockClear();

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: createTableRows("server-vp-1", 5, 10)
        }
      })


      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
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
          }
        }
      });
    });

  });

  describe("Scrolling, no buffer", () => {
    const [clientSubscription1, serverSubscriptionAck1] = createSubscription();

    it("scrolls forward, partial viewport", () => {
      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
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
      TEST_setRequestId(1);

      serverProxy.handleMessageFromClient({ viewport: "client-vp-1", type: "setViewRange", range: { lo: 2, hi: 12 } });
      serverProxy.handleMessageFromServer({ requestId: '1', body: { type: "CHANGE_VP_RANGE_SUCCESS", viewPortId: "server-vp-1", from: 2, to: 12 } });

      expect(callback).toHaveBeenCalledTimes(0);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: createTableRows("server-vp-1", 10, 12)
        }
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
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
          }
        }
      });
    })

    it("scrolls forward, discrete viewport", () => {
      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
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
      TEST_setRequestId(1);

      serverProxy.handleMessageFromClient({ viewport: "client-vp-1", type: "setViewRange", range: { lo: 20, hi: 30 } });
      serverProxy.handleMessageFromServer({ requestId: '1', body: { type: "CHANGE_VP_RANGE_SUCCESS", viewPortId: "server-vp-1", from: 20, to: 30 } });

      expect(callback).toHaveBeenCalledTimes(0);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: createTableRows("server-vp-1", 20, 30)
        }
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
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
          }
        }
      });
    })
  });

  describe("Updates", () => {
    const [clientSubscription1, serverSubscriptionAck1] = createSubscription();

    it('Updates, no scrolling', () => {

      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
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

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            updateTableRow("server-vp-1", 3, 2003)
          ]
        }
      })

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
              [0, 0, true, null, null, 1, "key-00", 0, "key-00", "name 00", 1000, true],
              [1, 1, true, null, null, 1, "key-01", 0, "key-01", "name 01", 1001, true],
              [2, 2, true, null, null, 1, "key-02", 0, "key-02", "name 02", 1002, true],
              [3, 3, true, null, null, 1, "key-03", 0, "key-03", "name 03", 2003, true],
              [4, 4, true, null, null, 1, "key-04", 0, "key-04", "name 04", 1004, true],
              [5, 5, true, null, null, 1, "key-05", 0, "key-05", "name 05", 1005, true],
              [6, 6, true, null, null, 1, "key-06", 0, "key-06", "name 06", 1006, true],
              [7, 7, true, null, null, 1, "key-07", 0, "key-07", "name 07", 1007, true],
              [8, 8, true, null, null, 1, "key-08", 0, "key-08", "name 08", 1008, true],
              [9, 9, true, null, null, 1, "key-09", 0, "key-09", "name 09", 1009, true],
            ]
          }
        }
      });

    })

  })

  describe("Buffering data", () => {

    it("buffers 10 rows, server sends entire buffer set", () => {
      const [clientSubscription1, serverSubscriptionAck1] = createSubscription({bufferSize: 10});

      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
      serverProxy.subscribe(clientSubscription1);
      serverProxy.handleMessageFromServer(serverSubscriptionAck1);

      expect(mockConnection.send).toHaveBeenCalledWith({
        requestId: 'client-vp-1',
        user: "user",
        body: {
          type: "CREATE_VP",
          table: "test-table",
          range: {from: 0, to: 20},
          sort: {sortDefs: []},
          filterSpec: {filter: ""}
        },
        module: "CORE"
      })

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            { viewPortId: "server-vp-1", vpSize: 100, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE" },
            ...createTableRows("server-vp-1", 0, 20)
          ]
        }
      })

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
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
            ],
            size: 100
          }
        }
      });
    });

    it("buffers 10 rows, server sends partial buffer set, enough to fulfill client request, followed by rest", () => {
      const [clientSubscription1, serverSubscriptionAck1] = createSubscription({bufferSize: 10});

      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
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
          "client-vp-1": {
            rows: [
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
            ],
            size: 100
          }
        }
      });

      callback.mockClear();

      // This will be a buffer top-up only, so no callback
      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            ...createTableRows("server-vp-1", 10, 20)
          ]
        }
      });

      expect(callback).toHaveBeenCalledTimes(0);


    });

    it("buffers 10 rows, server sends partial buffer set, not enough to fulfill client request, followed by rest", () => {
      const [clientSubscription1, serverSubscriptionAck1] = createSubscription({bufferSize: 10});

      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
      serverProxy.subscribe(clientSubscription1);
      serverProxy.handleMessageFromServer(serverSubscriptionAck1);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            { viewPortId: "server-vp-1", vpSize: 100, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE" },
            ...createTableRows("server-vp-1", 0, 9)
          ]
        }
      })

      // First call will be size only
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            size: 100
          }
        }
      });

      callback.mockClear();

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            ...createTableRows("server-vp-1", 9, 15)
          ]
        }
      });

      expect(callback).toHaveBeenCalledTimes(1);

      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
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
            ],
          }
        }
      });

      callback.mockClear();

      // This will be a buffer top-up only, so no callback
      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            ...createTableRows("server-vp-1", 15, 20)
          ]
        }
      });

      expect(callback).toHaveBeenCalledTimes(0);

    });

    it("returns client range requests from buffer, if available. Calls server when end of buffer is approached", () => {
      const [clientSubscription1, serverSubscriptionAck1] = createSubscription({bufferSize: 10});

      const callback = jest.fn();
      const serverProxy = new ServerProxy(mockConnection, callback);
      serverProxy.subscribe(clientSubscription1);
      serverProxy.handleMessageFromServer(serverSubscriptionAck1);

      serverProxy.handleMessageFromServer({
        body: {
          type: "TABLE_ROW", rows: [
            { viewPortId: "server-vp-1", vpSize: 100, rowIndex: -1, rowKey: "SIZE", updateType: "SIZE" },
            ...createTableRows("server-vp-1", 0, 20)
          ]
        }
      })

      callback.mockClear();
      mockConnection.send.mockClear()

      serverProxy.handleMessageFromClient({ viewport: "client-vp-1", type: "setViewRange", range: { lo: 2, hi: 12 } });

      expect(mockConnection.send).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1)

      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
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
            ],
          }
        }
      });

      callback.mockClear();
      mockConnection.send.mockClear()

      serverProxy.handleMessageFromClient({ viewport: "client-vp-1", type: "setViewRange", range: { lo: 5, hi: 15 } });

      expect(mockConnection.send).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1)

      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
              [5, 5, true, null, null, 1, "key-05", 0, "key-05", "name 05", 1005, true],
              [6, 6, true, null, null, 1, "key-06", 0, "key-06", "name 06", 1006, true],
              [7, 7, true, null, null, 1, "key-07", 0, "key-07", "name 07", 1007, true],
              [8, 8, true, null, null, 1, "key-08", 0, "key-08", "name 08", 1008, true],
              [9, 9, true, null, null, 1, "key-09", 0, "key-09", "name 09", 1009, true],
              [10, 1, true, null, null, 1, "key-10", 0, "key-10", "name 10", 1010, true],
              [11, 0, true, null, null, 1, "key-11", 0, "key-11", "name 11", 1011, true],
              [12, 4, true, null, null, 1, "key-12", 0, "key-12", "name 12", 1012, true],
              [13, 3, true, null, null, 1, "key-13", 0, "key-13", "name 13", 1013, true],
              [14, 2, true, null, null, 1, "key-14", 0, "key-14", "name 14", 1014, true],
            ],
          }
        }
      });

      callback.mockClear();
      mockConnection.send.mockClear()
      TEST_setRequestId(1);

      serverProxy.handleMessageFromClient({ viewport: "client-vp-1", type: "setViewRange", range: { lo: 8, hi: 18 } });

      expect(mockConnection.send).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1)

      expect(callback).toHaveBeenCalledWith({
        type: "viewport-updates", viewports: {
          "client-vp-1": {
            rows: [
              [8, 8, true, null, null, 1, "key-08", 0, "key-08", "name 08", 1008, true],
              [9, 9, true, null, null, 1, "key-09", 0, "key-09", "name 09", 1009, true],
              [10, 1, true, null, null, 1, "key-10", 0, "key-10", "name 10", 1010, true],
              [11, 0, true, null, null, 1, "key-11", 0, "key-11", "name 11", 1011, true],
              [12, 4, true, null, null, 1, "key-12", 0, "key-12", "name 12", 1012, true],
              [13, 3, true, null, null, 1, "key-13", 0, "key-13", "name 13", 1013, true],
              [14, 2, true, null, null, 1, "key-14", 0, "key-14", "name 14", 1014, true],
              [15, 7, true, null, null, 1, "key-15", 0, "key-15", "name 15", 1015, true],
              [16, 6, true, null, null, 1, "key-16", 0, "key-16", "name 16", 1016, true],
              [17, 5, true, null, null, 1, "key-17", 0, "key-17", "name 17", 1017, true],
            ],
          }
        }
      });

      expect(mockConnection.send).toHaveBeenCalledWith({
        requestId: '1',
        user: "user",
        body: {viewPortId: "server-vp-1", type: "CHANGE_VP_RANGE", from: 3, to: 23},
        module: "CORE"
      })


    });


  })

});

