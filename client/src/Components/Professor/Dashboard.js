import { Button, Spacer, StyledDivider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout, fetchUserType } from "../../firebase";
import axios from "axios";
import AllProjects from "../Projects/AllProjects";
import ProfessorNavbar from "./Navbar";
import MyProjectsCentre from "../Projects/MyProjectsCentre";
import MyApplications from "../MyApplications";

export default function Dashboard(props) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const [allProjects, setAllProjects] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [userType, setUserType] = useState("");

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
  };
  const getUser = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/professor/get_user", { data: data });
    // console.log(res.data.user);
    setProfile(res.data.user);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    checkUserSignup();
    if (profile === null) getUser();
    setAllProjects(() => {
      handleSetAllProjects();
    });
  }, [user, loading, profile]);
  return (
    <div className=" ">
      {profile ? (
        <ProfessorNavbar
          userType={userType}
          user={profile}
          searchListener={handleSetFilterAllProjects}
          setsearchText={setsearchText}
        />
      ) : (
        <div />
      )}
      <div className=" flex flex-row">
        {profile && userType ? (
          <div className=" w-1/5 mt-2 ">
            <AllProjects
              projects={allProjects}
              setsearchText={setsearchText}
              searchListener={handleSetFilterAllProjects}
              user={profile}
              isProfessor={userType === "Professor"}
            />
          </div>
        ) : (
          <div />
        )}

        <div className=" w-full mt-2 items-center bg-gray-100 shadow-sm rounded-lg border border-gray-300">
          {user && userType ? (
            <div className=" flex-grow">
              <div className=" flex w-full justify-center py-2 border-b border-gray-400">
                <span className=" font-bold text-black text-2xl w-full text-center">
                  Your Projects
                </span>
              </div>
              <MyProjectsCentre
                email={user.email}
                isProfessor={userType === "Professor"}
              />
            </div>
          ) : (
            <div style={{ width: "inherit" }} />
          )}
        </div>
        <div className=" w-1/5  border-2 p-2 shadow-sm rounded-xl mx-2">
          {profile && userType ? (
            <MyApplications
              isProfessor={userType === "Professor"}
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
