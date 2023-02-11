import React from "react";
import { Button,Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ProfilePopover from "./ProfilePopover";
import { useNavigate } from "react-router-dom";
import SpeechRecognizer from "../SpeechRecognizer";

export default (props)=>{
  const navigate=useNavigate()
    return <section className=" flex flex-grow my-2 justify-center">
    <Navbar variant={"sticky"} color={"primary"}>
    <Navbar.Content className=" flex justify-center">
    <Navbar.Link
    onClick={()=>{navigate("/student/dashboard")}}
    >
    Dashboard
    </Navbar.Link>
    <Navbar.Item>
    <ProfilePopover user={props.user} userType={props.userType}/>
    </Navbar.Item>
    <Navbar.Item>
    <SpeechRecognizer isProfessor={(props.userType==="Professor")?true:false}/>
    </Navbar.Item>
    </Navbar.Content>
        </Navbar>
        </section>
}