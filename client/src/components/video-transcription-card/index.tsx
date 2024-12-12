import React, { memo, useCallback, useContext, useEffect, useRef, useState } from "react";

import Modal from "../modal";
import ContextMenu from "./context-menu";
import ClipVideoPlayer from "../clip-video-player";

import { CreateProjectContext } from "@/context/create-project";

import { formatVideoTime } from "../video-player-editor/helper";

import Drag from "@/assets/drag-icon.svg";
import Unmute from "@/assets/no-audio.png";
import Mute from "@/assets/audio-volume.png";
import playIcon from "@/assets/playCircle.png";

import {
  StagingHandleContextInterface,
  VideoClipCardPropsInterface,
} from "@/pages/create-project/components/interface";

import styles from "./styles.module.scss";

const VideoTranscriptionCard: React.FC<VideoClipCardPropsInterface> = ({
  item,
  label,
  fieldId,
  activeTab,
  fieldName,
  lastElement,
  leftBodyRef,
  renameAllow,
  videoClipCss,
  selectedVideo,
  handleMenuOpen,
  stagingFieldId,
  handleClipClick,
  handleClipDelete,
}) => {
  const { stagingHandleEvent } = useContext<StagingHandleContextInterface>(
    CreateProjectContext as any,
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const VideoClipCardRef = useRef<HTMLDivElement>(null);

  const [muted, setMuted] = useState<boolean>(true);
  const [hoverId, setHoverId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>("");
  const [videoPlayer, setVideoPlayer] = useState<boolean>(false);

  const { clipDuration, thumbnailUrl, name, url, startTime, id, endTime, transcription } = item;
  const time = formatVideoTime(clipDuration as number);

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();

      videoRef.current.currentTime = startTime;
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef?.current && videoRef?.current?.currentTime >= endTime) {
        videoRef?.current?.pause();
        videoRef.current.currentTime = startTime;
      }
    };

    videoRef.current = document.getElementById(hoverId);

    const handleMouseEnter = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = startTime;
        videoRef?.current?.play();
      }
    };

    if (videoRef.current) {
      videoRef?.current?.addEventListener("timeupdate", handleTimeUpdate);
      videoRef?.current?.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [videoRef, endTime, hoverId, startTime]);

  const parseTimeToMilliseconds = ({ time }: { time: string }) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const [hours, minutes, seconds, milliseconds] = time?.split(":")?.map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
  };

  function secondsToMilliseconds({ seconds }: { seconds: number }) {
    return seconds * 1000;
  }

  const filterDataByTime = useCallback(() => {
    const filteredData = transcription?.filter((entry) => {
      const entryStartTime = entry.startTime;
      const entryEndTime = entry.endTime;
      const entryStartTimeMs = parseTimeToMilliseconds({ time: entryStartTime });
      const entryEndTimeMs = parseTimeToMilliseconds({ time: entryEndTime });
      const startTimeMs = secondsToMilliseconds({ seconds: startTime });
      const endTimeMs = secondsToMilliseconds({ seconds: endTime });

      return entryStartTimeMs >= startTimeMs && entryEndTimeMs <= endTimeMs;
    });
    return filteredData;
  }, [transcription, startTime, endTime]);

  const filteredTranscriptionText = filterDataByTime();

  const transcriptionText = filteredTranscriptionText?.map(
    ({ text }: { text: string }, index: number) => {
      // eslint-disable-next-line react/jsx-key
      return <span key={index}> {text} </span>;
    },
  );

  const getMenuPosition = () => {
    if (!VideoClipCardRef.current) return {};

    const buttonRect = VideoClipCardRef?.current?.getBoundingClientRect();
    // const contextMenuHeight = document.getElementById("context-menu")?.clientHeight || 0;
    const contextMenuHeight = 85;
    const top = (buttonRect?.height || 0) / 4;

    if (
      contextMenuHeight + top > buttonRect?.height &&
      lastElement &&
      leftBodyRef?.current?.scrollHeight > contextMenuHeight
    ) {
      return {
        top: `16px`,
        bottom: "0px",
        left: "16px",
      };
    } else if (stagingFieldId !== fieldId) {
      return {
        top: `${top}px`,
        left: "16px",
      };
    } else {
      return {};
    }
  };

  return (
    <>
      <div
        ref={VideoClipCardRef}
        className={`${styles.card}  ${selectedVideo}`}
        aria-hidden="true"
        onClick={handleClipClick}
        onContextMenu={(e) => {
          e?.preventDefault();
          setIsOpen(true);
          setCurrentIndex(id);
        }}
      >
        <div className={styles.imageClass} style={{ float: "left", margin: "5px" }}>
          <div
            onMouseEnter={() => {
              setHoverId(id);
            }}
            onMouseLeave={handleMouseLeave}
            className={styles.imageBox}
          >
            <div className={styles.clipVideo}>
              <video ref={videoRef} id={id} src={url} className={styles.clipVideo} muted={muted}>
                <source src={url} type="video/mp4" />
                <track kind="captions" />
              </video>
              <div className={styles.thumbnailZoom}>
                <div className={styles.muteVideo}>
                  <img
                    className={styles.volumeIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMuted(!muted);
                    }}
                    src={muted ? Unmute : Mute}
                    aria-hidden="true"
                    alt="volume"
                  />
                </div>
              </div>
              <div className={styles.imageClassRemove}>
                <img
                  src={thumbnailUrl ?? url}
                  className={`${styles.videoThumbnails} ${videoClipCss}`}
                  alt="video-thumbnail"
                />
              </div>
              {thumbnailUrl && <span className={styles.durationClass}>{time}</span>}
            </div>
          </div>
        </div>

        <div className={styles.transcriptText}>
          <div className={styles.heading}>
            <div className={styles.name}>{name || ""}</div>
            <div className={styles.iconsContainer}>
              <img
                src={Drag}
                aria-hidden="true"
                alt="Drag"
                style={{ marginLeft: "auto", cursor: "grab" }}
              />
              <div className={styles.videoPlayBox}>
                <img
                  className={styles.volumeIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoPlayer(true);
                  }}
                  src={playIcon}
                  aria-hidden="true"
                  alt="volume"
                />
              </div>
            </div>
          </div>
          {transcriptionText}
        </div>

        <Modal
          {...{
            open: videoPlayer === true,
            handleClose: () => setVideoPlayer(false),
          }}
        >
          <ClipVideoPlayer {...{ id, url, startTime, endTime }} />
        </Modal>
        {isOpen && currentIndex === id && (
          <ContextMenu
            id={id}
            name={name}
            label={label}
            fieldName={fieldName}
            setIsOpen={setIsOpen}
            activeTab={activeTab}
            renameAllow={renameAllow}
            handleMenuOpen={handleMenuOpen}
            handleClipClick={handleClipClick}
            getMenuPosition={getMenuPosition()}
            handleClipDelete={handleClipDelete}
            stagingHandleEvent={stagingHandleEvent}
          />
        )}
      </div>
    </>
  );
};

export default memo(VideoTranscriptionCard);
