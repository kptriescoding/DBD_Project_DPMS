import React, { useState } from "react";
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
import { Multiselect } from "multiselect-react-dropdown";

/**
 *
 * TODO
 * handle input cvalidation and error correction
 */

const ModalCreate = ({ user, visible, setVisible, closeHandler }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [funding, setFunding] = useState("");
  const [collaborator, setCollaborator] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState();
  const skills = [
    "Java",
    "C++",
    "Web Development",
    "Machine Learning",
    "Deep Learning",
    "DevOps",
    "Cloud-Computing",
    "Android-Development",
    "Block Chain",
  ];
  const addNewProject = async () => {
    const newProject = {
      title: name,
      description: description,
      collaborator: collaborator,
      funding: funding,
      startDate: startDate,
      endDate: endDate,
      professorEmail: user.email,
      projectID: Date.now(),
      skills:selectedSkills
    };
    // console.log(newProject);
    const res = await axios.post("/project/create", { data: newProject });
    if (res.data.success) closeHandler();
  };
  const handleSkillSelected = ((lis)=>{
    setSelectedSkills(() => {
      return lis;
      
    });
  }
  )
  return (
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
            size="lg"
            placeholder="Funding in Rs."
            aria-label="Funding in Rs."
            onChangeCapture={(event) => setFunding(event.target.value)}
          />
          <Multiselect
            options={skills}
            onSelect={(lis) => {
              handleSkillSelected(lis)
             }}
             onRemove={(lis)=>{
              handleSkillSelected(lis)
             }}
            isObject={false}
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
        </Modal.Body>
        <Modal.Footer autoMargin={false}>
          <Button auto onPress={addNewProject} style={{ width: "100%" }}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ModalCreate;
