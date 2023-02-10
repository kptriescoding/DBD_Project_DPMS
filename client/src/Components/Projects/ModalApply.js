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
import { Multiselect } from "multiselect-react-dropdown";

/**
 *
 * TODO
 * handle input cvalidation and error correction
 */
export const CreateApplyContext = createContext();
const ModalApply = ({ user, visible, setVisible, closeHandler, proj }) => {
  const [description, setDescription] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const addNewApplication = async () => {
    if (!description) {
      setErrorMessage("Enter all the details");
    }

    const newApplication = {
      forStudent: 0,
      description: description,
      Project_ID: proj.projectId,
      applicationStatus: "applied",
      Email: user.email,
      notificationTime: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    // console.log(newProject);
    let res = await axios.post("/project/application/apply_for_project", {
      data: newApplication,
    });

    if (res.data.success) {
      closeHandler();
    //   triggerOnAdditionOfProject();
    }
  };

  return (
    <CreateApplyContext.Provider >
      <div>
        <Modal closeButton onClose={closeHandler} open={visible}>
          <Modal.Header>
            <Text size={18}>Enter Message along with Application</Text>
          </Modal.Header>
          <Modal.Body>
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

            <p className="text-center font-semibold mx-4 mb-0 text-2xl font-light text-red-500">
              {errorMessage}
            </p>
          </Modal.Body>
          <Modal.Footer autoMargin={false}>
            <Button
              auto
              onPress={addNewApplication}
              style={{ width: "100%", backgroundColor: "#22c856" }}
            >
              Apply
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </CreateApplyContext.Provider>
  );
};
export default ModalApply;
