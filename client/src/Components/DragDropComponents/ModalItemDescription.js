import React, { useRef,useState,forwardRef} from "react";
import { useDrag, useDrop } from "react-dnd";
import { MultiSelect } from "react-multi-select-component";
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

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [multiSelectMembers,setMultiSelectMembers] = useState([
      { label:"Java",value:"Java"},
      {label:"C++",value:"C++"},
      {label:"Web Development",value:"Web Development"},
      {label:"Machine Learning",value:"Machine Learning"},
      {label:"Deep Learning",value:"Deep Learning"},
      {label:"DevOps",value:"DevOps"},
      {label:"Cloud-Computing",value:"Cloud-Computing"},
      {label:"Android-Development",value:"Android-Development"},
      {label:"Block Chain",value:"Block Chain"},
    ]);

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

    useEffect(() => {
      setSelectedSkills(res.data.user.skills)
    let skills=[...multiSelectSkills,...res.data.user.skills]
    skills = skills.filter((value, index, self) =>
  index === self.findIndex((t) => (
    t.label === value.label
  ))
)
    setMultiSelectSkills(skills)
    }, [])

  
  
    return (
      <div className=" my-0.5">
        <Button ref={ref} bordered color="gradient" light onPress={handler} style={
          {
            whiteSpace:"initial",
            height:"auto",
            padding:"0.75rem",
            
            background:"rgb(255,254,255)",
            width:"100%",
            borderRadius:"0.25rem"
          }
        }>
          {item.Name}
        </Button>
        
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
            <MultiSelect
                className="mt-5"
            options={multiSelectSkills}
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Skills"
            disabled={!editable}
            isCreatable={true}
            onCreateOption={newSkill=>({label:newSkill,value:newSkill})}
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