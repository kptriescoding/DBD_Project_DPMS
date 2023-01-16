import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input, Spacer } from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
} from "../firebase";
import GoogleButton from "react-google-button";
import axios from "axios";
import ProfessorSignup from "./Professor/Login/Signup";
import StudentSignup from "./Students/Login/Signup";
import rvce from "../assets/styles/download-removebg-preview.png";
/**TODO
 1. Check if email belongs to correct domain
 2. Seperate into different components if necessary
 3. Reset Password
 */

export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password,setPassword]=useState("");
  const [loginState, setLoginState] = useState("login");
  const [isProfessor, setisProfessor] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user&&localStorage.getItem("user")==="professor") navigate("/professor/dashboard");
    else if(user&&localStorage.getItem("user")==="student")navigate("/student/dashboard");
  }, [user, loading]);
  const handleOnClickIsProfessor = () => setisProfessor(!isProfessor);
  const loginThroughPassword = (event) => {
    event.preventDefault();
    let password=document.forms[0].password.value
    logInWithEmailAndPassword(email, password);
  };

  const checkUserLoggedIn = async (event) => {
    event.preventDefault();
    let email=document.forms[0].email.value
    setEmail(email)
    const data = {
      email: email,
    };
    if (isProfessor) {
      localStorage.setItem("user","professor")
      const res = await axios.post("/professor/is_signup", { data: data });
      if (res.data.isSignup) setLoginState("isSignup");
      else setLoginState("noSignup");
    } else {
      localStorage.setItem("user","student")
      const res = await axios.post("/student/is_signup", { data: data });
      if (res.data.isSignup) setLoginState("isSignup");
      else setLoginState("noSignup");
    }
  };
  const changeEmail=()=>setLoginState("login")
  const logInWithGoogle=()=>{
    if(isProfessor)localStorage.setItem("user","professor")
    else localStorage.setItem("user","student")
    signInWithGoogle()
  }
  const EmailInput = () => {
    return (
      <div className=" bg-neutral-100 flex justify-center content-center h-screen flex-col flex-wrap">
        <div className=" ">
          <div className=" flex justify-center -mb-12 z-10">
            <img src={rvce} className=" justify-center w-1/5"></img>
          </div>

          <form className="pt-32 pb-10 px-12 bg-white">
            {/* <!-- Email input --> */}
            <div className=" w-full items-center justify-center">
              <h2 className=" text-center">CPMS</h2>
            </div>
            {(loginState==="login")?
           <div><div className="mb-6">
              <input
                type="text"
                className="block w-full px-4 py-3 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email address"
                name="email"
                // value={email}
              />
            </div>
            <button
              type="submit"
              onClickCapture={checkUserLoggedIn}
              className="inline-block px-7 py-3.5 bg-blue-600 text-white font-medium text-base leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Sign in
            </button>
            </div> :
            <div><div className="mb-6">
              <input
                type="password"
                className="form-control block w-full px-4 py-3 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password"
                name="password"
                // value={password}
              />
            </div>
            <button
              type="submit"
              onClickCapture={loginThroughPassword}
              className="inline-block px-7 py-3.5 bg-blue-600 text-white font-medium text-base leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Enter Password
            </button>
            <button
              type="submit"
              onClickCapture={changeEmail}
              className="inline-block px-7 py-3.5 bg-blue-600 text-white font-medium text-base leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Change Email
            </button>
            </div> 
    }
            <div class="flex justify-between items-center mt-2.5">
              <Checkbox
                isSelected={isProfessor}
                size="sm"
                
                onChange={handleOnClickIsProfessor}
                label="Login As Professor"
              />
            </div>
            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="text-center font-semibold mx-4 mb-0">OR</p>
            </div>

            <div className=" flex justify-center w-full my-3">
              <GoogleButton
                onClickCapture={logInWithGoogle}
                className="w-full items-center "
                style={{
                  width: "100%",
                  backgroundColor: "rgb(37 99 235)",
                }}
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
                  alt="google icon"
                />
                <span className=" flex-grow"> Continue with Google</span>
              </GoogleButton>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (loginState === "login"|| loginState==="isSignup" )? (
    <EmailInput />
  ) : isProfessor === true ? (
    <ProfessorSignup email={email} />
  ) : (
    <StudentSignup email={email} />
  );
}
