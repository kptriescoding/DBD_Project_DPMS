import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
export default function Graph({data,xCol,yCol,reRender,graphType}) {
  const [graph, setgraph] = useState(()=><div></div>);

  useEffect(() => {
    handleDataChange();
  }, [reRender,xCol,yCol]);
  useEffect(()=>{
    handleDataChange()
    console.log(graphType)
    console.log("Graph type Changed")
  },[graphType])
  async function handleDataChange() {
    fetchgraphData(data);
  }
  let graphs={
    // "Bar":(graphData)=><Chart options={graphData.options} series={graphData.series} labels={graphData.labels} type="bar" />,
    "Pie":(graphData)=><Chart options={graphData.options} series={graphData.series} labels={graphData.labels} type="pie"  />,
    "Donut":(graphData)=><Chart options={graphData.options} series={graphData.series} labels={graphData.labels} type="donut" />,
  }
  function fetchgraphData(sqlD) {
    if(!xCol||!yCol)return
    if (sqlD == null || sqlD.length == 0) return;
    let yval = [];
    let xval = [];
    sqlD.forEach((datapoint) => {
      xval.push(datapoint[xCol]);
      yval.push(datapoint[yCol]);
    });
    let tmp = {
      options: {
        labels: xval,
        title: {
          text: xCol,
          align:"center",
        },
      },
      series: yval,
      labels: xval,
    };
    loadgraph(tmp);
  }
  const loadgraph = (graphData) => {
    try {
      if (graphData == null || graphData.length == 0) return;
      setgraph(()=> <div>
        <div style={{ width: "50%" }}></div>
        {graphs[graphType](graphData)}
        </div>);
    } catch (err) {
    }
  };
  return graph
  
}
