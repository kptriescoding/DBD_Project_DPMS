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
  members,
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
        <div className=" border border-gray-300 my-1.5 shadow-sm rounded-lg">
        <MovableItem
          items={items}
          name={item.Name}
          currentColumnName={columns[item.Column]}
          updateDragTasksForItems={updateDragTasksForItems}
          index={index}
          moveCardHandler={moveCardHandler}
          columns={columns}
          item={item}
          members={members}
        />
        </div>
      ) : (
        <div />
      )
    );
  };

  return (
    <div className=" px-2 pb-6 pt-2 bg-gray-100 rounded-md shadow-lg" ref={drop}>
      <div >
        <div
          borderWeight="extrabold"
          borderRadius="1"
          style={{
            background: "rgb(235,235,240)",
            margin: "0.5rem",
            borderRadius: "0.25rem",
          }}
        >
          <div
          >
            <Text>{title}</Text>
          </div>
          <Card.Divider />
          <div
            style={{
              flex: "1 1 auto",
            }}
          />
          <ModalAddNewItem
            items={items}
            columnIndex={columnIndex}
            updateDragTasksForItems={updateDragTasksForItems}
          />
          <Card.Divider />
          {returnItemsForColumn()}
          <Card.Divider />
        </div>
      </div>
    </div>
  );
};
export default Column;
