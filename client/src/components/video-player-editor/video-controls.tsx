import _ from "lodash";
import React, { useMemo, memo, useCallback, useEffect, useContext } from "react";

import { handleSelectionStartService, handleSelectionEndService } from "./helper";

import { VideoContext, VideoControlsPropsInterface } from "./interface";

import playIcon from "@/assets/play-icon.svg";
import pauseIcon from "@/assets/pause-icon.svg";
import forwardIcon from "@/assets/forward-frame.svg";
import selectionsEndIcon from "@/assets/right-brace.svg";
import selectionStartIcon from "@/assets/left-brace.svg";
import cancelStartEndSelection from "@/assets/curly-brackets.svg";
import gotoSelectionsEndIcon from "@/assets/right-arrow-brace.svg";
import gotoSelectionsStartIcon from "@/assets/left-arrow-brace.svg";
import { CreateProjectContext } from "@/context/create-project/index";

const VideoControls: React.FC<VideoControlsPropsInterface> = ({
  style,
  player,
  videoRef,
  setPlayer, //state
  setSelection, //state
  selectionEnd,
  selectionStart,
  oneFrameForward,
  handlePlayPause,
  oneFrameBackward,
  videoCurrentTime,
  videoStartFromTime,
  videoCurrentDuration,
  currentVideoDuration,
  resetToStartPointEvent,
  handleSelectedPlayPause,
  setNewTimeToVideoCurrentTime,
}) => {
  const { handleSelectedVideoClip } = useContext<VideoContext>(CreateProjectContext as any);

  const { currentTime, isSelectPlaying, isPlaying } = player;

  const handleSelectionStart = useCallback(() => {
    setNewTimeToVideoCurrentTime({ value: currentTime });
    const playerValues = handleSelectionStartService({
      videoRefCurrentTime: videoRef.current?.currentTime || videoCurrentTime,
      videoRefCurrentDuration: currentVideoDuration || videoCurrentDuration,
      selectionEnd,
      selectionStart,
    });

    setPlayer((prev) => ({
      ...prev,
      ...playerValues,
    }));

    setSelection({ controls: false });
  }, [
    videoRef,
    setPlayer,
    currentTime,
    selectionEnd,
    setSelection,
    selectionStart,
    videoCurrentTime,
    videoCurrentDuration,
    currentVideoDuration,
    setNewTimeToVideoCurrentTime,
  ]);

  // // handles the end of selection
  const handleSelectionEnd = useCallback(() => {
    setNewTimeToVideoCurrentTime({ value: currentTime });
    const playerValues = handleSelectionEndService({
      videoRefCurrentTime: videoRef.current?.currentTime || videoCurrentTime,
      videoRefCurrentDuration: videoCurrentDuration,
      selectionEnd,
      selectionStart,
    });
    setPlayer((prev) => ({
      ...prev,
      ...playerValues,
    }));

    setSelection({ controls: false });
  }, [
    videoRef,
    setPlayer,
    currentTime,
    selectionEnd,
    setSelection,
    selectionStart,
    videoCurrentTime,
    videoCurrentDuration,
    setNewTimeToVideoCurrentTime,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.currentTime = selectionStart;
  }, [selectionStart]);

  useEffect(() => {
    if (videoStartFromTime > 0) {
      if (videoRef.current) videoRef.current.regularPlay = true;
      const video = videoRef?.current;
      if (video) video.currentTime = videoStartFromTime;
      setPlayer((prev) => ({ ...prev, isPlaying: true }));
      video?.play();
    }
  }, [videoStartFromTime, setPlayer, videoRef]);

  const playPauseIcon = useMemo(() => {
    return isPlaying ? pauseIcon : playIcon;
  }, [isPlaying]);

  const removeStartTimeEvent = () => {
    if (
      (selectionStart === 0 && selectionEnd === 0) ||
      (_.isUndefined(selectionStart) && _.isUndefined(selectionEnd))
    ) {
      setPlayer((prev) => ({
        ...prev,
        selectionStart: undefined,
        selectionEnd: undefined,
      }));
    } else {
      setPlayer((prev) => ({
        ...prev,
        selectionStart: 0,
      }));
    }
  };
  const removeSelectedTimeEvent = () => {
    videoRef?.current?.pause();
    setSelection({ controls: false });
    handleSelectedVideoClip();
    setPlayer((prev) => ({
      ...prev,
      selectionStart: undefined,
      selectionEnd: undefined,
      currentTime: 0,
    }));
    resetToStartPointEvent();
  };
  const videosControlsButtons = [
    {
      dataFlow: "bottom",
      dataTooltip: "Video play pause clip",
      className: style.playPauseButton,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => handleSelectedPlayPause(),
      imgIcon: isSelectPlaying ? pauseIcon : playIcon,
      alt: "play-pause-icon",
      height: 15,
      imgClass: "",
      disable: selectionStart && selectionEnd ? false : true,
    },
    {
      dataFlow: "bottom",
      dataTooltip: "Rewind 1 frame",
      className: style.controlButtons,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => videoRef?.current && oneFrameBackward(videoRef?.current),
      imgClass: style.revert,
      imgIcon: forwardIcon,
      alt: "rewind-icon",
    },

    {
      dataFlow: "bottom",
      dataTooltip: "Remove Start Time",
      className: style.controlButton,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => {
        removeStartTimeEvent();
      },
      imgIcon: selectionStartIcon,
      alt: "forward-icon",
      cancelLineDiv: true,
      imgClass: "",
      disable: selectionStart ? false : true,
    },
    {
      dataFlow: "bottom",
      dataTooltip: "Start clip selection",
      className: style.controlButtons,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => handleSelectionStart(),
      imgIcon: selectionStartIcon,
      alt: "selection-start-icon",
      imgClass: "",
    },
    {
      dataFlow: "bottom",
      dataTooltip: "Goto selection start",
      className: style.controlButtons,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => {
        if (videoRef.current) videoRef.current.currentTime = Math.max(0, selectionStart);
        setPlayer((prev) => ({ ...prev, currentTime: selectionStart }));
      },
      imgIcon: gotoSelectionsStartIcon,
      alt: "goto-selection-start-icon",
      disabled: selectionStart === undefined,
      imgClass: "",
    },
    {
      dataFlow: "bottom",
      dataTooltip: "Video play or pause",
      className: style.playPauseButton,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => {
        handlePlayPause();
      },
      imgIcon: playPauseIcon,
      alt: "play-pause-icon",
      height: 15,
      imgClass: "",
    },
    {
      dataFlow: "bottom",
      dataTooltip: "Goto selection end",
      className: style.controlButtons,
      disabled: selectionEnd === undefined,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => {
        if (videoRef.current) videoRef.current.currentTime = Math.max(0, selectionEnd);
        setPlayer((prev) => ({ ...prev, currentTime: selectionEnd }));
      },
      imgIcon: gotoSelectionsEndIcon,
      alt: "goto-selection-end-icon",
      imgClass: "",
    },
    {
      dataFlow: "bottom",
      dataTooltip: "End clip selection",
      className: style.controlButtons,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => {
        handleSelectionEnd();
      },
      imgIcon: selectionsEndIcon,
      alt: "selection-end-icon",
      imgClass: "",
    },
    {
      dataFlow: "bottom",
      dataTooltip: "Remove End Time",
      className: style.controlButton,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => {
        if (selectionEnd !== 0 && !_.isUndefined(selectionEnd)) {
          setPlayer((prev) => ({
            ...prev,
            selectionEnd: videoCurrentDuration,
          }));
        }
      },
      imgIcon: selectionsEndIcon,
      alt: "selection-end-icon",
      cancelLineDiv: true,
      imgClass: "",
      disable: selectionEnd ? false : true,
    },
    {
      dataFlow: "bottom",
      dataTooltip: "Forward 1 frame",
      className: style.controlButtons,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => {
        videoRef?.current && oneFrameForward(videoRef?.current);
      },
      imgIcon: forwardIcon,
      alt: "forward-icon",
      imgClass: "",
    },
    {
      dataFlow: "bottom",
      dataTooltip: "Remove Selected Time",
      className: style.controlButton,
      onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
      onClick: () => {
        removeSelectedTimeEvent();
      },
      imgIcon: cancelStartEndSelection,
      alt: "forward-icon",
      cancelLineDiv: true,
      imgClass: "",
      disabled: selectionStart === undefined,
    },
    // {
    //   dataFlow: "bottom",
    //   dataTooltip: "Send clip to selected input",
    //   className: style.controlButton,
    //   onKeyDownCapture: (e: React.KeyboardEvent<HTMLButtonElement>) => e.preventDefault(),
    //   onClick: () => {
    //     handleDragStart(null, true);
    //   },
    //   imgIcon: arrow,
    //   alt: "arrow",
    //   imgClass: "",
    //   disable: selectionStart && selectionEnd ? false : true,
    // },
  ];

  return (
    <div
      className={style.controls}
      onKeyDownCapture={(e) => {
        e?.preventDefault();
      }}
      onClick={() => {
        setSelection((prev) => ({ ...prev, controls: true }));
      }}
    >
      {videosControlsButtons?.map((controls, index) => (
        <React.Fragment key={index}>
          <button
            data-flow={controls?.dataFlow}
            data-tooltip={controls?.dataTooltip}
            className={controls?.className}
            onKeyDownCapture={controls?.onKeyDownCapture}
            onClick={controls?.onClick}
            disabled={controls?.disabled || false}
          >
            {controls?.cancelLineDiv && <div className={style.cancelLine} />}
            <img
              className={controls?.imgClass}
              src={controls?.imgIcon}
              height={controls?.height || 10}
              alt={controls?.alt}
            />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default memo(VideoControls);
