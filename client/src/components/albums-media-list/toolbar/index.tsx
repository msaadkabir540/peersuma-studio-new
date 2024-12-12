import { memo } from "react";

import MediaButton from "./media-button";

import { ToolBarType } from "../media-list-interface";

import styles from "./index.module.scss";

const ToolBar: React.FC<ToolBarType> = ({
  media,
  toolBarData,
  isButtonLoading,
  clickOnFieldFields,
}) => {
  return (
    <div className={`${styles.flexClass} `}>
      {toolBarData?.map(
        ({ altText, title, icons, handlClickEvent, isListOpen, fileFields, mainClass }, index) => {
          return (
            <MediaButton
              media={media}
              key={index}
              icons={icons}
              index={index}
              title={title}
              altText={altText}
              mainClass={mainClass}
              isListOpen={isListOpen}
              fileFields={fileFields}
              isButtonLoading={isButtonLoading}
              handlClickEvent={handlClickEvent}
              clickOnFieldFields={clickOnFieldFields}
            />
          );
        },
      )}
    </div>
  );
};

export default memo(ToolBar);
