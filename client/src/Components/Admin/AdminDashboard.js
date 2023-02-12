import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout, fetchUserType } from "../../firebase";
import React, { useEffect, useState } from "react";
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
    <Reports userType={userType}email={user.email}/>
    :
    <></>
}
