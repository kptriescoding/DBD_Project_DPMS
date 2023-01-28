import { Card, Text } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function MyProjects(props) {
  // const [myProject, setmyProject] = useState([])
  const bgColors = []
  const [user, loading, error] = useAuthState(auth);
  const [myProjects, setmyProjects] = useState();
  const GetMyProjects = async () => {
    let colorArray = ["#858585","#1e69c0","#425b64","#4f3ed9","#546d7b","#00b96f"];

    const pickRandom=()=>{
      console.log( colorArray[Math.floor(Math.random()*colorArray.length)])
      return colorArray[Math.floor(Math.random()*colorArray.length)]
    }
    let arr
    try {
      // console.log(user.email);
      
      const myProjectsFromDatabase = await axios.post(
        "/project/get_my_projects",
        {
          data: {
            email: "dilsharma0220@gmail.com",
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
    console.log(arr);
    const ret = arr.map((proj) => {
      let curColor = pickRandom();
      console.log("curColor")
      return (
        <Card
          isPressable
          isHoverable
        
          variant="bordered "
          style={{
            width: "inherit",
            borderRadius:"0.6rem",
            margin: "1.5px",
          }}
          key={proj.projectId}
        >
          <Card.Header css={{
            backgroundColor:curColor
          }} >
            <Text    style={{
              color:"#ffffff"
            }} >{proj.projectName}</Text>
          </Card.Header>
          <Card.Divider
            style={{
              backgroundColor: "white",
            }}
          />
          <Card.Body>
            <Text >{proj.projectDescription}</Text>
          </Card.Body>
          <Card.Divider
          
          />
          <Card.Footer style={{justifyContent:"end"}}>
            <Text small style={{ justifyContent: "end" }}>
              {proj.collaborator}
            </Text>
          </Card.Footer>
        </Card>
      );
    });
    console.log(ret);
    setmyProjects(() => ret);
  };
  useEffect(() => {
    GetMyProjects();
  }, []);

  return <div className=" flex px-2 flex-col  ">{myProjects}</div>;
}
