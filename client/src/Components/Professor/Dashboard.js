import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import Navbar from "./Navbar";
import axios from "axios";
import MyProjects from "../MyProjects";
import AllProjects from "../AllProjects";
import ProfessorNavbar from "./Navbar";
import MyProjectsCentre from "../Projects/MyProjectsCentre";

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
            email: props.email,
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
            email: props.email,
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
    console.log("dsfs");
    setAllProjects(() => {
      console.log("dsfs");
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
      <div>
        {user ? (
          <MyProjectsCentre
            email={user.email}
            isProfessor={
              localStorage.getItem("user") === "professor" ? true : false
            }
          />
        ) : (
          <div />
        )}
      </div>
      <div className=" mt-2 ">
        <AllProjects projects={allProjects} />
      </div>
    </div>
  );
}
