import React from "react";

import VideoClipCard from "../video-clip-card";
import VerticalHorizontalDNDList from "@/components/horizontal-vertical-dnd";

import { UpdateProjectEnum } from "@/context/create-project/types";

import { TemplatesFieldValueInterface } from "@/pages/create-project/interface";
import { TemplateVideoFieldComponentInterface } from "./template-video-interface";

import styles from "../index.module.scss";

const TemplateVideoFields = ({
  name,
  index,
  value,
  label,
  dispatchProject,
  handleClipClicks,
  handleClipDelete,
  selectedVideoClip,
  setRenameVideoClip,
}: TemplateVideoFieldComponentInterface) => {
  const fieldName = name;
  return (
    <VerticalHorizontalDNDList
      direction="horizontal"
      height="93%"
      index={index}
      items={value || []}
      renderItem={(i: TemplatesFieldValueInterface) => {
        const item = { ...i };
        return (
          <VideoClipCard
            activeTab={false}
            isStaging={false}
            renameAllow={false}
            handleMenuOpen={({ e, id, name }) => {
              e?.preventDefault();
              setRenameVideoClip((prev) => ({
                ...prev,
                isRenameModal: true,
                clipId: id,
                renameText: name || "",
                fieldName,
                label,
              }));
            }}
            selectedVideo={
              (item?.id === selectedVideoClip && styles.selectedVideoClip) as React.CSSProperties
            }
            {...{
              item,
              handleClipClick: (e: React.MouseEvent<Element, MouseEvent>) => {
                dispatchProject({
                  type: UpdateProjectEnum.SET_SELECTED_VIDEO_CLIP,
                  selectedVideoClip: item?.id,
                });
                handleClipClicks({
                  e,
                  item,
                  label,
                  name,
                  templateClip: true,
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
  );
};

export default TemplateVideoFields;
