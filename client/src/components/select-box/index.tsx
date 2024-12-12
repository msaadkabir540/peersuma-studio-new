import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

import colorStyles from "./select-box-colour";
import { OptionsInterface, SelectBoxInterface } from "./select-box-interface";

const CustomSelect: React.FC<SelectBoxInterface> = ({
  name,
  rules,
  control,
  options,
  required,
  className,
  placeholder,
  handleChange,
  errorMessage,
  defaultValue = "",
  isLoading = false,
  isDisabled = false,
  isClearable = false,
  isSearchable = true,
  showSelected = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <Select
          {...{
            name,
            options,
            required,
            isLoading,
            className,
            isDisabled,
            isClearable,
            styles: colorStyles(errorMessage || ""),
            placeholder,
            isSearchable,

            value: options?.find((x) => x.value === value) || defaultValue,
            onChange: (selectedOption: OptionsInterface | any) => {
              if (selectedOption) {
                onChange(selectedOption.value);
                handleChange && handleChange(selectedOption.value);
              }
            },
          }}
          hideSelectedOptions={showSelected}
        />
      )}
    />
  );
};
CustomSelect.defaultProps = {};

export default CustomSelect;
