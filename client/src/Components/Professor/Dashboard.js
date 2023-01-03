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


  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
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
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/professor/login");
    checkUserSignup();
    fetchUserName();
    getUser();
  }, [user, loading]);
  return (
    <div>
    <Navbar/>
      <div>
      Hello Professor {name}
      </div>
    </div>
  );
}
