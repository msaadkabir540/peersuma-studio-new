import { memo, useMemo, useState } from "react";

import MediaMeta from "./media-meta.tsx";
import ToolBar from "../toolbar/index.js";

import { dataToolBar } from "../data-file/index.js";

import NoImage from "@/assets/audio.jpg";
import AltImage from "@/assets/noImage.png";

import { LoadingButtonInterface, MediaCardInterface } from "../media-list-interface.js";

import styles from "./index.module.scss";

const MediaCard: React.FC<MediaCardInterface> = ({
  media,
  index,
  isAssembly,
  fileFields,
  isVisibility,
  dispatchAlbum,
  handleDragEnd,
  handleDragStart,
  selectedAlbumId,
  clickMediaColor,
  handleDeleteFile,
  clickOnFieldFields,
  clickToSelectedAlbumMedia,
}) => {
  const [isButtonLoading, setIsButtonLoading] = useState<LoadingButtonInterface>({
    isLoading: false,
    loadingIndex: -1,
  });

  const toolBarData = useMemo(
    () =>
      dataToolBar({
        fileFields,
        isAssembly,
        isVisibility,
        dispatchAlbum,
        selectedAlbumId,
        handleDeleteFile,
        setIsButtonLoading,
        fileId: media?._id,
        filePath: media?.url,
        fileName: media?.name,
        fileS3Key: media?.s3Key,
      }),
    [
      fileFields,
      isAssembly,
      isVisibility,
      dispatchAlbum,
      selectedAlbumId,
      handleDeleteFile,
      setIsButtonLoading,
      media,
    ],
  );

  return (
    <div
      className={styles.cards}
      style={{ backgroundColor: clickMediaColor === index ? "#818181" : "#8a8a8a4d" }}
      onClick={(e) => {
        e.stopPropagation();
        clickToSelectedAlbumMedia({
          index,
          media,
        });
      }}
      {...(isAssembly && {
        draggable: true,
        onDragEnd: handleDragEnd,
        onDragStart: (e) => handleDragStart && handleDragStart(e, media),
      })}
    >
      <div className={styles.cardsBox}>
        <img
          className={styles.thumbnailImage}
          src={
            media?.fileType === "audio"
              ? NoImage
              : media?.thumbnailUrl
                ? media?.thumbnailUrl
                : media?.url
          }
          alt={"thumbnailUrl"}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = AltImage;
          }}
        />
        {/* media name  */}
        <MediaMeta mediaListMap={media} />
        {/* button Tool bar  */}
        <ToolBar
          toolBarData={toolBarData as any}
          isButtonLoading={isButtonLoading}
          media={media}
          clickOnFieldFields={clickOnFieldFields}
        />
      </div>
    </div>
  );
};

export default memo(MediaCard);
