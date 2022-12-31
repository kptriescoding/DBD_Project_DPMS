import { Button, Navbar } from "@nextui-org/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import DragDrop from "./DragDropComponents/DragDrop";

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
    <div>
      <section className=" flex flex-grow my-2 justify-center">
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
      <div>
        <DragDrop />
      </div>

      {/*<section>
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
           <img
            class="w-full"
            src="/img/card-top.jpg"
            alt="Sunset in the mountains"
          > 
            <h2 className=" text-black bold">Professor Name</h2>
          </img> 
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
            <p class="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus qzuia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
          </div>
          <div class="px-6 pt-4 pb-2">
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #photography
            </span>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #travel
            </span>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #winter
            </span>
            <img className=" object-scale-down inline-block rounded-full h-10 w-10" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACLCAMAAABmx5rNAAAAllBMVEX////s8PHnTDy9w8ft8fLd4uSVpabx9PW5v8PN0tXmQzHnSDfvk4zr4eHS19rAx8rAOSudq626ys6Sqqv++fjNlpPpPyvRQTPj6On2ysbxp6Htg3rlMxzvl4/paF2ar7GpenbCMB/dRzjBNCX529jOq6q/hYG0fnnaPCrDKhasdXCZm5u1W1OubWm+PjGfkY+xaGKii4mk43DfAAADvklEQVR4nO2b63aqMBCFK4SC2CM5xSIqtqK92Wpb3//lTriEDMtbEgjHVWf/nBV2voxhCKVzc4NC/Va5PfdCXNy+bduB09DFCZhLvyFN7NmZvH4jl37pEjcxIXapRjAlChNpxcXTT7DrtbKiyqVJfmPg0g7LUNtk2DaL3YDFRpbrY9EvvU5zltFkOr8XNi93unoRJvfz6WSkTPI8S5LIFyz3D4mvp+QBuPhRksye1XIy933LsgaQJbL0FEGWAQv4/lwhN6PHYmIzLCz0KA0zevQtoyyWLw0z59MClqABS7DHYkVzOZRnn9sMnv5yPb36R+Y6J/8VuAyqqNwGnlWz+uEtV9iABbgI65kMyigRNsDlTZvl7RCLlcjsmIlgSYHL4l2T5X0BXFLBMpFgmVabdFxjSQ/OdF5pjWXMw9FUgmXO87ikqxrL+MhkpzWusazosoz7MnfSHWcZ0zVw+UgrGxUtafoBXNaUr8i/U2GhdP0pXDYrTZbVRrB8rinVZEm3lc0npZoslFYrCrepNgulu1CkRZelSky4yyy1WMbM5us7ZEbh7U/aIC/pz21mEn5/sQXp7ZfMhq43i91uu0rBitSUXZiutrvdYrOmYEEaLHTFlJNQzXuaFjRMVJ+ltKmkhVIkRqhakCJLHWZ5aCIJLQ+iKLNAGF2UGgz4mZVZrOV4z0RD3GQJYuosOU7NQ0/7JloshoQsyIIsyIIsnCUadKFIhuVPV5JgcUk3kvnA4Pa6EbIgC7JcNwusTYcDvVOBY9fosBBHKM59YhApxpwKxLkJvIbos8Bvn5kNAR+Jg4IWDClmCsAn4Pwa+O2zFRa7ZBGBkkUE7JJFBEoWEUAWZEEWZLlslv9fdy/oeXRJz2mjQpZfx0LsgIvXl0AoH+GAQHlPC/H6IlzM1rr9+nJVdRdZkAVZfhfL3llKota1e5bqCzmFL4jkI2IQKI5bIFDwOyCCZ6mzQpZ2WM7/9kRtiD4LGQoV95EDIvmIGASK++jkNYbqi52P2K8voLLh38iQBVmQBVlUWYR43a3E665QWXdFgNddIaNnKbPPRjjepGT6C+NuYIhMY+CwExR2tpBhcbpIDDvVSLDUXhzMsfRlekCHXgeJYbVAJi+OFxjfviQOPJlmvB4rtoZhSMxKcE+CJWskDBxijoaQrLVbrr0wOyt77P3ZlJzsAC/Z6+vyJ9vQaV9D/nSV7Mfm7xmeCZXW0m2k4I3GjFS6sQ3DqDWGx545Gk+5X57dd2b2S1+n49glcfuS+ndDFAqFQl2d/gE5pr10a7mbYgAAAABJRU5ErkJggg=="/>
          </div>
        </div>
        </section>
      <button
        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full "
        onClick={logout}
      >
        Logout
      </button> */}
      {/*<Button>Default</Button> */}
    </div>
  );
}
