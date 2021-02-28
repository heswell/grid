
import { Grid } from "@vuu-ui/datagrid";
import {View} from "@heswell/layout";

export const pricesSchema = {
  columns: [
    { name: 'ric', width: 100 },
    {
      name: 'bid',
      type: {
        name: 'number',
        renderer: { name: 'background', flashStyle: 'arrow-bg' },
        formatting: { decimals: 2, zeroPad: true }
      },
      aggregate: 'avg'
    },
    {
      name: 'ask',
      type: {
        name: 'number',
        renderer: { name: 'background', flashStyle: 'arrow-bg' },
        formatting: { decimals: 2, zeroPad: true }
      },
      aggregate: 'avg'
    },
    { name: 'last', type: { name: 'number' } },
    { name: 'open', type: { name: 'number' } },
    { name: 'close', type: { name: 'number' } },
    { name: 'scenario' }
  ]
};

const PricesGrid = (props) => {
  return (
      <Grid {...props} columns={pricesSchema.columns} columnSizing="fill" renderBufferSize={20}/>
  );

}

export default PricesGrid;
