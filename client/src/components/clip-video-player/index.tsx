import React, { useRef, useEffect } from "react";

import styles from "./index.module.scss";

function ClipVideoPlayer({
  id,
  url,
  startTime,
  endTime,
}: {
  id: string;
  url: string;
  startTime: number;
  endTime: number;
}) {
  const videoRef = useRef<HTMLVideoElement | undefined>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current?.play();
    }
  }, [startTime]);
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef?.current && videoRef?.current?.currentTime >= endTime) {
        videoRef?.current?.pause();
      }
    };

    if (videoRef.current) {
      videoRef?.current?.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef?.current?.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [videoRef, endTime]);
  return (
    <video ref={videoRef} id={id} src={url} className={styles.videoClip}>
      <source src={url} type="video/mp4" />
      <track kind="captions" />
    </video>
  );
}

export default ClipVideoPlayer;
