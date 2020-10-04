export const dataSources = {
  "psp-superstore": {
    id: "psp-superstore",
    label: "Superstore (Perspective, arrow)",
    type: "psp",
    url: "/tables/psp-superstore/superstore.arrow",
    actions: [
      {label: "GroupBy Region", action: {id: "group", columns: ["region"]}}
    ]
  },
  "superstore-arrow": {
    id: "superstore-arrow",
    label: "Superstore (heswell, arrow)",
    type: "arrow",
    url: "/tables/psp-superstore/superstore.arrow",
    actions: [
      {label: "GroupBy Region", action: {id: "group", columns: ["region"]}}
    ]
  },
  instruments: {
    "id": "instruments",
    "label": "Instruments",
    "type": "json",
    url: "/instruments.js"
  }
}

export default {
  heswell: {
    label: 'Heswell',
    defaultDataSource: { dataSource: 'instruments', dataLocation: 'local' },
    dataSources: {
      "psp-superstore": ['worker', 'remote'],
      "superstore-arrow": ['local', 'worker', 'remote'],
      instruments: ['local', 'worker', 'remote']
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