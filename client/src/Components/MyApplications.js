import { async } from "@firebase/util";
import React from "react";

export default function MyApplications(props) {
  const [applications, setapplications] = useState([]);

  async function handleSetApplications() {}
  async function handleDeleteApplications() {}

  async function handleAcceptOrRejectApplications(
    projectId,
    Student_Email,
    isAccept
  ) {}
  useEffect(() => {
    handleSetApplications();
  }, []);

  const StudentsApplied = () => {
    {
      /* @todo Professor side : student name year cgpa  accept reject*/
    }

    const students = applications.map((student) => {
      return (
        <Card
          isPressable
          isHoverable
          variant="bordered "
          style={{
            width: "inherit",
            borderRadius: "0.6rem",
            margin: "1.5px",
          }}
          key={proj.projectId}
        >
          <Card.Header
            css={{
              backgroundColor: curColor,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
              }}
            >
              {student.studentName}
            </Text>
          </Card.Header>
          <Card.Divider
            style={{
              backgroundColor: "gray",
            }}
          />
          <Card.Body>
            <Text>{proj.projectDescription}</Text>
          </Card.Body>
          <Card.Divider />
          <Card.Footer style={{ justifyContent: "end" }}>
            <Text small style={{ justifyContent: "end" }}>
              {proj.collaborator}
            </Text>
          </Card.Footer>
        </Card>
      );
    });
  };

  return (
    <div>
      <div>
        <span className=" font-bold text-2xl">Applications</span>
        <div>
          {/* @todo Professor side : student name year cgpa  accept reject*/}
          {/* student side:project name remove application  */}
        </div>
      </div>
    </div>
  );
}
