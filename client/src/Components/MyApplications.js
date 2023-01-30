import { async } from "@firebase/util";
import { Card, Text } from "@nextui-org/react";
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
        return (
          <Card
            isPressable
            isHoverable
            variant="bordered "
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
              <Text
                style={{
                  color: "#ffffff",
                }}
              >
                {student.student.studentName}
              </Text>
            </Card.Header>
            <Card.Divider
              style={{
                backgroundColor: "gray",
              }}
            />
            <Card.Footer>
              <button
                className=" bg-green-500 font-bold text-white"
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
            </Card.Footer>
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
        <span className=" font-bold text-2xl">Applications</span>
        <div>
          {/* @todo Professor side : student name year cgpa  accept reject*/}
          {(isProfessor)?<StudentsApplied/>:<div/>}
          {/* student side:project name remove application  */}
        </div>
      </div>
    </div>
  );
}
