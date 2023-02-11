import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
export default function Bargraph(props) {
  const [bar, setbar] = useState();

  useEffect(() => {
    handleDataChange();
  }, []);

  async function handleDataChange() {
    fetchBarData(props.data);
  }
  function fetchBarData(sqlD) {
    if (sqlD == null || sqlD.length == 0) return;
    let yval = [];
    let keys = Object.keys(sqlD[0]);
    let xval = [];
    sqlD.forEach((datapoint) => {
      xval.push(datapoint.Collaborator);
      yval.push(datapoint.Total_Funding);
    });
    // let tmp = {
    //   options: {
    //     chart: {
    //       id: "Top Collaborators",
    //     },
    //     xaxis: {
    //       categories: keys,
    //     },
    //   },
    //   series: [
    //     {
    //       name: "Collaborators",
    //       data: yval,
    //     },
    //   ],
    // };
    let tmp = {
      options: {
        labels: xval,
        title: {
          text: "Top Collaborators",
          align:"center",
        },
      },
      series: yval,
      labels: xval,
    };
    loadBar(tmp);
  }
  const loadBar = (barData) => {
    let ret;
    try {
      if (barData == null || barData.length == 0) return;
      fetchBarData();
      ret = (
        <Chart
          options={barData.options}
          // options={barData.options}
          series={barData.series}
          // options={[1,2,3,4]}
          labels={barData.labels}
          // series={["ap","dfs","dfs","dfsf"]}
          type="pie"
        />
      );
    } catch (err) {
      console.log(err);
    }
    setbar(ret);
  };

  return (
    <>
      <div style={{ width: "50%" }}></div>
      {bar}
    </>
  );
}
