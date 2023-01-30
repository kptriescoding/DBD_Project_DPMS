import { async } from "@firebase/util";
import { Card, Divider, Text } from "@nextui-org/react";
import axios from "axios";

import React, { useEffect, useState } from "react";

export default function MyApplications({isProfessor,user}) {
  const [applications, setapplications] = useState([]);
  async function handleSetApplications() {
    try {
      const tapplications = await axios.post(
        "/project/application/get_all_applications_under_me",
        {
          data: {
            professorEmail: user.email,
          },
        }
      );
      console.log(tapplications);
      setapplications(() => tapplications.data.applications);
    } catch (err) {
      console.log(err);
    }
  }
  async function handleDeleteApplications() {}

  async function handleAcceptOrRejectApplications(
    projectId,
    Student_Email,
    isAccept
  ) {
    console.log(projectId,Student_Email)
    if (isAccept) {
      // const update_application = await axios.post("/project/add_student", {
      //   data: {
      //     projectID: projectId,
      //     studentEmail: Student_Email,
      //   },
      // });
      // if(!update_application.data.success)return;
      const update_student_status = await axios.post("/project/application/accept_or_reject_student",
        {
          data: {
            projectId: projectId,
            studentEmail: Student_Email,
            accept_or_reject: "Accept",
          },
        }
      );
    }
  }
  useEffect(() => {
    console.log(user)
    if(!user)return
    if(isProfessor)handleSetApplications();
  }, []);

  const StudentsApplied = () => {
    {
      /* @todo Professor side : student name year cgpa  accept reject*/
    }
  //  console.log(applications)
   if(applications){
    const students = applications.map((student)=> {
      console.log(student.student.name)
        return (
          <Card
            isPressable
            isHoverable
            
            variant="bordered shadow"
            style={{
              width: "inherit",
              borderRadius: "0.6rem",
              margin: "1.5px",
            }}
            key={student.projectID}
          >
            <Card.Header
              css={{
                backgroundColor: "#ffffff",
              }}
            >
              <span
                style={{
                  color: "#000000",

                }}
                className=" text-center w-full"
              >
                {student.student.name}
              </span>
            </Card.Header>
            <Card.Divider
              style={{
                backgroundColor: "gray",
              }}
            />
            {/* <Card.Footer css={{paddding:"unset"}}> */}
            <div className=" flex flex-grow w-full">
            <button
                className=" bg-red-500 font-bold text-white py-2 hover:bg-red-700"
                style={{
                  width:"inherit"
                }}
                // onClickCapture={() => {
                //   handleAcceptOrRejectApplications(
                //     student.projectID,
                //     student.student.email,
                //     true
                //   );
                // }}
              >
                Reject
              </button>
              <button
                className=" bg-green-500 font-bold text-white py-2 hover:bg-green-600"
                style={{
                  width:"inherit",
                  height:"inherit"
                }}
                onClickCapture={() => {
                  handleAcceptOrRejectApplications(
                    student.projectID,
                    student.student.email,
                    true
                  );
                }}
              >
                Accept
              </button>
              </div>
            {/* </Card.Footer> */}
            <Divider/>
          </Card>
        );
      });
    
    return students
   }
   else return <div/>
  };

  return (
    <div>
      <div>
        <span className=" font-bold text-2xl text-center w-full">Applications</span>
        <div>
          {/* @todo Professor side : student name year cgpa  accept reject*/}
          {(isProfessor)?<StudentsApplied/>:<div/>}
          {/* student side:project name remove application  */}
        </div>
      </div>
    </div>
  );
}
