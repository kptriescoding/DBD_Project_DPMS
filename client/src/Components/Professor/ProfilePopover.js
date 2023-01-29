import React, { useState } from "react";
import { Button, Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ModalCreateProject from "../Projects/ModalCreate";
import { useNavigate } from "react-router-dom";
import {Popover} from "@nextui-org/react";
import Profile from "./Profile";

const ProfilePopover=({user})=>{
    const navigate=useNavigate()
return <Popover>
<Popover.Trigger>
  <Button auto flat>{(user)?user.firstName:"Someother"}</Button>
</Popover.Trigger>
<Popover.Content>
<button
onClickCapture={()=>{navigate("/professor/profile")}}
className="w-full px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650"
>
Profile
</button>
<button
onClickCapture={logout}
className="w-full px-4 py-2.5 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-650"
>
Logout
</button>
</Popover.Content>
</Popover>
}

export default ProfilePopover