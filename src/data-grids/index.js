import {lazy} from 'react';

export default {
  heswell: lazy(() => import('./heswell/heswell-grid')),
  ag: {
    // Grid: lazyLoad('./ag-grid','Grid'),
    // DataProvider: lazyLoad('./ag-grid','DataProvider')
  },
  perspective: lazy(() => import('./perspective/perspective-grid')),
  regular: lazy(() => import('./regular-table/regular-table-grid')),
  material: {
    // Grid: lazyLoad('./material-ui','Grid'),
    // DataProvider: lazyLoad('./material-ui','DataProvider')
  }

}