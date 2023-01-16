import React, { useState } from "react";
import { useDrop } from "react-dnd";
import {
  Button,
  Modal,
  Text,
  Input,
  Textarea,
  Col,
  Card,
} from "@nextui-org/react";
import ModalAddNewItem from "./ModalAddNewItem";
import MovableItem from "./MovableItem";

const Column = ({
  columns,
  title,
  items,
  updateDragTasksForItems,
  columnIndex,
  moveCardHandler,
}) => {
  const [, drop] = useDrop({
    accept: "DraggableTasks",
    drop: () => ({ columnIndex: columnIndex }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const returnItemsForColumn = () => {
    return items.map((item, index) =>
      item.Column === columnIndex ? (
        <MovableItem
        
          items={items}
          name={item.Name}
          currentColumnName={columns[item.Column]}
          updateDragTasksForItems={updateDragTasksForItems}
          index={index}
          moveCardHandler={moveCardHandler}
          columns={columns}
          item={item}
        />
      ) : (
        <div />
      )
    );
  };
const nextuiCGNVTSfIgvLppdCss ={
  marginTop: "0 !important"
}
  return (
    <Col style={{
      margin:"0rem",
      
    }}  >
      <div ref={drop} style={{
            margin:"0rem",
            
          }}>
        <Card
          style={{
            background: "rgb(243,243,247)",
            width:"25rem",
            margin:"0rem"
          }}
        >
          <Card.Header style={{
            justifyContent: "center",
            nextuiCGNVTSfIgvLppdCss
          }
          }>
            <Text>{title}</Text>
          </Card.Header>
          <Card.Body style={{
            justifyContent: "center"
          }}
          
          />
          {returnItemsForColumn()}
          <Card.Body />
          <Card.Footer />
          <ModalAddNewItem
            items={items}
            columnIndex={columnIndex}
            updateDragTasksForItems={updateDragTasksForItems}
          />
          <Card.Footer />
        </Card>
      </div>
    </Col>
  );
};
export default Column;
