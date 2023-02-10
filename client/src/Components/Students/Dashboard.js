import { Button } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout,fetchUserType } from "../../firebase";
import Navbar from "./Navbar";
import axios from "axios";
import MyProjects from "../Projects/MyProjects";
import AllProjects from "../Projects/AllProjects";
import MyProjectsCentre from "../Projects/MyProjectsCentre";
import MyApplications from "../MyApplications";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [userType,setUserType]=useState("")
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [searchText, setsearchText] = useState("");

  const checkUserSignup = async () => {
    let resUserType=await fetchUserType(user.email)
    setUserType(resUserType)
    const data = {
      email: user.email,
    };
    const res = await axios.post("/student/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if (resUserType === "Professor")
      return navigate("/professor/dashboard");
      else if(resUserType==="Admin")navigate("/admin/dashboard");
    if (!isSignup && resUserType === "Student")
      return navigate("/student/signup");
    if (!isSignup && resUserType === "Professor")
      return navigate("/professor/signup");
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
    handleSetAllProjects();
   
  }, [user, loading]);
  useEffect(() => {
    console.log(userType)
    handleSetAllProjects();
  }, []);

  async function handleSetAllProjects() {
    let arr;
    try {
      const allProjectsFromDatabase = await axios.post(
        "/project/get_projects",
        {
          data: {
            email: user.email,
          },
        }
      );
      arr = allProjectsFromDatabase.data.projects;
    } catch (err) {
      console.log(err);
    }
    setAllProjects(() => {
      return arr;
    });
  }
  async function handleSetFilterAllProjects() {
    let arr;
    try {
      const allProjectsFromDatabase = await axios.post(
        "/project/get_projects_for_word_search",
        {
          data: {
            email: user.email,
            words: searchText,
          },
        }
      );
      arr = allProjectsFromDatabase.data.projects;
    } catch (err) {
      console.log(err);
    }
    setAllProjects(() => {
      return arr;
    });
  }
  return (
    <div>
      <Navbar user={profile} userType={userType} />
      <div className=" flex flex-row">
        <div className=" w-1/5 mt-2 ">
          <AllProjects
            projects={allProjects}
            setsearchText={setsearchText}
            searchListener={handleSetFilterAllProjects}
            user={profile}
            isProfessor={userType==="Professor"}
          />
        </div>

        <div className=" w-full mt-2 ">
          {user ? (
            <>
              <span className="flex flex-wrap items-center font-bold text-black text-2xl w-full text-center">
                Your Projects
              </span>
              <MyProjectsCentre
                email={user.email}
                isProfessor={
                  userType
                }
              />
            </>
          ) : (
            <div style={{ width: "inherit" }} />
          )}
        </div>
        <div className=" w-1/6 mt-2">
          {profile ? (
            <MyApplications
              isProfessor={
                userType=="Student"?false:true
              }
              user={profile}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
