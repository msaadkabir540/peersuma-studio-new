import {
  useRef,
  useEffect,
  useCallback,
  memo,
  useMemo,
  useImperativeHandle,
  useContext,
} from "react";

import Timeline from "./timeline";
import VideoControls from "./video-controls";
import StartAndEndPointIndication from "./start-end-point-indication";

import { formatVideoTime, parseTime } from "./helper";
import { CreateProjectContext } from "@/context/create-project";

import {
  TimelineRef,
  CustomVideoElement,
  VideoPlayerInterface,
  VideoPlayerEditorPropsInterface,
} from "./interface";
import { PlayerInterface } from "@/pages/create-project/interface";

import cross from "@/assets/empty-video.png";
import updateIcon from "@/assets/update-clip.png";

import style from "./video-player.module.scss";

const VideoPlayerEditor: React.FC<VideoPlayerEditorPropsInterface> = ({
  player,
  videoName,
  setPlayer,
  playerRef,
  selection,
  currentVideo,
  setSelection,
  handleDragEnd,
  selectionClear,
  handleDragStart,
  currentVideoLabel,
  handleSetCurrentTime,
  handleUpdateVideoClipEvent,
  handleEmptyVideoPlayerClickEvent,
}) => {
  const { handleSelectionClear } = useContext<VideoPlayerInterface>(CreateProjectContext as any);

  const timeLineRef = useRef<TimelineRef>(null);
  const videoRef = useRef<CustomVideoElement>(null); // Reference to the video element
  const intervalIdRef = useRef<any | null>(null); // Ref for storing the interval ID

  const {
    isPlaying,
    inValidTime,
    selectionEnd,
    selectionStart,
    currentTime,
    videoStartFromTime,
    videoClipPlayer,
  } = player;
  const editableTime = formatVideoTime(player?.currentTime);

  const videoFrames = 30; // Number of frames per second
  const frameTime = 1 / videoFrames; // Duration of each frame in seconds

  const oneFrameBackward = useCallback((video: CustomVideoElement) => {
    video.currentTime = Math.max(0, video.currentTime - frameTime); // Move one frame backward
    setPlayer((prev) => ({ ...prev, currentTime: video.currentTime })); // Update the player state with the new currentTime
  }, []);

  const oneFrameForward = useCallback((video: CustomVideoElement) => {
    video.currentTime = Math.min(video.duration, video.currentTime + frameTime); // Move one frame forward
    setPlayer((prev) => ({ ...prev, currentTime: video.currentTime })); // Update the player state with the new currentTime
  }, []);

  // handles play/pause event
  const handlePlayPause = useCallback(() => {
    if (videoRef) videoRef.current.currentTime = currentTime;
    if (videoRef?.current) videoRef.current.regularPlay = true;
    if (isPlaying) {
      if (videoRef?.current) videoRef.current.pause(); // Pause the video
      setPlayer((prev) => ({ ...prev, isPlaying: false }));
    } else {
      if (videoRef?.current) videoRef.current.play(); // Play the video
      setPlayer((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [isPlaying, setPlayer, videoRef, currentTime]);

  const handleSelectedPlayPause = useCallback(() => {
    videoRef.current.currentTime = currentTime;
    if (
      videoRef.current &&
      videoRef.current.paused &&
      videoRef.current.currentTime > (selectionEnd as number)
    ) {
      videoRef.current.currentTime = selectionStart as number;
      setPlayer((prev) => ({ ...prev, currentTime: selectionStart }));
    }

    if (selectionEnd && selectionStart) {
      if (videoRef?.current && videoRef.current.paused && currentTime !== selectionEnd) {
        videoRef.current.play();
        setPlayer((prev) => ({
          ...prev,
          isSelectPlaying: true,
          isPlaying: false,
          videoClipPlayer: true,
        }));
      }

      if (player?.isSelectPlaying && videoRef?.current) {
        videoRef.current.pause();
        setPlayer((prev) => ({ ...prev, isSelectPlaying: false, isPlaying: false }));
      }
    }
  }, [currentTime, selectionStart, setPlayer, selectionEnd, player?.isSelectPlaying, videoRef]);

  useEffect(() => {
    if (
      videoClipPlayer &&
      parseFloat(currentTime).toFixed(3) === parseFloat(selectionEnd).toFixed(3)
    ) {
      setPlayer((prev: PlayerInterface) => ({
        ...prev,
        isSelectPlaying: false,
        isPlaying: false,
        videoClipPlayer: false,
        currentTime: videoRef?.current.currentTime,
      }));
      videoRef?.current?.pause();
    }
  }, [currentTime, selectionEnd, videoClipPlayer, setPlayer, videoRef.current?.currentTime]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const video = videoRef.current;
      const notTimeField = document?.activeElement?.id !== "timeStamp";
      const tagName = document?.activeElement?.tagName || "";
      if (e.key === " " && !["TEXTAREA", "INPUT"].includes(tagName)) {
        handlePlayPause(); // Play/Pause the video on Space Bar press
        e.preventDefault();
      } else if (e.keyCode === 37 && notTimeField && video) {
        oneFrameBackward(video); // Move one frame backward on left arrow key press
      } else if (e.keyCode === 39 && notTimeField && video) {
        oneFrameForward(video); // Move one frame forward on right arrow key press
      }
    },
    [oneFrameBackward, oneFrameForward, handlePlayPause, videoRef],
  );

  const handleEditableTimeChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPlayer((prev) => ({ ...prev, editableTime: event.target.value }));

  const handleEditableTimeBlur = () => {
    const parsedTime = parseTime(editableTime);
    // if time entered is valid
    if (parsedTime !== null && videoRef?.current && parsedTime <= videoRef?.current?.duration) {
      videoRef.current.currentTime = parsedTime;
      setPlayer((prev) => ({
        ...prev,
        inValidTime: "",
        editTimeField: false,
        currentTime: parsedTime,
      }));
    } else {
      // handle invalid time
      setPlayer((prev) => ({
        ...prev,
        inValidTime: "Invalid time entered",
        editableTime: videoRef?.current?.currentTime
          ? formatVideoTime(videoRef?.current?.currentTime)
          : "",
      }));
    }
  };

  const handleEditableTimeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditableTimeBlur();
    }
  };

  const resetToStartPointEvent = () => {
    if (videoRef?.current) videoRef.current.currentTime = 0;
    timeLineRef?.current?.moveNotchToStart();
  };

  const resetToEndPointEvent = () => {
    if (videoRef?.current) videoRef.current.currentTime = videoRef.current?.duration;
    timeLineRef?.current?.moveNotchToEnd();
  };

  const clickOnStartTimeToEdit = ({ editableTime }: { editableTime: string }) =>
    setPlayer((prev) => ({
      ...prev,
      editTimeField: true,
      editableTime,
    }));

  const clickOnCurrentTimeControl = ({
    currentTime,
    controls = player.controls,
  }: {
    currentTime: number;
    controls?: boolean;
  }) => setPlayer((prev) => ({ ...prev, currentTime, controls }));

  const pauseVideoPlayer = ({ value }: { value: boolean }) =>
    setPlayer((prev) => ({ ...prev, isPlaying: value }));

  const setNewTimeToVideoCurrentTime = ({ value }: { value: number }) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = value;
      setPlayer((prev) => ({ ...prev, currentTime: value }));
    }
  };

  const setControlsOnSelectionEvent = ({ controls }: { controls: boolean }) =>
    setSelection((prev) => ({ ...prev, controls }));

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      if (currentVideo?.url) video.src = currentVideo?.url || ""; // Set the video source to the currentVideo's URL
      video.currentTime = currentTime || currentVideo?.startTime || 0; // Set the initial currentTime of the video
      video.muted = true; // Mute the video initially
      if (isPlaying) video.pause(); // Start playing the video if isPlaying is true
      video.muted = false; // Unmute the video
    }

    // Cleanup function for the effect
    return () => {
      clearInterval(intervalIdRef.current); // Clear the interval when the component is unmounted
      document.removeEventListener("keydown", handleKeyPress); // Remove the keydown event listener
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo]);

  // updates the current time, and checks if the video is playing or paused
  useEffect(() => {
    const video = videoRef.current;

    // Create an interval that runs every 100 milliseconds to track video playback
    intervalIdRef.current = setInterval(() => {
      if (video && video.paused) {
        // If video is paused
        isPlaying && setPlayer((prev) => ({ ...prev, isPlaying: false })); // Update the player state to indicate video is not playing
      } else {
        // If video is playing
        !isPlaying &&
          setPlayer((prev) => ({
            ...prev,
            isPlaying: false, //hanan
          })); // Update the player state to indicate video is playing
        if (isPlaying) {
          setPlayer((prev) => ({ ...prev, currentTime: video?.currentTime || 0 })); // Update the player state with the current time of the video
        }
      }
    }, 100);

    document.addEventListener("keydown", handleKeyPress); // Add a keydown event listener to handle keyboard inputs

    // Cleanup function for the effect
    return () => {
      clearInterval(intervalIdRef.current); // Clear the interval when the component is unmounted
      document.removeEventListener("keydown", handleKeyPress); // Remove the keydown event listener
    };
  }, [isPlaying, handleKeyPress, currentVideo, intervalIdRef, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    // Create an interval that runs every 100 milliseconds to track video playback
    const UpdateCurrentTime = setInterval(() => {
      if (player?.isSelectPlaying) {
        setPlayer((prev) => ({ ...prev, currentTime: video?.currentTime || 0 })); // Update the player state with the current time of the video
      }
    }, 100);
    // Cleanup function for the effect
    return () => {
      clearInterval(UpdateCurrentTime); // Clear the interval when the component is unmounted
    };
  }, [player?.isSelectPlaying, videoRef]);

  // checks if the current video has ended, and if so, moves to the next video
  useEffect(() => {
    const video = videoRef.current;
    if (currentTime >= selectionEnd - 0.08) {
      if (player?.isSelectPlaying) {
        setPlayer((prev) => ({
          ...prev,
          isPlaying: false,
          isSelectPlaying: false,
          currentTime: video.currentTime,
          video: { ...prev?.video, playClip: false },
        }));
        video && video.pause();
      }
    }
  }, [currentTime, currentVideo?.endTime, selectionEnd, setPlayer, player?.isSelectPlaying]);

  useEffect(() => {
    if (
      selection?.currentSelection?.startSeconds != undefined &&
      selection?.currentSelection?.startSeconds != null
    ) {
      setPlayer((prev) => ({
        ...prev,
        selectionStart: selection?.currentSelection?.startSeconds,
        selectionEnd: selection?.currentSelection?.endSeconds,
      }));
    }
  }, [videoRef, selectionStart, selection, selectionEnd, currentTime, setPlayer]);

  useEffect(() => {
    if (selectionClear) {
      resetToStartPointEvent();
      handleSelectionClear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionClear]);

  useImperativeHandle(playerRef, () => ({
    handleEmptyVideoRef() {
      handleEmptyVideoRef();
    },
  }));
  const handleEmptyVideoRef = () => {
    if (videoRef.current) {
      videoRef.current.src = "";
    }
    setPlayer({} as PlayerInterface);
    setSelection({
      controls: false,
    });
  };

  useEffect(() => {
    // Create an interval that runs every 100 milliseconds to track video playback
    const setCurrentTime = handleSetCurrentTime({ currentTime: videoRef?.current?.currentTime });

    // Cleanup function for the effect
    return () => {
      clearInterval(setCurrentTime as any); // Clear the interval when the component is unmounted
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef?.current?.currentTime]);

  return (
    <>
      <div className={style.playerWrapper}>
        <div className={style.videoHeadingContainer}>
          <div className={style.selectedMediaName}>{videoName}</div>
          <div className={style.actionsContainer}>
            <img
              src={cross}
              alt="cross"
              title={"Empty Video Player"}
              className={style.crossIcon}
              onClick={() => handleEmptyVideoPlayerClickEvent()}
            />
            {currentVideoLabel && (
              <img
                src={updateIcon}
                alt="updateIcon"
                title={"Update Clip"}
                className={style.crossIcon}
                onClick={() => handleUpdateVideoClipEvent()}
              />
            )}
          </div>
        </div>
        <video ref={videoRef} className={style.player} muted controls={false} />
        {player?.editTimeField ? (
          <>
            <input
              type="text"
              id="timeStamp"
              value={editableTime}
              onBlur={handleEditableTimeBlur}
              style={{ marginBottom: "10px" }}
              onChange={handleEditableTimeChange}
              onKeyDown={handleEditableTimeKeyDown}
            />
            <p style={{ color: "#ff0000" }}>{inValidTime || ""}</p>
          </>
        ) : (
          <StartAndEndPointIndication
            selectionEnd={selectionEnd}
            selectionStart={selectionStart}
            videoCurrentTime={currentTime || videoRef?.current?.currentTime}
            clickOnStartTimeToEdit={clickOnStartTimeToEdit}
          />
        )}
        <Timeline
          style={style}
          handleDragEnd={handleDragEnd}
          selectionEnd={selectionEnd || 0}
          handleDragStart={handleDragStart}
          selectionStart={selectionStart || 0}
          currentVideoDuration={currentVideo?.duration || 0}
          clickOnCurrentTimeControl={clickOnCurrentTimeControl}
          videoCurrentDuration={videoRef?.current?.duration || 0}
          setControlsOnSelectionEvent={setControlsOnSelectionEvent}
          setNewTimeToVideoCurrentTime={setNewTimeToVideoCurrentTime} // move or selected player time
          videoCurrentTime={currentTime || videoRef?.current?.currentTime || 0}
        />
        <VideoControls
          style={style}
          player={player}
          videoRef={videoRef}
          setPlayer={setPlayer}
          setSelection={setSelection}
          selectionEnd={selectionEnd || 0}
          handlePlayPause={handlePlayPause}
          oneFrameForward={oneFrameForward}
          handleDragStart={handleDragStart}
          oneFrameBackward={oneFrameBackward}
          pauseVideoPlayer={pauseVideoPlayer}
          selectionStart={selectionStart || 0}
          videoStartFromTime={videoStartFromTime || 0}
          resetToStartPointEvent={resetToStartPointEvent}
          handleSelectedPlayPause={handleSelectedPlayPause}
          currentVideoDuration={currentVideo?.duration || 0}
          videoCurrentDuration={videoRef?.current?.duration || 0}
          setNewTimeToVideoCurrentTime={setNewTimeToVideoCurrentTime} // move or selected player time
          videoCurrentTime={currentTime || (videoRef?.current?.currentTime as number)}
        />
      </div>
    </>
  );
};

export default memo(VideoPlayerEditor);
