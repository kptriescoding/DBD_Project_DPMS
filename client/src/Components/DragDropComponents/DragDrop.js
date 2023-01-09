import React, { useRef, useState,useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MovableItem from "./MovableItem";
import Column from "./Column";
import {COLUMN_NAMES,tasks} from "./tempConstants"
import axios from "axios"

import "../../assets/styles/DragDrop.css";


export default function DragDrop(){

  let [items,setItems]=useState({})
  let [dragTasks,setDragTasks]=useState({})
  let [columns,setColumns]=useState([])
  const getDragTasks=async()=>{
    const data={
      projectID:"Proj001"
    }
    const res=await axios.post("/project/dragdrop/get",{data:data})
    if(!res.data.success)console.log("Error")
    else {
     let resDragTask=res.data.dragTask
      setDragTasks(resDragTask)
      setItems(resDragTask.Tasks)
      setColumns(resDragTask.Columns)
      // console.log(resDragTask)
    }

  }

  const updateDragTasksForItems=async(items)=>{
    let updateDragTasks=dragTasks;
    updateDragTasks.Tasks=items
    const data={
      projectID:"Proj001",
      dragTask:updateDragTasks
    }
    console.log(data)
    const res=await axios.post("/project/dragdrop/update",{data:data})
    console.log(res)
    setItems([...items])
  }
  useEffect(() => {
    getDragTasks()
  }, [])

  const moveCardHandler = (dragIndex, hoverIndex) => {
    console.log(dragIndex,hoverIndex)
    const dragItem = items[dragIndex];
    console.log(items);

    if (dragItem) {
      setItems((prevState) => {
        const coppiedStateArray = [...prevState];

        // remove item by "hoverIndex" and put "dragItem" instead
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

        // remove item by "dragIndex" and put "prevItem" instead
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);

        return coppiedStateArray;
      });
    }
  };

  const returnItemsForColumn = (columnIndex) => {
    return items
      .map((item, index) => (
        (item.Column===columnIndex)?
        <MovableItem
          items={items}
          name={item.Name}
          currentColumnName={columns[item.Column]}
          updateDragTasksForItems={updateDragTasksForItems}
          index={index}
          moveCardHandler={moveCardHandler}
          columns={columns}
        />:<div/>
      ));
  };


  return (
    <div className="container">
      <DndProvider backend={HTML5Backend}>
      {
        
        // console.log(columns)
        (columns)?columns.map((e,index) => {
        // console.log(e)
       return <Column title={e} className="column do-it-column">
       {returnItemsForColumn(index)}
     </Column>
     }):<div/>
    }
      </DndProvider>
    </div>
  );
};
