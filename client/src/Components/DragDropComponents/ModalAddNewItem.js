import React, { useState } from "react";
import {useDrop } from "react-dnd";
import { Button,Modal,Text,Input,Textarea,Col,Card} from "@nextui-org/react";



const ModalAddNewItem=({items,columnIndex,updateDragTasksForItems})=> {
    const [visible, setVisible] = React.useState(false);
    const handler = () => setVisible(true);
    const [name,setName]=useState("")
    const [description,setDescription]=useState("")
  
    const closeHandler = () => {
      setVisible(false);
      console.log("closed");
    };
    const addNewItem=()=>{
      let item={
        Name: name,
        Description:description,
        Members:[],
        Labels:[],
        Date:Date.now(),
        Column:columnIndex
      }
      items.push(item)
      updateDragTasksForItems(items)
      setName("")
      setDescription("")
      closeHandler()
    }
  
  
    return (
      <div className=" my-0 py-0">
        <button  shadow onClick={handler} style={
          {
            width: "100%",
            fontSize: "xx-large",
            textAlign:"left",
            display:"flex",
            
          }
        }
        className=" bg-gray-200 hover:bg-gray-300 rounded-sm px-4 py-1 mx-2"
        >
          + 
          <span className=" text-sm self-center px-2">Add a card</span>
        </button>
        <Modal
          closeButton
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text size={18}>
              Enter New Task Name
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              value={name}
              size="lg"
              placeholder="Name"
              onChangeCapture={(event)=>
                setName(event.target.value)
              }
            />
            <Textarea
            clearable
              bordered
              fullWidth
              color="primary"
              value={description}
              size="lg"
           placeholder="Description"
           onChangeCapture={(event)=>
            setDescription(event.target.value)
          }
            />
          </Modal.Body>
          
          <Modal.Footer  >
            <Button auto onPress={addNewItem} style={{
              width:"100%"
            }}>
             Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  export default ModalAddNewItem