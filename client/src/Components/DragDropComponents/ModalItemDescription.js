import React, { useRef,useState,forwardRef,useEffect} from "react";
import { useDrag, useDrop } from "react-dnd";
import { Dropdown, MultiSelect } from "react-multi-select-component";
import { Button,Modal,Text,Input,Textarea,Card,Spacer} from "@nextui-org/react";
/**
 * TODO:
 * 1. Add array members and labels input and showing
 * 2. Add different kinds of dates for deadline
 */

const ModalItemDescription=forwardRef(({items,
    index
    ,updateDragTasksForItems
    ,item
    ,members
  }
    ,ref)=> {
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const [editable,setEditable]=useState(false)
    const closeHandler = () => setVisible(false);
    const [name,setName]=useState(item.Name)
    const [description,setDescription]=useState(item.Description)

    const changeEditable=()=>setEditable(true);

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [multiSelectMembers,setMultiSelectMembers] = useState([]);
    
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [multiSelectLabels,setMultiSelectLabels] = useState([]);
    const saveChanges=()=>{
        setEditable(false)
        items[index].Name=name
        items[index].Description=description
        items[index].Members=selectedMembers
        items[index].Labels=selectedLabels
        updateDragTasksForItems(items)
    }
    const deleteItem=()=>{
        items.splice(index,1);
        updateDragTasksForItems(items)
        closeHandler()
    }

    useEffect(() => {
      setSelectedMembers(items[index].Members)
      setMultiSelectMembers(members)
      setSelectedLabels(items[index].Labels)
      setMultiSelectLabels(items[index].Labels)
    }, [])

  
  
    return (
      <div className="">
        <button ref={ref} bordered color="gradient"  onClick={handler} 
        className=" px-2 py-1.5 text-center self-center w-full hover:bg-slate-100 shadow-md border border-gray-300 "
        >
          {item.Name}
        </button>
        
        <Modal
          closeButton
          open={visible}
          style={{
            width:"100%"
          }}
          onClose={closeHandler}
        >
          <Modal.Header style={{
            width:"100%"
          }}>
            <Input 
            label="Name"
            readOnly={!editable} 
            style={{
              width:"100%",
              textAlign: "center"
            }}
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
            <p>Members</p>
            <MultiSelect
                className="mt-5"
            options={multiSelectMembers}
            value={selectedMembers}
            onChange={setSelectedMembers}
            disabled={!editable}
          />
          <p>Labels</p>
          <MultiSelect
                className="mt-5"
            options={multiSelectLabels}
            value={selectedLabels}
            onChange={setSelectedLabels}
            disabled={!editable}
            isCreatable={true}
            onCreateOption={newLabel=>({label:newLabel,value:newLabel})}
          />
          </Modal.Body>
          <Modal.Footer autoMargin={false}>
            <Button auto flat color="error" onPress={deleteItem} style={{
              width:"45%",
              margin:"0.25rem"
            }}>
              Delete
            </Button>
            {(!editable)?
            <Button auto onPress={changeEditable} style={{
              width:"45%",
              margin:"0.25rem"
            }}>
             Edit
            </Button>:
            <Button auto onPress={saveChanges} style={{
              width:"45%"
            }}>
            Save
            </Button>
            }
          </Modal.Footer>
        </Modal>
      </div>
    );
    })
    export default ModalItemDescription