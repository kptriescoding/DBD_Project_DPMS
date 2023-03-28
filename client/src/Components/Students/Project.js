import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import Navbar from "./Navbar";
import axios from "axios";
import ProjectNotifications from "../Projects/ProjectNotifications";
import MyProjectsSide from "../Projects/MyProjects";
import DragDrop from "../DragDropComponents/DragDrop";
import ModalProjectDescription from "../Projects/ModelProjectDescription";

import { fetchUserType } from "../../firebase";
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function Projects() {
  const [user, loading, error] = useAuthState(auth);
  const [project, setProject] = useState("");
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [showNotification, setShowNotification] = useState(0);
  const [profile, setProfile] = useState({});
  const [editableProjectVisible,seteditableProjectVisible] = useState(false)


  useEffect(() => {
    handleSetProject();
  }, []);

  function handleShowNotification(val) {
    if (showNotification == 0) setShowNotification(val);
    else setShowNotification(0);
  }

  function handleOnClickEdit(){
    seteditableProjectVisible(true)
  }
  const closeProjectDescriptionHandler = () =>{
    seteditableProjectVisible(false);
    }

  async function handleSetProject() {
    let res;
    if (localStorage.getItem("projectID") == null) return;
    res = await axios.post("/project/get_by_projectID", {
      data: {
        projectID: localStorage.getItem("projectID"),
      },
    });
    setProject(res.data.project.projectName);
  }

  const checkUserSignup = async () => {
    let resUserType = await fetchUserType(user.email);
    setUserType(resUserType);
    const data = {
      email: user.email,
    };
    const res = await axios.post("/student/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if (resUserType === "Professor") return navigate("/professor/dashboard");
    else if (resUserType === "Admin") return navigate("/admin/dashboard");
    if (!isSignup && resUserType === "Student")
      return navigate("/student/signup");
    if (!isSignup && resUserType === "Professor")
      return navigate("/professor/signup");
    if (
      localStorage.getItem("projectID") &&
      localStorage.getItem("projectID").length === 0
    )
      return navigate("/professor/dashboard");
  };
  const getUser = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/student/get_user", { data: data });
    setProfile(res.data.user);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    checkUserSignup();
    getUser();
  }, [user, loading]);
  return (
    <div>
      {profile && <Navbar user={profile} userType={userType} />}
      <div className="flex flex-row relative">
        {(showNotification == 1 ||
          window.matchMedia("(min-width: 1024px)").matches) && (
          <div className="z-10 absolute lg:relative left-0 top-[10%] bg-gray-200 lg:bg-white h-full w-full  sm:w-1/2 lg:flex lg:w-1/5 mt-2 z border-gray-300 border-x-2">
            {user ? (
              <MyProjectsSide
                email={user.email}
                isProfessor={userType === "Professor"}
              />
            ) : (
              <div />
            )}
          </div>
        )}
        <div className="flex flex-col flex-grow">
          <div className=" flex w-full justify-center relative">
          <button className=" absolute right-3 top-0 bottom-0 hover:bg-gray-300 rounded-full px-2 my-1 " onClickCapture={handleOnClickEdit}>
              <RemoveRedEyeIcon />
              {editableProjectVisible&&(
        <ModalProjectDescription
          user={user}
          visible={editableProjectVisible}
          setVisible={seteditableProjectVisible}
          closeHandler={closeProjectDescriptionHandler}
          projectID={localStorage.getItem("projectID")}
          userCanEdit={false}
        />
      )}
            </button>
            <h3 className=" self-center">{project}</h3>
          </div>
          <div className=" bg-gray-100 w-full  grid grid-cols-2 grid-rows-1 items-center lg:hidden">
            <button
              className="  w-full flex  py-2 px-2.5 border-r-2 border-black justify-start  hover:bg-slate-500 hover:text-white"
              onClickCapture={() => handleShowNotification(1)}
            >
              {/* <span className="material-icons-outlined">bubble_chart</span> */}
              {showNotification == 1 ? <CloseIcon /> : <ReceiptLongIcon />}
              <span>Show All Projects</span>
            </button>
            <button
              className=" w-full flex  py-2 px-2.5 justify-start  hover:bg-slate-500 hover:text-white"
              onClickCapture={() => handleShowNotification(2)}
            >
              {/* <span className="material-icons-outlined">bubble_chart</span> */}
              {showNotification == 2 ? (
                <CloseIcon />
              ) : (
                <NotificationsPausedIcon />
              )}

              <span>Notifications</span>
            </button>
          </div>
          <DragDrop projectID={localStorage.getItem("projectID")} />
        </div>
        {(showNotification == 2 ||
          window.matchMedia("(min-width: 1024px)").matches) && (
          <div className="absolute lg:relative  top-[10%] sm:w-1/2  lg:top-0 right-0 lg:flex  w-full lg:w-1/6 bg-gray-200 lg:bg-white h-full">
            {user && (
              <ProjectNotifications
                isProfessor={userType === "Professor"}
                projectID={localStorage.getItem("projectID")}
                email={user.email}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
