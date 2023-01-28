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
  const nextuiCGNVTSfIgvLppdCss = {
    marginTop: "0 !important",
  };
  return (
    <Col
      style={{
        margin: "0rem",
      }}
    >
      <div
        ref={drop}
        
      >
        <Card
        borderWeight="extrabold"
        borderRadius="1"
        style={{
            background: "rgb(235,235,240)",
            margin: "0.5rem",
            borderRadius: "0.25rem",
          }}
        >
          <Card.Header
            style={{
              justifyContent: "center",
              nextuiCGNVTSfIgvLppdCss,
            }}
          >
            <Text>{title}</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body
          style={{
            flex: "1 1 auto"
          }}
          />
          {returnItemsForColumn()}
          <Card.Divider />
         
          <Card.Body />
          <Card.Divider/>
          <ModalAddNewItem
            items={items}
            columnIndex={columnIndex}
            updateDragTasksForItems={updateDragTasksForItems}
          />
        </Card>
      </div>
    </Col>
  );
};
export default Column;
