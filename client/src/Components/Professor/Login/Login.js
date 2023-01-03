import React, { useEffect,useState } from "react";
import {Button, Input,Spacer } from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle,logInWithEmailAndPassword} from "../../../firebase";
import GoogleButton from 'react-google-button'
import axios from "axios";
import Signup from "./Signup"

/**TODO
 1. Check if email belongs to correct domain
 2. Seperate into different components if necessary
 3. Reset Password
 */

export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  const [email,setEmail]=useState("")
  const [loginState,setLoginState]=useState("login");
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/professor/dashboard");
  }, [user, loading]);




  const checkUserLoggedIn=async(event)=>{
    event.preventDefault();
    let emailInput=document.forms[0].email.value;
    setEmail(emailInput)
    const data={
      email:emailInput
    }
    const res=await axios.post("/professor/is_signup",{data:data})
    if(res.data.isSignup)setLoginState("isSignup")
    else setLoginState("noSignup")
  }
  const EmailInput=()=>{
    return <div className="flex justify-center content-center h-screen flex-col flex-wrap">
    <form>
    <Input
        clearable
        underlined
        labelPlaceholder="Email"
        name="email"
      />
      <Spacer y={1.5}/>
      <Button onClickCapture={checkUserLoggedIn}>Enter Email</Button>
      <Spacer y={1}/>
      <GoogleButton onClickCapture={signInWithGoogle}>
        <img
          src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
          alt="google icon"
        />
        <span> Continue with Google</span>
      </GoogleButton>
      <Spacer y={1}/>
      <Button onClickCapture={()=>{navigate("/student/login")}}>Login As Student</Button>
      </form>
    </div>
  }
  




  const loginThroughPassword=(event)=>{
    event.preventDefault();
    const password=document.forms[0].password.value
    logInWithEmailAndPassword(email,password)
  }
  const PasswordInput=()=>{
    return <div className="flex justify-center content-center h-screen flex-col flex-wrap">
    <form>
      <Input
          clearable
          underlined
          labelPlaceholder="Password"
          name="password"
          type="password"
        />
        <Spacer y={1.5}/>
        <Button onClickCapture={loginThroughPassword}>Enter Password</Button>
        <Spacer y={1}/>
        <GoogleButton onClickCapture={signInWithGoogle}>
        <img
          src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
          alt="google icon"
        />
        <span> Continue with Google</span>
      </GoogleButton>
      <Spacer y={1}/>
      <Button onClickCapture={()=>{setLoginState("login")}}>Change Email</Button>
      </form>
        </div>
  }



  return (
    (loginState==="login")
    ?
    <EmailInput/>
    :
    (loginState==="isSignup")
    ?
    <PasswordInput/>
    :
    <Signup email={email}/>
  );
}