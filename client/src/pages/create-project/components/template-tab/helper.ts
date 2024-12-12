import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";

import useFieldRenderers from "@/components/project-field-render-hook";

import createNotification from "@/common/create-notification";
import { apiRequest, useOutsideClickHook } from "@/utils/helper";
import { getTemplateById, getTemplateFields } from "@/api-services/templates";
import {
  loadingDefaultValues,
  playerDefaultValues,
  mergePlayerDefaultValue,
} from "../../services/helper";
import { UpdateProjectEnum } from "@/context/create-project/types";

import {
  MergePlayerInterface,
  PlayerInterface,
  useTemplateTabPropsInterface,
  VariablesInterface,
  VariablesValueToMergeInterface,
} from "../../interface";
import {
  CurrentVideoInterface,
  LoadingStateInterface,
  MoveMediaToFieldFunctionArgs,
} from "../interface";
import { TemplateResponseFieldsInterface } from "@/interface/template-interface";
import { FieldRenderers } from "@/components/project-field-render-hook/interface";

import styles from "../../index.module.scss";

export const useTemplateTab = ({
  watch,
  prefix,
  project,
  dispatchProject,
}: useTemplateTabPropsInterface) => {
  const { id = "" } = useParams<{ id: string }>();

  const wrapperRef = useRef<HTMLUListElement>(null);
  const fieldRenderers = useFieldRenderers({ styles });

  const [player, setPlayer] = useState<PlayerInterface>({
    ...playerDefaultValues,
  });
  const [moveMenu, setMoveMenu] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [fieldName, setFieldName] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [mergePlayer, setMergePlayer] = useState<MergePlayerInterface>({
    ...mergePlayerDefaultValue,
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<CurrentVideoInterface>(
    {} as CurrentVideoInterface,
  );
  const [loading, setLoading] = useState<LoadingStateInterface>({
    ...loadingDefaultValues,
  });
  const { ssJson, finalVideo } = loading;

  const {
    activeTemplateId,
    templates = [],
    templatesData,
    activeTemplateUuid,
    templateStyleIds,
    templateThemeIds,
    selectedFieldName,
    themesData,
    stagingFields,
  } = project;

  const { templateFields, currentTemplateIndex, templateId, themesOptions } = useMemo(() => {
    const templateFields = templates?.find((x) => x?.uuid === activeTemplateUuid)?.fields || [];
    const currentTemplateIndex = templates?.findIndex((x) => x?.uuid === activeTemplateUuid);
    const templateId = templateStyleIds?.find((x) => x?.uuid === activeTemplateUuid);
    const themesOptions = themesData?.map((x) => ({
      label: x.themeName,
      value: x._id,
    }));

    return {
      templateId,
      themesOptions,
      templateFields,
      currentTemplateIndex,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const currentTemplate = templatesData?.find(
    (x) => x?._id === activeTemplateId || x?.uuid === activeTemplateUuid,
  );
  const templeStylesOptions = useMemo(() => {
    return currentTemplate?.templateStyles?.map((x) => ({
      label: x.name,
      value: x._id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTemplateUuid, currentTemplate, templatesData, activeTemplateId]);

  useOutsideClickHook(wrapperRef, () => {
    setMoveMenu(false);
  });

  useEffect(() => {
    activeTemplateUuid &&
      getTemplate({
        templateIdsFieldsAndUUid: {
          templateId: activeTemplateId || "",
          fields: !templates.find((x) => x?.uuid === activeTemplateUuid) || false,
          uuid: activeTemplateUuid,
        },
        getTemplateData: !templatesData.find((x) => x?._id === activeTemplateId),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTemplateId, activeTemplateUuid]);

  const typeFields = (fileType: string) => templateFields?.filter(({ type }) => type === fileType);
  const stageTypeFields = (fileType: string) =>
    stagingFields?.filter(({ type }) => type === fileType);

  const handleGetTemplateFields = async (templateId: string, uuid: string) => {
    setLoading((prev) => ({ ...prev, templateFields: true }));
    const res: unknown = await getTemplateFields({ templateId });
    if (res) {
      const fieldValues = res && Object.values(res);
      if (fieldValues.length) {
        const currentTemplateDataIndex = templatesData.length - 1;
        const keys = Object.keys(res);
        const copyProject = { ...project };
        copyProject.templatesData[currentTemplateDataIndex].fields = JSON.stringify(res);

        const fields = fieldValues
          ?.filter((x: TemplateResponseFieldsInterface) =>
            Object.keys(fieldRenderers).includes(x?.type as keyof FieldRenderers),
          )
          ?.map((x: TemplateResponseFieldsInterface, index: number) => ({
            ...x,
            name: keys[index],
            value: "",
            fieldLabel: "",
            render: fieldRenderers[x?.type as keyof FieldRenderers],
          }));

        copyProject.templates.push({
          id: templateId,
          fields,
          uuid,
        });
        dispatchProject({
          type: UpdateProjectEnum.GET_TEMPLATE_FIELD,
          payload: { ...copyProject },
        });
      }
    }
    setLoading((prev) => ({ ...prev, templateFields: false }));
  };

  const prepareVars = () => {
    const variables: VariablesInterface = {};

    variables["videosToMerge"] = variables?.videosToMerge || {};

    templateFields
      ?.filter((x) => x.type === "video" && Array.isArray(x.value) && x.value.length > 0)
      ?.forEach(({ name, value }) => {
        variables.videosToMerge[name] = (value?.map(({ name = "", s3Key, startTime, endTime }) => {
          return {
            name,
            s3Key,
            startTime: startTime === 0 ? 0.3 : Math.round(startTime * 100) / 100,
            endTime: Math.round(endTime * 100) / 100,
            duration: Math.round((endTime - startTime) * 100) / 100,
          };
        }) || []) as Array<VariablesValueToMergeInterface>;
      });
    templateFields
      ?.filter((x) => x.type !== "video" && x.value)
      ?.forEach(({ name, value }) => {
        variables[name] = value;
      });

    templateFields
      ?.filter((x) => x.type === "image")
      ?.forEach(({ name, value }) => {
        variables[name] = value?.[value.length - 1]?.url;
      });

    return variables;
  };

  const generateUpdateSSJson = async () => {
    setLoading((prev) => ({ ...prev, ssJson: true }));
    const variables = prepareVars();

    const res = await apiRequest({
      type: "post",
      path: `/project/generateMergeBlockFields`,
      body: {
        templateId: activeTemplateId,
        variables,
        projectId: id,
        templateUuid: activeTemplateUuid,
        templateStyleId: templateId?.templateStyleId,
        templateThemeId: templateThemeIds && templateThemeIds,
      },
    });

    if (res.status === 200) {
      dispatchProject({
        type: UpdateProjectEnum.SSJSON_MODAL_DATA,
        payload: {
          ssJson: res.data,
          templates: project.templates?.map((template, index) =>
            index === currentTemplateIndex ? { ...template, ssJson: res.data } : template,
          ),
        },
      });
      setLoading((prev) => ({ ...prev }));
    } else {
      createNotification(
        "error",
        res?.data?.msg ||
          res?.response?.data?.msg + " " + res?.data?.pythonFile ||
          "Failed to generate update SSJson.",
        15000,
      );
      dispatchProject({
        type: UpdateProjectEnum.SSJSON_MODAL_DATA,
        payload: {
          mailBox: true,
          isJsonLoad: false,
          ssJsonModal: res?.data?.pythonFile || res?.response?.data?.pythonFile,
        },
      });
    }
    setLoading((prev) => ({ ...prev, ssJson: false }));
    dispatchProject({
      type: UpdateProjectEnum.SSJSON_FINALMODAL_IS_JSONLOAD,
      payload: {
        isJsonLoad: false,
        ssJsonFinalModal: true,
      },
    });
  };

  const renderVideo = async (finalFileName: string) => {
    setLoading((prev) => ({ ...prev, finalVideo: true }));
    const variables = prepareVars();

    const res = await apiRequest({
      type: "post",
      path: `/project/renderTemplateVideo`,
      body: {
        id,
        variables,
        finalFileName,
        templateId: activeTemplateId,
        templateUuid: activeTemplateUuid,
        templateThemeId: templateThemeIds,
        templateStyleId: templateId?.templateStyleId,
        resolution: watch("mySwitch") ? "1080" : "sd",
        quality: watch("mySwitch") ? "high" : "medium",
      },
      config: { timeout: 1000 * 60 * 5 }, // 10 minutes
    });
    if (res.status === 200) {
      dispatchProject({ type: UpdateProjectEnum.SET_FINAL_VIDEO, payload: res.data.finalVideos });
    } else {
      createNotification("error", res?.data?.msg || "Failed to generate update SSJson.", 20000);
    }
    setLoading((prev) => ({ ...prev, finalVideo: false }));
  };

  const moveMediaToField = ({
    prev,
    name,
    id,
    label,
    _currentVideo,
    startTime,
    endTime,
  }: MoveMediaToFieldFunctionArgs) => {
    const currentIndex = prev?.findIndex(
      (x) => x?.label === label && x?.name === (name ? name : selectedFieldName),
    );

    if (currentIndex !== -1) {
      if (!prev?.[currentIndex]?.value?.length) {
        prev[currentIndex].value = [];
      }
      const clip = {
        ..._currentVideo,
        id: id || Math?.random()?.toString(),
        startTime,
        endTime,
        clipDuration: Math?.round((endTime - startTime) * 100) / 100,
      };
      prev[currentIndex].fieldLabel = _currentVideo?.label;

      if (id) {
        const elementIndex = prev[currentIndex]?.value?.findIndex((x) => {
          return x?.id === id;
        });

        prev[currentIndex].value[elementIndex] = clip;
      } else if (prev[currentIndex]?.type === "image") {
        prev[currentIndex].value = [];
        prev[currentIndex]?.value?.push(clip);
      } else {
        prev[currentIndex]?.value?.push(clip);
      }
    }

    return [...prev];
  };

  const moveMediaToFieldStaging = ({
    prev,
    name,
    id,
    label,
    _currentVideo,
    startTime,
    endTime,
    side,
  }: MoveMediaToFieldFunctionArgs) => {
    const currentIndex = prev?.findIndex(
      (x) => x?.label === label && x?.name === (name ? name : selectedFieldName),
    );

    if (currentIndex !== -1) {
      if (!prev?.[currentIndex]?.value && !prev[currentIndex]?.type === ("video" as string)) {
        prev[currentIndex].value = [];
      }
      if (!prev?.[currentIndex]?.value && prev[currentIndex]?.type === "video") {
        prev[currentIndex].value = [];
        prev[currentIndex].value = {
          leftValue: [],
          rightValue: [],
        };
      }

      if (!prev[currentIndex]?.value?.leftValue && prev[currentIndex]?.type === "video") {
        prev[currentIndex].value = {
          leftValue: [],
          rightValue: prev[currentIndex]?.value?.rightValue || [], // Preserve rightValue if it exists
        };
      }

      if (!prev[currentIndex]?.value?.rightValue && prev[currentIndex]?.type === "video") {
        prev[currentIndex].value = {
          leftValue: prev[currentIndex]?.value?.leftValue || [], // Preserve leftValue if it exists
          rightValue: [],
        };
      }

      const clip = {
        ..._currentVideo,
        id: id || Math?.random()?.toString(),
        clipId: Math?.random()?.toString(),
        startTime,
        side,
        endTime,
        clipDuration: Math?.round((endTime - startTime) * 100) / 100,
      };

      prev[currentIndex].fieldLabel = _currentVideo?.label;

      if (side === "left" && prev[currentIndex]?.type === "video") {
        prev[currentIndex]?.value?.leftValue?.push(clip);
      } else if (side === "right" && prev[currentIndex]?.type === "video") {
        prev[currentIndex]?.value?.rightValue.push(clip);
      } else if (prev[currentIndex]?.type === "image") {
        prev[currentIndex].value = [clip];
      } else {
        prev[currentIndex]?.value?.push(clip);
      }
    }

    return [...prev];
  };

  const getTemplate = async (args: {
    templateIdsFieldsAndUUid: {
      templateId: string;
      fields: boolean;
      uuid: string;
    };
    getTemplateData: boolean;
  }) => {
    const { templateIdsFieldsAndUUid, getTemplateData } = args;
    const { templateId, fields, uuid } = templateIdsFieldsAndUUid;

    if (getTemplateData) {
      const res = await getTemplateById({ templateId });
      if (res) {
        dispatchProject({
          type: UpdateProjectEnum.ADD_TEMPLATE_DATA,
          payload: {
            templatesData: [...project.templatesData, { ...res }],
          },
        });
      }
    }
    fields && handleGetTemplateFields(templateId, uuid);
  };

  return {
    id,
    ssJson,
    prefix,
    player,
    loading,
    moveMenu,
    setPlayer,
    isPlaying,
    fieldName,
    finalVideo,
    typeFields,
    wrapperRef,
    setLoading,
    setMoveMenu,
    currentTime,
    mergePlayer,
    renderVideo,
    setIsPlaying,
    themesOptions,
    currentVideo,
    currentIndex,
    setFieldName,
    setCurrentTime,
    setMergePlayer,
    stageTypeFields,
    setCurrentIndex,
    setCurrentVideo,
    moveMediaToField,
    templeStylesOptions,
    generateUpdateSSJson,
    moveMediaToFieldStaging,
  };
};
