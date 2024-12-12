import { ProjectInterface } from "@/pages/create-project/interface";
import { UpdateProjectEnum } from "./types";
import { UpdateProjectAction } from "./context-interface";

export function projectReducer(state: ProjectInterface, action: UpdateProjectAction) {
  const {
    type,
    payload,
    templateStyleId,
    activeTemplateUuid,
    index,
    templateIndex,
    inputNumberValue,
    inputTextValue,
  } = action;
  const updatedStagingFields = [...(state?.stagingFields || [])];
  const templateEmptyFields = [...(state?.templates || [])];

  switch (type) {
    case UpdateProjectEnum.SET_PROJECT:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.UPDATE_MEDIA_LIST:
      return {
        ...state,
        mediaList: payload,
      };
    case UpdateProjectEnum.ADD_ALBUM_ID:
      return {
        ...state,
        albumId: action?.albumId,
      };
      break;
    case UpdateProjectEnum.CLOSE_TEMPLATE:
      return {
        ...state,
        ssJson: null,
        isOpen: false,
        clickClip: null,
        showField: null,
        clickMediaColor: null,
        activeTemplateId: "",
        selectedFieldName: "",
        activeTemplateUuid: "",
      };
      break;
    case UpdateProjectEnum.SELECT_TEMPLATE_HANDLER:
      return {
        ...state,
        selectedTemplates: payload,
        templatesData: payload,
      };
      break;
    case UpdateProjectEnum.CLICK_ON_SELECTED_TEMPLATE:
      return {
        ...state,
        ssJson: action?.ssJson,
        isOpen: false,
        selectedFieldName: null,
        clickMediaColor: action?.clickMediaColor,
        activeTemplateId: action?.activeTemplateId,
        activeTemplateUuid: action?.activeTemplateUuid,
        activeTemplateIndex: action?.activeTemplateIndex,
      };
      break;
    case UpdateProjectEnum.DELETE_SELECTED_TEMPLATE:
      return {
        ...state,
        ssJson: action?.ssJson,
        templates: action?.templates,
        activeTemplateId: action?.activeTemplateId,
        activeTemplateUuid: action?.activeTemplateUuid,
        selectedTemplates: action?.selectedTemplates,
        templatesData: action?.templatesData,
        templateStyleIds: action?.templateStyleIds,
      };
      break;
    case UpdateProjectEnum.ASSEMBLY_HANDLE_EVENT:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.STAGEING_HANDLE_EVENT:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.TEMPLATE_HANDLE_EVENT:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.CANCEL_ACTIVE_TEMPLATEID:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.HANDLE_SELECTION_CLEAR:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.HANDLE_SELECTED_VIDEO_CLIP:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.HANDLE_EMPTY_VIDEOPLAYER_CLICKEVENT:
      return {
        ...state,
        clickClip: null,
        selectionClear: true,
        clickMediaColor: null,
        selectedVideoClip: null,
      };
      break;
    case UpdateProjectEnum.SET_CLIP_PROJECT:
      return {
        ...state,
        clickClip: 1,
        clickMediaColor: null,
        templateClip: action?.templateClip,
        selectedFieldName: action?.selectedFieldName,
      };
      break;
    case UpdateProjectEnum.IS_JSONLOAD_LOADING:
      return {
        ...state,
        isJson: payload,
      };

      break;
    case UpdateProjectEnum.SS_JSON:
      return {
        ...state,
        ssJson: payload,
      };
      break;
    case UpdateProjectEnum.IS_SSJSON_FINAL_MODAL:
      return {
        ...state,
        ssJsonFinalModal: action?.ssJsonFinalModal,
      };
      break;
    case UpdateProjectEnum.IS_JSONLOAD:
      return {
        ...state,
        isJsonLoad: payload,
      };
      break;
    case UpdateProjectEnum.HANDLE_UPDATE_PROJECTDATA:
      return {
        ...state,
        projectName: payload,
      };
      break;
    case UpdateProjectEnum.SET_SELECTED_VIDEO_CLIP:
      return {
        ...state,
        selectedVideoClip: action?.selectedVideoClip,
      };
      break;
    case UpdateProjectEnum.HANDEL_ALLOW_DRAG_DROP:
      return {
        ...state,
        allowDragDrop: action?.allowDragDrop,
      };
      break;
    case UpdateProjectEnum.UPDATE_STAGE_FIELD:
      return {
        ...state,
        stagingFields: payload,
      };
      break;
    case UpdateProjectEnum.SSJSON_FINALMODAL_IS_JSONLOAD:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.SSJSON_MODAL_DATA:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.SET_FINAL_VIDEO:
      return {
        ...state,
        finalVideos: payload,
      };
      break;
    case UpdateProjectEnum.ADD_TEMPLATE_DATA:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.GET_TEMPLATE_FIELD:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.MEDIA_DELETE_FILE:
      return {
        ...state,
        ...payload,
      };
      break;
    case UpdateProjectEnum.UPDATE_ALBUM_VISIBILITY:
      return {
        ...state,
        albumData: action?.albumData,
      };
      break;
    case UpdateProjectEnum.CLICK_ON_LIST_MEDIA:
      return {
        ...state,
        selectionClear: true,
        selectedVideoClip: null,
        clickClip: action?.indexValue,
        clickMediaColor: action?.indexValue,
      };
      break;
    case UpdateProjectEnum.UPDATE_MEDIA_TEMPLATE_FIELDS:
      return {
        ...state,
        templates: state.templates?.map((template, index) => ({
          ...template,
          fields: index === action?.templateIndex ? action?.updatedFields : template.fields,
        })),
        mediaList: state.mediaList?.filter?.((media) => media?.name !== action?.name),
      };
      break;
    case UpdateProjectEnum.MOVE_MEDIA_TEMPLATE_FIELDS:
      return {
        ...state,
        templates: state.templates?.map((template, index) =>
          index === action.templateIndex
            ? {
                ...template,
                fields: action.moveMediaToField
                  ? action.moveMediaToField({
                      prev: template.fields,
                      name: action?.name,
                      label: action?.label,
                      _currentVideo: action?._currentVideo,
                      startTime: 0,
                      endTime: action._currentVideo?.duration,
                    })
                  : [],
              }
            : template,
        ),
      };
      break;
    case UpdateProjectEnum.MOVE_MEDIA_TO_STAGE_FIELDS:
      return {
        ...state,
        stagingFields: action?.stageField,
      };
      break;
    case UpdateProjectEnum.UPDATE_STAGING_FIELD:
      return {
        ...state,
        stagingFields: action?.stagingFields,
      };
      break;
    case UpdateProjectEnum.SELETCED_MEDIA_CARD:
      return {
        ...state,
        clickMediaColor: action?.clickMediaColor ?? null,
        clickClip: action?.clickClip ?? null,
      };
      break;
    case UpdateProjectEnum.UPDATE_SUBCLIP:
      return {
        ...state,
        stagingField: action?.updatedFields,
      };
      break;
    case UpdateProjectEnum.UPDATE_STAGING_SUB_CLIP:
      return {
        ...state,
        stagingField: action?.stagingFields,
      };
      break;
    case UpdateProjectEnum.HANDLE_CLIP_CURRENT_TIME:
      return {
        ...state,
        subClipCurrentTime: action?.subClipCurrentTime,
      };
      break;

    case UpdateProjectEnum.ON_DROP_REORDERING:
      return {
        ...state,
        stagingField: action?.stagingFields,
      };
      break;
    case UpdateProjectEnum.DELETE_UPDATE_CLIP:
      return {
        ...state,
        stagingField: action?.stagingFields,
      };
      break;
    case UpdateProjectEnum.FINAL_VIDEOTO_MERGED:
      return {
        ...state,
        finalVideosToMerge: action?.finalVideoToMergeResult,
      };
      break;
    case UpdateProjectEnum.FINAL_VIDEO_TOMERGED:
      return {
        ...state,
        finalVideosToMerge: action?.finalVideosToMerge,
      };
      break;
    case UpdateProjectEnum.DELETE_FINAL_MERGED_VIDEO:
      return {
        ...state,
        finalVideosToMerge: action?.finalVideosToMerge,
      };
      break;
    case UpdateProjectEnum.FINAL_VIDEO_RENDERED:
      return {
        ...state,
        mergeFileName: action?.mergeFileName,
      };
      break;
    case UpdateProjectEnum.MODAL_RENDERED:
      return {
        ...state,
        mergeFileName: action?.mergeFileName,
      };
      break;
    case UpdateProjectEnum.ERROR_MODAL:
      return {
        ...state,
        mailBox: action?.mailBox,
      };
      break;
    case UpdateProjectEnum.MEDIA_DROP_TO_FIELD_AND_DELETE:
      return {
        ...state,
        templates: action?.templates,
        selectedVideoClip: action?.selectedVideoClip,
      };
      break;
    case UpdateProjectEnum.SET_THEMES_ID:
      return {
        ...state,
        templateThemeIds: action?.templateThemeIds,
      };
      break;

    case UpdateProjectEnum.SIMILAR_TEMPLATE_CHANGE:
      return {
        ...state,
        templatesData: [
          ...state.templatesData,
          {
            ...action.payload.res,
            fields: action.payload.fieldsStringified,
          },
        ],
        templates: [
          ...state.templates,
          {
            id: action.payload.selectTemplate.value,
            fields: action.payload.templateFields,
            uuid: action.payload.selectTemplate.uuid,
          },
        ],
        selectedTemplates: [...state.selectedTemplates, action.payload.selectTemplate],
      };
      break;
    case UpdateProjectEnum.UPDATE_TEMPLATE_STYLE:
      if (!state?.templateStyleIds) {
        const newTemplateStyleIds = [
          {
            templateStyleId,
            uuid: activeTemplateUuid,
          },
        ];
        return { ...state, templateStyleIds: newTemplateStyleIds };
      } else {
        const index = state?.templateStyleIds.findIndex((item) => item.uuid === activeTemplateUuid);
        if (index !== -1) {
          if (state?.templateStyleIds[index].templateStyleId !== templateStyleId) {
            const updatedTemplateStyleIds = [...state.templateStyleIds];
            updatedTemplateStyleIds[index] = {
              ...state?.templateStyleIds[index],
              templateStyleId,
            };
            return { ...state, templateStyleIds: updatedTemplateStyleIds };
          }
        } else {
          // If activeUuid doesn't exist, add a new object
          const newTemplateStyleIds = [
            ...state.templateStyleIds,
            {
              templateStyleId,
              uuid: activeTemplateUuid,
            },
          ];
          return { ...state, templateStyleIds: newTemplateStyleIds };
        }
      }

      return state;
      break;
    case UpdateProjectEnum.AUDIO_IMAGE_FIELD_EMPTY:
      updatedStagingFields[index].value = "";
      return {
        ...state,
        stagingFields: updatedStagingFields,
      };
    case UpdateProjectEnum.ENTER_NUMBER_TEMPLATE_FIELD:
      templateEmptyFields[templateIndex].fields[index].value = inputNumberValue;

      return {
        ...state,
        templates: templateEmptyFields,
      };
    case UpdateProjectEnum.SET_TEMPLATE_FIELD:
      templateEmptyFields[templateIndex].fields[index].value = inputTextValue;
      return {
        ...state,
        templates: templateEmptyFields,
      };
    default:
      return state;
  }
}
