import React, { useEffect, useState } from "react";

import Button from "@/components/button";

import cross from "@/assets/x-mark.png";
import arrow from "@/assets/arrow.png";

import { AudioPropsInterface } from "../interface";

const Audio: React.FC<AudioPropsInterface> = ({
  value,
  label,
  styles,
  clearable,
  templateTab,
  handleClose,
  handleDelete,
  deleteStageIcon,
  moveAudioFilesJSX,
  handleMoveAudioToField,
}) => {
  const [values, setValues] = useState<string>("");

  useEffect(() => {
    if (value) {
      setValues(value);
    }
  }, []);

  return (
    <div className={styles.mainDiv}>
      <div className={styles.fieldsDiv}>
        <div className={styles.headerContainer}>
          <div>
            <label>{label}</label>
          </div>
          <div className={styles.buttonContainer}>
            {templateTab ||
              (clearable && value && (
                <Button
                  icon={cross}
                  className={styles.btnClassName}
                  iconSize={{ width: 20, height: 20 }}
                  type="button"
                  tooltip="Click to Empty Auido Field"
                  handleClick={() => {
                    handleClose && handleClose();
                    setValues("");
                  }}
                />
              ))}
            {deleteStageIcon && (
              <Button
                icon={deleteStageIcon}
                iconSize={{ width: 20, height: 20 }}
                className={styles.btnClassName}
                type="button"
                tooltip={"Click to Delete Field"}
                handleClick={() => {
                  handleDelete && handleDelete();
                }}
              />
            )}
          </div>
          {templateTab && (
            <>
              <Button
                icon={arrow}
                iconSize={{ width: 20, height: 20 }}
                className={`${styles.btnClassName} ${styles.iconClass}`}
                type="button"
                tooltip={"Click to move image to template field "}
                handleClick={() => {
                  handleMoveAudioToField && handleMoveAudioToField();
                }}
              />
              {moveAudioFilesJSX && moveAudioFilesJSX()}
            </>
          )}
        </div>

        <span className={`${styles.span} ${!value ? styles.placeholder : ""} ${styles.cssClass}`}>
          {value || "Move an audio from Media List"}
        </span>
      </div>
    </div>
  );
};

export default Audio;
