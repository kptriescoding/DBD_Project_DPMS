import React, { createContext, useContext, useState } from "react";
import {
  Button,
  Modal,
  Text,
  Input,
  Textarea,
  Col,
  Card,
} from "@nextui-org/react";
// import {auth,useAuthState} from "../../firebase"
import axios from "axios";
import { MultiSelect  } from "react-multi-select-component";

/**
 *
 * TODO
 * handle input cvalidation and error correction
 */
export const CreateProjectContext = createContext();
const ModalProjectDescription = ({ user, visible, setVisible, closeHandler }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [funding, setFunding] = useState("");
  const [collaborator, setCollaborator] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errorMessage,setErrorMessage]=useState("")
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
  const addNewProject = async () => {
    if(!name||!description||!collaborator||!funding||!startDate||!endDate){
      setErrorMessage("Enter all the details")
      return
    }
    if(startDate>endDate){
      setErrorMessage("Start Date Can't be greater than end")
      return
    }

    const newProject = {
      title: name,
      description: description,
      collaborator: collaborator,
      funding: funding,
      startDate: startDate,
      endDate: endDate,
      professorEmail: user.email,
      projectID: Date.now(),
      skills:selectedSkills.map((skill)=>skill.value)
    };
    // console.log(newProject);
    let res = await axios.post("/project/create", { data: newProject });
    if(res.data.success) {
      await axios.post("/project/dragdrop/create",{data:newProject})
    }
    if (res.data.success){
       closeHandler();
       triggerOnAdditionOfProject();
    }
  };
  
  function triggerOnAdditionOfProject(){
  }
  return (
    <CreateProjectContext.Provider value={triggerOnAdditionOfProject}>
    <div>
      <Modal closeButton onClose={closeHandler} open={visible}>
        <Modal.Header>
          <Text size={18}>Enter New Project Details</Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            value={name}
            size="lg"
            placeholder="Title"
            aria-label="Title"
            onChangeCapture={(event) => setName(event.target.value)}
          />
          <Textarea
            clearable
            bordered
            fullWidth
            color="primary"
            value={description}
            size="lg"
            placeholder="Description"
            aria-label="Description"
            onChangeCapture={(event) => setDescription(event.target.value)}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            value={collaborator}
            size="lg"
            placeholder="Collaborator"
            aria-label="Collaborator"
            onChangeCapture={(event) => setCollaborator(event.target.value)}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            value={funding}
            type="number"
            size="lg"
            placeholder="Funding in Rs."
            aria-label="Funding in Rs."
            onChangeCapture={(event) => setFunding(event.target.value)}
          />
          <MultiSelect
            options={multiSelectSkills}
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Skills"
            isCreatable={true}
            onCreateOption={newSkill=>({label:newSkill,value:newSkill})}
          />
          <Input
            bordered
            fullWidth
            type="date"
            color="primary"
            value={startDate}
            size="lg"
            placeholder="Start Date"
            aria-label="Start Date"
            onChangeCapture={(event) => setStartDate(event.target.value)}
          />
          <Input
            clearable
            bordered
            fullWidth
            type="date"
            color="primary"
            value={endDate}
            size="lg"
            placeholder="End Date"
            aria-label="End Date"
            onChangeCapture={(event) => setEndDate(event.target.value)}
          />
          <p className="text-center font-semibold mx-4 mb-0 text-2xl text-red-500">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer autoMargin={false}>
          <Button auto onPress={addNewProject} style={{ width: "100%" }}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </CreateProjectContext.Provider>
  );
};
export default ModalProjectDescription;
