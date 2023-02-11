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
}) => {
  const [description, setDescription] = useState("");

  const [students, setStudents] = useState([]);
  const [studentSelected, setStudentSelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handelSetStudents() {
    let res = await axios.post("/student/get_students_for_professor_apply", {
      Project_ID: proj.projectId,
    });
    if (res.status.success) console.log(res.data);
    let studentEmails = [];
    res.data.students.forEach((student) => studentEmails.push(student.Email));
    setStudents(studentEmails);
  }
  const addNewStudentNotification = async () => {
    if (!description) {
      setErrorMessage("Enter all the details");
    }

    const newApplication = {
      forStudent: 1,
      description: description,
      Project_ID: proj.projectId,
      applicationStatus: "applied",
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
    handelSetStudents();
  }, []);

  return (
    <CreateStudentNotify.Provider>
      <div>
        <Modal closeButton onClose={closeHandler} open={visible}>
          <Modal.Header>
            <Text size={18}>Send Student message to Join your Project</Text>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Multiselect
                singleSelect={true}
                options={students}
                placeholder="Select Student"
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

            <p className="text-center font-semibold mx-4 mb-0 text-2xl font-light text-red-500">
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
