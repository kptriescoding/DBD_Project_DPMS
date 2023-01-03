import { Button, Input,Spacer,Textarea,Dropdown } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db ,linkMailWithGoogle,registerWithEmailAndPassword } from "../../../firebase";
import axios from "axios";

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

  const saveUser=async(event)=>{
    event.preventDefault();
    let email
    if(props&&props.email)email=props.email
    else email=user.email
    const data={
        firstName:document.forms[0].firstName.value,
        lastName:document.forms[0].lastName.value,
        middleName:document.forms[0].middleName.value,
        yearOfJoining:document.forms[0].yearOfJoining.value,
        email:email,
        deptName:"IS",
    }
  let  res=await axios.post("/professor/save_user",{data:data})
   const password=document.forms[0].password.value
  //  console.log(email+password+"!")
   if(res.data.success){
   if(!user)res= await registerWithEmailAndPassword(props.email,password)
   else
   res=await linkMailWithGoogle(email,password) 
   console.log(res)
  return navigate("/professor/dashboard")
   }
    else{
      alert("Something is wornf")
    }

  }
  const checkUserSignup=async()=>{
    let email
    if(user&&user.email)email=user.email
    else email=props.email
    const data={
        email:email
    }
   const res=await axios.post("/professor/is_signup",{data:data})
   let isSignup=res.data.isSignup;
   if(isSignup)return navigate("/professor/dashboard")
  }

  useEffect(() => {
    if (loading) return;
    if(!user&&!props.email) return navigate("/professor/login");
    checkUserSignup()
  }, [user, loading]);
  return (
    <div className="flex content-center flex-col flex-wrap">
    <h1>Enter Details </h1>
    <Spacer y={1.5}/>
    <form>
    <Input
        clearable
        underlined
        labelPlaceholder="First Name"
        name="firstName"
      />
      <Spacer y={2}/>
      <Input
        clearable
        underlined
        labelPlaceholder="Middle Name"
        name="middleName"
      />
      <Spacer y={2}/>
      <Input
        clearable
        underlined
        labelPlaceholder="Last Name"
        name="lastName"
      />
      <Spacer y={2}/>
      <Input
        clearable
        underlined
        labelPlaceholder="Year Of Joining"
        name="yearOfJoining"
      />
      <Spacer y={2}/>
      <Input
          clearable
          underlined
          labelPlaceholder="Password"
          name="password"
          type="password"
        />
      <Spacer y={2}/>
      <Input
          clearable
          underlined
          labelPlaceholder=" Renter Password"
          name="rpassword"
          type="password"
        />
      <Spacer y={1.5}/>
      {/*<Dropdown>
      <Dropdown.Button light>Department</Dropdown.Button>
      <Dropdown.Menu aria-label="Static Actions">
        <Dropdown.Item key="IS">IS</Dropdown.Item>
        <Dropdown.Item key="CS">CS</Dropdown.Item>
        <Dropdown.Item key="CV">CV</Dropdown.Item>
      </Dropdown.Menu>
      </Dropdown>*/}
      </form>
      <Button onClickCapture={saveUser}>Enter Details
      </Button>
      <Spacer y={1}/>
    </div>
  );
}
