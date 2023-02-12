import React, { useEffect, useState } from "react";
import ReactDropdown from "react-dropdown"
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import rvce from "../../assets/styles/download-removebg-preview.png";
import { Modal,Text } from "@nextui-org/react";

export default function ModalStudentDescription({
  visible,
  setVisible,
  closeHandler,
email}) {
  const [profile,setProfile]=useState({})
  const [isEditable,setIsEditable]=useState(false)
  const [dept,setDept]=useState("")
  const departmentNames = ["AS", "ISE", "CSE", "ECE", "ETE", "ME", "CV"];
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [multiSelectSkills,setMultiSelectSkills] = useState([
    { label:"Java",value:"Java"},
    {label:"C++",value:"C++"},
    {label:"Web Development",value:"Web Development"},
    {label:"Machine Learning",value:"Machine Learning"},
    {label:"Deep Learning",value:"Deep Learning"},
    {label:"DevOps",value:"DevOps"},
    {label:"Cloud-Computing",value:"Cloud-Computing"},
    {label:"Android-Development",value:"Android-Development"},
    {label:"Block Chain",value:"Block Chain"},
  ]);
  const getUser = async () => {
    const data = {
      email: email,
    };
    const res = await axios.post("/student/get_user", { data: data });
    setProfile(res.data.user);
    setSelectedSkills(res.data.user.skills)
    setDept(res.data.user.deptName)
  };

  useEffect(() => {
    if(email)getUser()
  }, [email]);
  return (
    <div>
    <Modal closeButton onClose={closeHandler} open={visible}>
        <Modal.Header>
        <Text size={18}>Student Details</Text>
        </Modal.Header>
        <Modal.Body>
    {(profile!==null)&&
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-neutral-100">
        <div className="w-full px-10 pt-6 pb-10 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
            <div>
              <div className="flex flex-col items-center mb-10">
                <img src={rvce} className="h-24 bg-white" />
                {/* <h3 className="text-4xl font-bold text-purple-600">Logo</h3> */}
              </div>
            </div>
            <div>
              <div className="flex flex-col items-start ">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  defaultValue={profile.firstName}
                  disabled={!isEditable}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="textarea"
                  placeholder="Middle Name"
                  name="middleName"
                defaultValue={profile.middleName}
                  disabled={!isEditable}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="textarea"
                  placeholder="Last Name"
                  name="lastName"
                  defaultValue={profile.lastName}
                  disabled={!isEditable}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-start ">
                <input
                  type="text"
                  placeholder="USN"
                  name="USN"
                  enterKeyHint="next"
                  defaultValue={profile.USN}
                  disabled={!isEditable}
                  className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
                />
              </div>
            </div>

            <div className="mt-4">
            <div className="flex flex-col items-start ">
              <input
                type="Number"
                placeholder="SEM"
                name="Sem"
                enterKeyHint="next"
                defaultValue={profile.Sem}
                disabled={!isEditable}
                className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col items-start ">
              <input
                type="number"
                placeholder="CGPA"
                name="CGPA"
                defaultValue={profile.CGPA}
                disabled={!isEditable}
                className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
              />
            </div>
          </div>
         
            
            
          
          <div className="mt-4">
            <div className="flex flex-col items-start ">
              <textarea
                placeholder="Local Address"
                name="tempAddress"
                defaultValue={profile.tempAddress}
                disabled={!isEditable}
                className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col items-start ">
              <textarea
                placeholder="Permanent Address"
                name="permAddress"
                defaultValue={profile.permAddress}
                disabled={!isEditable}
                style={{
                  width: "100%",
                }}
                className="block w-full mt-1 border-gray-300 px-2 py-2 border-2 rounded-md  shadow-sm focus:border-blue-300 "
              />
            </div>
          </div>
          <MultiSelect
                className="mt-5"
            options={multiSelectSkills}
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Skills"
            disabled={!isEditable}
            isCreatable={true}
            onCreateOption={newSkill=>({label:newSkill,value:newSkill})}
          />
            <ReactDropdown
              options={departmentNames}
              className=" flex w-full h-40 px-2 py-2 mt-4"
              placeholder="Choose Department"
                value={dept}
                onChange={(event)=>setDept(event.value)}
            >
              {" "}
            </ReactDropdown>

        </div>
      </div>}
      </Modal.Body>
      </Modal>
    </div>
  );
}
