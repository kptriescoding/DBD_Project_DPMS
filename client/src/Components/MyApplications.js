import { async } from "@firebase/util";
import { Card, Text } from "@nextui-org/react";
import axios from "axios";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function MyApplications({isProfessor}) {
  const [applications, setapplications] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  async function handleSetApplications() {
    
    // let arr
    // try {
    //   // console.log(user.email);
    //   // console.log(props.email)
    //   const myProjectsFromDatabase = await axios.post(
    //     "/project/get_my_projects",
    //     {
    //       data:

    // TODo this is if professor
    try {
      const tapplications = await axios.post(
        "/project/application/get_all_applications_under_me",
        {
          data: {
            professorEmail: user.email,
          },
        }
      );
      // console.log(tapplications);
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
    if (isAccept) {
      const update_application = await axios.post("/project/add_student", {
        data: {
          projectId: projectId,
          studentEmail: Student_Email,
        },
      });
      const update_student_status = await axios.post(
        "/applicaton/accept_or_reject_student",
        {
          data: {
            projectId: projectId,
            studentEmail: Student_Email,
            accept_or_reject: "accept",
          },
        }
      );
    }
  }
  useEffect(() => {
    handleSetApplications();
  }, []);

  const StudentsApplied = () => {
    {
      /* @todo Professor side : student name year cgpa  accept reject*/
    }
   console.log(applications)
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
            key={student.projectId}
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
                    student.projectId,
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
