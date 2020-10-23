import React, {useEffect, useMemo, useRef} from 'react';
import "regular-table";
import "regular-table/dist/css/material.css";

import Measure, {useMeasure} from '../../components/measure';
import DataProvider from './regular-table-data-provider';

const RegularTable = ({dataAdaptor, height, width}) => {

  const {source, location} = dataAdaptor;

  const dataProvider = useMemo(() => {
    const provider = new DataProvider(source, location);
    dataAdaptor.dataProvider = provider;
    return provider;
  }, [dataAdaptor, location, source])


  const regular = useRef(null);

  useEffect(() => {
    dataProvider.on('ready', () => {
      const {dataModel} = dataProvider;
      regular.current.addStyleListener(dataModel.applyStyle.bind(dataModel));
      regular.current.setDataListener(dataModel.getData.bind(dataModel));
      regular.current.draw();
    })
  },[dataProvider])

  return (
    <regular-table ref={regular} style={{height,width, padding: 0}}></regular-table>
  )
}

const RegularTableGrid = (props) => {
  const [{height, width}, setSize] = useMeasure(props);
  if (height === '100%' || width === '100%'){
    return (
      <Measure onMeasure={setSize} height={height} width={width}/>
    )
  } else {
      return (
        <RegularTable width={width} height={height} {...props}/>
      )
    }
}

export default RegularTableGrid;