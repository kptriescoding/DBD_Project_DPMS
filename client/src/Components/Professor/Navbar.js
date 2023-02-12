import React, { createContext, useState } from "react";
import { Button, Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ModalCreateProject from "../Projects/ModalCreate";
import { useNavigate } from "react-router-dom";
import { Popover } from "@nextui-org/react";
import ProfilePopover from "./ProfilePopover";
import SpeechRecognizer from "../SpeechRecognizer";

export default function ProfessorNavbar(props) {
  const [createProjectVisible, setCreateProjectVisible] = useState(false);
  const createProjectHandler = () => setCreateProjectVisible(true);
  const closeCreateProjectHandler = () => setCreateProjectVisible(false);
  const navigate = useNavigate();

  return (
    <section className=" flex flex-grow w-full  ">
      <Navbar
        variant={"sticky"}
        style={{
          width: "inherit",
          
        }}
      >
        <Navbar.Content className=" flex justify-center">
          <Navbar.Link
            variant="underline"
            className=" justify-center flex"
            onClickCapture={createProjectHandler}
          >
            Create Project
          </Navbar.Link>
          <Navbar.Link
            onClickCapture={() => {
              navigate("/professor/dashboard");
            }}
          >
            Dashboard
          </Navbar.Link>
          <Navbar.Link
            onClickCapture={() => {
              navigate("/professor/report");
            }}
          >
            Reports
          </Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
            <ProfilePopover user={props.user} userType={props.userType} />
          </Navbar.Item>
          <Navbar.Item>
            <SpeechRecognizer
              isProfessor={props.userType === "Professor" ? true : false}
            />
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      {createProjectVisible ? (
        <ModalCreateProject
          user={props.user}
          visible={createProjectVisible}
          setVisible={createProjectVisible}
          closeHandler={closeCreateProjectHandler}
        />
      ) : (
        <div />
      )}
    </section>
  );
}
