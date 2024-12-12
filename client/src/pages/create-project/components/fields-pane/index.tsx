import { v4 as uuidV4 } from "uuid";
import React, { Context, useContext, useEffect, useMemo, useRef } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import Modal from "@/components/modal";
import Loading from "@/components/loading";
import RenameClipModal from "../rename-clip-modal";
import VideoPlayer from "@/components/video-player";
import SelectBox from "@/components/multi-select-box";
import TemplateVideoFields from "./template-video-fields";

import { getFullNameByFirstNLastName } from "@/common/index";
import createNotification from "@/common/create-notification";
import { UpdateProjectEnum } from "@/context/create-project/types";
import { CreateProjectContext } from "@/context/create-project/index";
import { getAllTemplates, getTemplateById, getTemplateFields } from "@/api-services/templates";

import playIcon from "@/assets/playCircle.png";

import {
  TemplatesDataInterface,
  TemplateOptionsInterface,
  TemplatesFieldValueInterface,
} from "../../interface";
import {
  OnDropFunctionArgs,
  FieldContextInterface,
  CurrentVideoInterface,
  FieldsPanePropsInterface,
} from "../interface";
import { UpdateClipInterface } from "../staging/staging-interface";
import { ContextValueObjectInterface } from "@/context/create-project/context-interface";

import styles from "./index.module.scss";

const FieldsPane: React.FC<FieldsPanePropsInterface> = ({
  loading,
  isPlaying,
  currentTime,
  mergePlayer,
  currentIndex,
  themesOptions,
  currentVideo,
  setIsPlaying,
  setMergePlayer,
  setCurrentTime,
  setCurrentIndex,
  setCurrentVideo,
  moveMediaToField,
  handleClipClicks,
  templeStylesOptions,
}) => {
  const {
    reset,
    watch,
    control,
    project,
    register,
    renameVideoClip,
    dispatchProject,
    setRenameVideoClip,
  } = useContext<FieldContextInterface>(
    CreateProjectContext as Context<ContextValueObjectInterface>,
  );

  const {
    isOpen,
    showField,
    clientUsers,
    templatesData,
    templates = [],
    templateOptions,
    templateThemeIds,
    templateStyleIds,
    selectedVideoClip,
    selectedFieldName,
    selectedTemplates,
    activeTemplateUuid,
    subClipCurrentTime,
  } = project;

  const templateIndex = templates?.findIndex((x) => x?.uuid === activeTemplateUuid);
  const currentTemplate = templates?.[templateIndex] || "";
  const templateFields = currentTemplate?.fields || [];
  const currentTemplateData = templatesData.find((x) => x._id === currentTemplate.id);

  // a little function to help us with reordering the result

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
    const [source, destination] = reorder({
      sourceDroppableId,
      destinationDroppableId,
      startIndex: result.source.index,
      endIndex: result.destination.index,
      source: templateFields[sourceDroppableId].value,
      destination: templateFields[destinationDroppableId].value,
    });

    if (result.destination)
      if (+result.source.droppableId !== -1 && +result?.destination?.droppableId !== -1) {
        project.templates[templateIndex].fields[sourceDroppableId].value = [...source];
        project.templates[templateIndex].fields[destinationDroppableId].value = [...destination];
      }

    dispatchProject({
      type: UpdateProjectEnum.MEDIA_DROP_TO_FIELD_AND_DELETE,
      templates: project.templates,
    });
  };

  const getSimilarTemplates = async (currentTemplateData: TemplatesDataInterface) => {
    await getAllTemplates({
      params: {
        // sets template family code length to first 3 letters
        prefix: currentTemplateData?.templateName?.slice(0, 3),
        selectBox: true,
      },
      setTemplates: (data: unknown) => {
        project.templates[templateIndex].similarTemplates =
          data &&
          data?.filter((x: unknown) => !selectedTemplates?.map((x) => x?.value)?.includes(x.value));
        dispatchProject({ type: UpdateProjectEnum.SET_PROJECT, payload: [project] });
      },
    });
  };

  const handlePlay = (label: string, name: string) => {
    setCurrentTime(0);
    setCurrentIndex(0);
    setMergePlayer((prev) => ({ ...prev, mergePlayerOpen: true, label, name }));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevent the default behavior (usually not allowing drops)
    e.preventDefault();
  };

  const onDrop = ({ e, label, name }: OnDropFunctionArgs) => {
    e?.preventDefault();
    const video_data = JSON.parse(e?.dataTransfer.getData("video_data") || "");

    project.templates[templateIndex].fields = moveMediaToField({
      prev: project?.templates[templateIndex].fields,
      label,
      name,
      startTime: video_data?.startTime,
      endTime: video_data?.endTime,
      _currentVideo: video_data?._currentVideo || { ...video_data },
    });
    const latestDroppedClip = project.templates[templateIndex].fields
      ?.find((field) => field.name === name)
      ?.value?.at(-1) as TemplatesFieldValueInterface;

    handleClipClicks({
      e: e as React.DragEvent<HTMLDivElement>,
      item: latestDroppedClip || video_data,
      label: label || "",
      name: name || "",
      templateClip: true,
      currentVideoHeadTime: !video_data?.clipDuration && subClipCurrentTime,
    });
    dispatchProject({
      type: UpdateProjectEnum.HANDEL_ALLOW_DRAG_DROP,
      allowDragDrop: false,
    });
    dispatchProject({
      type: UpdateProjectEnum.MEDIA_DROP_TO_FIELD_AND_DELETE,
      templates: project?.templates,
      selectedVideoClip: latestDroppedClip?.id,
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
    label: string;
    name: string;
  }) => {
    e.stopPropagation();
    const { id } = item;
    const currentIndex = project?.templates[templateIndex]?.fields?.findIndex(
      (x) => x?.label === label && x?.name === name,
    );
    if (currentIndex !== -1) {
      project.templates[templateIndex].fields[currentIndex].value = project?.templates[
        templateIndex
      ]?.fields[currentIndex]?.value?.filter((x) => x?.id !== id);
    }
    dispatchProject({
      type: UpdateProjectEnum.MEDIA_DROP_TO_FIELD_AND_DELETE,
      templates: [...project.templates],
    });
    currentVideo?.id === id && setCurrentVideo({} as CurrentVideoInterface);
  };

  const handleUpdateClipName = ({ e, text }: UpdateClipInterface) => {
    e?.stopPropagation();
    const currentIndex = project?.templates[templateIndex]?.fields?.findIndex(
      (x) => x?.label === renameVideoClip?.label && x?.name === renameVideoClip?.fieldName,
    );
    if (currentIndex !== -1) {
      const videoClipToRename = project?.templates[templateIndex]?.fields[
        currentIndex
      ]?.value?.find((x) => x && x?.id === renameVideoClip?.clipId);

      videoClipToRename && (videoClipToRename.name = text);
    }

    dispatchProject({
      type: UpdateProjectEnum.MEDIA_DROP_TO_FIELD_AND_DELETE,
      templates: [...project.templates],
    });

    setRenameVideoClip((prev) => ({
      ...prev,
      isRenameModal: false,
      clipId: "",
      renameText: "",
      fieldName: "",
      label: "",
    }));
  };

  const handleCallRename = ({
    e,
    text,
  }: {
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>;
    text: string;
  }) => {
    handleUpdateClipName({ e, text } as UpdateClipInterface);
  };

  const selectTemplateHandler = ({ value, label, description }: TemplateOptionsInterface) => {
    const uuid = uuidV4();
    const newSelected = { value, label, description, uuid };
    return newSelected;
  };

  const handleSimilarTemplateChange = async (templateId: string) => {
    if (templateId !== null) {
      const [res, fieldsRes] = await Promise.all([
        getTemplateById({ templateId }),
        getTemplateFields({ templateId }),
      ]);
      if (res && fieldsRes) {
        const fieldsStringified = JSON.stringify(fieldsRes);
        if (fieldsStringified) {
          const selectedTemplate =
            templateOptions?.find(({ value }) => value === templateId) ||
            ({} as TemplateOptionsInterface);
          const selectTemplate = selectTemplateHandler(selectedTemplate);
          reset({
            ...watch,
            templateIds: [...selectedTemplates, selectTemplate]?.map((x) => {
              return { templateId: x?.value, uuid: x?.uuid };
            }),
            similarTemplate: undefined,
          });

          dispatchProject({
            type: UpdateProjectEnum.SIMILAR_TEMPLATE_CHANGE,
            payload: {
              res,
              fieldsStringified,
              selectTemplate,
              templateFields,
            },
          });
        } else {
          createNotification("error", "Similar template fields don't match.", 5000);
        }
      }
    }
  };

  const handleTemplateStyleId = (templateStyleId: string) => {
    dispatchProject({
      type: UpdateProjectEnum.UPDATE_TEMPLATE_STYLE,
      templateStyleId,
      activeTemplateUuid,
    });
  };

  const templateResults = useMemo(() => {
    return (templateStyleIds || [])
      ?.map((templateId) => {
        const foundObject = templeStylesOptions?.find(
          (obj) =>
            obj?.value === templateId?.templateStyleId && templateId?.uuid === activeTemplateUuid,
        );
        return foundObject ? foundObject.value : "0";
      })
      ?.filter((x) => x !== "0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateStyleIds, templeStylesOptions]);

  const handleSetThemesId = (themeId: string) => {
    dispatchProject({
      type: UpdateProjectEnum.SET_THEMES_ID,
      templateThemeIds: themeId,
    });
  };

  const themeDefaultValue = useMemo(() => {
    return themesOptions?.find((x) => templateThemeIds?.includes(x?.value)) || "";
  }, [themesOptions, templateThemeIds]);

  const templateDefaultValue = useMemo(() => {
    return templeStylesOptions?.find((x) => templateResults?.includes(x?.value)) || "";
  }, [templeStylesOptions, templateResults]);

  useEffect(() => {
    currentTemplate && currentTemplateData && getSimilarTemplates(currentTemplateData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templatesData, currentTemplate, currentTemplateData]);

  const handleEmptyField = ({ index }: { index: number }) => {
    dispatchProject({
      type: UpdateProjectEnum.SET_TEMPLATE_FIELD,
      index,
      templateIndex,
      inputTextValue: "",
    });
  };

  const handleNumberField = ({
    inputNumberValue,
    index,
  }: {
    inputNumberValue: number;
    index: number;
  }) => {
    dispatchProject({
      type: UpdateProjectEnum.ENTER_NUMBER_TEMPLATE_FIELD,
      index,
      templateIndex,
      inputNumberValue,
    });
  };

  const handleTextField = ({
    inputvalue,
    index,
    selectedOption,
  }: {
    inputvalue?: string;
    selectedOption?: string;
    index: number;
  }) => {
    dispatchProject({
      type: UpdateProjectEnum.SET_TEMPLATE_FIELD,
      index,
      templateIndex,
      inputTextValue: inputvalue || selectedOption,
    });
  };

  return (
    <>
      <div className={styles.form2Wrapper}>
        <div className={styles.fieldsBox}>
          <div className={styles.field}>
            <SelectBox
              name="similarTemplate"
              placeholder="Select Template To Replace"
              mediaOption={true}
              control={control}
              options={currentTemplate.similarTemplates || []}
              handleChange={async (value) => handleSimilarTemplateChange(value as string)}
            />
          </div>
          <div className={styles.field}>
            <SelectBox
              mediaOption={true}
              name="templateStyleId"
              placeholder="Select Style"
              control={control}
              isClearable={true}
              defaultValue={templateDefaultValue}
              handleChange={() => handleTemplateStyleId(watch("templateStyleId"))}
              options={templeStylesOptions || []}
            />
          </div>
          <div className={styles.field}>
            <SelectBox
              mediaOption={true}
              name="templateThemeId"
              placeholder="Select Theme"
              isClearable
              control={control}
              defaultValue={themeDefaultValue}
              handleChange={() => handleSetThemesId(watch("templateThemeId"))}
              options={themesOptions || []}
            />
          </div>
        </div>
        <div className={styles.form2}>
          {loading?.templateFields ? (
            <div className={styles.templateFieldsLoader}>
              <Loading />
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              {templateFields?.map(
                ({ name, type, render, label, options, fieldLabel = "", value }, index) => {
                  return (
                    <div
                      key={index}
                      className={styles.field}
                      {...(type === "video" && {
                        onDragOver,
                        onDrop: (e) => {
                          onDrop({
                            e,
                            label,
                            name,
                          });
                        },
                      })}
                    >
                      {render &&
                        (render({
                          index,
                          label,
                          options,
                          name,
                          project,
                          isOpen,
                          showField,
                          selectedFieldName: selectedFieldName || "",
                          videoFieldClass: styles.videoField as React.CSSProperties,
                          handlePlay: () => handlePlay(label, name),
                          handleNumberField: (inputNumberValue: number) =>
                            handleNumberField({ index, inputNumberValue }),
                          handleTextInputField: (inputvalue: string) =>
                            handleTextField({ index, inputvalue }),
                          handleSelectOption: (selectedOption: string | undefined) =>
                            handleTextField({ index, selectedOption }),
                          handleSelectOptions: (selectedOption: string | undefined) =>
                            handleTextField({ index, selectedOption }),
                          handleClose: () => handleEmptyField({ index }),
                          playIcon: value?.length > 0 && playIcon,
                          value:
                            type === "video" ? (
                              <TemplateVideoFields
                                name={name}
                                value={value}
                                index={index}
                                label={label}
                                dispatchProject={dispatchProject}
                                handleClipClicks={handleClipClicks}
                                handleClipDelete={handleClipDelete}
                                selectedVideoClip={selectedVideoClip}
                                setRenameVideoClip={setRenameVideoClip}
                              />
                            ) : ["image", "audio"].includes(type) ? (
                              (fieldLabel =
                                (value && value?.[value.length - 1]?.name) || fieldLabel)
                            ) : type === "number" ? (
                              +value
                            ) : type === "user" ? (
                              value
                            ) : (
                              value
                            ),
                          usersList: clientUsers?.map((x) => ({
                            value: x?._id,
                            label: `${getFullNameByFirstNLastName(x)}`,
                          })),
                          control,
                          register,
                        }) as React.ReactNode)}
                    </div>
                  );
                },
              )}
            </DragDropContext>
          )}
        </div>
      </div>

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
              templateFields.find(
                (x) => x.label === mergePlayer?.label && x.name === mergePlayer?.name,
              )?.value || [],
          }}
        />
      </Modal>

      {renameVideoClip?.isRenameModal && (
        <RenameClipModal
          handleUpdate={handleCallRename}
          clipName={renameVideoClip?.renameText}
          stagingFields={project?.stagingFields}
          setRenameVideoClip={setRenameVideoClip}
          isRenameModal={renameVideoClip?.isRenameModal}
        />
      )}
    </>
  );
};

export default FieldsPane;
