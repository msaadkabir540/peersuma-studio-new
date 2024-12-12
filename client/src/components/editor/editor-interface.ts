import { FieldValues, Control, RegisterOptions } from "react-hook-form";
import { RawDraftContentState } from "draft-js";

interface EditorContainerProps {
  name: string | any;
  label: string;
  control: Control<FieldValues | any>;
  className?: string;
  placeholder?: string;
  errorMessage?: string;
  defaultValue?: RawDraftContentState;
  rules: RegisterOptions<{
    required?: {
      value: boolean;
      message: string;
    };
    validate?: () => boolean;
  }>;
  labelClass?: string;
  colorPickerClass?: string;
}
export { EditorContainerProps };
