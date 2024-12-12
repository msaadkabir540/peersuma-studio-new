import _ from "lodash";
import { memo } from "react";

import { convertTimeToSeconds } from "@/utils/helper";

import { TextInterface } from "./interface";

import style from "./highlighted-text.module.scss";

const Text = ({
  text,
  index,
  endTime,
  startTime,
  textIndex,
  speakerIndex,
  getTextStyles,
  handleDragEnd,
  handleDragStart,
  currentSelection,
  setStartValueOnPlayer,
  nextElementIsPunctuation,
}: TextInterface) => {
  const handleWordClick = ({ startTime }: { startTime: string }) => {
    const startsTime = convertTimeToSeconds(startTime?.toString()) || 0;
    setStartValueOnPlayer({ startsTime });
  };

  return (
    <div id="outer-element" style={{ position: "relative", display: "inline-block" }} key={index}>
      <div
        id="sub-element"
        className={style.rounded}
        {...{
          ...(currentSelection && {
            draggable: true,
            onDragStart: handleDragStart as () => void,
          }),
          onDragEnd: handleDragEnd,
        }}
        onClick={() => handleWordClick({ startTime })}
      >
        <span
          key={textIndex}
          id={`${startTime},${endTime},${index},${speakerIndex}`}
          style={{
            ...(getTextStyles && getTextStyles(startTime)),
          }}
        >
          {`${nextElementIsPunctuation ? text : `${text} `}`}
        </span>
      </div>
    </div>
  );
};

export default memo(Text, _.isEqual);
