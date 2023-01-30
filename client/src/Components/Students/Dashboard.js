import { Button } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import Navbar from "./Navbar";
import axios from "axios";
import MyProjects from "../Projects/MyProjects";
import AllProjects from "../Projects/AllProjects";
import MyProjectsCentre from "../Projects/MyProjectsCentre";
import MyApplications from "../MyApplications";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [searchText, setsearchText] = useState("");

  const checkUserSignup = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/student/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if (!isSignup && localStorage.getItem("user") === "student")
      return navigate("/student/signup");
    if (!isSignup && localStorage.getItem("user") === "professor")
      return navigate("/professor/signup");
    if (localStorage.getItem("user") === "professor")
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
    handleSetAllProjects();
  }, [user, loading]);
   useEffect(() => {
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
      <Navbar user={profile} />
      <div className=" flex flex-row">
        <div className=" w-1/6 mt-2 ">
          <AllProjects
            projects={allProjects}
            setsearchText={setsearchText}
            searchListener={handleSetFilterAllProjects}
            isProfessor={
              localStorage.getItem("user") === "professor" ? true : false
            }
          />
        </div>

        <div className=" w-full mt-2 ">
          {user ? (
            <MyProjectsCentre
              email={user.email}
              isProfessor={
                localStorage.getItem("user") === "professor" ? true : false
              }
            />
          ) : (
            <div style={{ width: "inherit" }} />
          )}
        </div>
        <div className=" w-1/6 mt-2">
        {(profile)?<MyApplications isProfessor={localStorage.getItem("user")==="student"?false:true} user={profile}/>:<div/>}
        </div>
      </div>
    </div>
  );
}
