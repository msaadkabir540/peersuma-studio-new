import React, { SetStateAction } from "react";
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";

interface TemplateInterface {
  label: string;
  value: string;
  description: string;
  uuid: string;
}

interface TemplateIdsInterface {
  templateId: string;
  uuid: string;
  _id?: string;
}

interface CreateProjectFormInterface {
  _id: string;
  projectName: string;
  yourName: string;
  templateIds: Array<TemplateIdsInterface>;
  albumId: string;
  projectStatus: string;
  clientId: string;
  templateStyleIds: any;
  templateThemeIds?: string;
  finalVideos: any;
  finalVideosToMerge: any;
  createdAt: null;
  updatedAt: null;
  searchTemplate: string;
  mySwitch: string;
  similarTemplate: any; //  dropdown,
  templateStyleId: string;
  templateThemeId: string;
  finalFileName: string;
  search: string;
  fieldOptions: string;
  clipToggles: boolean;
}

// interface MediaListInterface {}

interface FinalVideoListInterface {
  url: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  thumbnailUrl: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  transcription: Array<TranscriptionInterface>;
}
interface ClientUserInterface {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
  roles: Array<string>;
}

interface TranscriptionInterface {
  startTime: string;
  endTime: string;
  type: string;
  speakerLabel: string;
  text: string;
}

interface TemplatesFieldValueInterface {
  url: string;
  clipDuration?: number;
  content?: string;
  s3Key: string;
  fileType: string;
  speakers: number;
  duration: number;
  thumbnailUrl: string;
  thumbnailS3Key: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  startTime: number;
  endTime: number;
  label: string;
  transcription: Array<TranscriptionInterface>;
  name?: string;
  clipId?: string;
}

interface VideoProjectInterface {
  url: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  thumbnailUrl: string;
  _id: string;
  id: string;
  clipDuration: number;
}

interface OptionInterface {
  label?: string | number | undefined;
  value?: string | number | undefined;
}

interface TemplateFieldRenderInterface {
  render: (args: {
    index?: number;
    label: string;
    // options: string[];
    options: OptionInterface[];
    name: string;
    project: ProjectInterface;

    isOpen?: boolean;
    showField: string | number | boolean | null | undefined;
    selectedFieldName?: string | null;
    videoFieldClass: React.CSSProperties | string;
    handlePlay: () => void;
    playIcon: any;
    value: any;
    usersList: Array<{
      value: string;
      label: string;
    }>;
    control: Control<CreateProjectFormInterface>;

    register: UseFormRegister<CreateProjectFormInterface>;
  }) => JSX.Element | JSX.Element[] | void;
}

interface TemplatesFieldInterface extends TemplateFieldRenderInterface {
  type: string;
  label: string;
  // options: Array<string>;
  options: OptionInterface[];
  name: string;
  fieldLabel: string;
  value: Array<TemplatesFieldValueInterface>;
  // render: TemplateFieldRenderInterface;
}
interface TemplatesInterface {
  id: string;
  fields: Array<TemplatesFieldInterface>;
  ssJson?: boolean;
  uuid?: string;
  similarTemplates?: any;
}
interface MediaOptionsInterface {
  label: string;
  value: string;
  description: string;
}
interface TemplatesStylesInterface {
  name: string;
  description: string;
  styles_py: string;
  _id: string;
}
interface TemplatesDataInterface {
  _id: string;
  templateName: string;
  description: string;
  templateStyles: Array<TemplatesStylesInterface>;
  mediaFiles: any;
  createdAt: string;
  updatedAt: string;
  UIpy: string;
  ssJson: string;
  templateVideoS3Key: string;
  templateVideoThumbnailS3Key: string;
  templateVideoThumbnailUrl: string;
  templateVideoUrl: string;
  fields: string;
  uuid?: string;
}
interface TemplateOptionsInterface {
  label: string;
  value: string;
  description: string;
}
interface SelectedTemplateInterface {
  label: string;
  value: string;
  description: string;
  uuid: string;
}

interface TemplateStyleIdsInterface {
  templateStyleId: string;
  uuid: string | undefined;
  _id?: string;
}

interface TemplateThemesIdsInterface {
  templateThemesId: string;
  uuid: string | undefined;
  _id?: string;
}

interface ThemesIdsInterface {
  _id: string;
  uuid?: string;
  themeName: string;
  themes_py: string;
  sampleVideoUrl?: string;
  sampleVideoS3Key?: string;
  themesDescription: string;
  themeVideoThumbnailUrl?: string;
}

interface ProjectInterface {
  type?: string;
  id?: string;
  mergeFileName?: boolean | any;
  mailBox?: boolean;
  templateClip?: boolean;
  ssJsonModal?: string;
  isVisibility?: boolean;
  allowDragDrop?: boolean;
  isOpen: boolean;
  ssJson: boolean | null;
  isJsonLoad: boolean;
  videoProjectId?: string;
  showField?: string | boolean | null | number;
  ssJsonFinalModal?: boolean | undefined;
  mediaList: Array<ProjectMediaListInterface>;
  templates: Array<TemplatesInterface>;
  finalVideos: Array<FinalVideoListInterface>;
  clientUsers: Array<ClientUserInterface>;
  mediaOptions: Array<MediaOptionsInterface>;
  templatesData: Array<TemplatesDataInterface>;
  templateOptions: Array<TemplateOptionsInterface>;
  selectedTemplates: Array<SelectedTemplateInterface>;
  templateStyleIds?: Array<TemplateStyleIdsInterface>;
  // templateThemeIds?: Array<TemplateThemesIdsInterface>;
  templateThemeIds?: string | undefined;
  themesData?: Array<ThemesIdsInterface>;
  // albumData?: Array<AlbumDataInterface>;
  activeTemplateId?: string;
  activeTemplateUuid?: string;
  finalVideosToMerge?: Array<ProjectFinalVideoToMergedInterface>;
  albumId?: string;
  activeTemplateIndex?: number;
  selectedFieldName?: string | null;
  clickClip?: number | null;
  selectedVideoClip?: string | null;
  clickMediaColor?: number | null;
  subClipCurrentTime?: number | null;
  selectionClear?: boolean;
  activeTab?: string | undefined;
  clientId?: string | null;
  _id?: string;
  yourName?: string;
  createdAt?: string;
  updatedAt?: string;
  projectName?: string;
  projectStatus?: string;
  stagingFields: Array<stagingFieldsInterface>;
}

interface ItemValueInterface {
  leftValue: any[];
  rightValue: any[];
}

interface stagingFieldsInterface {
  id?: string;
  label?: string;
  type?: string;
  name?: string;
  value?: ItemValueInterface;
  render?: any;
  options?: boolean;
  fieldLabel?: string;
}

interface SelectTemplateHandlerArgs {
  label: string;
  value: string;
  description: string;
}

interface templateObejct {
  type: string;
  mailBox?: boolean;
  ssJson?: any;
  isJsonLoad?: boolean;
  copyProject?: any;
  ssJsonFinalModal?: boolean;
  templates?: any;
  project?: any;
  payload?: any;
}

interface TemplateInterface {
  type?: string;
  payload?: templateObejct;
}
interface useTemplateTabPropsInterface {
  watch: UseFormWatch<CreateProjectFormInterface>;
  project: ProjectInterface;
  dispatchProject: React.Dispatch<SetStateAction<templateObejct>>;
  id?: string;
  prefix?: string;
}

interface PlayerVideoInterface {
  url: string;
  startTime: number;
  endTime: number;
  duration?: number;
  playClip?: boolean;
}

interface PlayerInterface {
  video: PlayerVideoInterface;
  currentTime: number;
  currentIndex: number;
  isPlaying?: boolean;
  selectionEnd?: number;
  selectionStart?: number;
  videoStartFromTime?: number;
  inValidTime?: string;
  editableTime?: string;
  editTimeField?: boolean;
  controls?: boolean;
  videoClipPlayer?: boolean;
  isSelectPlaying?: boolean;
}

interface MergePlayerInterface {
  mergePlayerOpen: boolean;
  label: string;
  name: string;
}

interface TemplateContainerPropsInterface {
  handleClipClicks: ({
    e,
    item,
    label,
  }: {
    e?: React.MouseEvent<HTMLDivElement, MouseEvent> | React.DragEvent<HTMLDivElement>;
    item: TemplatesFieldValueInterface;
    label: string;
  }) => void;
}

interface ProjectMediaListInterface {
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
}

interface ProjectFinalVideoToMergedInterface {
  url: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  thumbnailUrl: string;
  _id: string;
}

interface ClickOnSelectedTemplateArgsInterface {
  uuid: string;
  index: number;
  value: string;
  ssJson: boolean;
  clickMediaColor: number | null;
}
interface DeleteSelectedTemplateArgsInterface {
  templates: Array<TemplatesInterface>;
  selectedTemplates: Array<SelectedTemplateInterface>;
  value: string;
  uuid: string;
}

interface VariablesValueToMergeInterface {
  name: string;
  s3Key: string;
  startTime: number;
  endTime: number;
  duration: number;
}

interface VariablesInterface {
  text?: string;
  videosToMerge?: {
    [key: string]: Array<VariablesValueToMergeInterface>;
  };
  [key: string]: any;
}

export {
  TemplateInterface,
  ProjectInterface,
  VideoProjectInterface,
  CreateProjectFormInterface,
  TemplatesInterface,
  TemplateOptionsInterface,
  TemplateIdsInterface,
  SelectedTemplateInterface,
  SelectTemplateHandlerArgs,
  MediaOptionsInterface,
  useTemplateTabPropsInterface,
  PlayerInterface,
  MergePlayerInterface,
  TemplatesFieldInterface,
  TemplatesDataInterface,
  TemplatesFieldValueInterface,
  ClientUserInterface,
  TranscriptionInterface,
  TemplateContainerPropsInterface,
  ProjectFinalVideoToMergedInterface,
  TemplateFieldRenderInterface,
  ClickOnSelectedTemplateArgsInterface,
  DeleteSelectedTemplateArgsInterface,
  ProjectMediaListInterface,
  VariablesInterface,
  TemplateStyleIdsInterface,
  TemplateThemesIdsInterface,
  VariablesValueToMergeInterface,
  stagingFieldsInterface,
};
