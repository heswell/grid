const flasher = {name: 'number', renderer: {name: 'background', flashStyle: 'background'}};

export const config = {
  columns: [
    {name: 'product'},
    {name: 'portfolio'},
    {name: 'book'},
    {name: 'trade'},
    {name: 'dealType'},
    {name: 'bidFlag'},
    {name: 'current', type: flasher, aggregate: 'sum'},
    {name: 'previous', type: flasher, aggregate: 'sum'},
    {name: 'pl1', type: flasher, aggregate: 'sum'},
    {name: 'pl2', type: flasher, aggregate: 'sum'},
    {name: 'gainDx', type: flasher, aggregate: 'sum'},
    {name: 'sxPx', type: flasher, aggregate: 'sum'},
    {name: '_99out', type: flasher, aggregate: 'sum'},
    {name: 'submitterID'},
    {name: 'submitterDealID'},
    {name: 'batch'}
  ],

  dataUrl: '/tables/ag-grid-demo/data-generator.js',
  
  primaryKey: 'trade',

  valueColumns: ['current','previous','pl1','pl2','gainDx','sxPx','_99out']

}
