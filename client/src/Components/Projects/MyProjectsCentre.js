import { Avatar, Card, Text } from "@nextui-org/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalSendStudentNotification from "../ModalSendStudentNotification";
import { CreateProjectContext } from "./ModalCreate";

export default function MyProjectsCentre(props) {
  // const [myProject, setmyProject] = useState([])
  const navigate = useNavigate();
  const [myProjects, setmyProjects] = useState(null);
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

    function handleNewNotification(proj) {
      setProjectSelected(proj);
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
          variant="bordered "
          style={{
            width: "20%",

            borderRadius: "0.6rem",
            margin: "1.5px",
          }}
          key={proj.projectId}
        >
          <Card.Header
            css={{
              backgroundColor: curColor,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
              }}
            >
              {proj.projectName.length > 20
                ? proj.projectName.substring(0, 20) + "..."
                : proj.projectName}
            </Text>
          </Card.Header>
          <Card.Divider
            style={{
              backgroundColor: "white",
            }}
          />
          <Card.Body>
            <Text>{proj.projectDescription}</Text>
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Avatar
              onClickCapture={() => handleNewNotification(proj)}
              squared
              text="add students"
              style={{ justifyContent: "start" }}
            />
            <Text small style={{ justifyContent: "end" }}>
              {proj.collaborator}
            </Text>
          </Card.Footer>
        </Card>
      );
    });
    // console.log(ret);
    setmyProjects(() => ret);
  };
  useEffect(() => {
    if (myProjects == null || myProjects.length === 0) GetMyProjects();
  }, [myProjects]);

  return (
    <>
      <div className=" flex flex-wrap px-2 w-full content-center ">
        {myProjects}
      </div>
      {createNewApplyVisible ? (
        <ModalSendStudentNotification
          user={props.user}
          visible={createNewApplyVisible}
          setVisible={createNewApplyVisible}
          closeHandler={closeNewApplyVisibleHandler}
          proj={projectSelected}
        />
      ) : (
        <></>
      )}
    </>
  );
}
