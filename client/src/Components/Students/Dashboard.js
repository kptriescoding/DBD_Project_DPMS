import { Button } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import Navbar from "./Navbar";
import axios from "axios"

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const checkUserSignup=async()=>{
    const data={
        email:user.email
    }
   const res=await axios.post("/student/is_signup",{data:data})
   let isSignup=res.data.isSignup;
   if(!isSignup&&localStorage.getItem("user")==="student")return navigate("/student/signup")
   if(!isSignup&&localStorage.getItem("user")==="professor")return navigate("/professor/signup")
  }
  const getUser=async()=>{
    const data={
        email:user.email
    }
   const res=await axios.post("/student/get_user",{data:data})
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    checkUserSignup();
    getUser();
  }, [user, loading]);
  return (
    <div>
    <Navbar/>
      <div>
      Hello Student {name}
      </div>
    </div>
  );
}
