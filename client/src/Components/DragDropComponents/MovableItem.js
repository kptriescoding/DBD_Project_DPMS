import React, { useRef} from "react";
import { useDrag, useDrop } from "react-dnd";

/**
 * 
 * TODO
 *  Popup to edit details of each task
 * Add Option to delete along with edit
 */

const MovableItem = ({
  items,
    name,
    index,
    currentColumnName,
    moveCardHandler,
    updateDragTasksForItems,
    columns,
  }) => {
    const changeItemColumn = (currentItem, columnIndex) => {
      let curInd=currentItem.index
      items[curInd].Column=columnIndex
      // console.log(items)
      updateDragTasksForItems(items)
    };
  
    const ref = useRef(null);
  
    const [, drop] = useDrop({
      accept: "DraggableTasks",
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        // Time to actually perform the action
        moveCardHandler(dragIndex, hoverIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      }
    });
  
    const [{ isDragging }, drag] = useDrag({
      type:"DraggableTasks",
      item: { index, name, currentColumnName},
      end: (item, monitor) => {
        console.log(item)
        const dropResult = monitor.getDropResult();
  
        if (dropResult) {
          const { name } = dropResult;
          let columnIndex=columns.indexOf(name)
          // console.log(colIndex)
              changeItemColumn(item, columnIndex);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });
  
    const opacity = isDragging ? 0.4 : 1;
  
    drag(drop(ref));
  
    return (
      <div ref={ref} className="movable-item" style={{ opacity }}>
        {name}
      </div>
    );
  };

export default MovableItem;
  