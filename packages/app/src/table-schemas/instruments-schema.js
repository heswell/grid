export const instrumentsSchema = {
  columns: [
    { name: 'currency', label: 'ccy', width: 60 },
    { name: 'description', width: 120 },
    { name: 'exchange', width: 80 },
    { name: 'lotSize', width: 60, type: {name: 'number'} },
    { name: 'ric', width: 60 },
  ]
};
