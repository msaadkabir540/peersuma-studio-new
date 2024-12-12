import { isObject } from "lodash";
import { Dispatch, SetStateAction, memo } from "react";

import Modal from "@/components/modal";

import styles from "../index.module.scss";

const VideoModal = ({
  viewFile,
  setViewFile,
}: {
  viewFile: boolean | { url: string; fileType: string };
  setViewFile: Dispatch<SetStateAction<boolean | { url: string; fileType: string }>>;
}) => {
  return (
    <Modal
      {...{
        open: viewFile ? true : false,
        handleClose: () => setViewFile(false),
      }}
    >
      {isObject(viewFile) && viewFile?.fileType === "video" ? (
        <video className={styles.videoPlayer} controls autoPlay>
          <source src={viewFile?.url} type="video/mp4" />
          <track kind="captions" src={viewFile?.url} />
        </video>
      ) : isObject(viewFile) && viewFile?.fileType === "image" ? (
        <img src={viewFile?.url} className={styles.videoPlayer} alt="viewFile" />
      ) : isObject(viewFile) && viewFile?.fileType === "audio" ? (
        <audio className={styles.videoPlayer} controls autoPlay>
          <source src={viewFile?.url} type="audio/mpeg" />
          <track kind="captions" src={viewFile?.url} />
        </audio>
      ) : (
        ""
      )}
    </Modal>
  );
};

export default memo(VideoModal);
