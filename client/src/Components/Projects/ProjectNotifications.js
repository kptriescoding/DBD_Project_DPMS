import { Button, Card, Text } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popover, Textarea } from "@nextui-org/react";

export default function ProjectNotifications({
    projectID,
    isProfessor,
    email}) {
  // const [myProject, setmyProject] = useState([])
  const [myNotification, setmyNotifications] = useState([]);
  const [popoverOpen,setPopoverOpen]=useState(false)

  const [description,setDescription]=useState("")

  const sendNotification= async (event)=>{
    event.preventDefault()
    let date=new Date()
    let dateOfAnnouncement=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()
    let data={
      email:email,
      projectID:projectID,
      description:description,
      dateOfAnnouncement:dateOfAnnouncement
    }
    const res=await axios.post("/project/create_announcement",{data:data})
    setPopoverOpen(false)
    setmyNotifications([])

  }

  const GetMyNotifications = async () => {

    let announcements=[]
    try {
      const res = await axios.post(
        "/project/get_announcements",
        {
          data: {
            projectID:projectID
          },
        }
      );
      if (res.data.success) {;
        announcements = res.data.announcements;
      }
    } catch (e) {
      console.log(e);
    }
    
    const ret=announcements.map(announcement=>{
      return  <Card
      isHoverable
      variant="bordered "
      style={{
        width: "inherit",
        borderRadius: "0.6rem",
        margin: "1.5px",
      }}
      key={announcement.projectID}
    >
      <Card.Body>
        <Text>{announcement.description}</Text>
      </Card.Body>
      <Card.Divider />
      <Card.Footer style={{ justifyContent: "end" }}>
        <Text small style={{ justifyContent: "end" }}>
          {announcement.dateOfAnnouncement}
        </Text>
      </Card.Footer>
    </Card>
    })
      setmyNotifications(ret)
  };
  useEffect(() => {
    if(myNotification===null||myNotification.length===0)GetMyNotifications();
  }, [myNotification]);
  

  return <div className=" flex px-2 flex-col">
  {
    (isProfessor)&&
  <div>
  <Popover isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
  <Popover.Trigger>
    <Button >Post</Button>
  </Popover.Trigger>
  <Popover.Content>
  <Textarea  className="" placeholder="Description" 
  value={description} 
  onChange={(event)=>setDescription(event.target.value)}/>
    <Button onClickCapture={sendNotification}>Send</Button>
  </Popover.Content>
  </Popover>
  </div>
  }
  {myNotification.length!==0&&myNotification}
  </div>;
}
