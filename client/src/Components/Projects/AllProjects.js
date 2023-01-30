import { Button, Card, Text } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

export default function AllProjects(props) {
  // const [myProject, setmyProject] = useState([])
  const bgColors = [];
  const [user, loading, error] = useAuthState(auth);
  const [projects, setProjects] = useState([]);
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
    async function handleOpenApplication(proj){
      // console.log("ABCDEDF");
      const data = {
        projectID: proj.projectID,
        projectName:proj.projectName,
        professorEmail: user.email,
      };
   
      const r1 = await axios.post("/project/application/create/", {
        data: data
      });
      if (!r1.status.success) ;
     
    }
    async function handleApplyForProject(proj) {
      // console.log(proj);
      const data = {
        projectID: proj.projectId,
        email: user.email,
        professorEmail:proj.professorEmail,
        projectName:proj.projectName

      };
      // TODO remove this
      
      const res = await axios.post("/project/application/students_apply/", {
        data: data,
      });
      if (!res.data.success) console.log("Error");
      else {
        console.log("Applied successfully");
      }
    }
    const ret = props.projects.map((proj) => {
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
          >
            <Text small>{proj.projectDuration}</Text>
            <Text small>{proj.collaborator}</Text>
          </Card.Body>
          {!props.isProfessor ? (
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
          ) : (
            <Card.Footer style={{ backgroundColor: "blue" }}>
              
              <button
                className="  w-full font-bold text-white text-sm"
                onClickCapture={() => {
                  handleOpenApplication(proj);
                }}
              >
                Open Application
              </button>
            </Card.Footer>
          )}
        </Card>
      );
    });
    // console.log(ret);
    setProjects(() => ret);
  };
  useEffect(() => {
    GetMyProjects();
  }, []);

  useEffect(() => {
    GetMyProjects();
  }, [props.projects]);

  return (
    <div className=" flex px-2 flex-col  ">
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
      <div>{projects}</div>
    </div>
  );
}
