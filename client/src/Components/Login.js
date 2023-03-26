import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input, Spacer, Radio } from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
  fetchUserType,
} from "../firebase";
import GoogleButton from "react-google-button";
import axios from "axios";
import ProfessorSignup from "./Professor/Signup";
import StudentSignup from "./Students/Signup";
import rvce from "../assets/styles/download-removebg-preview.png";
import bgimg from "../assets/styles/background_image.png";
import coder_image from "../assets/styles/coding_deep.png";
/**TODO
 1. Check if email belongs to correct domain
 2. Seperate into different components if necessary
 3. Reset Password
 */

export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [loginState, setLoginState] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  let userTypes = {
    1: "Student",
    2: "Professor",
    3: "Admin",
  };
  const [userRoute, setUserRoute] = useState("");
  const [defaultUserType, setDefaultUserType] = useState(1);

  let userType;

  const checkIfAlreadyLoggedIn = async () => {
    let resUserType;
    resUserType = await fetchUserType(user.email);
    if (resUserType === "Professor") navigate("/professor/dashboard");
    else if (resUserType === "Student") navigate("/student/dashboard");
    else if (resUserType === "Admin") navigate("/admin/dashboard");
  };
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) checkIfAlreadyLoggedIn();
  }, [user, loading]);

  const loginThroughPassword = async (event) => {
    setErrorMessage("");
    event.preventDefault();
    userType = userTypes[document.forms[0].isProfessor.value];
    setUserRoute(userType);
    let password = document.forms[0].password.value;
    try {
      await logInWithEmailAndPassword(email, password, userType);
    } catch (err) {
      setErrorMessage("Invalid Password");
    }
  };

  const checkUserLoggedIn = async (event) => {
    event.preventDefault();

    userType = userTypes[document.forms[0].isProfessor.value];
    setUserRoute(userType);
    setErrorMessage("");
    let email = document.forms[0].email.value;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setErrorMessage("Enter Valid Email");
      return;
    }
    let resUserType = await fetchUserType(email);
    if (resUserType) {
      if (resUserType == "Admin") setLoginState("isSignup");
      userType = resUserType;
    }
    if (userType == "Admin" && !resUserType) {
      setErrorMessage("You don't have access to sign in as admin");
      return;
    }
    setEmail(email);
    const data = {
      email: email,
    };
    if (userType == "Professor") {
      const res = await axios.post("/professor/is_signup", { data: data });
      if (res.data.isSignup) setLoginState("isSignup");
      else setLoginState("noSignup");
    } else if (userType == "Student") {
      const res = await axios.post("/student/is_signup", { data: data });
      if (res.data.isSignup) setLoginState("isSignup");
      else setLoginState("noSignup");
    }
    setDefaultUserType(
      Object.keys(userTypes).find((key) => userTypes[key] === userType)
    );
  };
  const changeEmail = () => setLoginState("login");
  const logInWithGoogle = async () => {
    userType = userTypes[document.forms[0].isProfessor.value];
    setUserRoute(userType);
    await signInWithGoogle(userType);
  };
  const EmailInput = () => {
    return (
      <div
        className="  flex justify-center content-center h-screen  flex-wrap bg-no-repeat bg-cover  bg-black/20 bg-blend-multiply"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="rounded-2xl grid grid-cols-2 shadow-2xl border-2 border-blue-200">
          <div className=" bg-sky-300 grid py-6 rounded-l-2xl ">
            <div className=" flex-grow justify-center justify-self-center">
              <img src={coder_image} className=" self-center w-full"></img>
            </div>
            <div className=" flex justify-center text-center px-3 py-4 flex-col">
              <h3 className=" font-serif italic ">
                College Project Management System
              </h3>
              <span className=" ">Let's Increase the Culture of Doing Projects in College </span>
            </div>
          </div>
          <div className=" bg-blue-50 rounded-r-2xl">
            <div className=" flex justify-center -mb-12 z-10">
              <img src={rvce} className=" justify-center w-1/5"></img>
            </div>

            <form className="pt-32 pb-10 px-12 bg-blue-50">
              {/* <!-- Email input --> */}
              <div className=" w-full items-center justify-center ">
                {/* <h2 className=" text-center">CPMS</h2> */}
              </div>
              {loginState === "login" ? (
                <div>
                  <div className="mb-6">
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
                    className="inline-block px-7 py-3.5 bg-sky-500 text-white font-medium text-base leading-snug uppercase rounded shadow-md hover:bg-sky-600 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-sky-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    Sign in
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
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
                    className="inline-block px-7 py-3.5 bg-sky-700 text-white font-medium text-base leading-snug uppercase rounded shadow-md hover:bg-sky-800 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full mb-2"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    Enter Password
                  </button>
                  <button
                    type="submit"
                    onClickCapture={changeEmail}
                    className="inline-block px-7 py-3.5 bg-sky-700 text-white font-medium text-base leading-snug uppercase rounded shadow-md hover:bg-sky-800 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    Change Email
                  </button>
                </div>
              )}
              <div class="flex justify-between items-center mt-2.5">
                <Radio.Group
                  aria-label="Login-Type"
                  defaultValue={defaultUserType.toString()}
                  orientation="horizontal"
                  name="isProfessor"
                >
                  <Radio value="1" isDisabled={loginState !== "login"}>
                    Student
                  </Radio>
                  <Radio value="2" isDisabled={loginState !== "login"}>
                    Professor
                  </Radio>
                  <Radio value="3" isDisabled={loginState !== "login"}>
                    Admin
                  </Radio>
                </Radio.Group>
              </div>
              <p className="text-center font-semibold mx-4 mb-0 text-2xl font-light text-red-500">
                {errorMessage}
              </p>
              <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                <p className="text-center font-semibold mx-4 mb-0">OR</p>
              </div>
              <div className=" flex justify-center w-full my-3">
                <GoogleButton
                  onClickCapture={logInWithGoogle}
                  className="w-full items-center hover:bg-sky-600 bg-sky-500"
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
      </div>
    );
  };

  return loginState === "login" || loginState === "isSignup" ? (
    <EmailInput />
  ) : userRoute == "Professor" ? (
    <ProfessorSignup email={email} userType={userRoute} />
  ) : (
    <StudentSignup email={email} userType={userRoute} />
  );
}
