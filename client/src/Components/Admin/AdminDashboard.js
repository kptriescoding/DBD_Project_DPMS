import { Button, Input, Switch } from "@nextui-org/react";
import axios from "axios";

import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import * as XLSX from "xlsx";
import Bargraph from "./Bargraph";
import Table from "./Table";
export default function AdminDashboard() {
  useEffect(() => {
    fetchData();
  }, []);

  const viewType = ["Professor", "Student", "Project"];
  const [type, settype] = useState("Professor");
  const [barData, setbarData] = useState([]);
  const queryOptionsForProfessors = [
    "List Of Professors",
    "No Of Projects,total funding raised,  Under Each Professor",
    "Count of Students under Each Professor",
  ];
  const queryOptionsForStudents = [
    "List Of Students",
    "No Of Projects Each Student is Working On",
  ];

  const [optionForQueryState, setoptionForQueryState] = useState(
    queryOptionsForProfessors
  );
  const queryOptionsForProjects = ["List Of Projects"];
  const [queryType, setqueryType] = useState("");
  const [sqlData, setsqlData] = useState([]);
  const [isSQLQuery, setisSQLQuery] = useState(false);
  const [sqlQuery, setsqlQuery] = useState("");

  const handleOnChangeForViewType = (option) => {
    settype(option.value);
    console.log(option);
    setoptionForQueryState(() => {
      setqueryType("");
      if (option.value === "Professor") return queryOptionsForProfessors;
      else
        return option.value === "Student"
          ? queryOptionsForStudents
          : queryOptionsForProjects;
    });
  };

  const handleOnChangeForQueryType = (option) => {
    setqueryType(option.value);
  };
  const handleOnChangeForSwitch = () => {
    setisSQLQuery((prev) => {
      return !prev;
    });
  };
  const handleSqlQueryChange = (quer) => {
    setsqlQuery(quer.target.value);
  };
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
    if (type == "Student") {
      const tempData = await axios.post("/student/get_students_admin", {
        data: {
          query: queryType,
        },
      });
      setsqlData(tempData.data.students);
    } else if (type == "Project") {
      const tempData = await axios.post("/project/get_projects_admin", {
        data: {
          query: queryType,
        },
      });
      setsqlData(tempData.data.projects);
    } else {
      const tempData = await axios.post("/professor/get_professor_admin", {
        data: {
          query: queryType,
        },
      });
      setsqlData(tempData.data.professors);
    }
  }
  function generateXL() {
    const worksheet = XLSX.utils.json_to_sheet(sqlData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  }

  async function fetchData() {
    const tempData = await axios.post("/project/collaborator", {
      data: {
        limit: 10,
      },
    });

    setbarData(() => {
      return tempData.data.collaborators;
    });
    console.log(barData);
  }
  return (
    <>
      <div className="flex justify-around w-full py-4  bg-slate-100">
        <div className="flex justify-center my-2">
          <Dropdown
            options={viewType}
            className=" mx-2 px-4 py-2 w-60 rounded-md  text-white self-center bg-blue-500 hover:bg-blue-600"
            style={{
              position: "relative",
              overflow: "hidden",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "2px",
              boxSizing: "border-box",
              color: "#333",
              cursor: "default",
              outline: "none",
              padding: "8px 52px 8px 10px",
              transition: "all 200ms ease",
            }}
            placeholder={viewType[0]}
            onChange={(option) => handleOnChangeForViewType(option)}
          />
          <Dropdown
            options={optionForQueryState}
            className=" mx-2 px-4 py-2 w-60 rounded-md text-white self-center bg-blue-500 hover:bg-blue-600"
            onChange={(option) => handleOnChangeForQueryType(option)}
          />
        </div>
        <div className="flex justify-center">
          <input
            placeholder="Write Your SQL Query Here"
            className=" py-2 px-2  mx-2 my-2 bg-gray-200 items-center border-black border-2"
            onChangeCapture={(val) => handleSqlQueryChange(val)}
          ></input>

          <div className="flex w-fit self-center justify-center items-center mx-1 py-2 my-2 px-14 rounded-lg bg-blue-200 relative ">
            <span className="mx-1">Use SQL Query</span>
            <Switch
              animated={false}
              bordered={true}
              on
              onChange={handleOnChangeForSwitch}
            />
          </div>
        </div>
        <div className=" flex flex-column justify-center items-center bias">
          <Button
            style={{
              padding: "0rem 6.2rem 0rem 6.2rem",
            }}
            onClickCapture={handleSubmitClick}
          >
            Fetch Data
          </Button>
        </div>
      </div>
      <div className="flex flex-col mx-10">
        <Table data={sqlData} />
        {sqlData != null && sqlData.length != 0 ? (
          <button
            className=" px-4 py-2 bg-gray-300"
            onClickCapture={generateXL}
          >
            Convert To XL
          </button>
        ) : (
          <></>
        )}
      </div>
      <div>
        <Bargraph data={barData} />
      </div>
    </>
  );
}
