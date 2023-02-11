import { Button, Input, Spacer, Textarea } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ReactDropdown from "react-dropdown"
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import {
  auth,fetchUserType
} from "../../firebase";
import axios from "axios";
import rvce from "../../assets/styles/download-removebg-preview.png";
import ProfessorNavbar from "./Navbar";

/*
TODO:
1. Improve UI
2. Add  Dept
3. professor Papers Input 
4. professor expertice Input
5. Enter Verification for Each
6. Replace document.forms[0] by some common variable
*/

export default function Profile(props) {
  const [user, loading, error] = useAuthState(auth);
  const [profile,setProfile]=useState({})
  const navigate = useNavigate();
  const [isEditable,setIsEditable]=useState(false)
  const [dept,setDept]=useState("")
  const departmentNames = ["AS", "ISE", "CSE", "ECE", "ETE", "ME", "CV"];
  const [errorMessage,setErrorMessage]=useState("")
  const [userType,setUserType]=useState("")
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [multiSelectSkills,setMultiSelectSkills] = useState([
    { label:"Java",value:"Java"},
    {label:"C++",value:"C++"},
    {label:"Web Development",value:"Web Development"},
    {label:"Machine Learning",value:"Machine Learning"},
    {label:"Deep Learning",value:"Deep Learning"},
    {label:"DevOps",value:"DevOps"},
    {label:"Cloud-Computing",value:"Cloud-Computing"},
    {label:"Android-Development",value:"Android-Development"},
    {label:"Block Chain",value:"Block Chain"},
  ]);
  const updateUser = async (event) => {
    event.preventDefault();
    setErrorMessage("")
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
        skills:selectedSkills.map((skill)=>skill.value),
        email: email,
        deptName: dept,
      };
      if(!data.firstName||!data.lastName||!data.tempAddress||!data.permAddress||!data.CGPA||!data.USN||!data.Sem||!data.deptName){
        setErrorMessage("Enter All Values")
        return
      }
      if(!(/^[a-z ,.'-]+$/i).test(data.firstName)||!(/^[a-z ,.'-]*$/i).test(data.middleName)||!(/^[a-z ,.'-]+$/i).test(data.lastName))
      {
        setErrorMessage("Name Shouldn't Contain Invalid Characters")
        return
      }
    let res = await axios.post("/student/update_user", { data: data });
    if(res.data.success)setIsEditable(false)
  };
  const checkUserSignup = async () => {
    let resUserType=await fetchUserType(user.email)
    setUserType(resUserType)
    const data = {
      email: user.email,
    };
    const res = await axios.post("/student/is_signup", { data: data });
    let isSignup = res.data.isSignup;
    if (resUserType === "Professor")
    return navigate("/professor/dashboard");
    else if(resUserType==="Admin")
    navigate("/admin/dashboard");
    if (!isSignup && resUserType === "Student")
      return navigate("/student/signup");
    if (!isSignup && resUserType === "Professor")
      return navigate("/professor/signup");
  };
  const getUser = async () => {
    const data = {
      email: user.email,
    };
    const res = await axios.post("/student/get_user", { data: data });
    setProfile(res.data.user);
    setSelectedSkills(res.data.user.skills)
    let skills=[...multiSelectSkills,...res.data.user.skills]
    skills = skills.filter((value, index, self) =>
  index === self.findIndex((t) => (
    t.label === value.label
  ))
)
    setMultiSelectSkills(skills)
    setDept(res.data.user.deptName)
  };

  useEffect(() => {
    if (loading) return;
    if (!user ) return navigate("/login");
    checkUserSignup();
    getUser()
  }, [user, loading]);
  return (
    <div>
    <ProfessorNavbar user={profile} userType={userType}/>
    {(profile!==null)?
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
                  defaultValue={profile.firstName}
                //   onChangeCapture={(event)=>{
                //     profile.firstName=event.target.value
                //     setProfile(profile)
                //   }}
                  disabled={!isEditable}
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
                defaultValue={profile.middleName}
                  disabled={!isEditable}
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
                  defaultValue={profile.lastName}
                  disabled={!isEditable}
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
                  defaultValue={profile.USN}
                  disabled={!isEditable}
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
                defaultValue={profile.Sem}
                disabled={!isEditable}
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
                defaultValue={profile.CGPA}
                disabled={!isEditable}
                className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
              />
            </div>
          </div>
         
            
            
          
          <div className="mt-4">
            <div className="flex flex-col items-start ">
              <textarea
                placeholder="Local Address"
                name="tempAddress"
                defaultValue={profile.tempAddress}
                disabled={!isEditable}
                className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col items-start ">
              <textarea
                placeholder="Permanent Address"
                name="permAddress"
                defaultValue={profile.permAddress}
                disabled={!isEditable}
                style={{
                  width: "100%",
                }}
                className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
              />
            </div>
          </div>
          <MultiSelect
                className="mt-5"
            options={multiSelectSkills}
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Skills"
            disabled={!isEditable}
            isCreatable={true}
            onCreateOption={newSkill=>({label:newSkill,value:newSkill})}
          />
            <ReactDropdown
              options={departmentNames}
              className=" flex w-full h-40 px-2 py-2 mt-4"
              placeholder="Choose Department"
                value={dept}
                onChange={(event)=>setDept(event.value)}
            >
              {" "}
            </ReactDropdown>
           
            <p className="text-center font-semibold mx-4 mb-0 text-2xl text-red-500">{errorMessage}</p>
            <div className="flex items-center mt-4">
            {(!isEditable)?
                <button
                onClickCapture={(event)=>{
                    event.preventDefault()
                    setIsEditable(true)}
                }
                className="w-full px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650"
              >
                Edit
              </button>
                :
              <button
                onClickCapture={updateUser}
                className="w-full px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650"
              >
               Update
              </button>
              
            }
            </div>
          </form>

          <div className="my-6 space-y-2"></div>
        </div>
      </div>
        :<div/>}
    </div>
  );
}
