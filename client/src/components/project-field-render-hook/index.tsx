import Video from "./components/video";
import Text from "./components/text";
import Number from "./components/number";
import Image from "./components/image";
import Audio from "./components/audio";
import User from "./components/user";

import { UseFieldRenderersInterface, FieldRenderers } from "./interface";

const useFieldRenderers: ({ styles, clearable }: UseFieldRenderersInterface) => FieldRenderers = ({
  styles,
  clearable = true,
}) => {
  return {
    video: ({
      name,
      index,
      value,
      label,
      playIcon,
      handlePlay,
      handleDelete,
      deleteStageIcon,
      videoFieldClass,
    }) => {
      return (
        <Video
          {...{
            name,
            index,
            value,
            label,
            styles,
            playIcon,
            handlePlay,
            clearable,
            handleDelete,
            videoFieldClass,
            deleteStageIcon,
          }}
        />
      );
    },
    text: ({
      index,
      label,
      value,
      options,
      handleDelete,
      deleteStageIcon,
      handleSelectOption,
      handleTextInputField,
    }) => {
      return (
        <Text
          {...{
            index,
            label,
            value,
            styles,
            options,
            clearable,
            handleDelete,
            deleteStageIcon,
            handleSelectOption,
            handleTextInputField,
          }}
        />
      );
    },
    number: ({
      index,
      label,
      value,
      register,
      handleDelete,
      deleteStageIcon,
      handleNumberField,
    }) => {
      return (
        <Number
          {...{
            index,
            label,
            value,
            styles,
            register,
            clearable,
            handleDelete,
            deleteStageIcon,
            handleNumberField,
          }}
        />
      );
    },
    image: ({
      value,
      label,
      handleClose,
      templateTab,
      handleDelete,
      deleteStageIcon,
      moveImageFilesJSX,
      hanldeMoveImageToField,
    }) => {
      return (
        <Image
          {...{
            value,
            label,
            styles,
            clearable,
            templateTab,
            handleClose,
            handleDelete,
            deleteStageIcon,
            moveImageFilesJSX,
            hanldeMoveImageToField,
          }}
        />
      );
    },
    audio: ({
      value,
      label,
      templateTab,
      handleClose,
      handleDelete,
      deleteStageIcon,
      moveAudioFilesJSX,
      handleMoveAudioToField,
    }) => {
      return (
        <Audio
          {...{
            value,
            label,
            styles,
            clearable,
            handleClose,
            templateTab,
            handleDelete,
            deleteStageIcon,
            moveAudioFilesJSX,
            handleMoveAudioToField,
          }}
        />
      );
    },
    user: ({
      value,
      label,
      control,
      usersList = [],
      handleDelete,
      deleteStageIcon,
      handleSelectOptions,
    }) => {
      return (
        <User
          {...{
            value,
            label,
            control,
            styles,
            clearable,
            usersList,
            handleDelete,
            deleteStageIcon,
            handleSelectOptions,
          }}
        />
      );
    },
  };
};

export default useFieldRenderers;
