import {useCallback, useEffect, useState} from "react";

// import staticLayout from "./layout1";

const useLayoutConfig = (url) => {

  const [layout, setLayout] = useState(undefined);

  useEffect(() => {

    // setLayout(staticLayout);

    const load = async() => {
      fetch(`${url}/latest`, {
      })
        .then(response => {
          return response.ok
            ? response.json()
            : undefined
        })
        .then(setLayout)
    }

    load();


  },[url])


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
          : ""
      })
      .then(data => console.log(data))

  },[url])

  return [layout, saveData]

}

export default useLayoutConfig;
