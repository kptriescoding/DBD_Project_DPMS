import { async } from "@firebase/util";
import { Card, Divider, Text } from "@nextui-org/react";
import axios from "axios";

import React, { useEffect, useState } from "react";
import ModalApplicationStatus from "./ModalApplicationStatus";
export default function MyApplications({ isProfessor, user }) {
  const [applications, setapplications] = useState([]);
  // const [create, setCreateApplicationVisible] = useState(false);
  const [createApplicationStatusVisible, setcreateApplicationStatusVisible] =
    useState(false);
  const createApplicationStatusVisibleHandler = () =>
    setcreateApplicationStatusVisible(true);
  const closeApplicationStatusVisibleHandler = () =>
    setcreateApplicationStatusVisible(false);
  const [currentApplication, setcurrentApplication] = useState();
  async function handleSetApplications() {
    if (isProfessor) {
      
      try {
        const tapplications = await axios.post(
          "/project/application/get_notification_for_professor",
          {
            data: {
              Professor_Email: user.email,
            },
          }
        );
        

        setapplications(() => tapplications.data.notification);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const tapplications = await axios.post(
          "/project/application/get_notification_for_student",
          {
            data: {
              Email: user.email,
            },
          }
        );
        console.log(tapplications);

        setapplications(() => tapplications.data.notification);
      } catch (err) {
        console.log(err);
      }
    }
  }
  useEffect(() => {
    // console.log(user);
    if (!user) return;
    handleSetApplications(isProfessor);
  }, []);

  function handleOnClickForView(applicationData) {
    setcurrentApplication(applicationData);
    createApplicationStatusVisibleHandler();
  }

  const StudentsApplied = () => {
    {
      /* @todo Professor side : student name year cgpa  accept reject*/
    }
    //  console.log(applications)
    // if (applications) {
    const students = applications.map((applicationData) => {
      // console.log(student.student.name);

      return (
        <Card
          isPressable
          isHoverable
          variant="bordered shadow"
          style={{
            width: "inherit",
            borderRadius: "0.2rem",
            margin: "1.5px",
          }}
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
              {applicationData.Email}
            </span>
          </Card.Header>
          <Card.Divider
            style={{
              backgroundColor: "gray",
            }}
          />
          <div>
            <span className=" text-center w-full text-black font-semibold text-sm">
              {applicationData.Project_ID}
            </span>
          </div>
          {/* <Card.Footer css={{paddding:"unset"}}> */}
          <div className=" flex flex-grow w-full">
            <button
              className=" bg-red-500 font-bold text-white py-2 hover:bg-red-700"
              style={{
                width: "inherit",
              }}
              onClickCapture={() => {
                handleOnClickForView(applicationData);
              }}
            >
              View
            </button>
          </div>
          {/* </Card.Footer> */}
          <Divider />
        </Card>
      );
    });

    return students;
    // } else return <div />;
  };
  const StudentSideNotifications = () => {
    const notifications = applications.map((applicationData) => {
      // console.log(student.student.name);

      return (
        <Card
          isPressable
          isHoverable
          variant="bordered shadow"
          style={{
            width: "inherit",
            borderRadius: "0.2rem",
            margin: "1.5px",
            // backgroundColor:applicationData.applicationStatus=="accept"?"#003413":"#3b2600"
          }}
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
              {applicationData.Email}
            </span>
          </Card.Header>
          <Card.Divider
            style={{
              backgroundColor: "gray",
            }}
          />
          <div>
            <span className=" text-center w-full text-black font-semibold text-sm">
              {applicationData.Project_ID}
            </span>
          </div>
          {/* <Card.Footer css={{paddding:"unset"}}> */}
          <div className=" flex flex-grow w-full">
            <button
              className=" bg-red-500 font-bold text-white py-2 hover:bg-red-700"
              style={{
                width: "inherit",
              }}
              onClickCapture={() => {
                handleOnClickForView(applicationData);
              }}
            >
              View
            </button>
          </div>
          {/* </Card.Footer> */}
          <Divider />
        </Card>
      );
    });

    return notifications;
  };

  return (
    <>
      <div>
        <div>
          <span className=" font-bold text-2xl text-center w-full">
            Applications
          </span>
          <div className=" ">
            {/* @todo Professor side : student name year cgpa  accept reject*/}
            {isProfessor ? <StudentsApplied /> : <StudentSideNotifications/>}

            {/* student side:project name remove application  */}
          </div>
        </div>
      </div>
      {createApplicationStatusVisible ? (
        <ModalApplicationStatus
          user={user}
          visible={createApplicationStatusVisible}
          setVisible={createApplicationStatusVisible}
          closeHandler={closeApplicationStatusVisibleHandler}
          applicationData={currentApplication}
          isProfessor={isProfessor}
        />
      ) : (
        <div />
      )}
    </>
  );
}
