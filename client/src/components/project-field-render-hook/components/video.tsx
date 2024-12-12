import React from "react";

import Button from "@/components/button";

import { VideoPropsInterface } from "../interface";

const Video: React.FC<VideoPropsInterface> = ({
  name,
  value,
  label,
  styles,
  playIcon,
  clearable,
  handlePlay,
  handleDelete,
  videoFieldClass,
  deleteStageIcon,
}) => {
  const btnIconSize = { width: 23, height: 23 };
  return (
    <>
      <div className={styles.mainDiv}>
        <div className={styles.fieldsDiv}>
          <div className={styles.headerContainer}>
            <label>{label}</label>
            <div className={styles.buttonContainer}>
              {clearable && playIcon && (
                <Button
                  className={styles.btnClassName}
                  icon={playIcon}
                  type="button"
                  iconSize={btnIconSize}
                  tooltip={"Click to Play Videos"}
                  handleClick={() => {
                    handlePlay && handlePlay(label, name);
                  }}
                />
              )}
              {clearable && deleteStageIcon && (
                <Button
                  className={styles.btnClassName}
                  icon={deleteStageIcon}
                  iconSize={btnIconSize}
                  type="button"
                  tooltip={"Click to Delete Field"}
                  handleClick={() => {
                    handleDelete && handleDelete();
                  }}
                />
              )}
            </div>
          </div>
          <span
            className={`${styles.span1 ? styles.span1 : styles.span} ${
              !value ? styles.placeholder : ""
            } ${videoFieldClass || ""}`}
          >
            {value || "Move a video from Media List"}
          </span>
        </div>
      </div>
    </>
  );
};

export default Video;
