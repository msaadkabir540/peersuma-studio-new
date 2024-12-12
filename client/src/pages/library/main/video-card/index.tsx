import { useNavigate } from "react-router-dom";
import { writeText } from "clipboard-polyfill";

import { convertTime } from "@/utils/helper";

import createNotification from "@/common/create-notification";

import { VideoCardsInterface } from "./video-cards-interface";

import linkIcon from "@/assets/copy.png";
import Drag from "@/assets/drag-icon.svg";

import styles from "./index.module.scss";

const VideoCard: React.FC<VideoCardsInterface> = ({
  _id,
  name,
  thumbnailUrl,
  duration,
  shortLink,
  assetId,
}) => {
  const navigate = useNavigate();

  const handleDragStart = (e: React.DragEvent) => {
    // Set the data to be transferred during the drag operation
    // const crt;
    const crt = document.createElement("div");
    crt.id = "drag-player";
    crt.innerHTML = `
    <div class="${styles.dragElementInner}">
    <img src="${thumbnailUrl}" alt="video-thumbnail" />
    <div>
    <span>${name}</span>
    </div>
    </div>
    `;
    crt.classList.add(styles.dragElement);
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, 0, 0);
    e.dataTransfer.setData("video_data", JSON.stringify({ _id, name, thumbnailUrl, duration }));
  };

  const handleDragEnd = () => {
    const dragPlayerElement = document.getElementById("drag-player");
    if (dragPlayerElement) {
      dragPlayerElement.remove();
    }
  };

  return (
    <div className={styles.container}>
      <div
        aria-hidden="true"
        onClick={() => {
          navigate(`/library/${_id}`);
        }}
      >
        <div className={styles.containerHeader}>
          <div className={styles.videoDiv}>
            <img src={thumbnailUrl} alt="thumbnailUrl" />
            <div className={styles.videoDuration}>{convertTime(duration) || "Loading..."}</div>
          </div>
        </div>
        <div className={styles.headingContainer}>
          <h4>{name}</h4>
          <img
            {...{ draggable: true, onDragEnd: handleDragEnd, onDragStart: handleDragStart }}
            src={Drag}
            alt="Drag"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className={styles.footer}
        onClick={() => {
          writeText(import.meta.env.VITE_LIBRARY_SHORT_URL_BASE + shortLink);
          createNotification("success", "Short link copied to clipboard");
        }}
        title="click to copy"
      >
        <div className={styles.linkContainer}>
          <img src={linkIcon} alt="linkIcon" />
        </div>
        <p>
          {import.meta.env.VITE_LIBRARY_SHORT_URL_BASE}
          {shortLink ? shortLink : assetId}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
