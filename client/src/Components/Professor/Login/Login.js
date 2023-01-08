import React, { useEffect, useState } from "react";
import { Button, Input, Spacer } from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
} from "../../../firebase";

import GoogleButton from "react-google-button";
import axios from "axios";
import Signup from "./Signup";
import rvce from "../../../assets/styles/download-removebg-preview.png";
/**TODO
 1. Check if email belongs to correct domain
 2. Seperate into different components if necessary
 3. Reset Password
 */

export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [loginState, setLoginState] = useState("login");
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/professor/dashboard");
  }, [user, loading]);

  const checkUserLoggedIn = async (event) => {
    event.preventDefault();
    let emailInput = document.forms[0].email.value;
    console.log(emailInput);
    setEmail(emailInput);
    const data = {
      email: emailInput,
    };
    const res = await axios.post("/professor/is_signup", { data: data });
    if (res.data.isSignup) setLoginState("isSignup");
    else setLoginState("noSignup");
  };
  const EmailInput = () => {
    return (
      <div className="  flex justify-center content-center h-screen flex-col flex-wrap">
        {/* <form>
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
      </form> */}
        <div className=" ">
          <div className=" flex justify-center -mb-12 z-10">
            <img src={rvce} className=" justify-center w-1/5"></img>
          </div>

          <form className="pt-32 pb-8 px-8 bg-blue-50">
            {/* <!-- Email input --> */}
            <div className=" w-full items-center justify-center">
              <h2 className=" text-center font-sans italic">DPMS</h2>
            </div>
            <div className="mb-6">
              <input
                type="text"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email address"
              />
            </div>
            <button
              type="submit"
              onClickCapture={checkUserLoggedIn}
              className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              name="email"
            >
              Sign in
            </button>

            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="text-center font-semibold mx-4 mb-0">OR</p>
            </div>

            <button
              type="submit"
              onClickCapture={() => {
                navigate("/student/login");
              }}
              className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Login as Student
            </button>

            <div className=" flex justify-center w-full my-3">
              <GoogleButton
                onClickCapture={signInWithGoogle}
                className="w-full items-center "
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

  const loginThroughPassword = (event) => {
    event.preventDefault();
    const password = document.forms[0].password.value;
    logInWithEmailAndPassword(email, password);
  };
  const PasswordInput = () => {
    return (
      <div className="flex justify-center content-center h-screen flex-col flex-wrap">
        <form>
          <Input
            clearable
            underlined
            labelPlaceholder="Password"
            name="password"
            type="password"
          />
          <Spacer y={1.5} />
          <Button onClickCapture={loginThroughPassword}>Enter Password</Button>
          <Spacer y={1} />
          <GoogleButton onClickCapture={signInWithGoogle}>
            <img
              src="https://img.icons8.com/ios-filled/50/000000/google-logo.png"
              alt="google icon"
            />
            <span> Continue with Google</span>
          </GoogleButton>
          <Spacer y={1} />
          <Button
            onClickCapture={() => {
              setLoginState("login");
            }}
          >
            Change Email
          </Button>
        </form>
      </div>
    );
  };

  return loginState === "login" ? (
    <EmailInput />
  ) : loginState === "isSignup" ? (
    <PasswordInput />
  ) : (
    <Signup email={email} />
  );
}
