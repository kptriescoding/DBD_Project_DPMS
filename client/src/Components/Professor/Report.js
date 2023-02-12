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
import Reports from "../Reports/Reports";

export default function ProfessorReport() {
  const [user, loading, error] = useAuthState(auth);
  const [project,setProject]=useState({})
  const navigate = useNavigate();
  const [userType,setUserType]=useState("")
  const [profile, setProfile] = useState({});

  const checkUserSignup = async () => {
    let resUserType=await fetchUserType(user.email)
    setUserType(resUserType)
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if(resUserType==="Student")
    return navigate("/student/dashboard")
    else if(resUserType==="Admin")navigate("/admin/dashboard");
    if (!isSignup && resUserType=== "Student")
      return navigate("/student/signup");
    if (!isSignup && resUserType === "Professor")
      return navigate("/professor/signup");
    if(!localStorage.getItem("projectID"))
        return navigate("/professor/dashboard")
  };
  const getUser = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/get_user", { data: data });
    setProfile(res.data.user);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    checkUserSignup();
    getUser();
  }, [user, loading]);
  return (<div>
    { profile &&<Navbar user={profile}  userType={userType}/>}
    {userType&&<Reports userType={userType} email={user.email}/>}
    </div>
  );
}
