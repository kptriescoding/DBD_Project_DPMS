import React from "react";
import { Button, Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ProfilePopover from "./ProfilePopover";
import { useNavigate } from "react-router-dom";
import SpeechRecognizer from "../SpeechRecognizer";

export default (props) => {
  const navigate = useNavigate();
  return (
    <section className=" flex flex-grow my-2 justify-end ">
      <Navbar variant={"sticky"} color className="flex justify-end">
        <Navbar.Content className=" flex justify-end">
          <Navbar.Link
            onClick={() => {
              navigate("/student/dashboard");
            }}
          >
            Dashboard
          </Navbar.Link>
          <Navbar.Link
            onClick={() => {
              navigate("/student/report");
            }}
          >
            Report
          </Navbar.Link>
          <Navbar.Item>
            <ProfilePopover user={props.user} userType={props.userType} />
          </Navbar.Item>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
            <SpeechRecognizer
              isProfessor={props.userType === "Professor" ? true : false}
            />
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </section>
  );
};
