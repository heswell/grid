import { PerspectiveDataSource } from "@heswell/data-source";

export default function getPerspectivesDataSource(dataSourceId){

  let dataSource;

  if (dataSourceId === 'psp-streaming'){

    dataSource = new PerspectiveDataSource({
      configUrl: '/tables/psp-securities-demo/config.js',
    });

  } else if (dataSourceId === 'psp-superstore'){

    dataSource = new PerspectiveDataSource({
      dataUrl: '/tables/psp-superstore/superstore.arrow'
    });

  } else {
    throw Error('getPerspectiveDataSource, unknown dataSourceId ${dataSourceId}');
  }

  return [undefined, dataSource];

}
