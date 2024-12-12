import _ from "lodash";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "@/components/modal";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import FilterFields from "./component/filter-fields";
import createNotification from "@/common/create-notification";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import {
  addTemplateMedia,
  deleteTemplateMedia,
  getAllTemplateMedia,
  updateTemplateMedia,
  getAllTypesAndCategories,
  updateTemplateMediaFile,
} from "@/api-services/template-media";

import {
  s3TransloaditUploadMap,
  s3TransloaditCompletionCheck,
  handleDownloadMedia,
} from "@/utils/helper";

import {
  FileType,
  LoaderType,
  ViewFieldType,
  UploadMediaType,
  SortColumnsTypes,
  LoaderDefalutValue,
  MediaUploadFileType,
  MediaShortInterface,
  FileNameInterface,
} from "./media-library-interface";
import { Columns, TableActions } from "./component/columns";

import styles from "./index.module.scss";

const MediaLibrary = () => {
  const navigate = useNavigate();
  const prefix = `/templates_media/`;

  const { setValue, watch, control, register, reset } = useForm({});

  const [media, setMedia] = useState<MediaShortInterface[]>([]);
  const [loader, setLoader] = useState<LoaderType>(LoaderDefalutValue);
  const [editing, setEditing] = useState<string>("");
  const [fieldName, setFieldName] = useState<FileNameInterface>({} as FileNameInterface);
  const [fileTypes, setFileTypes] = useState<FileType[]>([]);
  const [viewFile, setViewFile] = useState<ViewFieldType>({ isView: false });
  const [categories, setCategories] = useState<FileType[]>([]);

  const [uploadMedia, setUploadMedia] = useState<UploadMediaType>({
    id: "",
    key: "",
    url: "",
    name: "",
  });
  const [sortColumn, setSortColumn] = useState<SortColumnsTypes>({
    sortBy: "",
    sortOrder: "asc",
  });

  const [copiedFiles, setCopiedFiles] = useState<string[]>([]);
  const [cacheBuster, setCacheBuster] = useState<number>(1);

  const { id, key, url, name } = uploadMedia;
  const urlWithoutQuery = url?.split("?")[0];
  const extension = urlWithoutQuery?.match(/\.([^.]+)$/)?.[1];
  const timeStamp = url?.split("/")?.pop();

  const handleSort = ({ sortBy, sortOrder }: { sortBy: string; sortOrder: "asc" | "desc" }) => {
    setValue("sortBy", sortBy);
    setValue("sortOrder", sortOrder);
    setValue("page", 1);
    setSortColumn((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const handleGetAllTypesNCatagories = async () => {
    try {
      const res = await getAllTypesAndCategories();
      if (res.status === 200) {
        setCategories(res.data.categories);
        setFileTypes(res.data.fileTypes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllTemplateMedias = async () => {
    setLoader((prev) => ({ ...prev, getAllTemplateMedia: true }));
    try {
      const watchData = { ...watch() };
      const res = await getAllTemplateMedia({ data: watchData });
      if (res.status === 200) {
        setMedia(res.data.media);
        setValue && setValue("totalCount", res.data.totalCount);
      }
    } catch (error) {
      console.error(error);
    }

    setLoader((prev) => ({ ...prev, getAllTemplateMedia: false }));
  };

  const debouncedFetchAllTemplateMedias = _.debounce(getAllTemplateMedias, 1000);

  useEffect(() => {
    handleGetAllTypesNCatagories();
  }, []);

  useEffect(() => {
    setLoader((prev) => ({ ...prev, getAllTemplateMedia: true }));
    debouncedFetchAllTemplateMedias();
    return () => {
      debouncedFetchAllTemplateMedias.cancel();
    };
  }, [
    watch("search"),
    watch("categories"),
    watch("fileType"),
    watch("page"),
    watch("pageSize"),
    watch("sortBy"),
    watch("sortOrder"),
  ]);

  useEffect(() => {
    setValue("page", 1);
    setValue("search", watch("file-search"));
    JSON.stringify(watch("file-categories")) !== JSON.stringify(watch("categories")) &&
      setValue("categories", watch("file-categories"));
    JSON.stringify(watch("file-types")) !== JSON.stringify(watch("fileType")) &&
      setValue("fileType", watch("file-types"));
  }, [watch("file-search"), watch("file-categories"), watch("file-types")]);

  const handelSetFileName = () => {
    navigate("/create-update-media-library");
  };

  const handlePassDataModal: (url: string, fileType: string) => void = (url, fileType) => {
    setViewFile((prev) => ({ ...prev, isView: true, url, fileType }));
  };

  const handleDownloads = async ({
    s3Key,
    url,
    name,
  }: {
    s3Key: string;
    url: string;
    name: string;
  }) => {
    createNotification("warn", "Please wait soon downloading will be start!");
    setLoader((prev) => ({ ...prev, download: name }));
    try {
      await handleDownloadMedia({
        name,
        url,
        s3Key,
      });
    } catch (error) {
      console.error(error);
    }
    setLoader((prev) => ({ ...prev, download: "" }));
  };

  const handelUpdateTemplate = async ({
    url,
    media,
    description,
    newFileName,
  }: {
    description: string;
    newFileName: string;
    categories: FileType[];
    url: string;
    media: any[];
  }) => {
    setLoader((prev: any) => ({ ...prev, updateFile: url }));
    try {
      const res = await updateTemplateMedia({
        newFileName,
        description: description,
        categories: watch("new-categories"),
        url,
        handleClear: () => {
          setValue("new-categories", []);
        },
        media,
      });
      if (res.status === 200) {
        setMedia((prev) => {
          const filteredMedia = prev.filter((media) => media.url !== url);
          return [res.data.updatedMedia, ...filteredMedia];
        });
      }
    } catch (error) {
      console.error(error);
    }
    setEditing("");
    setLoader((prev) => ({ ...prev, updateFile: "" }));
  };

  const handelClose = () => {
    setEditing("");
    setValue("description", "");
    setUploadMedia({
      id: "",
      key: "",
      url: "",
      name: "",
    });
  };

  const handleUpdateTemplateMediaFile = async ({
    uploads,
    id,
    key,
    cacheBuster,
  }: {
    id: string;
    key: string;
    uploads: MediaUploadFileType;
    cacheBuster: number;
  }) => {
    setLoader((prev) => ({ ...prev, getAllTemplateMedia: true }));
    try {
      const res = await updateTemplateMediaFile({ uploads, id, key });
      if (res.status === 200) {
        setMedia(
          (prev) =>
            prev?.map((media) =>
              media?._id === res.data?.updatedMedia?._id
                ? {
                    ...res?.data?.updatedMedia,
                    url: `${res?.data?.updatedMedia?.url}?cacheBuster=${cacheBuster}`,

                    ...(res?.data?.updatedMedia?.fileType === "video"
                      ? {
                          thumbnailUrl: `${res?.data?.updatedMedia?.thumbnailUrl}?cacheBuster=${cacheBuster}`,
                        }
                      : {
                          thumbnailUrl: `${res?.data?.updatedMedia?.thumbnailUrl}`,
                        }),
                  }
                : media,
            ),
        );
      }
      setCacheBuster((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader((prev) => ({ ...prev, getAllTemplateMedia: false }));
    }
  };

  const handleDeleteMedia = async ({ url, s3Key }: { url: string; s3Key: string }) => {
    setLoader((prev) => ({ ...prev, deleteFile: url }));
    try {
      const res = await deleteTemplateMedia({
        s3Key,
      });
      if (res.status === 200) {
        setMedia((prev) => {
          const newMediaFiles = prev.filter((media: MediaShortInterface) => media?.s3Key !== s3Key);
          return [...newMediaFiles];
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader((prev) => ({ ...prev, deleteFile: "" }));
    }
  };

  const handelUpdateMedia = async ({
    uploadFileName,
    id,
    key,
    url,
    name,
  }: {
    uploadFileName: string;
    id: string;
    key: string;
    url: string;
    name: string;
  }) => {
    setFieldName((prev) => ({ ...prev, isFileName: uploadFileName, isOpenFileName: true }));
    setUploadMedia((prev) => ({
      ...prev,
      id,
      key,
      url,
      name,
    }));
  };

  const handleClickCopy = ({ id }: { id: string }) =>
    setCopiedFiles((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const handleAddTemplateMedia = async ({ mediaFiles }: { mediaFiles: MediaUploadFileType }) => {
    setLoader((prev) => ({ ...prev, addTemplateMedia: true }));
    try {
      const res = await addTemplateMedia({ mediaFiles });
      if (res.status === 200) {
        setMedia && setMedia((prev) => [...res.data.newMediaFiles, ...prev]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader((prev) => ({ ...prev, addTemplateMedia: false }));
    }
  };

  const handleClose = () => {
    setUploadMedia({
      id: "",
      key: "",
      url: "",
      name: "",
    });
    setFieldName((prev) => ({ ...prev, isOpenFileName: false, isFileName: "" }));
  };

  return (
    <>
      <div
        className={styles.activeTab}
        style={{
          width: "100%",
        }}
      >
        <FilterFields
          watch={watch}
          reset={reset}
          control={control}
          register={register}
          setValue={setValue}
          fileTypes={fileTypes}
          categories={categories}
          handelSetFileName={() => handelSetFileName()}
        />
        <div className={styles.tableContainer}>
          <Table
            rows={media as any}
            customTableClass={styles.customTableClass}
            sortColumn={sortColumn}
            customBodyTableClass={styles.customClass}
            handleSort={handleSort}
            rowStyles={({ _id }) => ({
              backgroundColor: copiedFiles.includes(_id) ? "#d4ebf2" : "",
            })}
            handleRowClick={({ _id }) => {
              setCopiedFiles((prev) => {
                const filteredHighlighted = prev?.filter((id) => id !== _id);
                return [...filteredHighlighted];
              });
            }}
            isLoading={loader?.getAllTemplateMedia}
            columns={Columns({
              handlePassDataModal,
            })}
            actions={({ row }) => {
              return (
                <TableActions
                  row={row}
                  media={media}
                  watch={watch}
                  loader={loader}
                  editing={editing}
                  handelClose={handelClose}
                  handleDownload={handleDownloads}
                  handleClickCopy={handleClickCopy}
                  handelUpdateMedia={handelUpdateMedia}
                  handleDeleteMedia={handleDeleteMedia}
                  handelUpdateTemplate={handelUpdateTemplate}
                />
              );
            }}
          />
        </div>

        <Pagination
          page={watch("page")}
          pageSize={watch("pageSize")}
          totalCount={watch("totalCount")}
          control={control}
          setValue={setValue}
          perPageText="Records per page"
        />
      </div>

      <Modal
        {...{
          open: viewFile.isView === true,
          handleClose: () => setViewFile((prev) => ({ ...prev, isView: false })),
        }}
      >
        {viewFile?.fileType === "video" ? (
          <video className={styles.videoPlayer} controls autoPlay>
            <source src={viewFile?.url} type="video/mp4" />
            <track kind="captions" src={viewFile?.url} />
          </video>
        ) : viewFile?.fileType === "image" ? (
          <img src={viewFile?.url} className={styles.videoPlayer} alt="viewFile" />
        ) : viewFile?.fileType === "audio" ? (
          <audio className={styles.videoPlayer} controls autoPlay>
            <source src={viewFile?.url} type="audio/mpeg" />
            <track kind="captions" src={viewFile?.url} />
          </audio>
        ) : (
          ""
        )}
      </Modal>

      {fieldName?.isFileName === "mediaFiles" && (
        <TransloaditUploadModal
          {...{
            allowedFileTypes: null,
            handleCloseModal: handleClose,
            mapUploads: s3TransloaditUploadMap,
            fieldName: fieldName?.isOpenFileName,
            completionCheck: s3TransloaditCompletionCheck,
            fields: {
              prefix,
              timeStamp: moment().format("YYYYMMDD_HHmmss"),
            },
            setUploads: async ({ uploads }) => {
              handleAddTemplateMedia({ mediaFiles: uploads as MediaUploadFileType });
            },
          }}
        />
      )}
      {fieldName?.isFileName === "uploadMediaFile" && (
        <TransloaditUploadModal
          {...{
            fieldName: fieldName?.isOpenFileName,
            handleCloseModal: () =>
              setFieldName((prev) => ({ ...prev, isOpenFileName: false, isFileName: "" })),
            customName: name,
            maxNumberOfFiles: 1,
            allowedFileTypes: null,
            customExtension: extension,
            mapUploads: s3TransloaditUploadMap,
            completionCheck: s3TransloaditCompletionCheck,
            fields: {
              prefix,
              timeStamp: name ? name?.split("_")?.pop()?.split(".")?.[0] : timeStamp,
            },
            setUploads: async ({ uploads }) => {
              handleUpdateTemplateMediaFile({ uploads, id, key, cacheBuster } as any);
            },
          }}
        />
      )}
    </>
  );
};

export default MediaLibrary;
