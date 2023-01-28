import React,{useState} from "react";
import { Button,Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ModalCreateProject from "../Projects/ModalCreate";
import { useNavigate } from "react-router-dom";

export default ({user})=>{
  const navigate=useNavigate()
  const [createProjectVisible, setCreateProjectVisible] = useState(false);
    const createProjectHandler = () =>setCreateProjectVisible(true);
    const closeCreateProjectHandler=()=>setCreateProjectVisible(false)
    return <section className=" flex flex-grow justify-center">
    <Navbar variant={"sticky"} color={"primary"}>
          <Navbar.Content className=" flex justify-center">
            <Navbar.Link variant="underline" className=" justify-center flex" onClickCapture={createProjectHandler} >
              Create Project
            </Navbar.Link>
            <Navbar.Link onClickCapture={()=>{navigate("/professor/dashboard")}}>
            Dashboard
            </Navbar.Link>
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Item>
              <Button onClick={logout} className="">
                Logout
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
       {(createProjectVisible)?<ModalCreateProject user={user} visible={createProjectVisible} setVisible={createProjectVisible} closeHandler={closeCreateProjectHandler}/>:<div/>}
       </section>
}