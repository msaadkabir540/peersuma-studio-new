import { useRef, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-type";

import style from "./video-player.module.scss";

const VideoPlayerSingle = ({
  isPlaying,
  setPlayer,
  currentTime,
  currentIndex,
  video: currentVideo,
}) => {
  let intervalId = null;

  const videoRef = useRef(null);

  // handles the spacebar key press event to play/pause the video
  // Used useCallback to ensure that the handleKeyPress function only changes when needed
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === " ") {
        if (isPlaying) {
          videoRef.current.pause();
          setPlayer((prev) => ({ ...prev, isPlaying: false }));
        } else if (
          currentIndex === false ||
          (currentTime >= currentVideo?.startTime && currentTime <= currentVideo?.endTime)
        ) {
          videoRef.current.play();
          setPlayer((prev) => ({ ...prev, isPlaying: true }));
        }
      }
    },
    [isPlaying, currentTime, currentVideo],
  );

  // sets the current video to play when currentIndex changes

  useEffect(() => {
    const video = videoRef.current;
    video.src = currentVideo?.url;
    video.currentTime = currentTime || currentVideo?.startTime || 0;
    video.muted = true;
    isPlaying && video.play();
    video.muted = false;
  }, [currentIndex, currentVideo]);

  // updates the current time, and checks if the video is playing or paused
  useEffect(() => {
    const video = videoRef.current;
    intervalId = setInterval(() => {
      if (video.paused) {
        setPlayer((prev) => ({ ...prev, isPlaying: false }));
      } else {
        setPlayer((prev) => ({ ...prev, isPlaying: true }));
        if (isPlaying) {
          setPlayer((prev) => ({ ...prev, currentTime: video.currentTime }));
        }
      }
    }, 100);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying]);

  // checks if the current video has ended, and if so, moves to the next video
  useEffect(() => {
    const video = videoRef.current;
    if (currentIndex !== false && currentTime >= +currentVideo?.endTime - 0.08) {
      if (currentVideo?.playClip) {
        setPlayer((prev) => ({
          ...prev,
          isPlaying: false,
          currentTime: +currentVideo?.endTime,
          video: { ...prev?.video, playClip: false },
        }));
        video.pause();
      }
    }
  }, [currentTime, currentVideo?.endTime]);

  return <video className={style.player} ref={videoRef} muted controls />;
};

VideoPlayerSingle.prototype = {
  isPlaying: PropTypes.bool.isRequired,
  setPlayer: PropTypes.func.isRequired,
  currentTime: PropTypes.object.isRequired,
  currentIndex: PropTypes.bool,
  video: PropTypes.object.isRequired,
};
export default memo(VideoPlayerSingle);
