import React, { createContext, useState } from "react";
import { Button, Navbar } from "@nextui-org/react";
import { logout } from "../../firebase";
import ModalCreateProject from "../Projects/ModalCreate";
import { Link, useNavigate } from "react-router-dom";
import { Popover } from "@nextui-org/react";
import ProfilePopover from "./ProfilePopover";
import SpeechRecognizer from "../SpeechRecognizer";

export default function ProfessorNavbar(props) {
  const [createProjectVisible, setCreateProjectVisible] = useState(false);
  const createProjectHandler = () => setCreateProjectVisible(true);
  const closeCreateProjectHandler = () => setCreateProjectVisible(false);
  const navigate = useNavigate();
  const collapseItems = ["Profile", "Dashboard", "Create Project", "Reports"];
  const links = ["/professor/dashboard", "/professor/report"];

  return (
    <section className=" flex flex-grow w-full  ">
      <Navbar
        variant={"sticky"}
        style={{
          width: "inherit",
        }}
      >
        <Navbar.Toggle showIn="xs" />
        <Navbar.Content className=" flex justify-center" hideIn="xs">
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

        <Navbar.Content hideIn="xs" variant="highlight">
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
              <Link
                color="inherit"
                css={{
                  minWidth: "100%",
                }}
                onClickCapture={() => {
                  navigate(links[index]);
                }}
              >
                {item}
              </Link>
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
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

/*
export default function App() {
  const collapseItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Layout>
      <Navbar isBordered variant="sticky">
        <Navbar.Toggle showIn="xs" />
        <Navbar.Brand
          css={{
            "@xs": {
              w: "12%",
            },
          }}
        >
          <AcmeLogo />
          <Text b color="inherit" hideIn="xs">
            ACME
          </Text>
        </Navbar.Brand>
        <Navbar.Content
          enableCursorHighlight
          activeColor="warning"
          hideIn="xs"
          variant="highlight"
        >
          <Navbar.Link href="#">Features</Navbar.Link>
          <Navbar.Link isActive href="#">
            Customers
          </Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Company</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content
          css={{
            "@xs": {
              w: "12%",
              jc: "flex-end",
            },
          }}
        >
          <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="warning"
                  size="md"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </Dropdown.Trigger>
            </Navbar.Item>
            <Dropdown.Menu
              aria-label="User menu actions"
              color="warning"
              onAction={(actionKey) => console.log({ actionKey })}
            >
              <Dropdown.Item key="profile" css={{ height: "$18" }}>
                <Text b color="inherit" css={{ d: "flex" }}>
                  Signed in as
                </Text>
                <Text b color="inherit" css={{ d: "flex" }}>
                  zoey@example.com
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="settings" withDivider>
                My Settings
              </Dropdown.Item>
              <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
              <Dropdown.Item key="analytics" withDivider>
                Analytics
              </Dropdown.Item>
              <Dropdown.Item key="system">System</Dropdown.Item>
              <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
              <Dropdown.Item key="help_and_feedback" withDivider>
                Help & Feedback
              </Dropdown.Item>
              <Dropdown.Item key="logout" withDivider color="error">
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Content>
        <Navbar.Collapse disableAnimation>
          {collapseItems.map((item, index) => (
            <Navbar.CollapseItem
              key={item}
              activeColor="warning"
              css={{
                color: index === collapseItems.length - 1 ? "$error" : "",
              }}
              isActive={index === 2}
            >
              <Link
                color="inherit"
                css={{
                  minWidth: "100%",
                }}
                href="#"
              >
                {item}
              </Link>
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </Layout>
  );
}

*/
