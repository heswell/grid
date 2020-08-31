
import { 
  BinnedDataSource,
  FilterDataSource
} from '@heswell/data-source';

import { NOT_IN } from '@heswell/utils';
import { FilterType } from '../filters';

const ZeroRowFilter = {
  colName: 'count',
  type: NOT_IN,
  values: [0]
}

const dataSourceFactory = (dataSource, filterType, column, statsHandler) => {
  let filterView;
  switch (filterType){
    case FilterType.Set:
      filterView = new FilterDataSource(dataSource, column, {filter: ZeroRowFilter});
      break;
    case FilterType.Number:
      filterView = new BinnedDataSource(dataSource, column);
      break;
    default: return null;
  }
  filterView.on('data-count', statsHandler);
  return filterView;
}

export default dataSourceFactory;