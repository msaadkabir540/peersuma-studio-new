import { FieldValues, UseFormRegister } from "react-hook-form";

interface TextAreaInterface {
  label?: string;
  name?: string;
  placeholder?: string;
  errorMessage?: string;
  rows?: number;
  readOnly?: boolean;
  className?: string;
  value?: string;
  inputClass?: string;
  required?: boolean;
  register?: UseFormRegister<FieldValues | any>;
  onChange?: (value: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export { TextAreaInterface };
