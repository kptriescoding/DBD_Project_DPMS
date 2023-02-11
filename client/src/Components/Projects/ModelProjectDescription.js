import React, { createContext, useContext, useState,useEffect } from "react";
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
const ModalProjectDescription = ({ user, visible, setVisible, closeHandler,projectID,useCanEdit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [funding, setFunding] = useState("");
  const [collaborator, setCollaborator] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errorMessage,setErrorMessage]=useState("")
  const [editable,setEditable]=useState(false)
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
  const updateProject = async () => {
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
      projectID: projectID,
      skills:selectedSkills.map((skill)=>skill.value)
    };
    // console.log(newProject);
    let res = await axios.post("/project/update", { data: newProject });
    if (res.data.success){
      setEditable(false)
    }
  };
  const getProject=async()=>{
    let res=await axios.post("/project/get_by_projectID",{data:{
      projectID:projectID
  }})
    let project=res.data.project

    var pad = function(num) { return ('00'+num).slice(-2) };
    let date1=new Date(project.startDate)
    
date1 = date1.getUTCFullYear()         + '-' +
        pad(date1.getUTCMonth() + 1)  + '-' +
        pad(date1.getUTCDate())
        let date2=new Date(project.endDate)
        date2 = date2.getUTCFullYear()         + '-' +
                pad(date2.getUTCMonth() + 1)  + '-' +
                pad(date2.getUTCDate())
    setName(project.projectName)
    setDescription(project.projectDescription)
    setCollaborator(project.collaborator)
    setFunding(project.funding)
    setStartDate(date1)
    setEndDate(date2)

    setSelectedSkills(project.skills)
    let skills=[...multiSelectSkills,...project.skills]
    skills = skills.filter((value, index, self) =>
  index === self.findIndex((t) => (
    t.label === value.label
  ))
)
    setMultiSelectSkills(skills)

  }



  useEffect(() => {
    getProject()
  }, [projectID])
  
  return (
    <div>
      <Modal closeButton onClose={closeHandler} open={visible}>
        <Modal.Header>
          <Text size={18}>Project Details</Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            bordered
            fullWidth
            color="primary"
            value={name}
            size="lg"
            placeholder="Title"
            aria-label="Title"
            disabled={!editable}
            onChangeCapture={(event) => setName(event.target.value)}
          />
          <Textarea
            bordered
            fullWidth
            color="primary"
            value={description}
            size="lg"
            placeholder="Description"
            aria-label="Description"
            disabled={!editable}
            onChangeCapture={(event) => setDescription(event.target.value)}
          />
          <Input
            bordered
            fullWidth
            color="primary"
            value={collaborator}
            size="lg"
            placeholder="Collaborator"
            aria-label="Collaborator"
            disabled={!editable}
            onChangeCapture={(event) => setCollaborator(event.target.value)}
          />
          <Input
            bordered
            fullWidth
            color="primary"
            value={funding}
            type="number"
            size="lg"
            placeholder="Funding in Rs."
            aria-label="Funding in Rs."
            disabled={!editable}
            onChangeCapture={(event) => setFunding(event.target.value)}
          />
          <MultiSelect
            options={multiSelectSkills}
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Skills"
            isCreatable={true}
            disabled={!editable}
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
            disabled={!editable}
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
            disabled={!editable}
            onChangeCapture={(event) => setEndDate(event.target.value)}
          />
          <p className="text-center font-semibold mx-4 mb-0 text-2xl text-red-500">{errorMessage}</p>
        </Modal.Body>
        {useCanEdit&&<Modal.Footer autoMargin={false}>
        {(!editable)?<Button auto onPress={()=>setEditable(true)} style={{ width: "100%" }}>
        Edit
      </Button>
      :
          <Button auto onPress={updateProject} style={{ width: "100%" }}>
            Add
          </Button>}
        </Modal.Footer>}
      </Modal>
    </div>
  );
};
export default ModalProjectDescription;
