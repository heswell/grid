//TODO neither this file nor filter-data-view belong here - thye are not specific to remote views

import { createLogger, DataTypes, logColor, EventEmitter} from '@heswell/utils';

const logger = createLogger('BinnedDataSource', logColor.brown);

export default class BinnedDataSource extends EventEmitter {

  constructor(dataView, column) {
    super();
    this.dataView = dataView;
    this.column = column;
    this.dataCountCallback = null;
  }

  subscribe({range}, callback) {
    logger.log(`subscribe`)

    this.dataView.subscribeToFilterData(this.column, range, ({rows, size, range}) => {

      logger.log(`receive rows ${rows.length} of ${size} range ${JSON.stringify(range)}`)

      callback(rows);

    })

  }

  filter(filter){
    this.dataView.filter(filter, DataTypes.ROW_DATA);
  }

  destroy(){
    logger.log(`<destroy>`)
    this.dataView.unsubscribeFromFilterData(this.column);
}

}