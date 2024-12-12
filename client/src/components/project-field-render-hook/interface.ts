// interface fro the useFieldRenderers function

import { ProjectInterface } from "@/pages/create-project/interface";
import React, { SetStateAction } from "react";
import { Control, UseFormRegister, FieldValues } from "react-hook-form";

interface ValueInterface {
  label?: string | number | undefined;
  options?: OptionInterface[];
}
interface OptionInterface {
  label?: string | number | undefined;
  value?: string | number | undefined;
}

interface FieldRendererInterface {
  index: number;
  handleTextInputField?: (argu?: string) => (void | undefined) | undefined;
  handleNumberField?: (inputNumberValue?: number) => (void | undefined) | undefined;
  handleInputChange?: (argu?: number) => void;
  handleSelectOption?: (argu?: any) => (void | undefined) | undefined;
  handleClose?: () => (void | undefined) | undefined;
  handleSelectOptions: (argu?: any) => void | undefined;
  value?: any | string | number | undefined;
  label: string;
  playIcon?: string;
  handlePlay?: (label: string, name: string | undefined) => void;
  videoFieldClass?: string;
  project: ProjectInterface;
  setProject: React.Dispatch<SetStateAction<ProjectInterface>>;
  deleteStageIcon?: string;
  handleDelete?: () => (void | undefined) | undefined;
  stagImageEmpty?: boolean;
  name?: string;
  options?: OptionInterface[];
  control: Control<FieldValues | any>;
  register: UseFormRegister<FieldValues | any>;
  usersList?: Array<{
    value: string;
    label: string;
  }>;
  showSelected?: string;
  selectedOption?: ValueInterface[];
  templateTab?: boolean;
  hanldeMoveImageToField?: () => void;
  moveImageFilesJSX?: () => HTMLLIElement;
  handleMoveAudioToField?: () => void;
  moveAudioFilesJSX?: () => HTMLLIElement;
}

interface UseFieldRenderersInterface {
  styles: { [key: string]: string };
  clearable?: boolean;
}

interface VideoFieldRenderInterface {
  name?: string;
  index?: number;
  value?: any | string | number | undefined;
  label: string;
  playIcon?: string;
  handlePlay?: (label: string, name: string | undefined) => void;
  deleteStageIcon?: string;
  handleDelete?: () => (void | undefined) | undefined;
  videoFieldClass?: string;
}

interface TextFieldRendererInterface {
  index: number;
  label: string;
  value?: any | string | number | undefined;
  options?: OptionInterface[];
  deleteStageIcon?: string;
  handleDelete?: () => (void | undefined) | undefined;
  handleTextInputField?: (argu?: string) => (void | undefined) | undefined;
  handleSelectOption?: (argu?: any) => (void | undefined) | undefined;
}

interface NumberFieldRendererInterface {
  index: number;
  value?: any | string | number | undefined;
  label: string;
  register: UseFormRegister<FieldValues | any>;
  deleteStageIcon?: string;
  handleDelete?: () => (void | undefined) | undefined;
  handleNumberField?: (inputNumberValue?: number) => (void | undefined) | undefined;
}

interface ImageFieldRendererInterface {
  value?: any | string | number | undefined;
  label: string;
  deleteStageIcon?: string;
  handleDelete?: () => (void | undefined) | undefined;
  hanldeMoveImageToField?: () => (void | undefined) | undefined;
  templateTab?: boolean;
  moveImageFilesJSX?: () => HTMLLIElement;
  handleClose?: () => (void | undefined) | undefined;
}

interface AudioFieldRendererInterface {
  label: string;
  templateTab?: boolean;
  deleteStageIcon?: string;
  value?: any | string | number | undefined;
  moveAudioFilesJSX?: () => HTMLLIElement;
  handleDelete?: () => (void | undefined) | undefined;
  handleClose?: () => (void | undefined) | undefined;
  handleMoveAudioToField?: () => (void | undefined) | undefined;
}

interface UserFieldRendererInterface {
  value?: any | string | number | undefined;
  label: string;
  control: Control<FieldValues | any>;
  usersList?: any[];
  handleSelectOptions: (argu?: any) => void | undefined;
  deleteStageIcon?: string;
  handleDelete?: () => (void | undefined) | undefined;
}

interface FieldRenderers {
  video: (props: FieldRendererInterface) => void;
  text: (props: FieldRendererInterface) => void;
  number: (props: FieldRendererInterface) => void;
  image: (props: FieldRendererInterface) => void;
  audio: (props: FieldRendererInterface) => void;
  user: (props: FieldRendererInterface) => void;
}

interface VideoPropsInterface extends UseFieldRenderersInterface, VideoFieldRenderInterface {}
interface TextPropsInterface extends UseFieldRenderersInterface, TextFieldRendererInterface {}
interface NumberPropsInterface extends UseFieldRenderersInterface, NumberFieldRendererInterface {}
interface ImagePropsInterface extends UseFieldRenderersInterface, ImageFieldRendererInterface {}
interface AudioPropsInterface extends UseFieldRenderersInterface, AudioFieldRendererInterface {}
interface UserPropsInterface extends UseFieldRenderersInterface, UserFieldRendererInterface {}

export {
  UseFieldRenderersInterface,
  FieldRenderers,
  FieldRendererInterface,
  VideoPropsInterface,
  TextPropsInterface,
  NumberPropsInterface,
  ImagePropsInterface,
  AudioPropsInterface,
  UserPropsInterface,
};
