import { Button } from "@nextui-org/react";
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
  const [profile,setProfile]=useState({});

  const checkUserSignup=async()=>{
    const data={
        email:user.email
    }
   const res=await axios.post("/professor/is_signup",{data:data})
   let isSignup=res.data.isSignup;
   if(!isSignup)return navigate("/professor/signup")
  }
  const getUser=async()=>{
    const data={
        email:user.email
    }
   const res=await axios.post("/professor/get_user",{data:data})
   console.log(res.data.user);
   setProfile(res.data.user);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/professor/login");
    checkUserSignup();
    getUser();
  }, [user, loading]);
  return (
    <div>
    <Navbar user={profile}/>
      <div>
      Hello Professor
      </div>
    </div>
  );
}
