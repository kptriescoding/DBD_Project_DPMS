import { async } from "@firebase/util";
import { Card, Divider, Text } from "@nextui-org/react";
import axios from "axios";

import React, { useEffect, useState } from "react";
import ModalApplicationStatus from "./ModalApplicationStatus";
import ModalProfessorDescription from "./Professor/ModalProfessorDescription";
import ModalProjectDescription from "./Projects/ModelProjectDescription";
import ModalStudentDescription from "./Students/ModelStudentDescription";

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

  const [key, setKey] = useState("");

  const [studentDescriptionVisible, setStudentDescriptionVisible] =
    useState(false);
  const studentDescriptionHandler = (key) => {
    setKey(key);
    setStudentDescriptionVisible(true);
  };
  const closeStudentDescriptionHandler = () =>
    setStudentDescriptionVisible(false);

  const [projectDescriptionVisible, setProjectDescriptionVisible] =
    useState(false);
  const projectDescriptionHandler = (key) => {
    setKey(key);
    setProjectDescriptionVisible(true);
  };
  const closeProjectDescriptionHandler = () =>
    setProjectDescriptionVisible(false);

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
        // console.log(tapplications);

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
        <div className="flex flex-col bg-gray-100 rounded-xl px-2 py-4 shadow-sm border-b-2 border-gray-500 ">
          <span className="text-center w-full  overflow-hidden">
            {applicationData.Email}
          </span>

          <Card.Divider />
          <div className="flex justify-between">
            <span className=" text-center  text-black font-semibold text-sm self-center">
              {applicationData.Project_ID}
            </span>

            <button
              className="  text-blue-900 py-2 hover:text-black  hover:bg-slate-200 px-2 rounded-xl"
              onClickCapture={() => {
                handleOnClickForView(applicationData);
              }}
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <Divider />
        </div>
      );
    });

    return students;
    // } else return <div />;
  };
  const StudentSideNotifications = () => {
    const notifications = applications.map((applicationData) => {
      // console.log(student.student.name);

      return (
        <div className="flex flex-col bg-gray-100 rounded-xl px-2 py-4 shadow-sm border-b-2 border-gray-500 overflow-hidden">
          <span
            className=" text-center w-full overflow-hidden"
            onClickCapture={() =>
              projectDescriptionHandler(applicationData.Project_ID)
            }
          >
            {applicationData.Email}
          </span>

          <div className=" flex justify-between ">
            <span
              className=" text-center  text-black font-semibold text-sm self-center"
              onClickCapture={() =>
                projectDescriptionHandler(applicationData.Project_ID)
              }
            >
              {applicationData.Project_ID}
            </span>

            <button
              className="  text-blue-900 py-2 hover:text-black  hover:bg-slate-200 px-2 rounded-xl"
              onClickCapture={() => {
                handleOnClickForView(applicationData);
              }}
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      );
    });

    return notifications;
  };

  return (
    <>
      <div className="">
        <div className=" mx-2 overflow-hidden">
          <div className="flex justify-center ">
            <span className=" font-bold text-2xl ">Notifications</span>
          </div>
          <div className="grid grid-cols-1 gap-y-3 overflow-auto">
            {isProfessor ? <StudentsApplied /> : <StudentSideNotifications />}
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
      {studentDescriptionVisible && (
        <ModalStudentDescription
          visible={studentDescriptionVisible}
          setVisible={setStudentDescriptionVisible}
          closeHandler={closeStudentDescriptionHandler}
          email={key}
        />
      )}
      {projectDescriptionVisible && (
        <ModalProjectDescription
          user={user}
          visible={projectDescriptionVisible}
          setVisible={setProjectDescriptionVisible}
          closeHandler={closeProjectDescriptionHandler}
          projectID={key}
          userCanEdit={false}
        />
      )}
    </>
  );
}
