import React from "react";
import { Button, Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ProfilePopover from "./ProfilePopover";
import { useNavigate } from "react-router-dom";
import SpeechRecognizer from "../SpeechRecognizer";

export default (props) => {
  const collapseItems = ["Profile", "Dashboard", "Reports"];
  const links = ["/student/dashboard", "/student/report"];

  const navigate = useNavigate();
  return (
    <section className=" flex flex-grow my-2 justify-end ">
      <Navbar variant={"sticky"} color className="flex justify-end">
        <Navbar.Toggle showIn="xs" />
        <Navbar.Content className=" flex justify-end "  hideIn="xs">
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

        <Navbar.Collapse>
          {collapseItems.map((item, index) => (
            <Navbar.CollapseItem
              key={item}
              activeColor="secondary"
              css={{
                color: index === collapseItems.length - 1 ? "$error" : "",
              }}
              isActive={index === 2}
            >
              {index == 0 ? (
                <ProfilePopover
                  user={props.user}
                  userType={props.userType}
                  style={{ width: "100%" }}
                />
              ) : (
                <button
                  className=" border-b-2 border-black w-3/5"
                  onClickCapture={() => {
                    navigate(links[index - 1]);
                  }}
                >
                  {item}
                </button>
              )}
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </section>
  );
};
