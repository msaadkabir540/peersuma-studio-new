import { SetStateAction } from "react";
import {
  Control,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import {
  CreateProjectFormInterface,
  ProjectInterface,
  TemplatesFieldInterface,
  stagingFieldsInterface,
} from "../../interface";

interface MediaPlayerInterface {
  type: string;
  payload?: any;
  selectedVideoClip?: string;
  clickClip?: number;
  clickMediaColor?: string | null;
  selectedFieldName?: string;
  stagingFields?: stagingFieldsInterface;
  stageField?: TemplatesFieldInterface[];
  indexValue?: number;
  albumId?: string;
  templateClip?: boolean;
}

interface MediaPlayerContainerInterface {
  submitDisabled: boolean;
  selectedClient: string;
  updateAndSaveEvents: () => void;
  id: string;
  activeTemplateId: string;
  watch: UseFormWatch<CreateProjectFormInterface>;
  reset: UseFormReset<CreateProjectFormInterface>;
  control: Control<CreateProjectFormInterface>;
  project: ProjectInterface;
  onSubmit: (data: CreateProjectFormInterface) => Promise<void>;
  register: UseFormRegister<CreateProjectFormInterface>;
  setValue: UseFormSetValue<CreateProjectFormInterface>;
  dispatchProject: React.Dispatch<SetStateAction<MediaPlayerInterface>>;
  isUpdateModal: boolean;
  isLoading: boolean;
  handleUpdateModalOpen: () => void;
  handleUpdateModalClose: () => void;
  handleTemplateToogle: () => void;
  closeAllSelectedTemplate: () => void;
  templateHandleEvent: () => void;
  stagingHandleEvent: () => void;
  clickOnSelectedTemplate: (args: {
    uuid: string;
    index: number;
    value: string;
    ssJson: boolean;
    clickMediaColor: number | null;
  }) => void;
  deleteSelectedTemplate: () => void;
  assemblyHandleEvent: () => void;
  cancelActiveTemplateId: () => void;
  handleSelectTemplateOpen: () => void;
}

export { MediaPlayerContainerInterface };
