import _ from "lodash";
import React, { useEffect, useRef, useState, memo, useCallback, useMemo } from "react";

import Text from "./text";

import { clearTextSelection, convertTimeToSeconds } from "@/utils/helper";

import { extractNumbersFromString, groupByConsecutiveSpeakerLabel } from "@/common/index";

import {
  GetCalculationsFunctionArgs,
  HighlightAbleTextPropsInterface,
  SpeakerTranscription,
} from "./interface";

import style from "./highlighted-text.module.scss";

const HighlightAbleText: React.FC<HighlightAbleTextPropsInterface> = ({
  sectionControl,
  selectionEvent,
  transcription,
  handleDragEnd,
  handleDragStart,
  playerCurrentTime,
  selectionControlEvent,
  setStartValueOnPlayer,
  currentSelectionOfSelection,
  clearAllTranscriptionSelection,
  //
  clipStartTime,
  clipEndTime,
}) => {
  const textRef = useRef<HTMLDivElement>(null); // reference to the text container
  const endRef = useRef(null); // reference to the end element of the selected range
  const [speakerTranscription, setSpeakerTranscription] = useState<SpeakerTranscription[][]>([]);

  const chatColors = useMemo(() => {
    return [
      { backgroundColor: "#CCCCCC", color: "#000000" }, // gray
      { backgroundColor: "#acacac", color: "#000000" }, // darkgray
    ];
  }, []);

  const handleSelectionChange = useCallback(() => {
    const selection: Selection | null = window.getSelection();
    if (!selection?.isCollapsed) {
      const range = [selection?.anchorNode?.parentElement, selection?.focusNode?.parentElement]
        .sort((a, b) => parseInt(a?.id?.split(",")[2] || "") - parseInt(b?.id?.split(",")[2] || ""))
        .sort(
          (a, b) => parseInt(a?.id?.split(",")[3] || "") - parseInt(b?.id?.split(",")[3] || ""),
        );
      let startElement: any = range[0];
      if (
        Object.keys(startElement)[1] &&
        startElement &&
        startElement[Object.keys(startElement)[1]]?.id === "outer-element"
      ) {
        const spanElement = startElement.children[0].children[0];
        if (spanElement.nodeName === "SPAN") startElement = spanElement;
      }
      let endElement: any = range[1];
      if (endElement[Object.keys(endElement as any)[1]].id === "outer-element") {
        const spanElement = endElement.children[0].children[0];
        if (spanElement.nodeName === "SPAN") endElement = spanElement;
      }
      const [start, end] = [startElement.id, endElement.id].map((time) => time.split(","));
      const startSeconds = convertTimeToSeconds(start[0]);
      const endSeconds = convertTimeToSeconds(end[1]);
      if (startElement.id !== endElement.id) {
        const currentSelectedRange = {
          endSeconds,
          startSeconds,
          endIndex: end[3],
          startIndex: start[3],
          startSubIndex: start[2],
          endSubIndex: end[2],
        };
        clearTextSelection();
        endRef.current = endElement;
        selectionEvent({
          id: startElement.id + endElement.id + Math.floor(Math.random() * 100000000000),
          selectionEndElement: endElement,
          currentSelection: currentSelectedRange,
          selectionPopupIndex: endElement[Object.keys(endElement)[0]].key,
        });
      }
    }
  }, [selectionEvent, endRef]);

  const getCalculations = useMemo(
    () =>
      ({
        text,
        index,
        speakerIndex,
        speakerList,
        clipStartTime,
        clipEndTime,
        startTime,
        endTime,
      }: GetCalculationsFunctionArgs) => {
        const textIndex = `${text}-${index}-${speakerIndex}`;
        let nextElement;
        if (speakerIndex !== 0) {
          let toZero = speakerIndex;
          let totalIndexes = 0;
          while (toZero !== 0) {
            totalIndexes += speakerList?.[toZero - 1]?.length;
            toZero--;
          }
          nextElement = transcription?.[totalIndexes + index + 1];
        } else {
          nextElement = transcription?.[index + 1];
        }

        const nextElementIsPunctuation =
          nextElement && nextElement?.type === "punctuation" ? true : false;
        let currentSelection = currentSelectionOfSelection;
        const { startIndex, endIndex, startSubIndex, endSubIndex } = currentSelection;

        currentSelection =
          startIndex == endIndex
            ? startIndex == speakerIndex &&
              endIndex == speakerIndex &&
              startSubIndex <= index &&
              endSubIndex >= index
            : startIndex <= speakerIndex &&
              endIndex >= speakerIndex &&
              (startIndex == speakerIndex ? startSubIndex <= index : true) &&
              (endIndex > speakerIndex ? true : endSubIndex >= index);

        const startTimeInSeconds = convertTimeToSeconds(startTime) || 0;
        const EndTimeInSeconds = convertTimeToSeconds(endTime) || 0;
        const clipSelected = clipStartTime <= startTimeInSeconds && clipEndTime >= EndTimeInSeconds;

        const getTextStyles = (startTime: string): React.CSSProperties => {
          const isSelected = currentSelection ? true : false;
          const currentTimeInSeconds = (playerCurrentTime || 0)?.toFixed(1);
          const startTimeInSeconds = convertTimeToSeconds(startTime) || 0;
          const startTimeInSec = startTimeInSeconds?.toFixed(1);

          const backgroundColor =
            currentTimeInSeconds === startTimeInSec
              ? "#5A5A5A"
              : isSelected
                ? "#5A5A5A"
                : clipSelected && !isSelected
                  ? "#5A5A5A"
                  : "";
          const color =
            currentTimeInSeconds === startTimeInSec
              ? "#ffffff"
              : isSelected
                ? "#ffffff"
                : clipSelected
                  ? "#ffffff"
                  : "";
          const cursor = isSelected ? "grab" : "";
          return {
            backgroundColor,
            whiteSpace: "pre",
            color,
            cursor,
          };
        };

        return {
          textIndex,
          getTextStyles,
          currentSelection,
          nextElementIsPunctuation,
        };
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSelectionOfSelection, playerCurrentTime, transcription, clipStartTime, clipEndTime],
  );

  // Debounced function to handle the selection change
  const debouncedHandleSelectionChange = _.debounce(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const { current } = textRef;
      if (current && current.contains(range.commonAncestorContainer)) {
        handleSelectionChange();
      }
    }
  }, 500); // 300 ms debounce time

  useEffect(() => {
    document.addEventListener("mouseup", debouncedHandleSelectionChange);
    return () => {
      document.removeEventListener("mouseup", debouncedHandleSelectionChange);
      debouncedHandleSelectionChange.cancel();
    };
  }, []);

  useEffect(() => {
    const groupedTranscription = groupByConsecutiveSpeakerLabel(transcription);
    setSpeakerTranscription(groupedTranscription);
  }, [transcription]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement> | any) => {
    if (!sectionControl && textRef.current) {
      if (!textRef?.current?.contains(event?.target as any)) {
        clearAllTranscriptionSelection();
      }
    }
  };

  useEffect(() => {
    if (sectionControl) {
      document.addEventListener("click", () => selectionControlEvent({ controls: false }));
    }

    if (currentSelectionOfSelection) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [currentSelectionOfSelection, sectionControl, selectionControlEvent]);

  const dataResult = useMemo(() => {
    const computedResult = speakerTranscription?.map((chat, speakerIndex, speakerList) => {
      const speakerNo = chat?.[0]?.speakerLabel
        ? extractNumbersFromString(chat?.[0]?.speakerLabel)?.[0]
        : 0;
      const { backgroundColor, color } = chatColors[(speakerNo as number) % 2 === 0 ? 0 : 1];
      chat = chat?.map(({ text, startTime, endTime }, index) => {
        const { textIndex, getTextStyles, currentSelection, nextElementIsPunctuation } =
          getCalculations({
            text,
            index,
            speakerIndex,
            speakerList,
            //
            clipStartTime,
            clipEndTime,
            //
            startTime,
            endTime,
          });

        return {
          text,
          startTime,
          endTime,
          textIndex,
          getTextStyles,
          currentSelection,
          nextElementIsPunctuation,
        };
      }) as SpeakerTranscription[];
      return {
        chat,
        speakerIndex,
        speakerList,
        backgroundColor,
        color,
        clipStartTime,
        clipEndTime,
      };
    });
    return computedResult;
  }, [speakerTranscription, chatColors, getCalculations]);

  return (
    <div className={style.container}>
      <div
        ref={textRef}
        onMouseUp={() => handleSelectionChange()}
        onClick={(e) => e.preventDefault()}
        className={style.wordContainer}
      >
        {dataResult?.map(({ chat, speakerIndex, backgroundColor, color }) => {
          return (
            <div
              style={{
                backgroundColor,
                color,
              }}
              className={style.chat}
              key={speakerIndex}
            >
              {chat?.map(
                (
                  {
                    text,
                    startTime,
                    endTime,
                    textIndex,
                    getTextStyles,
                    currentSelection,
                    nextElementIsPunctuation,
                  },
                  index,
                ) => {
                  return (
                    <Text
                      key={index}
                      text={text}
                      index={index}
                      endTime={endTime}
                      startTime={startTime}
                      textIndex={textIndex}
                      speakerIndex={speakerIndex}
                      getTextStyles={getTextStyles}
                      handleDragEnd={handleDragEnd}
                      handleDragStart={handleDragStart}
                      currentSelection={currentSelection}
                      setStartValueOnPlayer={setStartValueOnPlayer}
                      nextElementIsPunctuation={nextElementIsPunctuation}
                    />
                  );
                },
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default memo(HighlightAbleText, _.isEqual);
