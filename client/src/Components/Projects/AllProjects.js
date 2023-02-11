import { Button, Card, Text } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import ModalApply from "./ModalApply";
import ModalProjectDescription from "./ModelProjectDescription";

export default function AllProjects(props) {
  // const [myProject, setmyProject] = useState([])
  const bgColors = [];
  const [user, loading, error] = useAuthState(auth);
  const [projects, setProjects] = useState([]);

  const [createApplicationVisible, setCreateApplicationVisible] =
    useState(false);
  const createApplicationHandler = () => setCreateApplicationVisible(true);
  const closeApplicationHandler = () => setCreateApplicationVisible(false);
  const [clickedProject, setclikcedProject] = useState();


  const [projectDescriptionVisible, setProjectDescriptionVisible] = useState(false);
  const projectDescriptionHandler = (proj) => {
    setclikcedProject(proj)
    setProjectDescriptionVisible(true);
  }
  const closeProjectDescriptionHandler = () => setProjectDescriptionVisible(false);
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
      // console.log(colorArray[Math.floor(Math.random() * colorArray.length)]);
      return colorArray[Math.floor(Math.random() * colorArray.length)];
    };
    // let arr
    // try {
    //   console.log(user.email);

    //   const projectsFromDatabase = await axios.post(
    //     "/project/get_projects",
    //     {
    //       data: {
    //         email:props.email,
    //         isProfessor: props.isProfessor,
    //       },
    //     }
    //   );
    //   // if (myProjectsFromDatabase.data.success) closeHandler();
    //   // console.log(myProjectsFromDatabase);
    //    arr = projectsFromDatabase.data.projects;
    // } catch (e) {
    //   console.log(e);
    // }
    // console.log(arr);

    async function handleApplyForProject(proj) {
      setclikcedProject(proj);
      
      // console.log(proj);
      // console.log(proj);
      // const data = {
      //   projectID: proj.projectId,
      //   email: user.email,
      //   professorEmail: proj.professorEmail,
      //   title: proj.projectName,
      //   studentName: props.user.firstName + " " + props.user.lastName,
      //   CGPA: props.user.CGPA,
      // };
      createApplicationHandler();
    }
    const ret = props.projects?.map((proj) => {
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
          key={proj.projectId}
        >
          <Card.Header
          //  css={{
          //   backgroundColor:curColor
          // }}
          onClickCapture={()=>projectDescriptionHandler(proj)}
          >
            <Text
              className=" font-bold text-2xl"
              style={{
                color: "#000000",
              }}
            >
              {proj.projectName}
            </Text>

          </Card.Header>

          <Card.Divider />

          <Card.Body
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              textDecoration: "italic",
            }}
            onClickCapture={()=>projectDescriptionHandler(proj)}
          >
            <Text small>{proj.projectDuration}</Text>
            <Text small>{proj.collaborator}</Text>
          </Card.Body>
          {!props.isProfessor&&(
            <Card.Footer style={{ backgroundColor: "blue" }}>
              <button
                className="  w-full font-bold text-white text-sm"
                onClickCapture={() => {
                  handleApplyForProject(proj);
                }}
              >
                APPLY
              </button>
            </Card.Footer>
          )}
        </Card>
      );
    });
    // console.log(ret);
    setProjects(() => <div>{ret}</div>);
  };

  useEffect(() => {
    GetMyProjects();
  }, [props.projects]);

  return (
    <>
      <div className=" flex px-2 flex-col  overflow-x-hidden">
        <div class="container flex">
          <div class="flex border-2 rounded">
            <input
              type="text"
              onInput={(e) => props.setsearchText(e.target.value)}
              class="px-4 py-2 w-full"
              placeholder="Search For Projects"
            />
            <button
              class="flex items-center justify-center px-4 border-r hover:bg-blue-200"
              onClickCapture={props.searchListener}
            >
              <svg
                class="w-6 h-6 text-gray-600 "
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className=" h-screen ">{projects}</div>
      </div>
      {createApplicationVisible ? (
        <ModalApply
          user={props.user}
          visible={createApplicationVisible}
          setVisible={createApplicationVisible}
          closeHandler={closeApplicationHandler}
          proj={clickedProject}
        />
      ) : (
        <div />
      )}
      {projectDescriptionVisible ? (
        <ModalProjectDescription
          user={props.user}
          visible={projectDescriptionVisible}
          setVisible={setCreateApplicationVisible}
          closeHandler={closeProjectDescriptionHandler}
          projectID={clickedProject.projectId}
          userCanEdit={false}
        />
      ) : (
        <div />
      )}

    </>
  );
}
