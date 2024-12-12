import React, { SetStateAction } from "react";
import { DropResult } from "react-beautiful-dnd";
import {
  UseFormReset,
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

import {
  CreateProjectFormInterface,
  SelectTemplateHandlerArgs,
  ProjectInterface,
  TemplatesInterface,
  SelectedTemplateInterface,
  PlayerInterface,
  MergePlayerInterface,
  TemplatesFieldInterface,
  TemplatesFieldValueInterface,
  ClientUserInterface,
  TranscriptionInterface,
  stagingFieldsInterface,
} from "../interface";
import { RenameClipInterface } from "./staging/staging-interface";

interface CreateAndEditProjectFormPropsInterface {
  selectTemplateEvent: () => void;
}

interface SelectedTemplateModalPropsInterface {
  project: ProjectInterface;
  showSelectTemplate: boolean;
  handleSelectTemplateModalClose: () => void;
  register: UseFormRegister<CreateProjectFormInterface>;
  errors: FieldErrors<CreateProjectFormInterface>;
  selectTemplateHandler: (selectedValue: SelectTemplateHandlerArgs) => void;
  templates: Array<TemplateInterface>;
  setValue: UseFormSetValue<CreateProjectFormInterface>;
  watch: UseFormWatch<CreateProjectFormInterface>;
}

interface TemplateTabPropsContextInterface {
  project: ProjectInterface;
  closeAllSelectedTemplate: () => void;
  handleSelectTemplateOpen: () => void;
  clickOnSelectedTemplate: (args: {
    uuid: string;
    index: number;
    value: string;
    ssJson: boolean;
    clickMediaColor: number | null;
  }) => void;
  deleteSelectedTemplate: (args: {
    templates: Array<TemplatesInterface>;
    selectedTemplates: Array<SelectedTemplateInterface>;
    value: string;
    uuid: string;
  }) => void;
  assemblyHandleEvent: () => void;
  cancelActiveTemplateId: () => void;
}

interface TemplateDispatchInterface {
  type: string;
  mailBox?: boolean;
}

type TemplateInterface = {
  handleClipClicks: (args: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.DragEvent<HTMLDivElement>;
    item: TemplatesFieldValueInterface;
    label: string;
  }) => void;
};

interface TemplateTabPropsInterface {
  reset: UseFormReset<CreateProjectFormInterface>;
  watch: UseFormWatch<CreateProjectFormInterface>;
  control: Control<CreateProjectFormInterface>;
  project: ProjectInterface;
  register: UseFormRegister<CreateProjectFormInterface>;
  setValue: UseFormSetValue<CreateProjectFormInterface>;
  onSubmit: (data: CreateProjectFormInterface) => Promise<void>;
  dispatchProject: React.Dispatch<SetStateAction<TemplateDispatchInterface>>;
}

interface CurrentVideoInterface {
  id: string;
  startTime: number;
  endTime: number;
  url: string;
  duration: number;
  label: string;
  thumbnailUrl?: string;
  name?: string;
  transcription: Array<TranscriptionInterface>;
  side?: string;
}

interface MoveMediaToFieldFunctionArgs {
  prev: Array<TemplatesFieldInterface>;
  name?: string;
  id?: string;
  label: string | undefined;
  _currentVideo: CurrentVideoInterface;
  startTime: number;
  endTime: number;
  moveFileFromStaging?: boolean;
  side?: string;
}
interface OnDropFunctionArgs {
  e?: React.DragEvent<HTMLDivElement>;
  label?: string | undefined;
  name: string;
  side?: string;
  noDrop?: boolean;
  videoDataFromClip?: {
    _currentVideo: CurrentVideoInterface;
    startTime: number | undefined;
    endTime: number | undefined;
  } | null;
}

interface PlayerPropsInterface {
  player: PlayerInterface;
  selection: {
    controls: boolean;
    currentSelection?: unknown;
  };
  isPlaying: boolean;
  setPlayer: React.Dispatch<SetStateAction<PlayerInterface>>;
  mergePlayer: MergePlayerInterface;
  currentTime: number;
  setSelection: React.Dispatch<SetStateAction<{ controls: boolean }>>;
  currentVideo: CurrentVideoInterface;
  setIsPlaying: React.Dispatch<SetStateAction<boolean>>;
  currentIndex: number;
  setCurrentTime: React.Dispatch<SetStateAction<number>>;
  setMergePlayer: React.Dispatch<SetStateAction<MergePlayerInterface>>;
  setCurrentIndex: React.Dispatch<SetStateAction<number>>;
  setCurrentVideo: React.Dispatch<SetStateAction<CurrentVideoInterface>>;
  moveMediaToField: (args: MoveMediaToFieldFunctionArgs) => TemplatesFieldInterface[];
  onDrop: (args: OnDropFunctionArgs) => void;
  templateFields: TemplatesFieldInterface[];
  closeMediaRef: HTMLDivElement;
}

interface PlayerDispatchInterface {
  type: string;
  payload?: unknown;
  subClipCurrentTime?: number;
  stagingFields?: stagingFieldsInterface[];
}

interface PlayerContextInterface {
  project: ProjectInterface;
  dispatchProject: React.Dispatch<SetStateAction<PlayerDispatchInterface>>;
  handleEmptyVideoPlayerClickEvent: () => void;
}

interface FieldsPanePropsInterface {
  loading: LoadingStateInterface;
  isPlaying: boolean;
  currentTime: number;
  mergePlayer: MergePlayerInterface;
  currentIndex: number;
  currentVideo: CurrentVideoInterface;
  setIsPlaying: React.Dispatch<SetStateAction<boolean>>;
  setMergePlayer: React.Dispatch<SetStateAction<MergePlayerInterface>>;
  setCurrentTime: React.Dispatch<SetStateAction<number>>;
  setCurrentIndex: React.Dispatch<SetStateAction<number>>;
  setCurrentVideo: React.Dispatch<SetStateAction<CurrentVideoInterface>>;
  moveMediaToField: (args: MoveMediaToFieldFunctionArgs) => TemplatesFieldInterface[];
  templeStylesOptions: Array<{
    label: string;
    value: string;
  }>;
  themesOptions?: Array<{
    label: string;
    value: string;
  }>;
  handleClipClicks: ({
    e,
    item,
    label,
    name,
    templateClip,
    currentVideoHeadTime,
  }: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.DragEvent<HTMLDivElement>;
    item: TemplatesFieldValueInterface;
    label: string;
    name: string;
    templateClip?: boolean;
    currentVideoHeadTime?: number | false | null | undefined;
  }) => void;
}

interface FieldDispatchInterface {
  type: string;
  templates?: unknown[];
  payload?: ProjectInterface | unknown;
  templateStyleId?: string;
  selectedVideoClip?: string;
  activeTemplateUuid?: string;
  templateThemeIds?: string;
  templateIndex?: number;
  index?: number;
  inputNumberValue?: number | string;
  startsTime?: number | null;
  inputTextValue?: string;
  allowDragDrop?: boolean;
}
interface FieldContextInterface {
  renameVideoClip: RenameClipInterface;
  setRenameVideoClip: React.Dispatch<SetStateAction<RenameClipInterface>>;
  reset: UseFormReset<CreateProjectFormInterface>;
  watch: UseFormWatch<CreateProjectFormInterface>;
  control: Control<CreateProjectFormInterface>;
  project: ProjectInterface;
  register: UseFormRegister<CreateProjectFormInterface>;
  dispatchProject: React.Dispatch<SetStateAction<FieldDispatchInterface>>;
}

interface StagingHandleContextInterface {
  stagingHandleEvent: () => void;
}

interface VideoClipCardPropsInterface {
  lastElement?: boolean;
  label?: string;
  fieldName?: string;
  fieldId?: string;
  stagingFieldId?: string;
  isStaging?: boolean;
  readyToDraft?: boolean;
  activeTab?: boolean;
  renameAllow?: boolean;
  leftBodyRef?: HTMLDivElement;
  item: TemplatesFieldValueInterface;
  selectedVideo?: React.CSSProperties;
  dragItemClass?: React.CSSProperties;
  videoClipCss?: React.CSSProperties;
  handleMenuOpen?: ({
    e,
    id,
    fieldName,
    label,
    name,
  }: {
    e?: React.MouseEvent<HTMLDivElement, MouseEvent> | React.DragEvent<HTMLDivElement>;
    id: string;
    fieldName: string | undefined;
    name: string | undefined;
    label: string | undefined;
  }) => void;
  handleClipClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleClipDelete: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleReadyToDraft: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

interface RenameFinalFilePropsInterface {
  watch: UseFormWatch<CreateProjectFormInterface>;
  styles: { [key: string]: string };
  errors: FieldErrors<CreateProjectFormInterface>;
  project: ProjectInterface;
  loading: {
    albumData?: boolean;
    deleteLoader?: unknown;
    finalVideo?: boolean;
    ssJson?: boolean;
    templateFields?: boolean;
    addUpdate?: boolean;
  };
  register: UseFormRegister<CreateProjectFormInterface>;
  setValue: UseFormSetValue<CreateProjectFormInterface>;
  dispatchProject: ({ type, mergeFileName }: { type: string; mergeFileName: boolean }) => void;
}

interface VideoDragAndDropPropsInterface {
  showField: number;
  onDragEnd: (result: DropResult) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (args: OnDropFunctionArgs) => void;
  templateData: TemplatesFieldInterface;
  project: ProjectInterface;
  handlePlay: (label: string, name: string) => void;
  selectedVideoClip: string | null | undefined;
  handleClipClicks: (args: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.DragEvent<HTMLDivElement>;
    item: TemplatesFieldValueInterface;
    label: string;
  }) => void;
  handleClipDelete: (args: {
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
  }) => void;
  clientUsers: Array<ClientUserInterface>;
  control: Control<CreateProjectFormInterface>;
  register: UseFormRegister<CreateProjectFormInterface>;
}

interface LoadingStateInterface {
  edit: boolean;
  ssJson?: boolean | undefined;
  albumData?: boolean | undefined;
  deleteLoader?: unknown;
  finalVideo?: boolean | undefined;
  templateFields?: boolean | undefined;
  addUpdate?: boolean | undefined;
  downloading?: boolean | undefined | string;
  mergeFinalVideo?: boolean | undefined | string;
  isLoading: boolean;
}

interface AssemblyPropsInterface {
  loading: LoadingStateInterface;
  setLoading: React.Dispatch<React.SetStateAction<LoadingStateInterface>>;
}
interface AssemblyContextInterface {
  id: string;
  selectedClient: string;
  watch: UseFormWatch<CreateProjectFormInterface>;
  project: ProjectInterface;
  setAddIncrement: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (data: CreateProjectFormInterface) => Promise<void>;
  register: UseFormRegister<CreateProjectFormInterface>;
  dispatchProject: ({
    type,
    mergeFileName,
    finalVideoToMergeResult,
    finalVideosToMerge,
    payload,
  }: {
    type: string;
    mergeFileName?: unknown;
    finalVideoToMergeResult?: unknown;
    finalVideosToMerge?: unknown;
    payload?: unknown;
  }) => void;
}

interface ListPropsInterface {
  x: unknown;
  id: string;
  index: number;
  loading: LoadingStateInterface;
  assembly?: boolean;
  moveMenu?: string;
  mediaList: unknown;
  writeText: (s: string) => Promise<void>;
  wrapperRef?: React.RefObject<HTMLDivElement> | React.RefObject<HTMLUListElement>;
  fileFields?: unknown;
  setMoveMenu?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  handleDragEnd?: () => void;
  handleDownload: (args: { name: string; url: string }) => void;
  clickMediaColor?: unknown;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, video: unknown) => void;
  clickOnListMedia: (args: { index: number; x: unknown }) => void;
  activeTemplateId: string;
  handleDeleteFile: (args: {
    id?: string;
    name: string;
    keyName: string;
    index: number;
    s3Key: string;
  }) => void;
  handleVisibility: (id: string, visibility: boolean) => void;
  clickOnFieldFields: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    name: string,
    label: string,
    x: unknown,
  ) => void;
  createNotification: (type: string, message: string) => void;
}

interface MediaListPropsInterface {
  prefix: string;
  loading: LoadingStateInterface;
  moveMenu?: string | boolean;
  setPlayer?: React.Dispatch<SetStateAction<PlayerInterface>>;
  fieldName: boolean;
  className?: string;
  typeFields?: (fileType: string) => TemplatesFieldInterface[];
  stageTypeFields?: (fileType: string) => stagingFieldsInterface[];
  wrapperRef?: React.RefObject<HTMLDivElement> | React.RefObject<HTMLUListElement>;
  setLoading: React.Dispatch<React.SetStateAction<LoadingStateInterface>>;
  setMoveMenu?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelection?: React.Dispatch<SetStateAction<{ controls: boolean }>>;
  setFieldName: React.Dispatch<React.SetStateAction<boolean>>;
  handleDragEnd?: () => void;
  handleDragStart?: (e: React.DragEvent<HTMLDivElement>, video: unknown) => void;
  setCurrentVideo?: React.Dispatch<SetStateAction<CurrentVideoInterface>>;
  assembly?: boolean;
  moveMediaToField?: (args: MoveMediaToFieldFunctionArgs) => TemplatesFieldInterface[];
}

interface MediaListContextInterface {
  id: string;
  watch: UseFormWatch<CreateProjectFormInterface>;
  control?: Control<CreateProjectFormInterface>;
  project: ProjectInterface;
  register: UseFormRegister<CreateProjectFormInterface>;
  onSubmit: (data: CreateProjectFormInterface) => Promise<void>;
  dispatchProject: unknown;
}

interface UpdateAlbumShotVisibilityResponse {
  url: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  thumbnailUrl: string;
  transcription: Array<TranscriptionInterface>;
  thumbnailS3Key: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  isVisible: boolean;
}

interface HandleClipDeleteFunctionArgs {
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
}

interface MediaListMapInterface {
  url: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  isVisible: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export {
  TemplateInterface,
  OnDropFunctionArgs,
  ListPropsInterface,
  PlayerPropsInterface,
  MediaListMapInterface,
  FieldContextInterface,
  CurrentVideoInterface,
  LoadingStateInterface,
  PlayerContextInterface,
  AssemblyPropsInterface,
  MediaListPropsInterface,
  AssemblyContextInterface,
  FieldsPanePropsInterface,
  TemplateTabPropsInterface,
  MediaListContextInterface,
  VideoClipCardPropsInterface,
  HandleClipDeleteFunctionArgs,
  MoveMediaToFieldFunctionArgs,
  StagingHandleContextInterface,
  RenameFinalFilePropsInterface,
  VideoDragAndDropPropsInterface,
  TemplateTabPropsContextInterface,
  UpdateAlbumShotVisibilityResponse,
  SelectedTemplateModalPropsInterface,
  CreateAndEditProjectFormPropsInterface,
};
