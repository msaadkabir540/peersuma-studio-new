import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type InputType = "text" | "number" | "password" | "email" | "date" | "checkbox" | "color";

interface InputInterface {
  min?: number;
  max?: number;
  step?: number;
  name: string;
  icon?: string;
  label?: string;
  accept?: string;
  type?: InputType;
  infoText?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  iconClass?: string;
  isDisable?: boolean;
  labelClass?: string;
  errorClass?: string;
  inputClass?: string;
  placeholder?: string;
  iconEleClass?: string;
  errorMessage?: string;
  value?: number | string;
  isContactNumber?: boolean;
  errorMessagefield?: boolean;
  style?: React.CSSProperties;
  onClick?: (value: any) => void;
  onChange?: (value: any) => void;
  register?: UseFormRegister<FieldValues | any>;
  id?: string;
}

export { InputInterface };
