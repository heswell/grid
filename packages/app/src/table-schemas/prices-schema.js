export const pricesSchema = {
  columns: [
    { name: 'ric', width: 80 },
    {
      name: 'bid',
      width: 60,
      type: {
        name: 'number',
        renderer: { name: 'background', flashStyle: 'arrow-bg' },
        format: { decimals: 2, zeroPad: true }
      },
      aggregate: 'avg'
    },
    {
      name: 'ask',
      width: 60,
      type: {
        name: 'number',
        renderer: { name: 'background', flashStyle: 'arrow-bg' },
        format: { decimals: 2, zeroPad: true }
      },
      aggregate: 'avg'
    },
    {
      name: 'last',
      width: 60,
      type: {
         name: 'number'
      }
    },
    {
      name: 'open',
      width: 60,
      type: {
        name: 'number'
      }
    },
    {
      name: 'close',
      width: 60,
      type: {
        name: 'number'
      }
    },
    { name: 'scenario' }
  ]
};
