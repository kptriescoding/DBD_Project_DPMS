import React, { useState } from "react";
import { Button, Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ModalCreateProject from "../Projects/ModalCreate";
import ReactSearchBox from "react-search-box";
import { Input } from "postcss";
export default function ProfessorNavbar(props) {
  const [createProjectVisible, setCreateProjectVisible] = useState(false);
  const createProjectHandler = () => setCreateProjectVisible(true);
  const closeCreateProjectHandler = () => setCreateProjectVisible(false);

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
        <Navbar.Content>
          <Navbar.Item>
            <div class="container flex mx-auto">
              <div class="flex border-2 rounded">
                <input
                  type="text"
                  onInput={(e) => props.setsearchText(e.target.value)}
                  class="px-4 py-2 w-80"
                  placeholder="Search For Projects"
                />
                <button
                  class="flex items-center justify-center px-4 border-r hover:bg-blue-200"
                  onClickCapture={props.searchListener}
                >
                  <svg
                    class="w-6 h-6 text-gray-600 "
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </Navbar.Item>
        </Navbar.Content>
        <Navbar.Content className=" flex justify-center">
          <Navbar.Link
            variant="underline"
            className=" justify-center flex"
            onClickCapture={createProjectHandler}
          >
            Create Project
          </Navbar.Link>
          <Navbar.Link>Analytics</Navbar.Link>
          {/* </Navbar.Content> */}

          {/* <Navbar.Content> */}
          <Navbar.Item>
            <Button onClick={logout} className="">
              Logout
            </Button>
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
