import { Button, Card, Text } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectNotifications({
    projectID,
    isProfessor,
    email}) {
  // const [myProject, setmyProject] = useState([])
  const [myNotification, setmyNotifications] = useState();

  const GetMyNotifications = async () => {

    let arr
    try {
      // console.log(user.email);
    //   console.log(email)
    //   const myProjectsFromDatabase = await axios.post(
    //     "/project/get_my_projects",
    //     {
    //       data: {
    //         email: "karthikpai.is20@rvce.edu.in",
    //         isProfessor: isProfessor,
    //       },
    //     }
    //   );
      // if (myProjectsFromDatabase.data.success) closeHandler();
      // console.log(myProjectsFromDatabase);
    //    arr = myProjectsFromDatabase.data.projects;
    } catch (e) {
      console.log(e);
    }
    // console.log(arr);
      
    setmyNotifications(() => 
        <div>
        {(isProfessor)?
        <div>
              <button
            //   onClickCapture={}
              className="w-full m-3 px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650"
            >
            Post With Project Members
            </button>
        </div>:
        <div/>
    }
        </div>);
  };
  useEffect(() => {
    GetMyNotifications();
  }, []);
  

  return <div className=" flex px-2 flex-col">{myNotification}</div>;
}
