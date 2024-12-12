import { TableColumns } from "@/components/table/table-interface";

import Button from "@/components/button";
import { writeText } from "clipboard-polyfill";
import createNotification from "@/common/create-notification";

import { ColumnInterface, RowMediaLibraryInterface } from "../media-library-interface";

import file from "@/assets/file.png";
import font from "@/assets/font.png";
import audio from "@/assets/audio.jpg";
import copyImg from "@/assets/copy.png";
import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";
import uploadIcon from "@/assets/upload.svg";
import download from "@/assets/download.svg";

import styles from "../index.module.scss";
import { useNavigate } from "react-router-dom";

const Columns = ({ handlePassDataModal }: ColumnInterface): TableColumns[] => [
  {
    key: "thumbnailUrl",
    title: "",
    render: ({ row }) => {
      return (
        (
          <>
            <div className={styles.thumbnailContainer}>
              {row?.fileType === "video" && row?.thumbnailUrl ? (
                <img height={50} src={row?.thumbnailUrl} alt="thumbnailUrl" />
              ) : row?.fileType === "image" ? (
                <img height={50} src={row?.url} alt="url" />
              ) : row?.fileType === "audio" ? (
                <img height={50} src={audio} alt="audio" />
              ) : row?.fileType === "font" ? (
                <img height={50} src={font} alt="font" />
              ) : (
                <img height={50} src={file} alt="file" />
              )}
              <div className={styles.thumbnailZoom}>
                {row?.fileType === "video" && row?.thumbnailUrl ? (
                  <img src={row?.thumbnailUrl} alt="thumbnailUrl" />
                ) : row?.fileType === "image" ? (
                  <img src={row?.url} alt="url" />
                ) : row?.fileType === "audio" ? (
                  <img src={audio} alt="audio" />
                ) : row?.fileType === "font" ? (
                  <img src={font} alt="font" />
                ) : (
                  <img src={file} alt="file" />
                )}
              </div>
            </div>
          </>
        ) || "-"
      );
    },
  },
  {
    key: "name",
    title: "File Name",
    sortKey: "name",
    render: ({ row, value }) => {
      const url = row?.url;
      const fileType = row?.fileType;

      return (
        (
          <>
            <div
              className={styles.fileName}
              aria-hidden="true"
              onClick={(e) => {
                e.stopPropagation();
                fileType != "font" &&
                  fileType != "document" &&
                  handlePassDataModal(url as string, fileType as string);
              }}
            >
              {value as string}
            </div>
          </>
        ) || "-"
      );
    },
  },
  {
    key: "description",
    title: "Description",

    render: ({ value }) => {
      return <div>{value ? <>{value as string} </> : "-"}</div>;
    },
  },
  {
    key: "fileType",
    title: "Type",
    sortKey: "fileType",
    render: ({ row }) => {
      return <>{row?.fileType ? <div className={styles.fileType}>{row?.fileType}</div> : "-"}</>;
    },
  },
  {
    key: "categories",
    title: "Tags",
    render: ({ row }) => {
      return (
        <div className={styles.chipsContainer}>
          {(row?.categories?.length as any) > 0 &&
            row?.categories?.map(({ _id, name }: any) => <span key={_id}>{name}</span>)}
        </div>
      );
    },
  },

  {
    key: "actions",
    title: "Action",
  },
];
const TableActions = ({
  row,
  loader,
  handleDownload,
  handleClickCopy,
  handelUpdateMedia,
  handleDeleteMedia,
}: RowMediaLibraryInterface) => {
  const navigate = useNavigate();
  const { _id, url, name, s3Key } = row;

  const handleDownloadEvent = (e: any) => {
    e.stopPropagation();
    handleDownload({ s3Key: s3Key as string, url: url as string, name: name as string });
  };

  const handleCopyEvent = (e: any) => {
    e.stopPropagation();
    const updatedUrl = url?.split("?");
    url && writeText(updatedUrl?.[0] as string);
    url && createNotification("success", "File Link Copied!");
    handleClickCopy({ id: _id });
  };

  const hadnleEditeMediaEvent = (e: any) => {
    e.stopPropagation();
    navigate(`/create-update-media-library/${_id}`);
  };

  const handleDeleteMediaEvent = async (e: any) => {
    e.stopPropagation();
    await handleDeleteMedia({ url: url as string, s3Key: s3Key as string });
  };

  const handleUploadMediaEvent = () => {
    handelUpdateMedia({
      uploadFileName: "uploadMediaFile",
      id: _id,
      key: s3Key as string,
      url: url as string,
      name: name as string,
    });
  };

  return (
    <td className={styles.iconRow} key={url}>
      <Button
        type={"button"}
        icon={uploadIcon}
        tooltip={"Update Media"}
        loaderClass={styles.loading}
        handleClick={handleUploadMediaEvent}
      />

      <Button
        icon={copyImg}
        type={"button"}
        tooltip={"Copy Link"}
        loaderClass={styles.loading}
        handleClick={handleCopyEvent}
      />

      <Button
        type="button"
        icon={download}
        tooltip={"Download"}
        loaderClass={styles.loading}
        handleClick={handleDownloadEvent}
        isLoading={loader?.download === name}
      />
      <Button
        tooltip={"Edit Media"}
        type="button"
        icon={editIcon}
        handleClick={hadnleEditeMediaEvent}
        loaderClass={styles.loading}
      />
      <Button
        type="button"
        icon={delIcon}
        tooltip={"Delete Media"}
        loaderClass={styles.loading}
        isLoading={loader?.deleteFile === url}
        handleClick={handleDeleteMediaEvent}
      />
    </td>
  );
};

export { Columns, TableActions };
