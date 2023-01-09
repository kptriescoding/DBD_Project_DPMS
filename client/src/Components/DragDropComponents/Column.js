import React, { useRef, useState,useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import {COLUMN_NAMES,tasks} from "./tempConstants"
import axios from "axios"

const Column = ({ children, className, title }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: "DraggableTasks",
      drop: () => ({ name: title }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      }),
      // Override monitor.canDrop() function
      canDrop: (item) => {
        const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, DONE } = COLUMN_NAMES;
        const { currentColumnName } = item;
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
      </div>
    );
  };
export default Column
  