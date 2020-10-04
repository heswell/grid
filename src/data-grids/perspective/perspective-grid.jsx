import React, {useEffect, useMemo, useRef} from 'react';
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import DataProvider from './perspective-data-provider';

import Measure, {useMeasure} from '../../components/measure';

import "@finos/perspective-viewer/themes/material-dense.css";
import "./perspective.css";

const PerspectiveViewer = ({dataAdaptor, height, width}) => {

  const {source, location} = dataAdaptor;

  const dataProvider = useMemo(() => {
    const provider = new DataProvider(source, location);
    dataAdaptor.dataProvider = provider;
    return provider;
  }, [dataAdaptor, location, source])


  const viewer = useRef(null);
  useEffect(() => {
    async function setData(){
      viewer.current.load(await dataProvider.fetchData());
    }
    setData();
  },[dataProvider])

  return (
    <perspective-viewer className="perspective-viewer-material" plugin="datagrid" ref={viewer} style={{height,width}}></perspective-viewer>
  )
}


const PerspectiveGrid = (props) => {
  const [{height, width}, setSize] = useMeasure(props);
  if (height === '100%' || width === '100%'){
    return (
      <Measure onMeasure={setSize} height={height} width={width}/>
    )
  } else {
      return (
        <PerspectiveViewer width={width} height={height} {...props}/>
      )
    }
}

export default PerspectiveGrid;