import React, { createContext, useContext, useEffect, useState } from "react";
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
export const CreateStudentNotify = createContext();
const ModalSendStudentNotification = ({
  user,
  visible,
  setVisible,
  closeHandler,
  proj,
  students
}) => {
  const [description, setDescription] = useState("");


  const [studentSelected, setStudentSelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

 
  const addNewStudentNotification = async () => {
    if (!description) {
      setErrorMessage("Enter all the details");
      return 
    }

    const newApplication = {
      forStudent: 1,
      description: description,
      Project_ID: proj.projectId,
      applicationStatus: "sent",
      Email: studentSelected,
      notificationTime: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    let res = await axios.post("/project/application/ask_student_to_join", {
      data: newApplication,
    });

    if (res.data.success) {
      closeHandler();
    }
  };
  function handleStudentSelected(student) {
    setStudentSelected(student);
  }
  useEffect(() => {
  
  }, [students]);

  return (
    <CreateStudentNotify.Provider>
      <div>
        <Modal closeButton onClose={closeHandler} open={visible}>
          <Modal.Header>
            <Text size={18}>Send Student invitation to Join your Project</Text>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Multiselect
                singleSelect={true}
                options={students}
                placeholder="Select Student"
                isObject={false}
                onSelect={(value) => handleStudentSelected(value)}
              />
            </div>
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

            <p className="text-center mx-4 mb-0 text-2xl font-light text-red-500">
              {errorMessage}
            </p>
          </Modal.Body>
          <Modal.Footer autoMargin={false}>
            <Button
              auto
              onPress={addNewStudentNotification}
              style={{ width: "100%", backgroundColor: "#22c856" }}
            >
              Send
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </CreateStudentNotify.Provider>
  );
};
export default ModalSendStudentNotification;
