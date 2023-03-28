import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout, fetchUserType } from "../../firebase";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import Reports from "../Reports/Reports";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [userType,setUserType]=useState("")

  const checkUser = async () => {
    // console.log(user)
    let resUserType = await fetchUserType(user.email);
    if (resUserType === "Professor") navigate("/professor/dashboard");
    if (resUserType === "Student") navigate("/student/dashboard");
    setUserType(resUserType)
  };

  useEffect(() => {
    // console.log(auth)
    if (loading) return;
    if (!user) navigate("/login");
    if (user) checkUser();
  }, [user, loading]);
  return (userType)
    ?
    <div className=" flex flex-col h-screen">
    <div className="flex justify-end w-full py-4  bg-slate-100">
            <div className=" flex flex-column justify-end items-center mx-5">
              <Button
                style={{
                  padding: "0rem 6.2rem 0rem 6.2rem",
                }}
                onClickCapture={()=>{
                  logout() 
                  navigate("/")}}
              >
                Logout
              </Button>
            </div>
          </div>
    <Reports userType={userType}email={user.email}/>
    </div>
    :
    <></>
}
