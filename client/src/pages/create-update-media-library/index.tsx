import moment from "moment";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";
import MultiSelectBox from "@/components/multi-select-box";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import { s3TransloaditCompletionCheck, s3TransloaditUploadMap } from "@/utils/helper";

import {
  addTemplateMedia,
  getAllTypesAndCategories,
  getTemplateMediaById,
  updateTemplateMedia,
  updateTemplateMediaFile,
} from "@/api-services/template-media";

import {
  FileType,
  LoaderDefalutValue,
  LoaderType,
  MediaShortInterface,
  MediaUploadFileType,
  UploadMediaTypes,
  ValidDefaultValues,
  ValidType,
} from "../media-library/media-library-interface";
import { ThemesFieldsInterface } from "./add-update-themes-interface";

import file from "@/assets/file.png";
import font from "@/assets/font.png";
import audio from "@/assets/audio.jpg";
import noImage from "@/assets/noImage.png";
import uploadIcon from "@/assets/upload.svg";

import styles from "./index.module.scss";

const CreateUpdateMediaLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { watch, control, register, setValue } = useForm<ThemesFieldsInterface>({
    defaultValues: {
      newFileName: "",
      description: "",
    },
  });

  const [cacheBuster, setCacheBuster] = useState<number>(1);
  const [media, setMedia] = useState<MediaShortInterface>();
  const [newFileName, setNewFileName] = useState<string>("");
  const [categories, setCategories] = useState<FileType[]>([]);
  const [valid, setValid] = useState<ValidType>(ValidDefaultValues);
  const [loader, setLoader] = useState<LoaderType>(LoaderDefalutValue);
  const [uploadMedia, setUploadMedia] = useState<UploadMediaTypes>({
    open: false,
    mediaId: "",
    key: "",
    url: "",
    name: "",
  });
  const [createMediaLibrary, setCreateMediaLibrary] = useState<{
    open: boolean;
    uploads?: any;
  }>({
    open: false,
  });

  const { ValidMessage } = valid;

  const urlWithoutQuery = media?.url?.split("?")[0];
  const extension = urlWithoutQuery?.match(/\.([^.]+)$/)?.[1];
  const timeStamp = media?.url?.split("/")?.pop();

  const getMediaById = useCallback(
    async ({ id }: { id: string }) => {
      const res = await getTemplateMediaById({ id });
      setMedia(res?.data);

      setValue("newFileName", res?.data?.name?.split("_20")?.[0]);
      setValue("description", res?.data?.description);
      setValue("new-categories", res?.data?.categories);
      setNewFileName(res?.data?.name?.split("_20")?.[0]);
    },
    [setValue, setNewFileName, setMedia],
  );

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
        setMedia(() => ({
          ...res?.data?.updatedMedia,
          url: `${res?.data?.updatedMedia?.url}?cacheBuster=${cacheBuster}`,

          ...(res?.data?.updatedMedia?.fileType === "video"
            ? {
                thumbnailUrl: `${res?.data?.updatedMedia?.thumbnailUrl}?cacheBuster=${cacheBuster}`,
              }
            : {
                thumbnailUrl: `${res?.data?.updatedMedia?.thumbnailUrl}`,
              }),
        }));
      }
      setCacheBuster((prev) => prev + 1);
      setUploadMedia((prev) => ({
        ...prev,
        isFileUpload: false,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoader((prev) => ({ ...prev, getAllTemplateMedia: false }));
    }
  };

  const handleValidationCheck = (inputValue: string) => {
    if (inputValue.includes(" ")) {
      setValid((prev: any) => ({
        ...prev,
        isValid: true,
        ValidMessage: "Spaces are not allowed",
      }));
    } else if (!inputValue.includes(" ")) {
      setValid((prev: any) => ({ ...prev, isValid: false, ValidMessage: "" }));
    }
    setNewFileName(inputValue);
  };

  const handleGetAllTypesNCatagories = async () => {
    try {
      const res = await getAllTypesAndCategories();
      if (res.status === 200) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id && getMediaById({ id });
  }, [id, getMediaById]);

  useEffect(() => {
    handleGetAllTypesNCatagories();
  }, []);

  const handleCancelEvent = () => {
    navigate("/media-library");
  };

  const handelUpdateTemplate = async ({
    url,
    media,
    description,
    newFileName,
  }: {
    description: string;
    newFileName: string;
    categories: FileType[] | undefined;
    url: string;
    media: any;
  }) => {
    if (newFileName.includes(" ")) {
      setValid((prev: any) => ({
        ...prev,
        isValid: true,
        ValidMessage: "Spaces are not allowed",
      }));
    } else if (newFileName === "") {
      setValid((prev: any) => ({
        ...prev,
        isValid: true,
        ValidMessage: "required",
      }));
    } else {
      setLoader((prev: any) => ({ ...prev, updateFile: url }));
      try {
        if (id) {
          if (uploadMedia?.isFileUpload) {
            await handleUpdateTemplateMediaFile({
              cacheBuster,
              id: uploadMedia?.mediaId,
              key: uploadMedia?.key,
              uploads: uploadMedia?.uploads,
            });
          }
          setValid((prev) => ({ ...prev, isValid: false, ValidMessage: "" }));
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

          if (res?.status === 200) {
            navigate("/media-library");
          }
        } else {
          if (createMediaLibrary?.uploads.length > 0) {
            const mediaFiles = {
              description: watch("description"),
              categories: watch("new-categories"),
              ...createMediaLibrary?.uploads?.[0],
            };

            const res = await addTemplateMedia({ mediaFiles });
            if (res.status === 200) {
              navigate("/media-library");
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
      setLoader((prev) => ({ ...prev, updateFile: "" }));
      setValid((prev) => ({ ...prev, isValid: false, ValidMessage: "" }));
    }
  };

  const handelUpdateMedia = async ({
    id,
    key,
    url,
    name,
  }: {
    id: string;
    key: string;
    url: string;
    name: string;
  }) => {
    setUploadMedia((prev) => ({
      ...prev,
      url,
      key,
      name,
      open: true,
      mediaId: id,
    }));
  };

  const handleClose = () => {
    setUploadMedia((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleUploadMedia = () => {
    id
      ? handelUpdateMedia({
          id: media?._id as string,
          key: uploadMedia?.key as string,
          url: media?.url as string,
          name: watch("newFileName") as string,
        })
      : setCreateMediaLibrary((prev) => ({ ...prev, open: true }));
  };

  const handleUploadMediaNew = ({ uploads }: { uploads?: any }) => {
    setMedia(uploads?.[0]);
    setValue("newFileName", uploads?.[0]?.name);
    setNewFileName(uploads?.[0]?.name);
    setCreateMediaLibrary((prev) => ({ ...prev, uploads, open: false }));
  };

  return (
    <>
      <div className={styles.updateMediaHeading}>{id ? "Update" : "Create"} Media Library </div>
      <div className={styles.fieldContainer}>
        <div>
          <div>
            <div className={styles.inputContainer}>
              <Input
                value={newFileName}
                label="New File Name"
                name="newFileName"
                className={styles.input}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  handleValidationCheck(inputValue);
                }}
                errorClass={styles.errorCustomizeMessage}
                errorMessage={ValidMessage}
              />
            </div>
            <div className={styles.inputContainer}>
              <Input
                name="description"
                label="Description"
                register={register}
                className={styles.input}
              />
            </div>
            <div className={styles.inputContainer}>
              <MultiSelectBox
                wrapperClass={styles.multiSelect}
                selectBoxClass={styles.selectBox}
                label="Tags"
                name="new-categories"
                control={control}
                badge
                options={categories?.map(({ label, value }) => {
                  return { label, value, checkbox: true };
                })}
                isMulti
                placeholder={"Select"}
                showSelected
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <div className={styles.thumbnailContainer}>
                <div className={styles.thumbnailLabel}>Thumbnail</div>
                {media?.fileType ? (
                  media?.fileType === "video" && media?.thumbnailUrl ? (
                    <img
                      className={styles.imageClass}
                      height={100}
                      src={media?.thumbnailUrl}
                      alt="thumbnailUrl"
                    />
                  ) : media?.fileType === "image" ? (
                    <img height={100} src={media?.url} className={styles.imageClass} alt="url" />
                  ) : media?.fileType === "audio" ? (
                    <img height={100} src={audio} alt="audio" className={styles.imageClass} />
                  ) : media?.fileType === "font" ? (
                    <img height={100} src={font} alt="font" className={styles.imageClass} />
                  ) : (
                    <img height={100} src={file} alt="file" className={styles.imageClass} />
                  )
                ) : (
                  <>
                    <img height={100} src={noImage} alt="file" className={styles.imageClass} />
                    <div>No File </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.btnGroup}>
              <Button
                tooltip={"Update Media"}
                type={"button"}
                icon={uploadIcon}
                loaderClass={styles.loading}
                handleClick={handleUploadMedia}
              />
              <div className={styles.btnGroupContainer}>
                <Button
                  tooltip={"Back"}
                  handleClick={handleCancelEvent}
                  title="Cancel"
                  type="button"
                />

                <Button
                  tooltip={"Save Media"}
                  styles={{ background: "#1976d2" }}
                  titleStyles={{ color: "white" }}
                  title={"Save"}
                  handleClick={async (e) => {
                    e.stopPropagation();
                    handelUpdateTemplate({
                      newFileName,
                      description: watch("description") || "",
                      categories: watch("new-categories"),
                      url: media?.url as string,
                      media: [media],
                    });
                  }}
                  isLoading={loader?.updateFile ? true : false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {createMediaLibrary?.open && (
        <TransloaditUploadModal
          {...{
            allowedFileTypes: null,
            handleCloseModal: handleClose,
            customName: newFileName,
            mapUploads: s3TransloaditUploadMap,
            fieldName: createMediaLibrary?.open,
            completionCheck: s3TransloaditCompletionCheck,
            fields: {
              prefix: "/templates_media/",
              timeStamp: `${newFileName}_${moment().format("YYYYMMDD_HHmmss")}`,
            },
            setUploads: handleUploadMediaNew,
          }}
        />
      )}

      {uploadMedia?.open && (
        <TransloaditUploadModal
          {...{
            fieldName: uploadMedia?.open,
            handleCloseModal: handleClose,
            customName: media?.name,
            maxNumberOfFiles: 1,
            allowedFileTypes: null,
            customExtension: extension,
            mapUploads: s3TransloaditUploadMap,
            completionCheck: s3TransloaditCompletionCheck,
            fields: {
              prefix: "/templates_media/",
              timeStamp: media?.name ? media?.name?.split("_")?.pop()?.split(".")?.[0] : timeStamp,
            },
            setUploads: async ({ uploads }) => {
              setMedia(
                (prev) =>
                  ({
                    ...prev,
                    url: `${uploads?.[0]?.url}?cacheBuster=${cacheBuster}`,
                    s3Key: uploads?.[0]?.s3Key,
                    fileSize: uploads?.[0]?.fileSize,
                  }) as any,
              );
              setUploadMedia((prev) => ({ ...prev, uploads, isFileUpload: true }));
            },
          }}
        />
      )}
    </>
  );
};

export default CreateUpdateMediaLibrary;
