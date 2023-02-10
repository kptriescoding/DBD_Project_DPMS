import { Button, Input, Spacer, Textarea } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ReactDropdown from "react-dropdown"
// import  {Multiselect} from "multiselect-react-dropdown"

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  fetchUserType,
  linkMailWithGoogle,
  registerWithEmailAndPassword,
} from "../../firebase";
import axios from "axios";
import rvce from "../../assets/styles/download-removebg-preview.png";

/*
TODO:
1. Improve UI
2. Add  Dept
3. professor Papers Input 
4. professor expertice Input
5. Enter Verification for Each
6. Replace document.forms[0] by some common variable
*/

export default function Signup(props) {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [dept,setDept]=useState("")
  const departmentNames = ["AS", "ISE", "CSE", "ECE", "ETE", "ME", "CV"];
  const [errorMessage,setErrorMessage]=useState()
  const saveUser = async (event) => {
    event.preventDefault();
    let email;
    if (props && props.email) email = props.email;
    else email = user.email;
    const data = {
      firstName: document.forms[0].firstName.value,
      lastName: document.forms[0].lastName.value,
      middleName: document.forms[0].middleName.value,
      yearOfJoining: document.forms[0].yearOfJoining.value,
      email: email,
      deptName: dept,
    };
    const password = document.forms[0].password.value;
    const rpassword = document.forms[0].rpassword.value;
    if(!data.firstName||!data.lastName||!data.email||!data.yearOfJoining||!data.deptName||!password||!rpassword){
      setErrorMessage("Enter All Values")
      return
    }
    if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))){
      setErrorMessage("Password must have Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
      return
    }
    if(!(/^[a-z ,.'-]+$/i).test(data.firstName)||!(/^[a-z ,.'-]*$/i).test(data.middleName)||!(/^[a-z ,.'-]+$/i).test(data.lastName))
      {
        setErrorMessage("Name Shouldn't Contain Invalid Characters")
        return
      }
    if(password!==rpassword){
      setErrorMessage("Both the passwords entered must be same")
      return
    }
    let res = await axios.post("/professor/save_user", { data: data });
    //  console.log(email+password+"!")
    if (res.data.success) {
      if (!user)
        res = await registerWithEmailAndPassword(props.email, password,props.userType);
      else res = await linkMailWithGoogle(email, password);
      console.log(res);
      return navigate("/professor/dashboard");
    } else {
      alert("Something is wornf");
    }
  };
  const checkUserSignup = async () => {
    let email;
    let userType=props.userType
    if (user && user.email){
       email = user.email;
       userType=await fetchUserType(email)
    }
    else email = props.email;
    const data = {
      email: email,
    };
    const res = await axios.post("/professor/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if(userType==="Admin")navigate("/admin/dashboard");
    if(isSignup&&userType==="Student")return navigate("/student/dashboard")
   if(isSignup&&userType==="Professor")return navigate("/professor/dashboard")
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
                  type="number"
                  placeholder="Year of Joining"
                  name="yearOfJoining"
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
            <p className="text-center font-semibold mx-4 mb-0 text-2xl font-light text-red-500">{errorMessage}</p>

            <div className="flex items-center mt-4">
              <button
                onClickCapture={saveUser}
                className="w-full px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650"
              >
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
