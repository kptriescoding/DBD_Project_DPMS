import { Button, Input, Switch } from "@nextui-org/react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout, fetchUserType } from "../../firebase";
import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "./Dropdown.css";
import * as XLSX from "xlsx";
import Graph from "./Graph";
import Table from "../Reports/Table";
import jsPDF from "jspdf";

const Reports=({userType})=>{

  let viewType ,queryFunctions
  if(userType==="Admin"){
  viewType= {
    "Options":["Professor","Student","Project"],

        "Professor":["List Of Professors",
        "No Of Projects,total funding raised,  Under Each Professor",
        "Count of Students under Each Professor"]
    , "Student":[
        "List Of Students",
        "No Of Projects Each Student is Working On",
      ],
    "Project":["List Of Projects"]
  }
  queryFunctions={
    "Student":async (queryType)=> await axios.post("/student/get_students_admin", {
        data: {
          query: queryType,
        },
      }),
     "Professor":async(queryType)=>await axios.post("/professor/get_professor_admin", {
        data: {
          query: queryType,
        },
      }),
      "Project":async (queryType)=>  await axios.post("/project/get_projects_admin", {
        data: {
          query: queryType,
        },
      }) 
  }
}
const [reRender,shouldReRender]=useState(0)
  const [queryType, setqueryType] = useState("");
  const [sqlData, setsqlData] = useState([]);
  const [isSQLQuery, setisSQLQuery] = useState(false);
  const [sqlQuery, setsqlQuery] = useState("");

  const [barCharCol,setBarChartCol]=useState([])
  const [barData1,setBarData1]=useState("")
  const [barData2,setBarData2]=useState("")
  const [type, settype] = useState("Professor");
  const [graphType,setGraphType]=useState("Pie")
    const graphTypes=[
        // "Bar",
    "Donut","Pie"]

    const handleOnChangeForViewType = (option) => {
        settype(option.value);
        setqueryType("");
      };
    
      const handleOnChangeForQueryType = (option) => setqueryType(option.value)
      const handleOnChangeForSwitch = () => setisSQLQuery(!isSQLQuery)
      const handleSqlQueryChange = (quer) => setsqlQuery(quer.target.value)

      async function handleSubmitClick() {
        if (isSQLQuery) {
          const tempData = await axios.post("/project/sql_query", {
            data: {
              query: sqlQuery,
            },
          });
          setsqlData(tempData.data.data);
          return;
        }
        // console.log(queryFunctions[type])
        const tempData=await queryFunctions[type](queryType)   
        setsqlData(tempData.data.result);
        setBarChartCol(Object.keys(tempData.data.result[0]))
      }

      function generateXL() {
        const worksheet = XLSX.utils.json_to_sheet(sqlData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "DataSheet.xlsx");
      }

      function generatePDF() {
        var doc = new jsPDF("p", "pt");
        doc.text(20, 20, "College Project Management System");
        doc.setFont("helvetica");
        // doc.setFontType("normal");
        doc.text(20, 60, sqlData);
    
        doc.save("sample-file.pdf");
      }
    
      const fetchData = async () => {
        // const td = await axios.post("/project/collaborator", {
        //   data: {
        //     limit: 10,
        //   },
        // });
        // const resData = td.data.collaborators;
    
        // setbarData(resData);
      };

     const generateGraph=()=>{
        if(!barData1||!barData2)return
        shouldReRender(reRender+1)
      }


      useEffect(() => {
        fetchData()
      }, []);

      return (
        <div className=" flex flex-col h-screen">
          <div className="flex justify-end w-full py-4  bg-slate-100">
            <div className=" flex flex-column justify-end items-center mx-5">
              <Button
                style={{
                  padding: "0rem 6.2rem 0rem 6.2rem",
                }}
                onClickCapture={logout}
              >
                Logout
              </Button>
            </div>
          </div>
          <div className=" flex flex-grow">
            <div className="flex  flex-col w-1/6 mt-4">
              <div className="flex flex-col justify-center mt-4 w-full mx-2">
                <Dropdown
                  className=" mb-1"
                  options={viewType["Options"]}
                  placeholder={"Professor"}
                  onChange={(option) => handleOnChangeForViewType(option)}
                />
                <Dropdown
                  className=" mb-1"
                  options={viewType[type]}
                  onChange={(option) => handleOnChangeForQueryType(option)}
                />
              </div>
              {userType==="Admin"&&<div className="flex flex-col justify-center w-full">
                <input
                  placeholder="Write Your SQL Query Here"
                  className=" py-2 px-2 w-full mx-2 mb-2 bg-gray-200 items-center border-black border-2  text-black"
                  onChangeCapture={(val) => handleSqlQueryChange(val)}
                ></input>
    
                <div className="flex  w-full self-center justify-center items-center py-2 my-2 px-14 rounded-full bg-blue-200  ">
                  <span className="mx-1 rounded-lg w-fit h-8 text-center ">Use SQL Query</span>
                  <Switch
                    animated={false}
                    bordered={true}
                    on
                  
                    onChange={handleOnChangeForSwitch}
                  />
                </div>
              </div>
            }
              <div className=" flex  justify-center items-center">
                <Button
                  style={{
                    padding: "0rem 6.2rem 0rem 6.2rem",
                    width: "100%",
                  }}
                  onClickCapture={handleSubmitClick}
                >
                  Fetch Data
                </Button>
              </div>
            </div>
    
            <div className="flex flex-col mx-4 overflow-x-auto flex-grow p-2 border-  " >
              <Table data={sqlData}/>
              {sqlData != null && sqlData.length != 0 ? (
                <button
                  className=" px-4 py-2 bg-gray-300 mx-2 w-full"
                  onClickCapture={generateXL}
                >
                  Convert To XL
                </button>
              ) : (
                <></>
              )}
            </div>
            <div className=" w-1/4 my-4">
              <div className=" border-2 rounded-2xl m-2 border-black py-4">
                 <Graph data={sqlData} xCol={barData1} yCol={barData2} reRender={reRender} graphType={graphType}/> : <div />
              </div>
              <Dropdown
                  className=" mb-1"
                  options={barCharCol}
                  onChange={(option)=>setBarData1(option.value)}
                />
                <Dropdown
                  className=" mb-1"
                  options={barCharCol}
                  onChange={(option)=>setBarData2(option.value)}
                />
                <Dropdown
                  className=" mb-1"
                  options={graphTypes}
                  placeholder={"Pie"}
                  onChange={(option)=>setGraphType(option.value)}
                />
                <button className=" px-4 py-2 bg-gray-300 mx-2 w-full"
                onClickCapture={generateGraph}
                >
                Generate Graph
                </button>
            </div>
          </div>
        </div>
      );
}
export default Reports