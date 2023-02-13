import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import Navbar from "./Navbar";
import axios from "axios";
import ProjectNotifications from "../Projects/ProjectNotifications";
import MyProjectsSide from "../Projects/MyProjects";
import DragDrop from "../DragDropComponents/DragDrop";
import { fetchUserType } from "../../firebase";

export default function Projects() {
  const [user, loading, error] = useAuthState(auth);
  const [project, setProject] = useState("");
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [profile, setProfile] = useState({});

  const checkUserSignup = async () => {
    let resUserType = await fetchUserType(user.email);
    setUserType(resUserType);
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if (resUserType === "Student") return navigate("/student/dashboard");
    else if (resUserType === "Admin") navigate("/admin/dashboard");
    if (!isSignup && resUserType === "Student")
      return navigate("/student/signup");
    if (!isSignup && resUserType === "Professor")
      return navigate("/professor/signup");
    if (!localStorage.getItem("projectID"))
      return navigate("/professor/dashboard");
  };
  const getUser = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/get_user", { data: data });
    setProfile(res.data.user);
  };
  useEffect(() => {
    handleSetProject();
  }, []);

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

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    checkUserSignup();
    getUser();
  }, [user, loading]);
  return (
    <div>
      {profile && <Navbar user={profile} userType={userType} />}
      <div className="flex flex-row">
        <div className=" sticky flex w-1/5 mt-2 z border-gray-300 border-x-2">
          {user ? (
            <MyProjectsSide
              email={user.email}
              isProfessor={userType === "Professor"}
            />
          ) : (
            <div />
          )}
        </div>
        <div className="flex flex-col flex-grow ">
          <div className=" flex w-full justify-center">
            <h3 className=" self-center">{project}</h3>
          </div>
          <DragDrop projectID={localStorage.getItem("projectID")} />
        </div>
        <div className="flex w-1/6">
          {user && (
            <ProjectNotifications
              isProfessor={userType === "Professor"}
              projectID={localStorage.getItem("projectID")}
              email={user.email}
            />
          )}
        </div>
      </div>
    </div>
  );
}
