import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

import ShortLink from "./component/short-link";

import Input from "@/components/input";
import Switch from "@/components/switch";
import VimeoPlayer from "./vimeo-player";
import Button from "@/components/button";
import Loading from "@/components/loading";
import TextArea from "@/components/textarea";
import DropDown from "@/components/dropdown-menu";
import EditShortLinkModal from "./edit-short-link";
import SelectBox from "@/components/multi-select-box";

import {
  addLibraryMedia,
  getLibraryWidgetById,
  updateLibraryMedia,
  updateThumbnailFromFrame,
} from "@/api-services/library";

import { Users as UsersApiInterface } from "@/interface/account-interface";
import { ClientsStateInterface } from "@/interface/user-selector-interface";
import {
  FormSchemaLibrary,
  LoadingSchemaInterface,
  CreateUpdateDataInterface,
} from "./create-update-library-interface";

import downloadIcon from "@/assets/download.svg";

import styles from "./index.module.scss";

const CreateUpdateLibrary: React.FC = () => {
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const { users = [] as UsersApiInterface[] } = useSelector((state: any) => state.users);
  const { selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);
  const {
    reset,
    watch,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormSchemaLibrary>({});

  const [updatedShotLink, setUpdatedShotLink] = useState<string>("");
  const [videoTime, setVideoTime] = useState<number | null>(0);
  const [editShortLink, setEditShortLink] = useState<boolean>(false);
  const [loading, setLoading] = useState<LoadingSchemaInterface>({
    updateFrame: false,
    libraryWidget: false,
    handleShowProcessing: false,
    isLoading: false,
  });

  const shortLink = useMemo(() => {
    return `${import.meta.env.VITE_LIBRARY_SHORT_URL_BASE}${
      watch("shortLink") ? watch("shortLink") : updatedShotLink
    }`;
  }, [watch("shortLink"), updatedShotLink]);

  const handleShotLink = ({ shotLink }) => setUpdatedShotLink(shotLink);

  const onSubmit = async (data: CreateUpdateDataInterface) => {
    data.clientId = selectedClient;
    data.videoUrl = `https://vimeo.com/${data?.videoUrl}`;
    setLoading((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = id ? await updateLibraryMedia({ id, data }) : await addLibraryMedia({ data });

      if (res.status === 200) {
        navigate("/library");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading((prev) => ({ ...prev, isLoading: false }));
  };

  const handleSelectFromFrame = async () => {
    setLoading((prev) => ({ ...prev, updateFrame: true }));
    try {
      const res = await updateThumbnailFromFrame({
        data: {
          id,
          time: videoTime,
          assetId: watch("videoUrl"),
        },
      });
      if (res.status === 200) {
        setValue("thumbnailUrl", res?.data?.updatedLibrary?.thumbnailUrl);
        setValue("duration", res?.data?.updatedLibrary?.duration);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading((prev) => ({ ...prev, updateFrame: false }));
  };

  const handleClose = () => {
    setEditShortLink(false);
  };

  const handleSetVideoTime = ({ value }: { value: number | null }) => setVideoTime(value);

  const handleSetLoading = () => setLoading((prev: any) => ({ prev, handleShowProcessing: true }));

  const handleGetLibraryWidgetById = async () => {
    setLoading((prev) => ({ ...prev, libraryWidget: true }));
    try {
      const res = await getLibraryWidgetById({ params: { id } });
      if (res.status === 200) {
        reset({ ...res.data, videoUrl: res?.data?.videoUrl?.split(".com/")?.[1] });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading((prev) => ({ ...prev, libraryWidget: false }));
  };

  useEffect(() => {
    id && handleGetLibraryWidgetById();
  }, [id]);

  return (
    <>
      {loading?.libraryWidget ? (
        <Loading pageLoader={true} diffHeight={70} />
      ) : (
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.CULibraryContainer}>
            <h3>{id ? "Update" : "Create"} Video</h3>
            <div className={styles.createUpdateLibraryContainer}>
              <div className={styles.fieldContainerLeft}>
                <div className={styles.field}>
                  <Input
                    label="Name"
                    name="name"
                    register={register}
                    inputClass={styles.inputClass}
                  />
                </div>
                <div className={styles.field}>
                  <TextArea
                    label="Description"
                    name="description"
                    placeholder={"Tell the Story behind the video"}
                    register={register}
                  />
                </div>
                <div className={styles.field}>
                  <SelectBox
                    isMulti
                    showSelected
                    name="producers"
                    control={control}
                    label="Producers"
                    placeholder={"Select"}
                    selectBoxClass={styles.height}
                    options={producerOptions(users) || []}
                  />
                </div>
                {watch("thumbnailUrl") && (
                  <>
                    <label htmlFor="Thumbnail">Thumbnail</label>
                    <div className={styles.thumbnail}>
                      <img alt="thumbnailUrl" src={watch("thumbnailUrl")} />
                    </div>
                  </>
                )}
                {id && (
                  <Button
                    isLoading={loading?.updateFrame}
                    title="Select From Frame"
                    className={styles.selectFrame}
                    handleClick={handleSelectFromFrame}
                  />
                )}
                <div className={styles.switchContainer}>
                  <div>
                    <label htmlFor="Privacy">Privacy</label>
                    <span>People can share this video</span>
                  </div>
                  <div className={styles.btnSwitch}>
                    <Switch control={control} name={"shareable"} defaultValue={true} />
                  </div>
                </div>
                {id && (
                  <div className={styles.switchContainer}>
                    <div>
                      <label htmlFor="Status">Status</label>
                      <span>This video is active</span>
                    </div>
                    <div className={styles.btnSwitch}>
                      <Switch control={control} name={"active"} defaultValue={true} />
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.fieldContainerRight}>
                <div className={styles.field}>
                  <label htmlFor="videoUrl">Video URL</label>
                  <div className={styles.inputBase}>
                    <span>https://vimeo.com/</span>
                    <Input
                      name="videoUrl"
                      register={register}
                      placeholder="video_id"
                      className={styles.inputContainer}
                    />
                  </div>
                </div>
                <ShortLink
                  shortLink={shortLink}
                  handleSetEditShortLink={() => setEditShortLink(true)}
                />
                {watch("downloads")?.length > 0 && (
                  <div className={styles.download}>
                    <DropDown
                      options={watch("downloads")?.map(
                        ({ link, quality }: { link: string; quality: string }) => ({
                          name: quality,
                          icon: downloadIcon,
                          handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            e.stopPropagation();
                            const a = document.createElement("A") as HTMLAnchorElement;
                            a.href = link;
                            a.download = true.toString();
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          },
                        }),
                      )}
                      title={
                        <Button
                          type="button"
                          title={"Download"}
                          icon={downloadIcon}
                          className={styles.downloadButton}
                        />
                      }
                    />
                  </div>
                )}
                {loading?.handleShowProcessing ? (
                  <div className={styles.messageShow}>Video is in processing, please wait.</div>
                ) : (
                  watch("videoUrl") && (
                    <div className={styles.videoUrl}>
                      <VimeoPlayer
                        {...{
                          handleSetLoading,
                          handleSetVideoTime,
                          url: `https://vimeo.com/${watch("videoUrl")}`,
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.btnDiv}>
              <Button title={id ? "Update" : "Save"} type="submit" isLoading={loading?.isLoading} />
              <Button
                title="Cancel"
                type="button"
                handleClick={() => {
                  navigate("/library");
                }}
              />
            </div>
          </form>
          {editShortLink && (
            <EditShortLinkModal
              reset={reset}
              register={register}
              isSubmitting={isSubmitting}
              setValue={setValue}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              editShortLink={editShortLink}
              shortLinkText={watch("shortLink") || updatedShotLink}
              handleShotLink={({ shotLink }) => handleShotLink({ shotLink })}
            />
          )}
        </div>
      )}
    </>
  );
};

export default CreateUpdateLibrary;

export const producerOptions = (users: UsersApiInterface[]) => {
  return users
    ?.filter(({ roles }) =>
      roles.find((role) => ["executive-producer", "producer"]?.includes(role)),
    )
    ?.map(({ _id, firstName, lastName }) => ({
      label: `${firstName || ""} ${lastName || ""}`,
      value: _id,
    }));
};
