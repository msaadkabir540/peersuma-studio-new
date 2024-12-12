import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useReducer, useEffect, useMemo, useContext, useState, useRef } from "react";

import Modal from "@/components/modal";
import Button from "@/components/button";
import Switch from "@/components/switch";
import StagingModal from "./staging-modal";
import RenameClipModal from "../rename-clip-modal";
import VideoPlayer from "@/components/video-player";
import StagingVideoField from "./staging-video-field";
import useFieldRenderers from "@/components/project-field-render-hook";

import addStageIcons from "@/assets/plus.png";
import deleteStageIcon from "@/assets/deleteCircle.png";

import { reducer, types } from "./staging-reducer";
import { useTemplateTab } from "../template-tab/helper";
import { UpdateProjectEnum } from "@/context/create-project/types";
import { CreateProjectContext } from "@/context/create-project/index";

import { formatVideoTime } from "@/components/video-player-editor/helper";

import {
  StagingInterface,
  UpdateClipInterface,
  StagingContextInterface,
  HandleClipOnClipInterface,
  VideoClipTranscriptionInterface,
} from "./staging-interface";
import {
  ProjectInterface,
  stagingFieldsInterface,
  TemplatesFieldValueInterface,
} from "../../interface";
import { CurrentVideoInterface, OnDropFunctionArgs } from "../interface";

import styles from "./index.module.scss";

const Staging: React.FC<StagingInterface> = ({ handleClipClicks, handleUpdateStageField }) => {
  const {
    watch,
    setValue,
    control,
    project,
    register,
    dispatchProject,
    renameVideoClip,
    setRenameVideoClip,
  } = useContext<StagingContextInterface>(CreateProjectContext as unknown);
  const {
    moveMenu,
    isPlaying,
    typeFields,
    wrapperRef,
    setMoveMenu,
    currentTime,
    mergePlayer,
    currentVideo,
    setIsPlaying,
    currentIndex,
    setCurrentTime,
    setMergePlayer,
    setCurrentIndex,
    setCurrentVideo,
    moveMediaToField,
    moveMediaToFieldStaging,
  } = useTemplateTab({ watch, project, dispatchProject });

  const [clickedSide, setClickSide] = useState<string>("");

  const { stagingFields, subClipCurrentTime } = project;

  const initialValue = {
    count: 0,
    newValue: 1,
    stageModal: false,
    fieldStage: stagingFields,
  };
  const [state, dispatch] = useReducer(
    reducer as React.ReducerWithoutAction<unknown>,
    initialValue,
  );

  const stagingFieldId = useMemo(() => {
    if (stagingFields?.length >= 2 && stagingFields[length]?.type === "video") {
      return stagingFields[length + 1]?.id;
    } else {
      return "";
    }
  }, [stagingFields]);

  const fieldRenderers = useFieldRenderers({ styles, clearable: true });

  const { selectedVideoClip, templates, activeTemplateUuid } = project;

  const templateIndex = useMemo(() => {
    if (project) return templates?.findIndex((x) => x?.uuid === activeTemplateUuid);
  }, [templates, activeTemplateUuid, project]);

  const handleClickSide = ({ value }: { value: string }) => {
    setClickSide(value);
  };

  const reorder = ({
    source,
    endIndex,
    startIndex,
    destination,
    sourceDroppableId,
    destinationDroppableId,
  }: {
    source: Array<TemplatesFieldValueInterface>;
    endIndex: number;
    startIndex: number;
    destination: Array<TemplatesFieldValueInterface>;
    sourceDroppableId: number;
    destinationDroppableId: number;
  }) => {
    source = [...source];
    destination = [...destination];
    const [removed] = source.splice(startIndex, 1);
    if (sourceDroppableId === destinationDroppableId) {
      destination.splice(startIndex, 1);
    }
    destination.splice(endIndex, 0, removed);
    return [source, destination];
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceDroppableId = +result.source.droppableId;
    const destinationDroppableId = +result.destination.droppableId;

    const transcriptionSource = stagingFields[sourceDroppableId]?.value?.leftValue;
    const transcriptionDestination = stagingFields[destinationDroppableId]?.value?.leftValue;

    const thumbnailSource = stagingFields[sourceDroppableId - 10]?.value?.rightValue;
    const thumbnailDestination = stagingFields[destinationDroppableId - 10]?.value?.rightValue;

    if (
      clickedSide === "left" &&
      transcriptionSource?.length >= 0 &&
      transcriptionDestination?.length >= 0
    ) {
      const [source, destination] = reorder({
        sourceDroppableId,
        destinationDroppableId,
        startIndex: result.source.index,
        endIndex: result.destination.index,
        source: transcriptionSource || [],
        destination: transcriptionDestination || [],
      });

      if (result.destination)
        if (+result.source.droppableId !== -1 && +result?.destination?.droppableId !== -1) {
          project.stagingFields[sourceDroppableId].value.leftValue = [...source];
          project.stagingFields[destinationDroppableId].value.leftValue = [...destination];
        }
    }

    if (
      clickedSide === "right" &&
      thumbnailSource?.length >= 0 &&
      thumbnailDestination?.length >= 0
    ) {
      const [source, destination] = reorder({
        sourceDroppableId,
        destinationDroppableId,
        startIndex: result.source.index,
        endIndex: result.destination.index,
        source: stagingFields[sourceDroppableId - 10]?.value?.rightValue || [],
        destination: stagingFields[destinationDroppableId - 10]?.value?.rightValue || [],
      });

      if (result.destination)
        if (+result.source.droppableId !== -1 && +result?.destination?.droppableId !== -1) {
          project.stagingFields[sourceDroppableId - 10].value.rightValue = [...source];
          project.stagingFields[destinationDroppableId - 10].value.rightValue = [...destination];
        }
    }

    if ((thumbnailSource?.length >= 0 && thumbnailDestination?.length === undefined) || null) {
      const [source, destination] = reorder({
        sourceDroppableId,
        destinationDroppableId,
        startIndex: result.source.index,
        endIndex: result.destination.index,
        source: project.stagingFields[sourceDroppableId - 10]?.value?.rightValue || [],
        destination: project.stagingFields[destinationDroppableId]?.value?.leftValue || [],
      });

      if (result.destination)
        if (+result.source.droppableId !== -1 && +result?.destination?.droppableId !== -1) {
          project.stagingFields[sourceDroppableId - 10].value.rightValue = [...source];
          project.stagingFields[destinationDroppableId].value.leftValue = [...destination];
        }
    }

    if ((transcriptionSource?.length >= 0 && transcriptionDestination === undefined) || null) {
      const [source, destination] = reorder({
        sourceDroppableId,
        destinationDroppableId,
        startIndex: result.source.index,
        endIndex: result.destination.index,
        source: project.stagingFields[sourceDroppableId]?.value?.leftValue || [],
        destination: project.stagingFields[destinationDroppableId - 10]?.value?.rightValue || [],
      });

      if (result.destination)
        if (+result.source.droppableId !== -1 && +result?.destination?.droppableId !== -1) {
          project.stagingFields[sourceDroppableId].value.leftValue = [...source];
          project.stagingFields[destinationDroppableId - 10].value.rightValue = [...destination];
        }
    }

    dispatchProject({
      type: UpdateProjectEnum.ON_DROP_REORDERING,
      stagingFields: [project.stagingFields],
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevent the default behavior (usually not allowing drops)
    e.preventDefault();
  };

  const dropVideClip = ({
    e,
    side,
    name,
    label,
    project,
    video_data,
    subClipCurrentTime,
  }: {
    e?: React.DragEvent<HTMLDivElement>;
    name: string;
    side?: string;
    video_data: VideoClipTranscriptionInterface;
    label: string | undefined;
    project: ProjectInterface;
    subClipCurrentTime: number | null | undefined;
  }) => {
    const copyProject = { ...project };
    const updatedFields = moveMediaToFieldStaging({
      prev: copyProject?.stagingFields,
      label,
      name,
      side,
      ...video_data,
    });
    let latestDroppedClip;
    if (side === "left") {
      latestDroppedClip = updatedFields
        ?.find((field) => field.name === name)
        ?.value?.leftValue?.at(-1) as TemplatesFieldValueInterface;
    } else {
      latestDroppedClip = updatedFields
        ?.find((field) => field.name === name)
        ?.value?.rightValue?.at(-1) as TemplatesFieldValueInterface;
    }
    dispatchProject({
      type: UpdateProjectEnum.SET_SELECTED_VIDEO_CLIP,
      selectedVideoClip: latestDroppedClip?.id,
    });

    handleClipClicks({
      e: e as React.DragEvent<HTMLDivElement>,
      item: latestDroppedClip || video_data,
      label: label || "",
      name: name || "",
      currentVideoHeadTime: video_data?.startTime && video_data?.endTime && subClipCurrentTime,
    });
  };

  const onDrop = ({ e, label, name, side }: OnDropFunctionArgs) => {
    e?.preventDefault();

    const video_data = JSON.parse(e?.dataTransfer.getData("video_data") || "");
    dropVideClip({
      e,
      project,
      label,
      side,
      name,
      video_data,
      subClipCurrentTime,
    });
  };

  const handleClipDelete = ({
    e,
    item,
    label,
    name,
  }: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent>;
    item: {
      id: string;
      startTime: number;
      endTime: number;
      url: string;
      duration: number;
    };
    label: string | undefined;
    name: string | undefined;
  }) => {
    e.stopPropagation();
    const { id } = item;
    const currentIndex = project?.stagingFields?.findIndex(
      (x) => x?.label === label && x?.name === name,
    );
    if (currentIndex !== -1) {
      const leftFiltered = project?.stagingFields[currentIndex]?.value?.leftValue?.filter(
        (x) => x?.id !== id,
      );
      const rightFiltered = project?.stagingFields[currentIndex]?.value?.rightValue?.filter(
        (x) => x?.id !== id,
      );

      project.stagingFields[currentIndex].value = {
        leftValue: leftFiltered || [],
        rightValue: rightFiltered || [],
      };
    }
    dispatchProject({
      type: UpdateProjectEnum.DELETE_UPDATE_CLIP,
      stagingFields: [...project.stagingFields],
    });

    currentVideo?.id === id && setCurrentVideo({} as CurrentVideoInterface);
  };

  const handleUpdateClipName = ({ e, text }: UpdateClipInterface) => {
    e?.stopPropagation();
    e?.preventDefault();
    const currentIndex = project?.stagingFields?.findIndex(
      (x) => x?.label === renameVideoClip?.label && x?.name === renameVideoClip?.fieldName,
    );
    if (currentIndex !== -1) {
      const leftFiltered = project?.stagingFields[currentIndex]?.value?.leftValue?.find(
        (x) => x && x?.id === renameVideoClip?.clipId,
      );
      const rightFiltered = project?.stagingFields[currentIndex]?.value?.rightValue?.find(
        (x) => x && x?.id === renameVideoClip?.clipId,
      );
      leftFiltered && (leftFiltered.name = text);
      rightFiltered && (rightFiltered.name = text);
    }

    dispatchProject({
      type: UpdateProjectEnum.DELETE_UPDATE_CLIP,
      stagingFields: [...project.stagingFields],
    });

    setRenameVideoClip((prev) => ({
      ...prev,
      isRenameModal: false,
      clipId: "",
      renameText: "",
      fieldName: "",
      label: "",
    }));

    currentVideo?.id === renameVideoClip.clipId && setCurrentVideo({} as CurrentVideoInterface);
  };

  const handleUpdate = ({
    e,
    text,
  }: {
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>;
    text: string;
  }) => {
    e?.stopPropagation();
    e?.preventDefault();
    handleUpdateClipName({ e, text } as UpdateClipInterface);
  };

  const handleDragStart = ({
    e,
    video,
  }: {
    e: React.DragEvent<HTMLDivElement>;
    video: TemplatesFieldValueInterface;
  }) => {
    const duration = formatVideoTime(video?.clipDuration || 0);

    const crt = document.createElement("div");
    crt.id = "drag-player";
    crt.innerHTML = `
    <div class="${styles.dragElementInner}">
    <img src="${video?.thumbnailUrl}" alt="video-thumbnail" />
    <div>
    <span>${duration}</span>
    </div>
    </div>
    `;
    crt.classList.add(styles.dragElement);
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, 0, 0);
    e.dataTransfer.setData("video_data", JSON.stringify(video));
  };

  const handleDragEnd = () => {
    document.getElementById("drag-player")?.remove();
  };

  const hanldeMoveImageToField = ({ label }: { label: string | undefined }) => {
    setMoveMenu && setMoveMenu(label);
  };

  const clickOnFieldFields = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    name: string,
    label: string,
    x: CurrentVideoInterface,
  ) => {
    e.stopPropagation();
    dispatchProject({
      type: UpdateProjectEnum.MOVE_MEDIA_TEMPLATE_FIELDS,
      templateIndex,
      name,
      label,
      _currentVideo: x,
      moveMediaToField,
    });
  };

  const moveImageFilesJSX = () => {
    if (typeFields?.("image")?.length > 0) {
      return (
        <ul className={styles.ul} ref={wrapperRef}>
          {typeFields?.("image")?.map(
            ({ label, name }: { label: string; name: string }, index: number) => {
              return (
                <li
                  aria-hidden="true"
                  key={index}
                  title={label}
                  onClick={(e) => {
                    clickOnFieldFields(e, name, label, state?.moveValue);
                  }}
                >
                  {label}
                </li>
              );
            },
          )}
        </ul>
      );
    }
  };

  const moveAudioFilesJSX = () => {
    if (typeFields?.("audio")?.length > 0) {
      return (
        <ul className={styles.ul} ref={wrapperRef}>
          {typeFields?.("audio")?.map(
            ({ label, name }: { label: string; name: string }, index: number) => {
              return (
                <li
                  aria-hidden="true"
                  key={index}
                  title={label}
                  onClick={(e) => {
                    clickOnFieldFields(e, name, label, state?.moveValue);
                  }}
                >
                  {label}
                </li>
              );
            },
          )}
        </ul>
      );
    }
  };

  const handleEmptyField = ({ index }: { index: number }) => {
    dispatchProject({
      type: UpdateProjectEnum.AUDIO_IMAGE_FIELD_EMPTY,
      index,
    });
  };

  const handleClickOnClip = ({ item, e, label, name }: HandleClipOnClipInterface) => {
    dispatchProject({
      type: UpdateProjectEnum.SET_SELECTED_VIDEO_CLIP,
      selectedVideoClip: item?.id,
    });

    dispatchProject({
      type: UpdateProjectEnum.HANDEL_ALLOW_DRAG_DROP,
      allowDragDrop: true,
    });

    handleClipClicks({
      e,
      item,
      label,
      name,
      templateClip: false,
    });
  };

  useEffect(() => {
    if (state?.fieldStage) {
      handleUpdateStageField({
        stagingFields: state?.fieldStage as stagingFieldsInterface,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.fieldStage]);

  useEffect(() => {
    if (project?.activeTab) {
      setValue("clipToggles", true);
    }
  }, [project?.activeTab, setValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === "n" && project?.activeTab === "stagingTab") {
        e.preventDefault();
        dispatch({ type: types.Open_Modal });
      }
      if (e.key === "Escape") {
        e.preventDefault();
        dispatch({ type: types.Close_Modal });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const toggleData = useMemo(() => {
    return project?.templates?.find(
      (templateData) =>
        templateData?.id === project?.activeTemplateId &&
        templateData?.uuid === project?.activeTemplateUuid,
    )?.fields;
  }, [project]);

  const videoIds = useMemo(() => {
    return toggleData
      ?.filter((field) => field?.type === "video" && Array?.isArray(field?.value))
      ?.flatMap((field) => field?.value?.map((video) => video?.clipId || ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleData, project?.templates]);

  const stagingFieldsResult = useMemo(() => {
    if (!state || !state?.fieldStage) return [];

    return state?.fieldStage?.map(
      ({
        id,
        name,
        type,
        label,
        value = [],
        fieldLabel = "",
        render = fieldRenderers[type as never],
      }: {
        id: string;
        name: string;
        type: string;
        label: string;
        value: [];
        fieldLabel: string;
        render: string;
      }) => {
        const leftFilter = value?.leftValue?.filter((video) => !videoIds?.includes(video?.clipId));
        const rightFilter = value?.rightValue?.filter(
          (video) => !videoIds?.includes(video?.clipId),
        );

        const cardValueLeft = watch("clipToggles") ? value?.leftValue : leftFilter;
        const cardValueRight = watch("clipToggles") ? value?.rightValue : rightFilter;

        return {
          id,
          name,
          type,
          label,
          value,
          render,
          fieldLabel,
          cardValueLeft,
          cardValueRight,
        };
      },
    );
  }, [state, fieldRenderers, watch, videoIds]);

  return (
    <div
      className={`${styles.StagingContainer} ${
        project?.activeTab !== "stagingTab" ? styles.stagingHeight : ""
      }`}
    >
      <div className={styles.StagingHeader}>
        <h4>Staging Section</h4>
        <div className={styles.toggleButtonContainer}>
          {project?.activeTab === "stagingTab" && (
            <Button
              className={styles.btnClassName}
              iconSize={{ width: 17, height: 17 }}
              icon={addStageIcons}
              tooltip={"Select the Field"}
              handleClick={() => dispatch({ type: types.Open_Modal })}
            />
          )}
          {project?.activeTemplateUuid && project?.activeTab !== "stagingTab" && (
            <Switch
              control={control}
              defaultValue={false}
              name={"clipToggles"}
              label={watch("clipToggles") ? "All SubClips" : "un-Used SubClip"}
              mainClass={styles.switch}
            />
          )}
        </div>
      </div>
      <div
        className={` ${
          project?.activeTab === "stagingTab" ? styles.stagingBody : styles.stagingBox
        }`}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {stagingFieldsResult?.map(
            (
              { id, name, type, label, value, fieldLabel, render, cardValueLeft, cardValueRight },
              index,
            ) => {
              return (
                <div key={index} className={styles.field}>
                  {render &&
                    (render({
                      index,
                      label,
                      name,
                      selectedFieldName: name || "",
                      videoFieldClass: styles.videoField as React.CSSProperties,
                      moveImageFilesJSX: (moveMenu as unknown) === label && moveImageFilesJSX,
                      hanldeMoveImageToField: () => {
                        hanldeMoveImageToField({ label });
                        dispatch({ type: types.Set_Label_Name, name, label, moveValue: value });
                      },
                      moveAudioFilesJSX: (moveMenu as unknown) === label && moveAudioFilesJSX,
                      handleMoveAudioToField: () => {
                        hanldeMoveImageToField({ label });
                        dispatch({ type: types.Set_Label_Name, name, label, moveValue: value });
                      },
                      templateTab:
                        project?.activeTab === "templateTab" &&
                        typeFields?.(type as string)?.length > 0
                          ? true
                          : false,
                      deleteStageIcon: project?.activeTab === "stagingTab" && deleteStageIcon,
                      stagImageEmpty: true,
                      handleClose: () => handleEmptyField({ index }),
                      handleDelete: () => {
                        dispatch({ type: types.Delete_Field, delete_id: id });
                      },
                      value:
                        type === "video" ? (
                          <StagingVideoField
                            fieldId={id}
                            name={name}
                            type={type}
                            index={index}
                            value={value}
                            label={label}
                            onDrop={onDrop}
                            project={project}
                            onDragOver={onDragOver}
                            clickedSide={clickedSide}
                            cardValueLeft={cardValueLeft}
                            handleDragEnd={handleDragEnd}
                            cardValueRight={cardValueRight}
                            stagingFieldId={stagingFieldId}
                            handleClickSide={handleClickSide}
                            handleDragStart={handleDragStart}
                            handleClipDelete={handleClipDelete}
                            selectedVideoClip={selectedVideoClip}
                            handleClickOnClip={handleClickOnClip}
                            setRenameVideoClip={setRenameVideoClip}
                          />
                        ) : ["image", "audio"].includes(type as string) ? (
                          (fieldLabel = (value && value?.[value.length - 1]?.name) || fieldLabel)
                        ) : type === "number" ? (
                          +value
                        ) : type === "user" ? (
                          value
                        ) : (
                          value
                        ),
                      control,
                      register,
                    }) as React.ReactNode)}
                </div>
              );
            },
          )}
        </DragDropContext>
      </div>
      {state?.stageModal && (
        <StagingModal
          setValue={setValue}
          dispatch={dispatch}
          stageModal={state?.stageModal}
          control={control}
          stagingFields={state?.fieldStage}
        />
      )}
      <Modal
        {...{
          open: mergePlayer?.mergePlayerOpen === true,
          handleClose: () =>
            setMergePlayer({
              mergePlayerOpen: false,
              label: "",
              name: "",
            }),
        }}
      >
        <VideoPlayer
          {...{
            isPlaying,
            currentTime,
            currentIndex,
            setIsPlaying,
            setCurrentTime,
            setCurrentIndex,
            videos:
              stagingFields.find(
                (x) => x.label === mergePlayer?.label && x.name === mergePlayer?.name,
              )?.value || [],
          }}
        />
      </Modal>
      {renameVideoClip?.isRenameModal && (
        <RenameClipModal
          clipName={renameVideoClip?.renameText}
          handleUpdate={handleUpdate}
          stagingFields={project?.stagingFields}
          setRenameVideoClip={setRenameVideoClip}
          isRenameModal={renameVideoClip?.isRenameModal}
        />
      )}
    </div>
  );
};

export default Staging;
