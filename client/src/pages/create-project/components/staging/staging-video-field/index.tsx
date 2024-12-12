import React, { useRef } from "react";

import VerticalHorizontalDNDList from "@/components/horizontal-vertical-dnd";
import VideoClipCard from "../../fields-pane/video-clip-card";

import { OnDropFunctionArgs } from "../../interface";
import { StagingVideoFieldInterface } from "../staging-interface";

import VideoTranscriptionCard from "@/components/video-transcription-card";

import styles from "../index.module.scss";

const StagingVideoField = ({
  name,
  type,
  index,
  label,
  onDrop,
  project,
  fieldId,
  onDragOver,
  cardValueLeft,
  handleDragEnd,
  stagingFieldId,
  cardValueRight,
  handleClickSide,
  handleDragStart,
  handleClipDelete,
  handleClickOnClip,
  selectedVideoClip,
  setRenameVideoClip,
}: StagingVideoFieldInterface) => {
  const leftBodyRef = useRef<HTMLDivElement>();
  return (
    <div className={styles.mainClass}>
      <div
        ref={leftBodyRef}
        onMouseEnter={() => {
          handleClickSide({ value: "left" });
        }}
        className={styles.leftField}
        {...(type === "video" && {
          onDragOver,
          onDrop: (e) => {
            onDrop({
              e,
              label,
              name,
              side: "left",
            } as OnDropFunctionArgs);
          },
        })}
      >
        <VerticalHorizontalDNDList
          handleDragEnd={handleDragEnd}
          direction={"vertical"}
          handleDragStart={handleDragStart}
          disable={!project?.activeTemplateUuid ? false : true}
          index={index}
          height="100%"
          items={cardValueLeft || []}
          renderItem={(i, renderItemIndex) => {
            const item = { ...i };
            return (
              <VideoTranscriptionCard
                stagingFieldId={stagingFieldId}
                fieldId={fieldId}
                leftBodyRef={leftBodyRef}
                fieldName={name}
                lastElement={cardValueLeft?.length - 1 === renderItemIndex ? true : false}
                activeTab={project?.activeTab === "stagingTab" ? true : false}
                label={label}
                handleMenuOpen={({ e, id, fieldName, label, name }) => {
                  e?.stopPropagation();
                  setRenameVideoClip((prev) => ({
                    ...prev,
                    isRenameModal: true,
                    clipId: id,
                    renameText: name || "",
                    fieldName,
                    label,
                  }));
                }}
                renameAllow={true}
                dragItemClass={styles.dragItem as React.CSSProperties}
                selectedVideo={
                  (item?.id === selectedVideoClip &&
                    styles.selectedVideoClip) as React.CSSProperties
                }
                videoClipCss={styles.videoThumbnail as React.CSSProperties}
                {...{
                  item,
                  handleClipClick: (e: React.MouseEvent<Element, MouseEvent>) => {
                    e.stopPropagation();
                    handleClickOnClip({
                      e,
                      item,
                      label,
                      name,
                    });
                  },
                  handleClipDelete: (e: React.MouseEvent<Element, MouseEvent>) => {
                    handleClipDelete({ e, item, label, name });
                  },
                }}
              />
            );
          }}
        />
      </div>

      <div
        className={styles.rightField}
        onMouseEnter={() => {
          handleClickSide({ value: "right" });
        }}
        {...(type === "video" && {
          onDragOver,
          onDrop: (e) => {
            onDrop({
              e,
              label,
              name,
              side: "right",
            } as OnDropFunctionArgs);
          },
        })}
      >
        <VerticalHorizontalDNDList
          direction={"horizontal"}
          handleDragEnd={handleDragEnd}
          handleDragStart={handleDragStart}
          disable={!project?.activeTemplateUuid ? false : true}
          index={index + 10}
          items={cardValueRight || []}
          renderItem={(i) => {
            const item = { ...i };
            return (
              <div>
                <VideoClipCard
                  isStaging={true}
                  activeTab={project?.activeTab === "stagingTab" ? true : false}
                  fieldName={name}
                  label={label}
                  handleMenuOpen={({ e, id, fieldName, label, name }) => {
                    e?.stopPropagation();
                    setRenameVideoClip((prev) => ({
                      ...prev,
                      isRenameModal: true,
                      clipId: id,
                      renameText: name || "",
                      fieldName,
                      label,
                    }));
                  }}
                  renameAllow={true}
                  dragItemClass={
                    `${styles.dragItem} ${styles.stagingHeightClass}` as React.CSSProperties
                  }
                  selectedVideo={
                    (item?.id === selectedVideoClip
                      ? styles.selectedStagingClip
                      : "") as React.CSSProperties
                  }
                  videoClipCss={styles.stagingVideoThumbnail as React.CSSProperties}
                  {...{
                    item,
                    handleClipClick: (e: React.MouseEvent<Element, MouseEvent>) => {
                      e?.stopPropagation();
                      handleClickOnClip({ e, item, label, name });
                    },
                    handleClipDelete: (e: React.MouseEvent<Element, MouseEvent>) => {
                      handleClipDelete({ e, item, label, name });
                    },
                  }}
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default StagingVideoField;
