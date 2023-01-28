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

/**
 *
 * TODO
 * handle input cvalidation and error correction
 */

const ModalCreateGeneralAnnouncement = ({ projectID, visible, closeHandler }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const addNewAnnouncement = async () => {
    const newAnnouncement = {
        projectID:projectID,
      name: name,
      description: description,
    };
      let res=await axios.post("/project/application/create_announcement",{data:newAnnouncement})
    if (res.data.success) closeHandler();
  };
  return (
    <div>
      <Modal closeButton onClose={closeHandler} open={visible}>
        <Modal.Header>
          <Text size={18}>Enter The Announcement</Text>
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
        </Modal.Body>
        <Modal.Footer autoMargin={false}>
          <Button auto onPress={addNewAnnouncement} style={{ width: "100%" }}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ModalCreateGeneralAnnouncement;
