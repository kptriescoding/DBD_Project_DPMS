import React, { useState } from "react";
import { Button, Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ModalCreateProject from "../Projects/ModalCreate";
import { useNavigate } from "react-router-dom";
import {Popover} from "@nextui-org/react";
import ProfilePopover from "./ProfilePopover";
export default function ProfessorNavbar(props) {
  const [createProjectVisible, setCreateProjectVisible] = useState(false);
  const createProjectHandler = () => setCreateProjectVisible(true);
  const closeCreateProjectHandler = () => setCreateProjectVisible(false);
  const navigate=useNavigate()

  return (
    <section className=" flex flex-grow justify-between ">
      <Navbar
        variant={"sticky"}
        color={"primary"}
        style={{
          justifyContent: "space-between",
          flexGrow:"initial"
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
          onClick={()=>{navigate("/professor/dashboard")}}
          >
          Dashboard
          </Navbar.Link>
          <Navbar.Item>
          <ProfilePopover user={props.user}/>
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