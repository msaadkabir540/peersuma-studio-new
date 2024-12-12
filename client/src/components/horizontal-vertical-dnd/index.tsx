import React, { memo, useMemo } from "react";

import { Droppable, Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";

import { HorizontalDNDListPropsInterface } from "./interface";

const VerticalHorizontalDNDList: React.FC<HorizontalDNDListPropsInterface> = ({
  direction = "vertical",
  index,
  disable,
  renderItem,
  items = [],
  height = "",
  handleDragEnd,
  handleDragStart,
}) => {
  const getItemStyle = useMemo(
    () =>
      (
        isDragging: boolean,
        draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
        direction: string,
      ) => {
        if (direction === "vertical") {
          return {
            // some basic styles to make the items look a bit nicer
            userSelect: "none",
            // padding: "2px",
            // /*TLBR TRBL*/,
            margin: `0`,

            // change background color if dragging
            background: isDragging ? "lightgreen" : "#8a8a8a4d",
            height: isDragging ? "500px" : "",
            borderRadius: "5px",
            cursor: "default",
            width: "100% !important",
            // styles we need to apply on draggable
            ...draggableStyle,
          };
        } else if (direction === "horizontal") {
          return {
            // some basic styles to make the items look a bit nicer
            userSelect: "none",
            // padding: "2px",
            // /*TLBR TRBL*/,
            margin: `0 8px 0 0`,

            // change background color if dragging
            background: isDragging ? "lightgreen" : "#8a8a8a4d",
            borderRadius: "5px",
            cursor: "default",
            // styles we need to apply on draggable
            ...draggableStyle,
          };
        }
      },
    [],
  );

  const getListStyle = useMemo(
    () => (isDraggingOver: boolean, height: string, direction: string) => {
      if (direction === "vertical") {
        return {
          background: isDraggingOver ? "lightblue" : "",
          padding: "2px",
          // overflowY: "scroll",
          width: "calc(100% - 4px)",
          height: isDraggingOver && "300px",
        };
      } else if (direction === "horizontal") {
        return {
          background: isDraggingOver ? "lightblue" : "",
          display: "flex",
          padding: "2px",
          overflowY: "scroll",
          width: "calc(100% - 16px)",
          gap: "5px",
          height,
        };
      }
    },
    [],
  );

  return (
    <div style={{ width: "100%" }} draggable onDragEnd={handleDragEnd}>
      <Droppable direction={direction} droppableId={index?.toString()} isDropDisabled={disable}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver, height, direction) as React.CSSProperties}
            {...provided.droppableProps}
          >
            {items?.map((item, index) => (
              <Draggable
                key={`${item?.id}-${item?._id}`}
                draggableId={`${item?.id}-${item?._id}`}
                index={index}
                isDragDisabled={disable}
              >
                {(provided, snapshot) => (
                  <div
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleDragStart && handleDragStart({ e, video: item });
                    }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={
                      getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        direction,
                      ) as React.CSSProperties
                    }
                  >
                    {renderItem(item, index)}
                    {item?.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(VerticalHorizontalDNDList);
