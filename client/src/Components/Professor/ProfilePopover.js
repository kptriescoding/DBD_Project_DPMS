import React, { useState } from "react";
import { Button, Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ModalCreateProject from "../Projects/ModalCreate";
import { useNavigate } from "react-router-dom";
import { Popover } from "@nextui-org/react";
import Profile from "./Profile";

const ProfilePopover = ({ user, userType }) => {
  const navigate = useNavigate();
  return (
    <Popover>
      <Popover.Trigger>
        <Button auto flat>
          {user ? user.firstName : "Someother"}
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <div>
          <span className=" mx-2 text-sm">{userType}</span>
        </div>
        <button
          onClickCapture={() => {
            navigate("/professor/profile");
          }}
          className="w-full px-4 py-2.5 border-t-2 border-gray-400 tracking-wide text-black transition-colors duration-200 transform bg-gray-200  hover:bg-gray-300 focus:outline-none"
        >
          Profile
        </button>
        <button
          onClickCapture={() => {
            logout();
            navigate("/login");
          }}
          className="w-full px-4 py-2.5 border-t-2 border-gray-400 tracking-wide text-black transition-colors duration-200 transform bg-red-400 hover:bg-red-500 focus:outline-none "
        >
          Logout
        </button>
      
      </Popover.Content>
    </Popover>
  );
};

export default ProfilePopover;
