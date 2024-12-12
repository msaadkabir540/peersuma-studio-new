import { Control, FieldValues } from "react-hook-form";

interface OptionsInterface {
  value: string | number;
  label: string | number;
  checkbox?: boolean;
}

interface SelectBoxInterface {
  showSelected?: boolean;
  mediaOption?: boolean;
  errorMessage?: boolean;
  name: string;
  label?: string;
  control: Control<FieldValues | any>;
  placeholder?: string;
  options: Array<OptionsInterface>;
  isMulti?: boolean;
  selectBoxClass?: string;
  wrapperClass?: string;
  badge?: boolean;
  defaultValue?: string | number | OptionsInterface | OptionsInterface[] | null;
  handleChange?: (value: string | number | OptionsInterface | OptionsInterface[] | null) => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  disabled?: boolean;
  required?: boolean;
}

interface FormatOptionLabelDataInterface {
  label: string;
  value: string | number;
  color: string;
  checkbox: boolean;
  box: boolean;
}

interface FormatOptionMetaDataInterface {
  context?: string;
  selectValue: any;
}

interface FormatOptionLabelInterface {
  data: {
    data: any;
    metaData?: FormatOptionMetaDataInterface;
    badge: boolean;
    mediaOption?: boolean;
  };
}

export { SelectBoxInterface, OptionsInterface, FormatOptionLabelInterface };
