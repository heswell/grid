
import { Grid } from "@vuu-ui/datagrid";
import {QueryFilter} from "@vuu-ui/filter";
import {pricesSchema} from "../table-schemas";

const PricesGrid = ({onFilterChange,onClearFilters, query,  ...props}) => {

  return (
    <>
      <QueryFilter onChange={q => onFilterChange('prices', q)}/>
      <Grid {...props} columns={pricesSchema.columns} renderBufferSize={20}/>
      </>
  );

}

export default PricesGrid;
