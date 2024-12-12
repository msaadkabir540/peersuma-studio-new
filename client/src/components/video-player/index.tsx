import { useRef, useEffect, useMemo, useCallback, memo } from "react";

import { VideoPlayerPropsInterface } from "./interface";

import style from "./video-player.module.scss";

const VideoPlayer: React.FC<VideoPlayerPropsInterface> = ({
  videos,
  isPlaying,
  currentTime,
  currentIndex,
  setIsPlaying,
  setCurrentTime,
  setCurrentIndex,
}) => {
  let intervalId: NodeJS.Timeout | null = null;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Use useMemo to memoize the current video and only update it when the currentIndex or videos change
  const currentVideo = useMemo(
    () => videos?.[!currentIndex ? 0 : currentIndex],
    [currentIndex, videos],
  );

  // handles the spacebar key press event to play/pause the video
  // Used useCallback to ensure that the handleKeyPress function only changes when needed
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " ") {
        if (isPlaying) {
          videoRef.current?.pause();
          setIsPlaying(false);
        } else if (
          // currentIndex === false ||
          currentTime >= currentVideo?.startTime &&
          currentTime <= currentVideo?.endTime
        ) {
          videoRef.current?.play();
          setIsPlaying(true);
        }
      }
    },
    [isPlaying, currentTime, currentVideo, videoRef],
  );

  // sets the current video to play when currentIndex changes

  useEffect(() => {
    if (currentIndex >= videos.length) {
      return;
    }

    const video = videoRef.current;
    if (video) {
      if (currentVideo?.url) video.src = currentVideo?.url;
      video.currentTime = currentVideo?.startTime || 0;
      video.muted = true;
      video.play();
      if (!isPlaying) setIsPlaying(true);
      video.muted = false;
    }
  }, [currentIndex, videos]);

  // updates the current time, and checks if the video is playing or paused
  useEffect(() => {
    const video = videoRef?.current;
    intervalId = setInterval(() => {
      if (video?.paused) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        if (isPlaying && video?.currentTime) {
          setCurrentTime(video?.currentTime);
        }
      }
    }, 100);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      intervalId && clearInterval(intervalId);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying]);

  // checks if the current video has ended, and if so, moves to the next video
  useEffect(() => {
    const video = videoRef.current;
    // if (currentIndex !== false && currentTime >= +currentVideo?.endTime - 0.08) {
    if (currentIndex !== -1 && currentTime >= +currentVideo?.endTime - 0.08) {
      if (currentIndex + 1 < videos.length) {
        setCurrentIndex(currentIndex + 1);
        setCurrentTime(0);
      }
      setIsPlaying(false);
      video?.pause();
    }
  }, [currentTime, currentVideo?.endTime]);

  return <video className={style.player} ref={videoRef} muted />;
};

export default memo(VideoPlayer);
