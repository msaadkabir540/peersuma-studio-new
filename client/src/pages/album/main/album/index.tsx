import moment from "moment";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

import MediaCards from "./media-cards";
import Modal from "@/components/modal";
import FilterField from "./filter-field";
import Button from "@/components/button";
import Loading from "@/components/loading";
import ShotList from "./component/shot-list";
import UserList from "./component/user-list";
import InviteBox from "./component/invite-box";
import MainHeading from "./component/main-header";
import ShotHeading from "./component/shot-heading";
import CreateUpdateAlbum from "../create-update-album";
import SendEmailDialogue from "../send-email-dialogue";
import CreateUpdateAlbumshot from "../create-update-albumshot";
import EditShortLinkModal from "../create-update-album/edit-short-link";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import { getAlbumsById } from "@/api-services/album";
import { s3TransloaditUploadMap } from "@/utils/helper";
import { uploadShotMedia } from "@/api-services/albumshot";
import createNotification from "@/common/create-notification";

import { Users as UsersApiInterface } from "@/interface/account-interface";

import ShotUrlLink from "./component/shot-url-link";

import {
  AlbumDataInterface,
  AlbumDataResultInterface,
  AlbumShortInterface,
  EmailDialogueInterface,
  SendEmailUserInterface,
  ShotModalInterface,
  UploadsMediaInterface,
} from "./albuminterface";
import { MediaUploadFileType } from "@/pages/media-library/media-library-interface";

import styles from "./index.module.scss";

const AlbumMedia: React.FC = () => {
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const { users = [] as UsersApiInterface[], loggedInUser } = useSelector(
    (state: any) => state.users,
  );
  const { control, register, watch, setValue } = useForm({});

  const [albumData, setAlbumData] = useState<AlbumDataInterface>({
    loading: { main: false, isLoadingMain: true },
  } as AlbumDataInterface);
  const [shotModal, setShotModal] = useState<ShotModalInterface>({
    createShot: false,
    upload: false,
  });
  const [currentShot, setCurrentShot] = useState<AlbumShortInterface>({} as AlbumShortInterface);
  const [updatePage, setUpdatePage] = useState<number>(0);
  const [modalData, setModalData] = useState<AlbumShortInterface[]>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [editAlbumShortLink, setEditAlbumShortLink] = useState<boolean>(false);
  const [emailDialogue, setEmailDialogue] = useState<EmailDialogueInterface>({
    open: false,
    subject: "",
    message: "",
    email: "",
    loading: false,
    user: {},
  });
  const { loading, open, data = {}, isOpen, openMedia } = albumData;
  const { _id, name, albumshots, createdByUser, createdAt } = data as AlbumDataResultInterface;
  const { media, mediaIds = [], confirmation = false, shotUrl, invites } = currentShot;

  const FilteredMedia = useMemo(
    () =>
      media?.filter(({ fileType }) =>
        watch("status") === "all" ? true : !watch("status") || fileType === watch("status"),
      ),
    [watch("status"), media],
  );

  useEffect(() => {
    handleAlbums(id as string);
  }, [id, updatePage]);

  useEffect(() => {
    if (Object.prototype.hasOwnProperty.call(albumData, "data")) {
      const albumShots = albumData?.data?.albumshots;
      if (
        // currentShot?.hasOwnProperty("_id") &&
        Object.prototype.hasOwnProperty.call(currentShot, "_id") &&
        albumShots?.filter((x) => x._id === currentShot?._id).length
      ) {
        const currentShortResult = albumShots?.find((x) => x?._id === currentShot?._id);
        setCurrentShot(currentShortResult as any);
      } else {
        const currentShortResult = albumShots?.find((x) => x?.isDefault);
        setCurrentShot(currentShortResult as any);
      }
    }
  }, [albumData]);

  const handleAlbums = async (id: string) => {
    setAlbumData((prev) => ({
      ...prev,
      loading: {
        ...prev.loading,
        main: true,
      },
    }));
    try {
      const res = await getAlbumsById({
        params: { id },
      });
      if (res.status === 200) {
        setAlbumData((prev) => ({
          ...prev,
          data: res.data,
          loading: {
            ...prev.loading,
            main: false,
            isLoadingMain: false,
          },
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLInputElement>,
    user: SendEmailUserInterface, // Replace YourUserType with the actual type of your 'user' object
  ): void => {
    // Set the data to be transferred during the drag operation
    // let crt: HTMLDivElement;
    const crt = document.createElement("div");
    crt.id = "drag-player";
    crt.innerHTML = `
      <div class="${styles.dragElementInner}">
        <div>
          <span>${user?.username || user?.fullName}</span>
        </div>
      </div>
    `;
    crt.classList.add(styles.dragElement);
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, 0, 0);
    e.dataTransfer.setData("user-data", JSON.stringify(user));
  };

  const handleDragEnd: () => void = () => {
    const dragPlayerElement = document.getElementById("drag-player");

    if (dragPlayerElement) {
      dragPlayerElement.remove();
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLInputElement>) => {
    // Prevent the default behavior (usually not allowing drops)
    e.preventDefault();
  };

  const onDrop = async (e: any) => {
    // Prevent the default behavior (usually open as a link)
    e.preventDefault();
    // Get the data that was transferred during the drag operation
    const dragMedia = JSON.parse(e.dataTransfer.getData("user-data"));

    if (!shotUrl) {
      createNotification("error", "Please create shotURL First");
    } else if (dragMedia.length !== 0) {
      setEmailDialogue({
        ...emailDialogue,
        open: true,
        user: dragMedia,
      });
    }
  };

  const getLetter = useCallback((name: string) => {
    const firstLetter = name?.[0];
    const lastLetter = name?.[name?.length - 1];
    return `${firstLetter}${lastLetter}`;
  }, []);

  const addUpdateShotHandler = ({ data }: { data?: AlbumShortInterface }) => {
    if (data) {
      if ("_id" in data && typeof data._id === "string") {
        // Updating
        setModalData(data as any);
        setShotModal((prev) => ({ ...prev, createShot: true }));
      } else {
        // Creating
        setModalData({} as any);
        setShotModal((prev) => ({ ...prev, createShot: true }));
      }
    }
  };
  const addUpdateShotHandlers = () => {
    // Creating
    setModalData({} as any);
    setShotModal((prev) => ({ ...prev, createShot: true }));
  };

  const handleClose = () => setEditAlbumShortLink(false);

  const handleIncrementUpdatePage = () => setUpdatePage((prev) => prev + 1);

  const handleClearSelection = () => {
    setCurrentShot((prev) => ({ ...prev, mediaIds: [] }));
    setValue("multiDelete", "");
  };

  const handleNoClick = () => {
    setAlbumData((prev) => ({ ...prev, confirmation: false, mediaIds: [] }));
    setValue("multiDelete", "");
  };

  const handleSetFile = (fileType: string, url: string) => {
    setAlbumData((prev: any) => ({
      ...prev,
      isOpen: { isOpen: true },
      openMedia: { fileType, url },
    }));
  };

  const handleSelectDelete = (mediaId: []) => {
    setCurrentShot((prev) => ({
      ...prev,
      mediaIds: mediaId,
    }));
  };

  const handleDeleteCurrentShot = (id: string) => {
    setCurrentShot((prev: any) => ({
      ...prev,
      mediaIds: prev?.mediaIds?.filter((mediaId: string) => mediaId !== id),
    }));
  };

  const handleDelete = (id: string) =>
    setCurrentShot((prev: any) => ({ ...prev, mediaIds: [id], confirmation: true }));

  const handleUpload = async ({ id, uploads }: { id: string; uploads: UploadsMediaInterface }) => {
    {
      setLoadingPage(true);
      try {
        const res = await uploadShotMedia({
          id,
          data: { media: uploads } as MediaUploadFileType,
        });
        res && handleIncrementUpdatePage();
      } catch (error) {
        console.error(error);
      }
      setLoadingPage(false);
    }
  };

  const handleUpdateAlbumData = ({ shortLink }: { shortLink: string }) => {
    setAlbumData((prev) => {
      prev.data.shortLink = shortLink;
      prev = structuredClone(prev);
      return prev;
    });
  };

  const handleSetCurrentShot = ({ shot }: { shot: AlbumShortInterface }) => {
    setCurrentShot(shot as AlbumShortInterface);
  };

  const handleInviteAdd = ({ id }: { id: string }) => {
    setCurrentShot((prev: any) => ({
      ...prev,
      // eslint-disable-next-line no-unsafe-optional-chaining
      invites: [...prev?.invites, { id, lastInvited: new Date() }],
    }));
  };

  return (
    <div className={styles.albumContainer}>
      <Button
        title="< Back to List"
        type="button"
        handleClick={() => {
          navigate("/album");
        }}
      />
      {loading?.isLoadingMain ? (
        <Loading pageLoader={true} />
      ) : (
        <>
          <MainHeading
            name={name}
            createdAt={createdAt}
            createdBy={loggedInUser?._id === createdByUser ? loggedInUser?.username : ""}
            handleUpdateName={() => setAlbumData((prev) => ({ ...prev, open: true }))}
          />
          <div className={styles.albumMediaContainer}>
            <div>
              <ShotList
                albumShots={albumshots}
                currentShotId={currentShot?._id}
                handleAddShot={() => addUpdateShotHandlers()}
                handleSetCurrentShot={({ shot }) => handleSetCurrentShot({ shot })}
              />
              <ShotHeading
                currentShot={currentShot}
                handleAddUpdatedShot={() => addUpdateShotHandler({ data: currentShot })}
                handleOpenUploadModal={() => setShotModal((prev) => ({ ...prev, upload: true }))}
              />
              <InviteBox
                users={users}
                invites={invites}
                shotUrl={shotUrl}
                getLetter={getLetter}
                emailDialogue={emailDialogue}
                handleDragEnd={handleDragEnd}
                setEmailDialogue={setEmailDialogue}
              />
              {_id && (
                <ShotUrlLink
                  shotUrl={shotUrl}
                  handleSetEditAlbumShotLink={() => setEditAlbumShortLink(true)}
                />
              )}
              <FilterField
                {...{
                  control,
                  mediaIds,
                  setValue,
                  currentShotId: currentShot?._id,
                  FilteredMedia,
                  handleClearSelection,
                  handleIncrementUpdatePage,
                }}
              />

              {loading?.main || loadingPage ? (
                <Loading pageLoader={true} />
              ) : (
                <>
                  <MediaCards
                    {...{
                      watch,
                      mediaIds,
                      control,
                      register,
                      currentShot,
                      confirmation,
                      FilteredMedia,
                      handleDelete,
                      handleNoClick,
                      handleSetFile,
                      setCurrentShot,
                      handleSelectDelete,
                      handleClearSelection,
                      handleDeleteCurrentShot,
                      handleIncrementUpdatePage,
                    }}
                    handleCloseModal={() =>
                      setAlbumData((prev) => ({ ...prev, confirmation: false }))
                    }
                  />
                </>
              )}
            </div>
            <UserList
              {...{
                watch,
                users,
                invites,
                control,
                register,
                getLetter,
                handleDragEnd,
                handleDragStart,
              }}
            />
          </div>
        </>
      )}
      {shotModal.createShot && (
        <CreateUpdateAlbumshot
          {...{
            data: modalData,
            open: shotModal?.createShot,
            handleIncrementUpdatePage,
            handleClickOpen: (open) => setShotModal((prev) => ({ ...prev, createShot: open })),
          }}
        />
      )}

      {open && (
        <CreateUpdateAlbum
          {...{
            open,
            data,
            handleUpdateAlbumData,
            handleIncrementUpdatePage,
            handleModalClose: () => setAlbumData((prev) => ({ ...prev, open: false })),
          }}
        />
      )}

      {editAlbumShortLink && (
        <EditShortLinkModal
          {...{
            editAlbumShortLink,
            setEditAlbumShortLink,
            shortLinkText: shotUrl,
            setUpdatePage,
            handleClose,
            handleIncrementUpdatePage,
          }}
          currentShotId={currentShot?._id as string}
        />
      )}

      <Modal
        {...{
          open: isOpen,
          handleClose: () => setAlbumData((prev: any) => ({ ...prev, isOpen: false })),
        }}
      >
        {openMedia && openMedia?.fileType === "video" ? (
          <video className={styles.videoPlayer} controls>
            <source src={openMedia?.url} type="video/mp4" />
            <track kind="captions" src={openMedia?.url} />
          </video>
        ) : openMedia && openMedia?.fileType === "image" ? (
          <img src={openMedia?.url} className={styles.videoPlayer} alt="openMedia" />
        ) : openMedia && openMedia?.fileType === "audio" ? (
          <video className={styles.videoPlayer} controls>
            <source src={openMedia?.url} type="audio/mpeg" />
            <track kind="captions" src={openMedia?.url} />
          </video>
        ) : (
          ""
        )}
      </Modal>

      {/* Manage Invitation*/}
      {!!emailDialogue?.open && (
        <SendEmailDialogue
          open={emailDialogue.open}
          albumData={albumData?.data}
          currentShot={currentShot}
          user={emailDialogue.user}
          shotCrewEmailId={emailDialogue.email}
          handleInviteAdd={(id: string) => handleInviteAdd({ id })}
          handleClose={() => setEmailDialogue({ ...emailDialogue, open: false })}
        />
      )}

      {shotModal?.upload && (
        <TransloaditUploadModal
          fieldName={shotModal.upload}
          setFieldName={(val) => setShotModal((prev) => ({ ...prev, upload: val }))}
          allowedFileTypes={null}
          mapUploads={s3TransloaditUploadMap}
          setUploads={async ({ uploads }) => {
            await handleUpload({ id: currentShot?._id, uploads: uploads as any });
          }}
          fields={{
            prefix: `/albums/${id}/${currentShot?._id}/`,
            timeStamp: moment().format("YYYYMMDD_HHmmss"),
          }}
        />
      )}
    </div>
  );
};

export default AlbumMedia;
