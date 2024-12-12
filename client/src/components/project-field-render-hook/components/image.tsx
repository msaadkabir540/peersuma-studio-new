import React, { useEffect, useState } from "react";

import Button from "@/components/button";

import cross from "@/assets/x-mark.png";
import arrow from "@/assets/arrow.png";

import { ImagePropsInterface } from "../interface";

const Image: React.FC<ImagePropsInterface> = ({
  value,
  label,
  styles,
  clearable,
  templateTab,
  handleClose,
  handleDelete,
  deleteStageIcon,
  moveImageFilesJSX,
  hanldeMoveImageToField,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, []);

  return (
    <div className={`${styles.mainDiv} ${styles.imageClassName}`}>
      <div className={styles.fieldsDiv}>
        <div className={styles.headerContainer}>
          <label>{label}</label>
          <div className={styles.buttonContainer}>
            {templateTab ||
              (clearable && (
                <Button
                  icon={cross}
                  type="button"
                  tooltip="Click to Empty Image Field"
                  iconSize={{ width: 20, height: 20 }}
                  className={styles.btnClassName}
                  handleClick={() => {
                    handleClose && handleClose();
                    setInputValue("");
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
            {templateTab && (
              <>
                <Button
                  icon={arrow}
                  iconSize={{ width: 20, height: 20 }}
                  className={`${styles.btnClassName} ${styles.iconClass}`}
                  type="button"
                  tooltip={"Click to move image to template field "}
                  handleClick={() => {
                    hanldeMoveImageToField && hanldeMoveImageToField();
                  }}
                />
                {moveImageFilesJSX && moveImageFilesJSX()}
              </>
            )}
          </div>
        </div>
        <span className={`${styles.span} ${!value ? styles.placeholder : ""} ${styles.cssClass}`}>
          {value || "Move an image"}
        </span>
      </div>
      <div
        style={{ display: "flex", gap: "5px", justifyContent: "center", alignItems: "flex-end" }}
      ></div>
    </div>
  );
};

export default Image;
