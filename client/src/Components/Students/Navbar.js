import React from "react";
import { Button,Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";

export default ()=>{
    return <section className=" flex flex-grow my-2 justify-center">
    <Navbar variant={"sticky"} color={"primary"}>
          <Navbar.Content className=" flex justify-center">
            <Navbar.Link variant="underline" className=" justify-center flex">
              Home
            </Navbar.Link>
            <Navbar.Link>Analytics</Navbar.Link>
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Item>
              <Button onClick={logout} className="">
                Logout
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
        </section>
}