export const dataSources = {
  "psp-superstore": {
    id: "psp-superstore",
    label: "Superstore (Perspective, arrow)",
    type: "psp",
    url: "/tables/psp-superstore/superstore.arrow",
    actions: [
      {label: "SortBy Category", action: {type: "sort", columns: [["Category", "asc"]]}},
      {label: "GroupBy Region", action: {type: "group", columns: [["Region", "asc"]]}},
      {label: "GroupBy Region, State, City", action: {type: "group", columns: [["Region", "asc"],["State", "asc"],["City", "asc"]]}}
    ]
  },
  "superstore-arrow": {
    id: "superstore-arrow",
    label: "Superstore (heswell, arrow)",
    type: "arrow",
    url: "/tables/psp-superstore/superstore.arrow",
    actions: [
      {label: "GroupBy Region", action: {type: "group", columns: [["Region","asc"]]}},
      {label: "GroupBy Region, State, City", action: {type: "group", columns: [["Region", "asc"],["State", "asc"],["City", "asc"]]}}
    ]
  },
  instruments: {
    "id": "instruments",
    "label": "Instruments",
    "type": "json",
    url: "/instruments.js",
    actions: [
      {label: "SortBy Sector", action: {type: "sort", columns: [["Sector", "asc"]]}},
      {label: "SortBy Sector, Price", action: {type: "sort", columns: [["Sector", "asc"],["Price", "asc"]]}},
      {label: "GroupBy Sector", action: {type: "group", columns: [["Sector", "asc"]]}},
      {label: "GroupBy Sector, Industry", action: {type: "group", columns: [["Sector", "asc"], ["Industry", "asc"]]}},
      {label: "GroupBy Sector, Industry, IPO", action: {type: "group", columns: [["Sector", "asc"], ["Industry", "asc"], ["IPO", "asc"]]}}
    ]
  },
  prices: {
    "id": "prices",
    "label": "Prices (ticking)",
    "type": "json",
    url: '/tables/ag-grid-demo/config.js',
    actions: [
      {label: "GroupBy Product, Portfolio, Book", action: {type: "group", columns: [["product", "asc"], ["portfolio", "asc"], ["book", "asc"]]}}
    ]
  },
  "many-columns": {
    "id": "many-columns",
    "label": "Many Columns",
    "type": "json",
    url: '/tables/many-columns/config.js',
    actions: [
    ]
  }
}

export default {
  heswell: {
    label: 'Heswell',
    defaultDataSource: { dataSource: 'instruments', dataLocation: 'local' },
    dataSources: {
      "psp-superstore": ['worker', 'remote'],
      "superstore-arrow": ['local', 'worker', 'remote'],
      instruments: ['local', 'worker', 'remote'],
      prices: ['worker'],
      "many-columns": ['local', 'worker', 'remote'],
    }
  },
  regular: {
    label: 'Regular Table',
    defaultDataSource: { dataSource: 'psp-superstore', dataLocation: 'worker' },
    dataSources: {
      "psp-superstore": ['worker', 'remote'],
    }
  },
  perspective: {
    label: 'Perspective',
    defaultDataSource: { dataSource: 'psp-superstore', dataLocation: 'worker' },
    dataSources: {
      "psp-superstore": ['worker', 'remote'],
    }
  },
  ag: {
    label: 'AG Grid',

  },
  material: {
    label: 'Material UI',

  }

}