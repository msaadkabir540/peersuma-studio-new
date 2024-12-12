import { FieldValues, UseFormRegister } from "react-hook-form";

interface RadioInterface {
  id?: string;
  name: string;
  error?: string;
  label?: string;
  checked?: boolean;
  register: UseFormRegister<FieldValues | any>;
  className?: string;
  radioValue: string;
  handleClick?: () => void;
  handleChange?: () => void;
  defaultChecked?: boolean;
}

export { RadioInterface };
