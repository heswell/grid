const filledQuantity = {
  name: 'filledQuantity',
  label: 'filled qty',
  width: 80,
  type: {
    name: 'number',
    renderer: { name: 'progress', associatedField: 'quantity' },
    format: { decimals: 0 }
  }
};



export const childOrders = {
  "table": "childOrders",
  "columns": [
    "account",
    "averagePrice",
    "ccy",
    "exchange",
    "filledQty",
    "id",
    "idAsInt",
    "lastUpdate",
    "openQty",
    "parentOrderId",
    "price",
    { "name": "quantity", "width": 80, "type": { "name": "number" } },
    "ric",
    "side",
    "status",
    "strategy",
    "volLimit"
  ]
};

export const instrumentPrices = {
  "table": "instrumentPrices",
  "columns": [
    { "name": "ask", "type": { "name": "number", "renderer": { "name": "background", "flashStyle": "arrow-bg" }, "formatting": { "decimals": 2, "zeroPad": true } }, "aggregate": "avg" },
    { "name": "bid", "type": { "name": "number", "renderer": { "name": "background", "flashStyle": "arrow-bg" }, "formatting": { "decimals": 2, "zeroPad": true } }, "aggregate": "avg" },
    "close", { "name": "currency", "label": "ccy", "width": 60 },
    "description",
    "exchange",
    "last",
    { "name": "lotSize", "width": 80, "type": { "name": "number" } },
    "open",
    "phase",
    "ric",
    "scenario"
  ]
};

export const instruments = {
  "table": "instruments",
  "columns": [
    { "name": "currency", "label": "ccy", "width": 60 },
    "description",
    "exchange", { "name": "lotSize", "width": 80, "type": { "name": "number" } },
    "ric"
  ]
};

export const metricsGroupBy = {
  "table": "metricsGroupBy",
  "columns": ["75Perc", "99Perc", "99_9Perc", "id", "max", "mean", "table"]
};

export const metricsTables = {
  "table": "metricsTables",
  "columns": ["size", "table", "updateCount", "updatesPerSecond"]
};

export const metricsViewports = {
  "table": "metricsViewports",
  "columns": ["75Perc", "99Perc", "99_9Perc", "id", "max", "mean", "table"]
};

export const orderEntry = {
  "table": "orderEntry",
  "columns": ["clOrderId", "orderType", "price", "priceLevel", { "name": "quantity", "width": 80, "type": { "name": "number" } }, "ric"
  ]
};

export const orders = {
  "table": "orders",
  "columns": [
    "ccy",
    "created",
    filledQuantity,
    "lastUpdate",
    "orderId", {
      "name": "quantity",
      "width": 80,
      "type": {
        "name": "number"
      }
    },
    "ric",
    "side",
    "trader"
  ]
};

export const ordersPrices = {
  "table": "ordersPrices",
  "columns": [
    {
      "name": "ask",
      "type": {
        "name": "number",
        "renderer": {
          "name": "background", "flashStyle": "arrow-bg"
        },
        "formatting": {
          "decimals": 2,
          "zeroPad": true
        }
      },
      "aggregate": "avg"
    },
    { "name": "bid", "type": { "name": "number", "renderer": { "name": "background", "flashStyle": "arrow-bg" }, "formatting": { "decimals": 2, "zeroPad": true } }, "aggregate": "avg" }, "ccy", "close", "created",
    filledQuantity,
    "last", "lastUpdate", "open", "orderId", "phase", { "name": "quantity", "width": 80, "type": { "name": "number" } }, "ric", "scenario", "side", "trader"]
};

export const parentOrders = {
  "table": "parentOrders",
  "columns": ["account", "algo", "averagePrice", "ccy", "childCount", "exchange",

    "filledQty",

    "id", "idAsInt", "lastUpdate", "openQty", "price", { "name": "quantity", "width": 80, "type": { "name": "number" } }, "ric", "side", "status", "volLimit"]
};

export const prices = {
  "table": "prices",
  "columns": [{ "name": "ask", "type": { "name": "number", "renderer": { "name": "background", "flashStyle": "arrow-bg" }, "formatting": { "decimals": 2, "zeroPad": true } }, "aggregate": "avg" }, { "name": "bid", "type": { "name": "number", "renderer": { "name": "background", "flashStyle": "arrow-bg" }, "formatting": { "decimals": 2, "zeroPad": true } }, "aggregate": "avg" }, "close", "last", "open", "phase", "ric", "scenario"]
};
