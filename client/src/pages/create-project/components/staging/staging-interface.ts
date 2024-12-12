import { Dispatch, SetStateAction } from "react";
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import {
  CreateProjectFormInterface,
  ProjectInterface,
  TemplatesFieldInterface,
  TemplatesFieldValueInterface,
  TranscriptionInterface,
  stagingFieldsInterface,
} from "../../interface";
import {
  CurrentVideoInterface,
  MoveMediaToFieldFunctionArgs,
  OnDropFunctionArgs,
} from "../interface";

interface StagingInterface {
  handleClipClicks: ({
    e,
    item,
    label,
    name,
    currentVideoHeadTime,
    templateClip,
  }: {
    e?: React.MouseEvent<HTMLDivElement, MouseEvent> | React.DragEvent<HTMLDivElement>;
    item: TemplatesFieldValueInterface;
    label: string | undefined;
    name: string | undefined;
    currentVideoHeadTime?: number | null | undefined;
    templateClip?: boolean;
  }) => void;
  handleUpdateStageField: ({ stagingFields }: { stagingFields: stagingFieldsInterface }) => void;
}

interface stagingDispatchInterface {
  type: string;
  stagingFields?: unknown;
  payload?: unknown;
  templates?: unknown;
  selectedVideoClip?: string;
  index?: number;
  templateIndex?: number;
  name?: string;
  label?: string;
  allowDragDrop?: boolean;
  _currentVideo?: CurrentVideoInterface;
  moveMediaToField?: ({
    prev,
    name,
    id,
    label,
    _currentVideo,
    startTime,
    endTime,
  }: MoveMediaToFieldFunctionArgs) => TemplatesFieldInterface[];
}

interface StagingContextInterface {
  control: Control<CreateProjectFormInterface>;
  register: UseFormRegister<CreateProjectFormInterface>;
  stagingFields: Array<stagingFieldsInterface>;
  moveMediaToField: (args: MoveMediaToFieldFunctionArgs) => TemplatesFieldInterface[];
  dispatchProject: React.Dispatch<SetStateAction<stagingDispatchInterface>>;
  setValue: UseFormSetValue<CreateProjectFormInterface>;
  watch: UseFormWatch<CreateProjectFormInterface>;
  project: ProjectInterface;
  renameVideoClip: RenameClipInterface;
  setRenameVideoClip: React.Dispatch<SetStateAction<RenameClipInterface>>;
}

interface StagingDispatchInterface {
  type: string;
  name?: string;
  label?: string;
  moveValue?: string;
  delete_id?: string;
}

interface StagingModalInterface {
  stageModal: boolean;
  dispatch: Dispatch<StagingDispatchInterface>;
  stagingFields: Array<stagingFieldsInterface> | undefined;
  control: Control<CreateProjectFormInterface>;
  setValue: UseFormSetValue<CreateProjectFormInterface>;
}

interface HandleClipOnClipInterface {
  item: {
    url: string;
    clipDuration?: string | undefined;
    content?: string | undefined;
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
    transcription: TranscriptionInterface[];
    name?: string | undefined;
  };
  e: React.MouseEvent<HTMLDivElement, MouseEvent>;
  label: string | undefined;
  name: string | undefined;
}

interface RenameClipInterface {
  isRenameModal?: boolean;
  renameText?: string;
  clipId?: string;
  label?: string;
  fieldName?: string;
}

interface UpdateClipInterface {
  text: string;
  renameVideoClip: RenameClipInterface;
  e: React.MouseEvent<HTMLDivElement, MouseEvent>;
}

interface StagingVideoFieldInterface {
  type: string;
  stagingFieldId?: string;
  fieldId?: string;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: ({ e, label, name, side }: OnDropFunctionArgs) => void;
  label: string | undefined;
  name: string | undefined;
  handleDragEnd: () => void;
  handleDragStart: ({
    e,
    video,
  }: {
    e: React.DragEvent<HTMLDivElement>;
    video: CurrentVideoInterface | TemplatesFieldValueInterface;
  }) => void;
  project: ProjectInterface;
  index: number;
  cardValueLeft: TemplatesFieldValueInterface[];
  cardValueRight: TemplatesFieldValueInterface[];
  setRenameVideoClip: React.Dispatch<SetStateAction<RenameClipInterface>>;
  selectedVideoClip: string | null | undefined;
  handleClickOnClip: ({ item, e, label, name }: HandleClipOnClipInterface) => void;
  handleClickSide: ({ value }: { value: string }) => void;
  handleClipDelete: ({
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
  }) => void;
}

interface VideoClipTranscriptionInterface {
  startTime: number;
  endTime: number;
  _currentVideo: CurrentVideoInterface;
}

export {
  StagingInterface,
  UpdateClipInterface,
  RenameClipInterface,
  StagingModalInterface,
  StagingContextInterface,
  HandleClipOnClipInterface,
  StagingVideoFieldInterface,
  VideoClipTranscriptionInterface,
};
