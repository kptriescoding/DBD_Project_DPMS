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

/**
 *
 * TODO
 * handle input cvalidation and error correction
 */
export const CreateModalApplicationStatus = createContext();
const ModalApplicationStatus = ({
  user,
  visible,
  setVisible,
  closeHandler,
  applicationData,
  isProfessor,
}) => {
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateApplicationStatus = async (accept) => {
    if (!description) {
      setErrorMessage("Enter all the details");
    }

    const applicationStatus = {
      description: description,
      applicationStatus: accept ? "accept" : "reject",
      Email: applicationData.Email,
      Project_ID: applicationData.Project_ID,
      notificationTime: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    // console.log(newProject);
    if (isProfessor) {
      let res = await axios.post(
        "/project/application/update_application_from_professor",
        { data: applicationStatus }
      );

      if (res.data.success) {
        closeHandler();
      }
    } else {
      let res = await axios.post(
        "/project/application/update_application_from_student",
        { data: applicationStatus }
      );

      if (res.data.success) {
        closeHandler();
      }
    }
  };

  const StudentNotification = () => {
    return (
      // <CreateModalApplicationStatus.Provider>
      <>
        <Modal
          closeButton
          onClose={closeHandler}
          open={visible && !isProfessor}
        >
          <Modal.Header>
            <Text size={18}>{applicationData.description}</Text>
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
          {applicationData.applicationStatus != "sent" ? (
            <div></div>
          ) : (
            <Modal.Footer autoMargin={false}>
              <Button
                auto
                onPress={() => updateApplicationStatus(true)}
                style={{ width: "50%", backgroundColor: "#22c856" }}
              >
                Accept
              </Button>
              <Button
                auto
                onPress={() => updateApplicationStatus(false)}
                style={{ width: "50%", backgroundColor: "#df0b32" }}
              >
                Deny
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </>
      // </CreateModalApplicationStatus.Provider>
    );
  };

  return (
    <>
      {isProfessor ? (
        <CreateModalApplicationStatus.Provider>
          <div>
            <Modal
              closeButton
              onClose={closeHandler}
              open={visible && isProfessor}
            >
              <Modal.Header>
                <Text size={18}>{applicationData.Email}</Text>
              </Modal.Header>
              <Modal.Body>
                {applicationData.applicationStatus == "accept" ? (
                  <>
                    <Text fullWidth>{applicationData.description}</Text>
                    <Button disabled={true} style={{ backgroundColor: "red" }}>
                      Accepted
                    </Button>
                  </>
                ) : applicationData.applicationStatus == "reject" ? (
                  <>
                    <Text fullWidth>{applicationData.description}</Text>
                    <Button disabled={true} style={{ backgroundColor: "red" }}>
                      Accepted
                    </Button>
                  </>
                ) : (
                  <Textarea
                    clearable
                    bordered
                    fullWidth
                    color="primary"
                    value={description}
                    size="lg"
                    placeholder="Description"
                    aria-label="Description"
                    onChangeCapture={(event) =>
                      setDescription(event.target.value)
                    }
                  />
                )}

                <p className="text-center font-semibold mx-4 mb-0 text-2xl font-light text-red-500">
                  {errorMessage}
                </p>
              </Modal.Body>
              {applicationData.applicationStatus == "accept" ? (
                <Button style={{ backgroundColor: "#22c856" }}>Accepted</Button>
              ) : applicationData.applicationStatus == "reject" ? (
                <Button style={{ backgroundColor: "#df0b32" }}>Rejected</Button>
              ) : (
                <Modal.Footer autoMargin={false}>
                  <Button
                    auto
                    onPress={() => updateApplicationStatus(true)}
                    style={{ width: "50%", backgroundColor: "#22c856" }}
                  >
                    Accept
                  </Button>
                  <Button
                    auto
                    onPress={() => updateApplicationStatus(false)}
                    style={{ width: "50%", backgroundColor: "#df0b32" }}
                  >
                    Reject
                  </Button>
                </Modal.Footer>
              )}
            </Modal>
          </div>
        </CreateModalApplicationStatus.Provider>
      ) : (
        <CreateModalApplicationStatus.Provider>
          {<StudentNotification />}
        </CreateModalApplicationStatus.Provider>
      )}
    </>
  );
};
export default ModalApplicationStatus;
