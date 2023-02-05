import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
export default function Bargraph(props) {
  const [sqlD, setsqlD] = useState([]);

  const [barData, setbarData] = useState([]);
  const [bar, setbar] = useState();

  useEffect(() => {

    handleDataChange();

    fetchBarData();
    loadBar();
  }, [props.data]);

  function handleDataChange() {
    setsqlD(props.data);
  }
  function fetchBarData() {
    if (sqlD == null || sqlD.length == 0) return;
    let yval = [];
    let keys = Object.keys(sqlD[0]);

    sqlD.forEach((datapoint) => {
      yval.push(datapoint.Total_Funding);
    });
    let tmp = {
      options: {
        chart: {
          id: "Top Collaborators",
        },
        xaxis: {
          categories: keys,
        },
      },
      series: [
        {
          name: "Collaborators",
          data: yval,
        },
      ],
    };
    setbarData(tmp);
  }
  const loadBar = () => {
    let ret;
    try {
      if (barData == null || barData.length==0) return;
      fetchBarData()
      console.log("here")
      console.log(barData)
      ret = (
        <Chart options={barData.options} series={barData.series} type="bar" />
      );
    } catch (err) {
      console.log(err);
    }
    setbar(ret);
  };

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
      {bar}
    </>
  );
}
