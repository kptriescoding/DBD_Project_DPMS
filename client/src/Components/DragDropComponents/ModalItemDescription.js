import React, { useRef,useState,forwardRef} from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button,Modal,Text,Input,Textarea,Card,Spacer} from "@nextui-org/react";
/**
 * TODO:
 * 1. Add array members and labels input and showing
 * 2. Add different kinds of dates for deadline
 */
const ModalItemDescription=forwardRef(({items,
    index
    ,updateDragTasksForItems
    ,item}
    ,ref)=> {
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const [editable,setEditable]=useState(false)
    const closeHandler = () => setVisible(false);
    const [name,setName]=useState(item.Name)
    const [description,setDescription]=useState(item.Description)

    const changeEditable=()=>setEditable(true);
    const saveChanges=()=>{
        setEditable(false)
        items[index].Name=name
        items[index].Description=description
        updateDragTasksForItems(items)
    }
    const deleteItem=()=>{
        items.splice(index,1);
        updateDragTasksForItems(items)
        closeHandler()
    }
  
  
    return (
      <div >
      <Spacer/>
        <Button ref={ref} bordered color="gradient" light onPress={handler}>
          {item.Name}
        </Button>
        <Spacer/>
        <Modal
          closeButton
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Input 
            label="Name"
            readOnly={!editable} 
            value={name}
            onChangeCapture={(event)=>setName(event.target.value)}
            />
          </Modal.Header>
          <Modal.Body>
            <Textarea 
            label="Description"
            readOnly={!editable} 
            value={description}
            onChangeCapture={(event)=>setDescription(event.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onPress={deleteItem}>
              Delete
            </Button>
            {(!editable)?
            <Button auto onPress={changeEditable}>
             Edit
            </Button>:
            <Button auto onPress={saveChanges}>
            Save
            </Button>
            }
          </Modal.Footer>
        </Modal>
      </div>
    );
    })
    export default ModalItemDescription