import React, { useRef, useState,useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { Button } from "@nextui-org/react";

/**
 * 
 * TODO
 *  Get popup to add details of new tasks
 */

const Column = ({ children, className, title,items,updateDragTasksForItems,columnIndex}) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: "DraggableTasks",
      drop: () => ({ name: title }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      }),
      // Override monitor.canDrop() function
      canDrop: (item) => {
        return (
        //   currentColumnName === title ||
        //   (currentColumnName === DO_IT && title === IN_PROGRESS) ||
        //   (currentColumnName === IN_PROGRESS &&
        //     (title === DO_IT || title === AWAITING_REVIEW)) ||
        //   (currentColumnName === AWAITING_REVIEW &&
        //     (title === IN_PROGRESS || title === DONE)) ||
        //   (currentColumnName === DONE && title === AWAITING_REVIEW)
        // );
        true);
      }
    });
    const addNewItem=()=>{
      let item={
        Name:"New Item "+ items.length,
        Description:"Create a login page",
        Members:[],
        Labels:[],
        Date:Date.now(),
        Column:columnIndex
      }
      items.push(item)
      updateDragTasksForItems(items)
    }
  
    const getBackgroundColor = () => {
      if (isOver) {
        if (canDrop) {
          return ;
        } else if (!canDrop) {
          return "rgb(255,188,188)";
        }
      } else {
        return "";
      }
    };
  
    return (
      <div
        ref={drop}
        className={className}
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <p>{title}</p>
        {children}
        <Button onClick={addNewItem}>Add Item</Button>
      </div>
    );
  };
export default Column
  