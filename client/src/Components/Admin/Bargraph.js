import axios from "axios";
import React, { useEffect, useState } from "react";

import { data } from "autoprefixer";

export default function Bargraph(props) {
  const [sqlD, setsqlD] = useState([]);

  const [barData, setbarData] = useState([]);

  useEffect(() => {
    console.log(props.data);
    setsqlD(props.data);

    fetchBarData();
  }, [props.data]);

  function fetchBarData() {
    if (sqlD == null || sqlD.length == 0) return;
    const tmp = sqlD.map((datapoint) => {
      return { text: datapoint.Collaborator, value: datapoint.Total_Funding };
    });
    console.log(tmp);
    setbarData(tmp);
  }
  // function loadBar() {
  //   try{
  //   setbar();
  //   }catch(err){
  //     console.log(err)
  //   }
  // }
  return (
    <>
      <div style={{ width: "50%" }}></div>
      <BarChart data={barData} />
    </>
  );
}
