import moment from "moment";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";
import Tooltip from "@/components/tooltip";
import TextArea from "@/components/textarea";
import MultiSelectBox from "@/components/multi-select-box";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import { createInventory, getInventoryById, updateInventoryById } from "@/api-services/inventory";

import { s3TransloaditUploadMap } from "@/utils/helper";

import { InventoryFieldsInterface } from "./add-update-inventory-interface";

import noImage from "@/assets/noImage.png";
import deleteIcon from "@/assets/del-icon.svg";
import replaceImage from "@/assets/upload.png";

import styles from "./index.module.scss";

const AddEditInventories: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loggedInUser } = useSelector((state: any) => state.users);

  const {
    watch,
    register,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InventoryFieldsInterface>({
    defaultValues: {
      name: "",
      level: "",
      category: "",
      complexity: "",
      description: "",
      instructions: "",
    },
  });
  const [color, setColor] = useState<string>("");
  const [isUpload, setIsUpload] = useState<{
    isOpen: boolean;
    isOpenThumbnailModal?: boolean;
    isVideoFile?: any;
    isError?: string;
    fileType?: string;
  }>({ isOpen: false, isOpenThumbnailModal: false });

  const getInventoryByIdEvent = useCallback(
    async ({ id }: { id: string }) => {
      try {
        const res = await getInventoryById({ id });

        setColor(res?.color);
        setValue("name", res?.name);
        setValue("level", res?.level);
        setValue("category", res?.category);
        setValue("complexity", res?.complexity);
        setValue("description", res?.description);
        setValue("instructions", res?.instructions);
        setIsUpload((prev) => ({
          ...prev,
          isVideoFile: {
            thumbnailUrl: res?.thumbnailUrl,
            url: res?.url,
            audioUrl: res?.audioUrl,
            audioS3Key: res?.audioS3Key,
            customeThumbnailUrl: res?.customeThumbnailUrl
              ? res?.customeThumbnailUrl
              : res?.thumbnailUrl
                ? res?.thumbnailUrl
                : null,
          },
        }));
      } catch (error) {
        console.error(error);
      }
    },
    [setValue, setColor, setIsUpload],
  );

  const onSubmit = async (data: any) => {
    const levelName = levelOption?.find((data) => data.value === watch("level"));
    let createdData;

    // if (isUpload?.isVideoFile && isUpload?.isVideoFile?.thumbnailUrl) {
    setIsUpload((prev) => ({ ...prev, isError: "" }));

    if (!id) {
      createdData = {
        ...data,
        level: levelName?.label,
        userId: loggedInUser?._id,
        color,
        ...(isUpload?.isVideoFile ? { ...isUpload?.isVideoFile } : {}),
      };
    }
    let res;
    try {
      id
        ? (res = await updateInventoryById({
            id,
            data: {
              ...data,
              color,
              level: levelName?.label,
              ...(isUpload?.isVideoFile ? { ...isUpload?.isVideoFile } : {}),
            },
          }))
        : (res = await createInventory({ data: createdData }));
      if (res.status === 200) {
        navigate("/inventory");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id && getInventoryByIdEvent({ id });
  }, [id, getInventoryByIdEvent]);

  useEffect(() => {
    setValue("complexity", complexityOption?.[0]?.value);
  }, [setValue]);

  const handleChangeLevel = (value: any) => {
    setColor(value);
  };

  const handleOpenModal = () => {
    setIsUpload((prev) => ({ ...prev, isOpen: true }));
  };
  const handleCloseModal = () => {
    setIsUpload((prev) => ({ ...prev, isOpen: false }));
  };
  const handleOpenThumbnailModal = () => {
    setIsUpload((prev) => ({ ...prev, isOpenThumbnailModal: true, fileType: "image" }));
  };
  const handleOpenAudioModal = () => {
    setIsUpload((prev) => ({ ...prev, isOpenThumbnailModal: true, fileType: "audio" }));
  };

  const handleCloseThumbnailModal = () => {
    setIsUpload((prev) => ({ ...prev, isOpenThumbnailModal: false, fileType: "" }));
  };

  const handleRemoveThumbnail = () => {
    setIsUpload((prev) => ({
      ...prev,
      isLoading: true,
      isVideoFile: {
        ...prev?.isVideoFile,
        customeThumbnailUrl: null,
      },
    }));
  };
  const handleRemoveAudio = () => {
    setIsUpload((prev) => ({
      ...prev,
      isLoading: true,
      isVideoFile: {
        ...prev?.isVideoFile,
        audioUrl: null,
        audioS3Key: null,
      },
    }));
  };

  const handleRemoveSampleVideo = () => {
    setIsUpload((prev) => ({
      ...prev,
      isLoading: true,
      isVideoFile: {
        ...prev?.isVideoFile,
        url: null,
        thumbnailUrl: null,
      },
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.styleEdit}>
          <h2>{id ? "Update Inventory" : "Add Inventory"}</h2>
          <div className={styles.field}>
            <label htmlFor="Name">Name</label>
            <Input name={"name"} register={register} required placeholder="Enter Name " />
          </div>
          <div className={styles.field}>
            <label htmlFor="Name">Description</label>
            <TextArea
              rows={4}
              register={register}
              name={`description`}
              placeholder={"Enter Description"}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="Name">Category</label>
            <MultiSelectBox
              showSelected
              required={true}
              name="category"
              control={control}
              placeholder={"Select"}
              options={statusOptions}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="Name">Instructions</label>
            <TextArea
              rows={4}
              name={`instructions`}
              placeholder={"Enter Instructions"}
              register={register}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="Name">Complexity</label>
            <MultiSelectBox
              showSelected
              required={true}
              name="complexity"
              control={control}
              placeholder={"Select"}
              options={complexityOption}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="Name">Level</label>
            <MultiSelectBox
              name="level"
              showSelected
              required={true}
              control={control}
              placeholder={"Select"}
              options={levelOption}
              handleChange={handleChangeLevel}
            />
          </div>
          <div className={styles.colorContainer}>
            <div
              className={styles.colorCircle}
              style={{
                background: color,
              }}
            ></div>
            <Input
              id={"color"}
              name={"color"}
              type={"color"}
              className={styles.inputContainer}
              onChange={(e) => {
                setColor(e.target.value);
              }}
            />
          </div>
          <div className={styles.mediaClass}>
            <div style={{ width: `${isUpload?.isVideoFile?.url ? "400px" : ""}` }}>
              {isUpload?.isVideoFile?.url && (
                <video
                  src={isUpload?.isVideoFile?.url}
                  controls
                  height={200}
                  width={400}
                  muted={true}
                />
              )}

              <div className={styles.videoBtnContainer}>
                <Button title="Upload Sample Video" type="button" handleClick={handleOpenModal} />
                {isUpload?.isVideoFile?.url && (
                  <Tooltip backClass={styles.tooltipClass} text="Remove Sample Video">
                    <Button type="button" icon={deleteIcon} handleClick={handleRemoveSampleVideo} />
                  </Tooltip>
                )}
              </div>
            </div>
            <div>
              {(isUpload?.isVideoFile?.customeThumbnailUrl ||
                isUpload?.isVideoFile?.thumbnailUrl) && (
                <img
                  className={styles.thumbnailUrlClassName}
                  src={
                    isUpload?.isVideoFile?.customeThumbnailUrl
                      ? isUpload?.isVideoFile?.customeThumbnailUrl
                      : isUpload?.isVideoFile?.thumbnailUrl
                        ? isUpload?.isVideoFile?.thumbnailUrl
                        : noImage
                  }
                  alt="peersuma-logo"
                  width="150px"
                />
              )}
              <div className={styles.btnThumbnailReplace}>
                <Tooltip backClass={styles.tooltipClass} text="Upload Thumbnail">
                  <Button
                    title={
                      isUpload?.isVideoFile?.url || isUpload?.isVideoFile?.customeThumbnailUrl
                        ? ""
                        : "Upload Thumbnail"
                    }
                    icon={replaceImage}
                    type="button"
                    handleClick={handleOpenThumbnailModal}
                  />
                </Tooltip>
                {isUpload?.isVideoFile?.customeThumbnailUrl && (
                  <Tooltip backClass={styles.tooltipClass} text="Remove Thumbnail">
                    <Button type="button" icon={deleteIcon} handleClick={handleRemoveThumbnail} />
                  </Tooltip>
                )}
              </div>
            </div>
            {/*  audio file  */}
            <div>
              {isUpload?.isVideoFile?.audioUrl && (
                <audio className={styles.videoPlayer} controls>
                  <source src={isUpload?.isVideoFile?.audioUrl} type="audio/mpeg" />
                  <track kind="captions" src={isUpload?.isVideoFile?.audioUrl} />
                </audio>
              )}
              <div className={styles.btnThumbnailReplace}>
                <Tooltip backClass={styles.tooltipClass} text="Upload Audio">
                  <Button
                    title={isUpload?.isVideoFile?.audioUrl ? "" : "Upload Audio"}
                    icon={replaceImage}
                    type="button"
                    handleClick={handleOpenAudioModal}
                  />
                </Tooltip>
                {isUpload?.isVideoFile?.audioUrl && (
                  <Tooltip backClass={styles.tooltipClass} text="Remove Audio">
                    <Button type="button" icon={deleteIcon} handleClick={handleRemoveAudio} />
                  </Tooltip>
                )}
              </div>
            </div>
            {isUpload?.isError && (
              <span className={`${styles.errorMessage}`}>{isUpload?.isError}</span>
            )}
          </div>

          <div className={styles.btnDivBottom}>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!watch("name")}
              loaderClass={styles.loading}
              title={id ? "update" : "Save"}
            />
            <Button title="Cancel" type="button" handleClick={() => navigate("/inventory")} />
          </div>
        </div>
      </form>

      {isUpload?.isOpen && (
        <TransloaditUploadModal
          fieldName={isUpload?.isOpen}
          setFieldName={() => handleCloseModal()}
          maxNumberOfFiles={1}
          minNumberOfFiles={1}
          allowedFileTypes={["video/*"]}
          mapUploads={s3TransloaditUploadMap}
          setUploads={async ({ uploads }) => {
            setIsUpload((prev) => ({
              ...prev,
              isVideoFile: {
                ...prev?.isVideoFile,
                url: uploads?.[0]?.url,
                imageName: uploads?.[0]?.name,
                s3Key: uploads?.[0]?.s3Key,
                thumbnailUrl: uploads?.[0]?.thumbnailUrl,
                thumbnailS3Key: uploads?.[0]?.thumbnailS3Key,
              },
              isError: "",
            }));
          }}
          fields={{
            prefix: `/inventory/${id}/`,
            timeStamp: moment().format("YYYYMMDD_HHmmss"),
          }}
        />
      )}
      {isUpload?.isOpenThumbnailModal && (
        <TransloaditUploadModal
          fieldName={isUpload?.isOpenThumbnailModal}
          setFieldName={() => handleCloseThumbnailModal()}
          maxNumberOfFiles={1}
          minNumberOfFiles={1}
          allowedFileTypes={[isUpload?.fileType === "image" ? "image/*" : "audio/*"]}
          mapUploads={s3TransloaditUploadMap}
          setUploads={async ({ uploads }) => {
            setIsUpload((prev) => ({
              ...prev,
              isVideoFile: {
                ...prev?.isVideoFile,
                ...(isUpload?.fileType === "image"
                  ? {
                      customeThumbnailUrl: uploads?.[0]?.url,
                      customeThumbnailS3Key: uploads?.[0]?.s3Key,
                    }
                  : {
                      audioUrl: uploads?.[0]?.url,
                      audioS3Key: uploads?.[0]?.s3Key,
                    }),
              },
              isError: "",
            }));
          }}
          fields={{
            prefix: `/inventory/${id}/`,
            timeStamp: moment().format("YYYYMMDD_HHmmss"),
          }}
        />
      )}
    </>
  );
};

export default AddEditInventories;

const statusOptions = [
  { label: "Teachers", value: "Teachers" },
  { label: "Curriculum", value: "Curriculum" },
  { label: "Enrichment", value: "Enrichment" },
  { label: "Wellness", value: "Wellness" },
  { label: "Environment", value: "Environment" },
  { label: "Leadership", value: "Leadership" },
];

const levelOption = [
  { label: "K-2", value: "#00c4cc" },
  { label: "3-5", value: "#74C578" },
  { label: "6-8", value: "#F2C057" },
  { label: "9-12", value: "#CB5B3B" },
  { label: "N/A", value: "#F8F8F8" },
];

const complexityOption = [
  { label: "Simple", value: "Simple" },
  { label: "Complex", value: "Complex" },
  { label: "Moderate", value: "Moderate" },
];
