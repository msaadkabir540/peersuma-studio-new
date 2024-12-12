import { useContext, useMemo, useRef, useState } from "react";

import Player from "../player";
import Staging from "../staging";
import Assembly from "../assembly";
import DraftComponent from "../drafts";
import Loading from "@/components/loading";
import { useTemplateTab } from "../template-tab/helper";
import TemplateContainer from "../../template-container";
import AlbumsMediaList from "@/components/albums-media-list";
import CreateUpdateProject from "../../create-update-project";
import HeaderButtonComponent from "../header-button-component";

import { CreateProjectContext } from "@/context/create-project/index";
import { UpdateProjectEnum } from "@/context/create-project/types";

import { OnDropFunctionArgs } from "../interface";
import { MediaPlayerContainerInterface } from "./media-player-container-interface";
import {
  TemplatesFieldInterface,
  TemplatesFieldValueInterface,
  stagingFieldsInterface,
} from "../../interface";

import editIcons from "@/assets/edit.svg";

import styles from "./index.module.scss";

const MediaPlayerContainer: React.FC = () => {
  const closeMediaRef = useRef<HTMLDivElement>(null);
  // context
  const {
    watch,
    project,
    isLoading,
    isUpdateModal,
    selectedClient,
    dispatchProject,
    handleUpdateModalOpen,
    handleUpdateModalClose,
  } = useContext<MediaPlayerContainerInterface>(CreateProjectContext as any);

  const {
    player,
    loading,
    setPlayer,
    ssJson,
    isPlaying,
    setLoading,
    setMoveMenu,
    finalVideo,
    renderVideo,
    currentTime,
    mergePlayer,
    setIsPlaying,
    currentVideo,
    currentIndex,
    setCurrentTime,
    setMergePlayer,
    stageTypeFields,
    setCurrentIndex,
    setCurrentVideo,
    moveMediaToField,
    generateUpdateSSJson,
    moveMediaToFieldStaging,
  } = useTemplateTab({ watch, project, dispatchProject });

  const {
    albumId,
    yourName,
    templates,
    showField,
    projectName,
    finalVideos,
    videoProjectId,
    selectedFieldName,
    activeTemplateUuid,
    subClipCurrentTime,
  } = project;

  const templateIndexUuid = useMemo(() => {
    return templates?.findIndex((x) => x?.uuid === activeTemplateUuid);
  }, [templates, activeTemplateUuid]);

  const currentTemplate = templates?.[templateIndexUuid] || "";
  const templateFields = currentTemplate?.fields || [];

  const projectModalData = {
    yourName,
    projectName,
  };
  const [selection, setSelection] = useState<{
    controls: boolean;
    currentSelection?: any;
  }>({
    controls: false,
  });

  const handleGenerateSSJson = () => {
    dispatchProject({
      type: UpdateProjectEnum.IS_JSONLOAD,
      payload: true,
    });
    generateUpdateSSJson();
  };

  const handleUpdateProjectData = ({ responseData }: { responseData: string }) => {
    dispatchProject({
      type: UpdateProjectEnum.IS_JSONLOAD,
      payload: responseData,
    });
  };

  const onDrop = ({
    e,
    label,
    name = selectedFieldName || "",
    noDrop = false,
    videoDataFromClip = null,
  }: OnDropFunctionArgs) => {
    e?.preventDefault();

    let video_data;
    label =
      project?.stagingFields?.find((data, index) => index === showField)?.label || label || "";
    if (noDrop) video_data = videoDataFromClip;
    else video_data = JSON.parse(e?.dataTransfer?.getData("video_data") || "");

    const copyProject = { ...project };
    const updatedFields = moveMediaToField({
      prev: copyProject?.stagingFields,
      label,
      name,
      ...video_data,
    });
    const latestDroppedClip = updatedFields
      ?.find((field) => field.name === name)
      ?.value?.at(-1) as TemplatesFieldValueInterface;
    dispatchProject({
      type: UpdateProjectEnum.SET_SELECTED_VIDEO_CLIP,
      selectedVideoClip: latestDroppedClip?.id,
    });

    handleClipClicks({
      e: e as React.DragEvent<HTMLDivElement>,
      item: latestDroppedClip || video_data,
      label: label || "",
      name: name || "",
      currentVideoHeadTime: !video_data?.clipDuration && subClipCurrentTime,
    });
  };

  const handleClipClicks = ({
    e,
    item,
    label,
    name,
    currentVideoHeadTime,
    templateClip,
  }: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.DragEvent<HTMLDivElement>;
    item: TemplatesFieldValueInterface;
    label: string;
    name: string;
    currentVideoHeadTime?: number | false | null | undefined;
    templateClip?: boolean;
  }) => {
    e?.stopPropagation();
    const { id, startTime, endTime, url, duration } = item;
    setCurrentVideo({ ...item, label, id });
    setPlayer({
      video: {
        url: url,
        duration,
        startTime,
        endTime,
        playClip: true,
      },
      currentIndex: 0,
      selectionEnd: endTime,
      currentTime: currentVideoHeadTime ? currentVideoHeadTime : startTime,
      selectionStart: startTime,
    });
    dispatchProject({
      type: UpdateProjectEnum.SET_CLIP_PROJECT,
      clickClip: 1,
      clickMediaColor: null,
      selectedFieldName: name,
      templateClip: templateClip,
    });
    setSelection({ controls: false });
  };

  const handleUpdateStageField = ({ stagingFields }: { stagingFields: stagingFieldsInterface }) => {
    dispatchProject({
      type: UpdateProjectEnum.UPDATE_STAGING_FIELD,
      stagingFields: stagingFields,
    });
  };

  const clickOnFieldFields = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    name: string,
    label: string,
    media: any,
  ) => {
    e.stopPropagation();
    let resultStageFields;
    if (media?.fileType === "video") {
      resultStageFields = moveMediaToFieldStaging
        ? (moveMediaToFieldStaging({
            prev: project?.stagingFields as [],
            name,
            label,
            _currentVideo: media,
            startTime: 0,
            endTime: media?.duration,
            side: "right",
          }) as TemplatesFieldInterface[])
        : [];
    } else {
      resultStageFields = moveMediaToField
        ? (moveMediaToField({
            prev: project?.stagingFields as [],
            name,
            label,
            _currentVideo: media,
            startTime: 0,
            endTime: media?.duration,
          }) as TemplatesFieldInterface[])
        : [];
    }
    dispatchProject({
      type: UpdateProjectEnum.MOVE_MEDIA_TO_STAGE_FIELDS,
      stageField: [...resultStageFields],
    });

    setMoveMenu && setMoveMenu(false);
  };

  const clickOnListMedia = ({ index, media }: { index: number; media: any }) => {
    setSelection && setSelection({ controls: false });
    dispatchProject({ type: UpdateProjectEnum.CLICK_ON_LIST_MEDIA, indexValue: index });
    setPlayer &&
      setPlayer({
        video: {
          url: media?.url,
          startTime: 0,
          endTime: media?.duration,
        },
        currentTime: 0,
        currentIndex: 0,
        isPlaying: false,
      });
    media?.fileType === "video" && setCurrentVideo && setCurrentVideo(media);
  };

  const handleAlbumIdEvent = ({ newAlbumId }: { newAlbumId: string }) => {
    dispatchProject({ type: UpdateProjectEnum.ADD_ALBUM_ID, albumId: newAlbumId });
  };

  const handleCloseMedia = () =>
    closeMediaRef && (closeMediaRef?.current?.handleCloseMedia() as unknown);

  return (
    <>
      <div className={styles.headingContainer}>
        <div className={styles.projectHeading}>
          <div className={styles.projectNameClass}>
            Project Name: <span> {projectName}</span>
          </div>
          <img
            aria-hidden="true"
            onClick={() => handleUpdateModalOpen()}
            src={editIcons}
            alt="edit Image"
            height={"16px"}
          />
          {/* // update modal */}
          {isUpdateModal && (
            <CreateUpdateProject
              data={projectModalData}
              open={isUpdateModal}
              handleUpdateProjectData={({ responseData }) =>
                handleUpdateProjectData({ responseData })
              }
              handleModalClose={() => handleUpdateModalClose()}
            />
          )}
        </div>
        <div className={styles.projectButtonContainer}>
          <HeaderButtonComponent
            isSSJsonLoading={ssJson}
            renderVideo={renderVideo}
            isFinalVideoLoading={finalVideo}
            handleCloseMedia={handleCloseMedia}
            handleGenerateSSJson={handleGenerateSSJson}
          />
        </div>
      </div>
      {isLoading || finalVideo || ssJson ? (
        <Loading pageLoader={true} loaderClass={styles.stagingLoad} diffHeight={650} />
      ) : (
        <div className={styles.wrappersContainer}>
          {project?.activeTab !== "assembly" && (
            <>
              {project?.activeTab === "templateTab" && (
                <Staging
                  handleUpdateStageField={handleUpdateStageField}
                  handleClipClicks={handleClipClicks as () => void}
                />
              )}
              {project?.activeTab === "stagingTab" && (
                <div className={styles.MediaPlayerScss}>
                  <>
                    <div className={styles.mediaContainer}>
                      <AlbumsMediaList
                        albumId={albumId}
                        loadingHeight={575}
                        selectedClientId={selectedClient}
                        stageTypeFields={stageTypeFields}
                        clickOnListMedia={clickOnListMedia}
                        clickOnFieldFields={clickOnFieldFields}
                        handleAlbumIdEvent={handleAlbumIdEvent}
                        clickMediaColor={project?.clickMediaColor}
                      />
                    </div>
                    <Player
                      onDrop={onDrop}
                      player={player}
                      isPlaying={isPlaying}
                      selection={selection}
                      setPlayer={setPlayer}
                      currentTime={currentTime}
                      mergePlayer={mergePlayer}
                      setSelection={setSelection}
                      currentIndex={currentIndex}
                      setIsPlaying={setIsPlaying}
                      currentVideo={currentVideo}
                      closeMediaRef={closeMediaRef}
                      templateFields={templateFields}
                      setCurrentTime={setCurrentTime}
                      setMergePlayer={setMergePlayer}
                      setCurrentIndex={setCurrentIndex}
                      setCurrentVideo={setCurrentVideo}
                      moveMediaToField={moveMediaToField}
                    />
                  </>
                </div>
              )}
            </>
          )}
          <div className={styles.PlayerScss}>
            <>
              {project?.activeTab === "stagingTab" && (
                <div className={styles.stagingTabContainer}>
                  <div>Empty Stage</div>
                  <Staging
                    handleUpdateStageField={handleUpdateStageField}
                    handleClipClicks={handleClipClicks as () => void}
                  />
                </div>
              )}

              {project?.activeTab === "templateTab" && (
                <div className={styles.templateTabContainer}>
                  <div className={styles.templateAssembly}>
                    <h4>Rendered Videos:</h4>
                    <AlbumsMediaList
                      isAssembly={true}
                      finalVideos={finalVideos}
                      selectedClientId={null}
                    />
                  </div>
                  <div className={styles.templateFields}>
                    <TemplateContainer handleClipClicks={handleClipClicks as () => void} />
                  </div>
                </div>
              )}

              {project?.activeTab === "assembly" && (
                <Assembly loading={loading} setLoading={setLoading} />
              )}
              {project?.activeTab === "drafts" && (
                <div className={styles.templateFields}>
                  <DraftComponent />
                </div>
              )}
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaPlayerContainer;
