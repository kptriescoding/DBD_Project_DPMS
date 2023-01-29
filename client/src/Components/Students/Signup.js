import { Button, Dropdown, Input, Spacer, Textarea } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import ReactDropdown from "react-dropdown";
import {
  auth,
  db,
  linkMailWithGoogle,
  registerWithEmailAndPassword,
} from "../../firebase";
import axios from "axios";
import rvce from "../../assets/styles/download-removebg-preview.png";
/*
TODO:
1. Improve UI
2. Add Resume Uploading (think of way) and Dept
3. Student Skills Input 
4. Student Achievements Input
5. Enter Verification for Each
6. Replace document.forms[0] by some common variable
*/

export default function Signup(props) {
  const [dept,setDept]=useState("")
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const departmentNames = [
    "AS","ISE","CSE","ECE","ETE","ME","CV",
  ]
  const saveUser = async (event) => {
    event.preventDefault();
    let email;
    if (props && props.email) email = props.email;
    else email = user.email;
    
    const data = {
      firstName: document.forms[0].firstName.value,
      lastName: document.forms[0].lastName.value,
      middleName: document.forms[0].middleName.value,
      tempAddress: document.forms[0].tempAddress.value,
      permAddress: document.forms[0].permAddress.value,
      CGPA: document.forms[0].CGPA.value,
      USN: document.forms[0].USN.value,
      Sem: document.forms[0].Sem.value,
      resume: "404 Error Not Found",
      email: email,
      deptName: dept,
    };
    let res = await axios.post("/student/save_user", { data: data });
    const password = document.forms[0].password.value;
    //  console.log(email+password+"!")
    if (res.data.success) {
      if (!user)
        res = await registerWithEmailAndPassword(props.email, password);
      else res = await linkMailWithGoogle(email, password);
      console.log(res);
      return navigate("/student/dashboard");
    } else {
      alert("Something is wrong");
    }
  };
  const checkUserSignup = async () => {
    let email;
    if (user && user.email) email = user.email;
    else email = props.email;
    const data = {
      email: email,
    };
    const res = await axios.post("/student/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if(isSignup&&localStorage.getItem("user")==="student")return navigate("/student/dashboard")
   if(isSignup&&localStorage.getItem("user")==="professor")return navigate("/professor/dashboard")
  };

  useEffect(() => {
    if (loading) return;
    if (!user && !props.email) return navigate("/login");
    checkUserSignup();
  }, [user, loading]);
  return (
    <div>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-neutral-100">
        <div className="w-full px-10 pt-6 pb-10 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
          <form>
            <div>
              <div className="flex flex-col items-center mb-10">
                <img src={rvce} className="h-24 bg-white" />
                {/* <h3 className="text-4xl font-bold text-purple-600">Logo</h3> */}
              </div>
            </div>
            <div>
              <div className="flex flex-col items-start ">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="textarea"
                  placeholder="Middle Name"
                  name="middleName"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="textarea"
                  placeholder="Last Name"
                  name="lastName"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="text"
                  placeholder="USN"
                  name="USN"
                  enterKeyHint="next"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="password"
                  placeholder="Confirm password"
                  name="rpassword"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="Number"
                  placeholder="SEM"
                  name="Sem"
                  enterKeyHint="next"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="number"
                  placeholder="CGPA"
                  name="CGPA"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
           
              
              
            
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <textarea
                  placeholder="Local Address"
                  name="tempAddress"
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <textarea
                  placeholder="Permanent Address"
                  name="permAddress"
                  style={{
                    width: "100%",
                  }}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <ReactDropdown
            options={departmentNames}
            className=" flex w-full h-40 px-2 py-2 mt-4"
            placeholder="Choose Department"
              onChange={(event)=>setDept(event.value)}
          >
            {" "}
          </ReactDropdown>

            <div className="flex items-center mt-4">
              <button onClickCapture={saveUser} className="w-full px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650">
                Sign Up
              </button>
            </div>
          </form>

          <div className="my-6 space-y-2"></div>
        </div>
      </div>
    </div>
  );
}
