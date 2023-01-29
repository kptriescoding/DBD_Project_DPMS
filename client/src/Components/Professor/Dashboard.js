import { Button, StyledDivider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import axios from "axios";
import AllProjects from "../Projects/AllProjects";
import ProfessorNavbar from "./Navbar";
import MyProjectsCentre from "../Projects/MyProjectsCentre";
import MyApplications from "../MyApplications";

export default function Dashboard(props) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [user, loading, error] = useAuthState(auth);
  const [allProjects, setAllProjects] = useState([]);
  const [searchText, setsearchText] = useState("");

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
      console.log(arr);
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
  const checkUserSignup = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if (!isSignup && localStorage.getItem("user") === "student")
      return navigate("/student/signup");
    if (!isSignup && localStorage.getItem("user") === "professor")
      return navigate("/professor/signup");
    if (localStorage.getItem("user") === "student")
      return navigate("/student/dashboard");
  };
  const getUser = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/get_user", { data: data });
    console.log(res.data.user);
    setProfile(res.data.user);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    checkUserSignup()
    getUser()
    setAllProjects(() => {
      handleSetAllProjects();
    });
  }, []);
  return (
    <div className="">
      <ProfessorNavbar
        user={profile}
        searchListener={handleSetFilterAllProjects}
        setsearchText={setsearchText}
      />
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
<MyApplications/>
        </div>
      </div>
    </div>
  );
}
