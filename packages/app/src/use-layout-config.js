import {useCallback, useEffect, useState} from "react";

// import staticLayout from "./layout1";

const useLayoutConfig = (url, defaultLayout) => {

  const [layout, _setLayout] = useState(undefined);

  const setLayout = layout => {
    console.log('set LAyout')
    _setLayout(layout)
  }



  useEffect(() => {

    const load = async() => {
      fetch(`${url}/latest`, {
      })
        .then(response => {
          return response.ok
            ? response.json()
            : defaultLayout
        })
        .then(setLayout)
    }

    load();


  },[defaultLayout, url])


  const saveData = useCallback((data) => {

    // console.log(JSON.stringify(data,null,2))

    fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        return response.ok
          ? response.json()
          : defaultLayout
      })
      .then(data => console.log(data))

  },[url])

  return [layout, saveData]

}

export default useLayoutConfig;
