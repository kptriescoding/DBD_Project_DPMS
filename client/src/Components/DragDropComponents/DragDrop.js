import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import axios from "axios";
import { Row, Container, Button } from "@nextui-org/react";
import Navbar from "../Professor/Navbar";

import "../../assets/styles/DragDrop.css";
import MyProjects from "../MyProjects";
import { auth } from "../../firebase";

const DragDrop = () => {
  let [items, setItems] = useState({});
  let [dragTasks, setDragTasks] = useState({});
  let [columns, setColumns] = useState([]);
  const getDragTasks = async () => {
    const data = {
      projectID: "Proj001",
    };
    const res = await axios.post("/project/dragdrop/get", { data: data });
    if (!res.data.success) console.log("Error");
    else {
      let resDragTask = res.data.dragTask;
      setDragTasks(resDragTask);
      setItems(resDragTask.Tasks);
      setColumns(resDragTask.Columns);
    }
  };

  const updateDragTasksForItems = async (items) => {
    let updateDragTasks = dragTasks;
    updateDragTasks.Tasks = items;
    const data = {
      projectID: "Proj001",
      dragTask: updateDragTasks,
    };
    // console.log(data)
    const res = await axios.post("/project/dragdrop/update", { data: data });
    // console.log(res)
    setItems([...items]);
  };
  useEffect(() => {
    getDragTasks();
  }, []);

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];

    if (dragItem) {
      // remove item by "hoverIndex" and put "dragItem" instead
      const prevItem = items.splice(hoverIndex, 1, dragItem);

      // remove item by "dragIndex" and put "prevItem" instead
      items.splice(dragIndex, 1, prevItem[0]);
      updateDragTasksForItems(items);

      return items;
    }
  };

  return (
    <div className=" h-screen w-screen bg-gray flex flex-col justify-start">
      <div>
        <Navbar className="" />
      </div>
      <div className=" flex h-full">
        <div className=" sticky  flex flex-col w-1/5">
          <MyProjects email={auth.email}isProfessor={true}/>
        </div>
        <DndProvider backend={HTML5Backend}>
          <Container
            style={{
              backgroudColor: "blue",
              flexGrow:"initial"
            }}
          >
            <Row
              style={{
                justifyContent: "center",
                margin: "0.25rem",
              }}
              gap={0}
            >
              {
                // console.log(columns)
                columns ? (
                  columns.map((e, index) => {
                    // console.log(e)
                    return (
                      <Column
                        title={e}
                        items={items}
                        style={{
                          display: "flex",
                          borderRadius: "0.25rem",

                          // margin:"0.5rem"
                        }}
                        updateDragTasksForItems={updateDragTasksForItems}
                        columnIndex={index}
                        columns={columns}
                        moveCardHandler={moveCardHandler}
                      />
                    );
                  })
                ) : (
                  <div />
                )
              }
            </Row>
          </Container>
        </DndProvider>
      </div>
    </div>
  );
};
export default DragDrop;
