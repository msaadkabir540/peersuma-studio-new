import axios from "axios";

import { writeText } from "clipboard-polyfill";

import createNotification from "@/common/create-notification";

import { updateAlbumShotVisibility } from "@/api-services/albumshot";

import { DataToolBarInterface, LoadingButtonInterface } from "../media-list-interface";

import arrow from "@/assets/arrow.png";
import copyIcon from "@/assets/copy.png";
import deleteIcon from "@/assets/del-icon.svg";
import VisibleIcon from "@/assets/eyeIcon.svg";
import downloadIcon from "@/assets/download.svg";
import inVisibleIcon from "@/assets/eyeclose.svg";

import { handleDownloadMedia } from "@/utils/helper";

import styles from "../index.module.scss";

const handleCopyEvent = ({ filePath }: { filePath: string }) => {
  writeText(filePath);
  createNotification("success", "File Link Copied!");
};

export const dataToolBar = ({
  fileId,
  fileName,
  filePath,
  fileS3Key,
  isAssembly,
  fileFields,
  isVisibility,
  dispatchAlbum,
  selectedAlbumId,
  handleDeleteFile,
  setIsButtonLoading,
}: DataToolBarInterface) => {
  const handleDeleteFileEvent = ({
    name,
    s3Key,
    deleteIndex,
  }: {
    name: string;
    s3Key: string;
    deleteIndex?: number;
  }) => {
    setIsButtonLoading &&
      setIsButtonLoading((prev: LoadingButtonInterface) => ({
        ...prev,
        isLoading: true,
        loadingIndex: deleteIndex,
      }));
    handleDeleteFile && handleDeleteFile({ name, s3Key });
    setIsButtonLoading &&
      setIsButtonLoading((prev: LoadingButtonInterface) => ({
        ...prev,
        isLoading: false,
        loadingIndex: -1,
      }));
  };

  const handleDownload = async ({
    filePath,
    downloadIndex,
  }: {
    filePath: string;
    downloadIndex?: number;
  }) => {
    setIsButtonLoading &&
      setIsButtonLoading((prev: LoadingButtonInterface) => ({
        ...prev,
        isLoading: true,
        loadingIndex: downloadIndex,
      }));
    try {
      const Key = filePath?.split(".com/")[1];
      const fileName = filePath?.substring(filePath?.lastIndexOf("/") + 1);
      await handleDownloadMedia({
        s3Key: Key,
        name:
          fileName?.split(`_${new Date().getFullYear()}`)[0] + `.${fileName?.split(".")?.pop()}`,
        url: filePath,
      });
    } catch (error) {
      console.error(error);
    }

    setIsButtonLoading &&
      setIsButtonLoading((prev: LoadingButtonInterface) => ({
        ...prev,
        isLoading: false,
        loadingIndex: -1,
      }));
  };

  const handleVisibility = async ({
    id,
    visibility,
    index,
  }: {
    id: string;
    visibility: boolean;
    index: number;
  }) => {
    setIsButtonLoading &&
      setIsButtonLoading((prev: LoadingButtonInterface) => ({
        ...prev,
        isLoading: true,
        loadingIndex: index,
      }));
    const res = await updateAlbumShotVisibility({
      id,
      params: { isVisible: visibility },
    });
    const response = res?.data?.data;
    dispatchAlbum({
      type: "EVENT_ALBUM_VISIBILITY",
      visibilityResponse: response,
      visibilityId: selectedAlbumId,
    });
    setIsButtonLoading &&
      setIsButtonLoading((prev: LoadingButtonInterface) => ({
        ...prev,
        isLoading: false,
        loadingIndex: -1,
      }));
  };

  return isAssembly
    ? [
        {
          altText: "copyIcon",
          title: "Click here to copy this media",
          icons: copyIcon,
          handlClickEvent: () => handleCopyEvent({ filePath }),
        },
        {
          altText: "downloadIcon",
          title: "Click here to download media",
          icons: downloadIcon,
          handlClickEvent: ({ index }: { index?: number }) =>
            handleDownload({ filePath, downloadIndex: index }),
        },
        {
          altText: "deleteIcon",
          title: "Click here to Delete media",
          icons: deleteIcon,
          handlClickEvent: ({ index }: { index?: number }) =>
            handleDeleteFileEvent({
              name: fileName,
              s3Key: fileS3Key,
              deleteIndex: index,
            } as {
              name: string;
              s3Key: string;
            }),
        },
      ]
    : [
        isVisibility !== true
          ? {
              icons: VisibleIcon,
              altText: "VisibleIcon",
              title: "Click here to make this media visible",
              handlClickEvent: ({ index }: { index?: number }) =>
                handleVisibility({ id: fileId, visibility: true, index: index as number }),
            }
          : {
              icons: inVisibleIcon,
              altText: "InVisibleIcon",
              title: "Click here to hide this media",
              handlClickEvent: ({ index }: { index?: number }) =>
                handleVisibility({ id: fileId, visibility: false, index: index as number }),
            },
        {
          altText: "copyIcon",
          title: "Click here to copy this media",
          icons: copyIcon,
          handlClickEvent: () => handleCopyEvent({ filePath }),
        },
        {
          altText: "downloadIcon",
          title: "Click here to download media",
          icons: downloadIcon,
          handlClickEvent: ({ index }: { index?: number }) =>
            handleDownload({ filePath, downloadIndex: index }),
        },
        fileFields && fileFields?.length > 0
          ? {
              altText: "arrow",
              icons: arrow,
              isListOpen: true,
              fileFields: fileFields,
            }
          : { mainClass: styles.notAssigned },
      ];
};
