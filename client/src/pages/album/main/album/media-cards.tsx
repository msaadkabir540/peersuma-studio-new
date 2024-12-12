import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";

import Modal from "@/components/modal";
import Button from "@/components/button";
import Loading from "@/components/loading";

import { removeAlbumShotMedia } from "@/api-services/albumshot";

import audioImage from "@/assets/audio.jpg";
import deleteIcons from "@/assets/del-icon.svg";
import downloadIcon from "@/assets/download.svg";

import { MediaCardsInterface, SortInterface, SortItemInterface } from "../album-interface";
import {
  RemoveAlbumShotMediaRequestInterface,
  RemoveAlbumShotMediaInterface,
} from "@/interface/album-shot-interface";

import styles from "./index.module.scss";
import { handleDownloadMedia } from "@/utils/helper";

const MediaCards: React.FC<MediaCardsInterface> = ({
  watch,
  mediaIds,
  register,
  currentShot,
  confirmation,
  FilteredMedia,
  handleDelete,
  handleNoClick,
  handleSetFile,
  handleCloseModal,
  handleSelectDelete,
  handleClearSelection,
  handleDeleteCurrentShot,
  handleIncrementUpdatePage,
}) => {
  const [isDownloadMedia, setIsDownloadMedia] = useState<{
    isDownload: boolean;
    downloadId: string;
  }>({
    isDownload: false,
    downloadId: "",
  });

  const [isDeletingMedia, setIsDeletingMedia] = useState<boolean>(false);

  useEffect(() => {
    handleClearSelection();
  }, [currentShot?._id]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, _id: string) => {
    const { checked } = event.target;
    if (checked) {
      const mediaId = [...mediaIds, _id];
      handleSelectDelete(mediaId as []);
    } else {
      handleDeleteCurrentShot(_id);
    }
  };

  const handleYesButtonClick = async () => {
    setIsDeletingMedia(true);
    const params = {
      albumshotId: currentShot?._id,
      mediaIdsToDelete: mediaIds,
    } as RemoveAlbumShotMediaInterface;
    const isDeleted = await removeAlbumShotMedia(params as RemoveAlbumShotMediaRequestInterface);
    if (isDeleted) {
      handleIncrementUpdatePage();
    }
    setIsDeletingMedia(false);
  };
  const FilteredMediaResult = FilteredMedia?.sort(getSorted(watch?.("sort")));

  const handleDownloadEvent = async ({
    e,
    name,
    url,
    s3Key,
  }: {
    e?: any;
    url: string;
    name: string;
    s3Key: string;
  }) => {
    setIsDownloadMedia((prev) => ({ ...prev, isDownload: true, downloadId: name }));
    e.preventDefault();
    try {
      await handleDownloadMedia({ s3Key, name, url });
    } catch (error) {
      console.error(error);
    }
    setIsDownloadMedia((prev) => ({ ...prev, isDownload: false, downloadId: "" }));
  };

  return (
    <div className={styles.albums}>
      {FilteredMediaResult?.map(
        ({ _id, url, updatedAt, fileType, thumbnailUrl, s3Key, name }, index) => {
          const checkboxProps = {} as any;
          if (register && !onchange) {
            checkboxProps.name = "multiDelete";
            Object.assign(checkboxProps, register("multiDelete"));
          }
          return (
            <Fragment key={index}>
              <div className={styles.albumMedia}>
                <label
                  className={`${styles.iconsHover}`}
                  style={{ display: mediaIds?.includes(_id as never) ? "block" : "" }}
                >
                  <label htmlFor="none" className={styles.downloadImg}>
                    {isDownloadMedia?.downloadId === name ? (
                      <Loading pageLoader={false} loaderClass={styles.loadingClass} />
                    ) : (
                      <img
                        aria-hidden="true"
                        src={downloadIcon}
                        title="Download"
                        alt="deleteIcons"
                        onClick={(e) => handleDownloadEvent({ e, s3Key, name, url })}
                      />
                    )}
                  </label>
                  <label htmlFor="none" className={styles.deleteImg}>
                    <img
                      aria-hidden="true"
                      src={deleteIcons}
                      onClick={() => handleDelete(_id as string)}
                      alt="deleteIcons"
                    />
                  </label>
                  <label htmlFor="selection" className={styles.checkBox}>
                    <input
                      type="checkbox"
                      {...checkboxProps}
                      onChange={(event) => handleCheckboxChange(event, _id as string)}
                    />
                  </label>
                </label>
                <img
                  aria-hidden="true"
                  src={
                    (thumbnailUrl && thumbnailUrl) || (fileType === "audio" && audioImage) || url
                  }
                  alt="thumbnailUrl"
                  onClick={() => handleSetFile(fileType as string, url)}
                />

                <div className={styles.mediaContent}>
                  <p>{fileType}</p>
                  <p>{moment(updatedAt).format("MMM DD, YYYY")}</p>
                </div>
              </div>
            </Fragment>
          );
        },
      )}

      <Modal
        className={styles.modalWidth}
        {...{
          open: confirmation,
          handleClose: () => handleCloseModal(),
        }}
      >
        <div className={styles.confirmModalContainer}>
          <div className={styles.modalText}>Are you sure you want to delete this media?</div>
          <div className={styles.modalBUtton}>
            <Button
              title="Yes"
              type="button"
              className={styles.cancelBtn}
              isLoading={isDeletingMedia}
              handleClick={() => handleYesButtonClick()}
            />
            <Button
              type="button"
              title="No"
              className={styles.cancelBtn}
              handleClick={() => {
                handleNoClick();
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MediaCards;

const getSorted =
  (sort?: SortInterface) =>
  (a: SortItemInterface, b: SortItemInterface): number => {
    switch (sort?.name) {
      case "lastModified":
        return new Date(b?.updatedAt || "").getTime() - new Date(a?.updatedAt || "").getTime();
      case "oldest":
        return new Date(a?.createdAt || "").getTime() - new Date(b?.createdAt || "").getTime();
      case "nameAsc":
        return (a?.name || "").localeCompare(b?.name || "");
      case "nameDesc":
        return (b?.name || "").localeCompare(a?.name || "");
      default:
        return new Date(b?.createdAt || "").getTime() - new Date(a?.createdAt || "").getTime();
    }
  };
