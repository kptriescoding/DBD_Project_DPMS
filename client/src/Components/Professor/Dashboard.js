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

export default function Dashboard(props) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
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
      <div className=" mt-2 ">
        <AllProjects projects={allProjects}/>
      </div>
    </div>
  );
}
