import { Dispatch, SetStateAction } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { DropResult } from "react-beautiful-dnd";

import {
  CreateProjectFormInterface,
  DeleteSelectedTemplateArgsInterface,
  ProjectInterface,
  SelectTemplateHandlerArgs,
  TemplateInterface,
} from "@/pages/create-project/interface";

export interface ContextValueObjectInterface {
  watch?: UseFormWatch<CreateProjectFormInterface>;
  videoProjects?: VideoProjectsInterface;
  errors?: FieldErrors<CreateProjectFormInterface>;
  project?: ProjectInterface;
  loading?: {
    isLoading?: boolean;
    albumData?: boolean;
    deleteLoader?: any;
    finalVideo?: boolean;
    ssJson?: boolean;
    templateFields?: boolean;
    addUpdate?: boolean;
  };
  isLoading?: boolean;
  register?: UseFormRegister<CreateProjectFormInterface>;
  setValue?: UseFormSetValue<CreateProjectFormInterface>;
  setProject?: React.Dispatch<SetStateAction<ProjectInterface>>;
  setAddIncrement?: React.Dispatch<SetStateAction<number>>;
  id?: string;
  submitDisabled?: boolean;
  updateAndSaveEvents?: () => void;
  handleSelectionClear?: () => void;
  handleSelectedVideoClip?: () => void;
  reset?: UseFormReset<CreateProjectFormInterface>;
  control?: Control<CreateProjectFormInterface>;
  onSubmit?: (data: CreateProjectFormInterface) => Promise<void>;
  isUpdateModal?: boolean;
  handleUpdateModalOpen?: () => void;
  handleUpdateModalClose?: () => void;
  handleTemplateToogle?: () => void;
  closeAllSelectedTemplate?: () => void;
  templateHandleEvent?: () => void;
  stagingHandleEvent?: () => void;
  clickOnSelectedTemplate?: (args: {
    uuid: string;
    index: number;
    value: string;
    ssJson: boolean;
    clickMediaColor: number | null;
  }) => void;
  deleteSelectedTemplate?: ({
    templates,
    selectedTemplates,
    value,
    uuid,
  }: DeleteSelectedTemplateArgsInterface) => void;
  assemblyHandleEvent?: () => void;
  cancelActiveTemplateId?: () => void;
  handleSelectTemplateModalClose?: () => void;
  handleEmptyVideoPlayerClickEvent?: () => void;
  handleSelectTemplateOpen?: () => void;

  showSelectTemplate: boolean;
  setShowSelectTemplate?: Dispatch<SetStateAction<boolean>>;
  selectTemplateHandler?: ({ value, label, description }: SelectTemplateHandlerArgs) => void;
  templates?: TemplateInterface[];
}

export interface UpdateProjectAction {
  payload?: any;
  stageField?: any;
  updatedFields?: any;
  clickMediaColor?: any;
  clickClip?: any;
  albumData?: any;
  stagingFields?: any;
  templates?: any;
  ssJson?: any;
  mergeFileName?: any;
  templatesData?: any;
  finalVideoToMergeResult?: any;
  selectedTemplates?: any;
  //
  type: string;
  indexValue?: number;
  subClipCurrentTime?: number;
  templateIndex?: number;
  name?: string;
  albumId?: string;
  selectedVideoClip?: string;
  selectedFieldName?: string;
  isVisibility?: boolean;
  templateClip?: boolean;
  mailBox?: boolean;
  allowDragDrop?: boolean;
  ssJsonFinalModal?: boolean;
  reordering?: reorderingInterface;
  index?: number | undefined;
  finalVideosToMerge?: DropResult;
  activeTemplateIndex?: number;
  activeTemplateUuid?: string;
  activeTemplateId?: string;
  templateThemeIds?: string;
  inputNumberValue?: number;
  inputTextValue?: string;
  templateStyleIds?: string;
  moveMediaToField?: ({
    prev,
    name,
    label,
    _currentVideo,
    startTime,
    endTime,
  }: {
    prev?: any;
    name?: string;
    label?: string;
    _currentVideo?: any;
    startTime?: number;
    endTime?: string;
  }) => void;

  prev?: any;
  label?: string;
  _currentVideo?: any;
  startTime?: number;
  endTime?: string;
  templateStyleId?: string;
}

interface reorderingInterface {
  sourceDroppableId?: string;
  destinationDroppableId?: string;
  source?: any;
  destination?: any;
}

export interface VideoProjectsInterface {
  _id: string;
  name: string;
  status: string;
  createdUser: string;
}

export type ContextValue = ContextValueObjectInterface | undefined;
export type TemplateTabPropsContextType = ContextValueObjectInterface | undefined;
