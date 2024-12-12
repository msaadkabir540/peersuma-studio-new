import { SSJsonObjectInterface } from "@/interface/json-interface";
import { TemplatesInterface } from "@/interface/template-interface";
import { FieldRenderers } from "@/utils/interface/interface-helper";
import { Dispatch, SetStateAction } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

// interface for UI
interface OptionInterface {
  value: string | number | undefined;
  label: string | number | undefined;
}

interface RenderFunctionInterface {
  (params: {
    index: number;
    value: string | number;
    label: string;
    options: OptionInterface;
    setTemplateFields?: Dispatch<SetStateAction<TemplateFieldInterface[]>>;
  }): React.ReactNode | JSX.Element;
}

interface TemplateFieldInterface {
  id?: string;
  type: string;
  render: RenderFunctionInterface;
  label: string;
  options: OptionInterface;
  fieldLabel: string;
  value: string;
}

interface UIInterface {
  id: string | undefined;
  watch: UseFormWatch<TemplatesInterface>;
  register: UseFormRegister<TemplatesInterface>;
  isCreateLoading?: boolean;
  isFieldLoading?: boolean;
  templateFields: TemplateFieldInterface[];
  setTemplateFields: Dispatch<SetStateAction<TemplateFieldInterface[]>>;
  hanldeGetTemplateFields: (fieldRenderers: FieldRenderers) => void;
}

interface JsonInterface {
  id: string | undefined;
  watch: UseFormWatch<TemplatesInterface>;
  isCreateLoading: boolean;
  placeholder: SSJsonObjectInterface;
  setValue: UseFormSetValue<TemplatesInterface>;
}

// interface fro Info Component
interface InfoComponentInterface {
  isEditInfo: boolean;
  id: string | undefined;
  handleModalOpen: () => void;
  watch: UseFormWatch<TemplatesInterface>;
  errors: FieldErrors<TemplatesInterface>;
  register: UseFormRegister<TemplatesInterface>;
}

// interface for Style Component

interface StyleComponentInterface {
  watch: UseFormWatch<TemplatesInterface>;
  register: UseFormRegister<TemplatesInterface>;
  reset: UseFormReset<TemplatesInterface>;
  isCreateLoading: boolean;
  handleStyleSave: () => void;
  handleOnSubmitStyleData: (newTemplateStyles: string[]) => void;
}

interface DeleteingInterface {
  isLoading: boolean;
  isIndex: number;
}

interface NewTemplatesInterface {
  newTemplate: {
    templateName: string;
    description: string;
    templateStyles: any[];
    mediaFiles: any[];
    createdAt?: string;
    updatedAt?: string;
    UIpy?: string;
    ssJson: string;
    templateVideoUrl?: string;
  };
}

// interface for  AddEditStyle component

interface AddEditStyleInterface {
  watch: UseFormWatch<TemplatesInterface>;
  register: UseFormRegister<TemplatesInterface>;
  isCreateLoading?: boolean;
  handleClickSave: () => void;
  handleCloseStyle: () => void;
  handleCloseModal: () => void;
  handleUploadModalOpen: () => void;
  fieldName: boolean;
  currentStyleIndex: number;
  prevTemplate: TemplatesInterface;
  handleOnSubmitStyleData: (templateStyles: string[]) => void;
}

export {
  UIInterface,
  JsonInterface,
  AddEditStyleInterface,
  NewTemplatesInterface,
  InfoComponentInterface,
  TemplateFieldInterface,
  StyleComponentInterface,
  TemplatesInterface,
  DeleteingInterface,
};
