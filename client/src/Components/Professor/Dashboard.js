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
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";

export default function Dashboard(props) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const [allProjects, setAllProjects] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [userType, setUserType] = useState("");
  const [openProOrNo, setOpenProOrNo] = useState(0);

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

  function handeleSetOpenOrPro(val) {
    
    if(openProOrNo==0) setOpenProOrNo(val);
    else setOpenProOrNo(0)
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
      <div className=" grid grid-cols-2 justify-items-center w-full lg:hidden ">
        <button
          className=" bg-gray-200 py-2 self-center w-full border-r-2 border-black hover:bg-gray-600  hover:text-white"
          onClickCapture={() => handeleSetOpenOrPro(1)}
        >
          {openProOrNo == 1 ? <CloseIcon /> : <ReceiptLongIcon />}
        
          All Projects
        </button>
        <button
          className=" bg-gray-200 py-2 self-center w-full  border-black hover:bg-gray-600  hover:text-white"
          onClickCapture={() => handeleSetOpenOrPro(2)}
        >
          {openProOrNo == 2 ? <CloseIcon /> : <NotificationsPausedIcon />}
          My Applications
        </button>
      </div>
      <div className=" flex flex-row relative">
        {(openProOrNo == 1 || window.matchMedia("(min-width: 768px)").matches) && profile && userType ? (
          <div className="absolute lg:relative left-0 right-0 top-0 z-10 w-full md:w-4/5 bg-slate-50 lg:w-1/5 mt-2 ">
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
        {(openProOrNo == 2 || window.matchMedia("(min-width: 768px)").matches)&& (
          <div className="absolute lg:sticky h-full bg-gray-200 right-0 top-1 w-3/5 lg:w-1/5  border-2 p-2 shadow-sm rounded-xl mx-2">
            {profile && userType ? (
              <MyApplications
                isProfessor={userType === "Professor"}
                user={profile}
              />
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
