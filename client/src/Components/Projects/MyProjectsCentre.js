import {
  Avatar,
  Button,
  Card,
  StyledButton,
  StyledButtonIcon,
  Text,
} from "@nextui-org/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalSendStudentNotification from "../Professor/ModalSendStudentNotification";
import { CreateProjectContext } from "./ModalCreate";

export default function MyProjectsCentre(props) {
  // const [myProject, setmyProject] = useState([])
  const navigate = useNavigate();
  const [myProjects, setmyProjects] = useState(null);
  const [studentEmails, setStudentEmails] = useState([]);
  const [createNewApplyVisible, setCreateNewApplyVisible] = useState(false);
  const createNewApplyVisibleHandler = () => setCreateNewApplyVisible(true);
  const closeNewApplyVisibleHandler = () => setCreateNewApplyVisible(false);
  const [projectSelected, setProjectSelected] = useState();
  const createProjectContext = useContext(CreateProjectContext);
  const GetMyProjects = async () => {
    let colorArray = [
      "#858585",
      "#1e69c0",
      "#425b64",
      "#4f3ed9",
      "#546d7b",
      "#00b96f",
    ];

    const pickRandom = () => {
      // console.log( colorArray[Math.floor(Math.random()*colorArray.length)])
      return colorArray[Math.floor(Math.random() * colorArray.length)];
    };
    let arr;
    try {
      // console.log(user.email);
      // console.log(props.email)
      const myProjectsFromDatabase = await axios.post(
        "/project/get_my_projects",
        {
          data: {
            email: props.email,
            isProfessor: props.isProfessor,
          },
        }
      );
      // if (myProjectsFromDatabase.data.success) closeHandler();
      // console.log(myProjectsFromDatabase);
      arr = myProjectsFromDatabase.data.projects;
    } catch (e) {
      console.log(e);
    }

    async function handleNewNotification(proj) {
      setProjectSelected(proj);
      await handelSetStudents(proj.projectId);

      createNewApplyVisibleHandler();
    }
    async function handelSetStudents(projectId) {
      let res = await axios.post("/student/get_students_for_professor_apply", {
        data: {
          Project_ID: projectId,
        },
      });

      let stEmails = [];
      res.data.students.forEach((student) => stEmails.push(student.Email));
      setStudentEmails(stEmails);
    }
    async function handleCloseApplication(proj) {
      let dateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
      if (
        window.confirm(
          "Do you want to close Application Process for the Project :" +
            proj.projectName
        ) == false
      )
        return;

      let res = await axios.post(
        "/project/application/close_open_project_application",
        {
          data: {
            Project_ID: proj.projectId,
            close: 1,
            notificationTime: dateTime,
          },
        }
      );
      if (res.data.success) {
        alert("Project Application closed successfully");
      }
    }
    // console.log(arr);
    const ret = arr.map((proj) => {
      let curColor = pickRandom();
      //   console.log("curColor")
      return (
        <Card
          isPressable
          isHoverable
          onPress={(event) => {
            localStorage.setItem("projectID", proj.projectId);
            if (props.isProfessor) return navigate("/professor/project");
            else return navigate("/student/project");
          }}
          variant="shadow"
          style={{
            width: "100%",

            borderRadius: "0.6rem",
            margin: "1.5px",
          }}
          key={proj.projectId}
        >
          <Card.Header
            css={{
              backgroundColor: curColor,
            }}
            style={{
              // height:"5rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
              }}
              className=" py-3"
            >
              {proj.projectName.length > 20
                ? proj.projectName.substring(0, 20) + "..."
                : proj.projectName}
            </Text>

            {props.isProfessor ? (
              <Button
                size={"xs"}
                onPress={() => {
                  handleCloseApplication(proj);
                }}
                ghost
                auto
                color={"error"}
              >
                X
              </Button>
            ) : (
              <></>
            )}
          </Card.Header>
          <Card.Divider
            style={{
              backgroundColor: "white",
            }}
          />
          <Card.Body>
            <Text className=" py-8">{proj.projectDescription}</Text>
          </Card.Body>
          <Card.Divider />
          <Card.Footer
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Text  style={{ justifyContent: "end" }}>
              {proj.collaborator}
            </Text>
            {props.isProfessor ? (
              <Button
                flat
                auto
                onClickCapture={() => handleNewNotification(proj)}
                style={{ justifyContent: "start", width: "30%" }}
              >
                Add Student
              </Button>
            ) : (
              <></>
            )}
          </Card.Footer>
        </Card>
      );
    });
    // console.log(ret);
    setmyProjects(() => ret);
  };
  useEffect(() => {
    if (myProjects == null || myProjects.length === 0) GetMyProjects();
    // console.log(myProjects)
  }, [myProjects]);

  return (
    <>
      <div className=" mx-6  my-2 grid grid-cols-3 px-2 flex-grow content-center  gap-x-6 gap-y-10">
        {myProjects}
      </div>
      {createNewApplyVisible ? (
        <ModalSendStudentNotification
          user={props.user}
          visible={createNewApplyVisible}
          setVisible={createNewApplyVisible}
          closeHandler={closeNewApplyVisibleHandler}
          proj={projectSelected}
          students={studentEmails}
        />
      ) : (
        <></>
      )}
    </>
  );
}
