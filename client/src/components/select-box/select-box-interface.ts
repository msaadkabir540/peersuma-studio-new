import { Control, FieldValues } from "react-hook-form";

interface OptionsInterface {
  value: string | number;
  label: string | number;
}

interface SelectBoxInterface {
  name: string;
  options: Array<OptionsInterface>;
  control: Control<FieldValues | any>;
  className?: string;
  required?: boolean;
  rules?: {
    required: {
      value: boolean;
      message: string;
    };

    validate: (value: any) => any;
  };
  showSelected?: boolean;
  errorMessage?: string;
  handleChange?: (value: string) => void;
  defaultValue?: string | number;
  isLoading?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
}

export { SelectBoxInterface, OptionsInterface };
