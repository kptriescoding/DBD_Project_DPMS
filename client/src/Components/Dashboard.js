import { Button, Navbar } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);
  return (
    <div className=" flex flex-grow my-2 justify-center">
      <Navbar variant={"sticky"} color={"primary"}>
        <Navbar.Content className=" flex justify-center">
          <Navbar.Link variant="underline" className=" justify-center flex">Home</Navbar.Link>
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
      {/* <button
        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full "
        onClick={logout}
      >
        Logout
      </button> */}
      {/* <Button>Default</Button> */}
    </div>
  );
}
