import React, { memo, useContext, useEffect, useRef, useState } from "react";

import Modal from "@/components/modal";
import ClipVideoPlayer from "@/components/clip-video-player";

import { CreateProjectContext } from "@/context/create-project";
import ContextMenu from "@/components/video-transcription-card/context-menu";

import { formatVideoTime } from "@/components/video-player-editor/helper";

import { StagingHandleContextInterface, VideoClipCardPropsInterface } from "../interface";

import Drag from "@/assets/drag-icon.svg";
import Unmute from "@/assets/no-audio.png";
import Mute from "@/assets/audio-volume.png";
import playIcon from "@/assets/playCircle.png";
import AltImage from "@/assets/noImage.png";

import styles from "./index.module.scss";

const VideoClipCard: React.FC<VideoClipCardPropsInterface> = ({
  item,
  label,
  activeTab,
  fieldName,
  isStaging,
  renameAllow,
  readyToDraft,
  videoClipCss,
  dragItemClass,
  selectedVideo,
  handleMenuOpen,
  handleClipClick,
  handleClipDelete,
  handleReadyToDraft,
}) => {
  const { stagingHandleEvent } = useContext<StagingHandleContextInterface>(
    CreateProjectContext as any,
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const VideoClipCardRef = useRef<HTMLDivElement>(null);

  const [muted, setMuted] = useState(true);
  const [hoverId, setHoverId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>("");
  const [isVideoPlayer, setIsVideoPlayer] = useState<boolean>(false);

  const { clipDuration, thumbnailUrl, name, url, startTime, id, endTime } = item;

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

  const getMenuPosition = () => {
    if (!VideoClipCardRef.current) return {};

    const buttonRect = VideoClipCardRef?.current?.getBoundingClientRect();
    const top = (buttonRect?.height || 0) / 2;

    if (!renameAllow) {
      return {
        top: `${top + 13}px`,
        left: "0px",
      };
    } else if (!activeTab) {
      return {
        top: `${120}px`,
        left: "5px",
      };
    } else {
      return {
        top: `${top}px`,
        left: "8px",
      };
    }
  };

  return (
    <>
      <div
        ref={VideoClipCardRef}
        className={`${styles.card} ${selectedVideo}`}
        aria-hidden="true"
        onClick={(e) => {
          e?.stopPropagation;
          handleClipClick && handleClipClick(e as React.MouseEvent<HTMLDivElement, MouseEvent>);
        }}
        onContextMenu={(e) => {
          e?.preventDefault();
          setIsOpen(true);
          setCurrentIndex(id);
        }}
      >
        <div
          onMouseEnter={() => {
            setHoverId(id);
          }}
          onMouseLeave={handleMouseLeave}
          className={styles.imageBox}
        >
          <div className={`${isStaging ? styles.StagingClipVideoCards : styles.clipVideoCardss}`}>
            <video
              ref={videoRef}
              id={id}
              src={url}
              className={`${isStaging ? styles.StagingClipVideoCards : styles.clipVideoCardss}`}
              muted={muted}
            >
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = AltImage;
                  }}
                />
              </div>
            </div>
            <div className={styles.imageClassRemove}>
              <img
                src={thumbnailUrl ?? url}
                className={`${styles.videoThumbnail} ${videoClipCss}`}
                alt="video-thumbnail"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>

          {thumbnailUrl && (
            <span className={`${isStaging ? styles.stagingDurationClass : styles.durationClass}`}>
              {time}
            </span>
          )}
        </div>

        <div className={`${styles.dragItem} ${dragItemClass}`}>
          <div className={styles.name}>{name || ""}</div>
          <div className={styles.videoPlayBox}>
            <img
              className={styles.volumeIcon}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsVideoPlayer(true);
              }}
              src={playIcon}
              aria-hidden="true"
              alt="volume"
            />
            <img src={Drag} aria-hidden="true" alt="Drag" style={{ cursor: "grab" }} />
          </div>
        </div>

        <Modal
          {...{
            open: isVideoPlayer === true,
            handleClose: () => {
              setIsVideoPlayer(false);
            },
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
            readyToDraft={readyToDraft}
            activeTab={activeTab}
            renameAllow={renameAllow}
            handleMenuOpen={handleMenuOpen}
            handleClipClick={handleClipClick}
            getMenuPosition={getMenuPosition()}
            handleClipDelete={handleClipDelete}
            handleReadyToDraft={handleReadyToDraft}
            stagingHandleEvent={stagingHandleEvent}
          />
        )}
      </div>
    </>
  );
};

export default memo(VideoClipCard);
