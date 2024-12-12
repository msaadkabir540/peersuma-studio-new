import _ from "lodash";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useState, useRef, memo } from "react";

import colorStyles from "./color-styles";

import { OptionsInterface, SelectBoxInterface } from "./multi-select-box-interface";

import formatOptionLabelList from "./format-option-label";

import "./style.scss";
import style from "./box.module.scss";

const SelectBox: React.FC<SelectBoxInterface> = ({
  name,
  label,
  badge,
  control,
  isMulti,
  handleChange,
  options = [],
  errorMessage,
  wrapperClass,
  defaultValue,
  showSelected,
  selectBoxClass,
  disabled = false,
  required = false,
  isClearable = true,
  isSearchable = true,
  mediaOption = false,
  placeholder = "None Selected",
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <>
      <div className={`${style.wraper} ${wrapperClass}`} ref={wrapperRef}>
        <label
          style={{
            color: errorMessage ? "#ff5050" : " #252733",
          }}
        >
          {label}
        </label>
        <div
          className={`${style.selectBox} ${selectBoxClass}`}
          style={{
            cursor: disabled ? "unset" : "",
          }}
        >
          {control && (
            <Controller
              name={name}
              control={control}
              render={({ field }) => {
                const tooltipText = _.isArray(field?.value)
                  ? field?.value.join(", ")
                  : _.isObject(field?.value)
                    ? // ? field?.value?.barStatus // TODO
                      field?.value
                    : field?.value;

                return disabled ? (
                  <div className={style.displayValueOnly}>{field.value}</div>
                ) : (
                  <div>
                    <Select
                      required={required}
                      menuIsOpen={isMenuOpen}
                      closeMenuOnSelect={!isMulti || !isMenuOpen}
                      closeMenuOnScroll={true}
                      onMenuOpen={() => setIsMenuOpen(true)}
                      onMenuClose={() => setIsMenuOpen(false)}
                      isMulti={isMulti}
                      formatOptionLabel={(data, metaData) =>
                        formatOptionLabelList({
                          data: {
                            badge: badge || false,
                            data,
                            metaData,
                            mediaOption,
                          },
                        })
                      }
                      hideSelectedOptions={showSelected ? false : true}
                      options={options}
                      styles={colorStyles({
                        // isEditMode: false,
                        errorMessage: "",
                        clearOption: true,
                        mediaOption,
                      })}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          text: "blue",
                          primary25: "pink",
                          primary: "black",
                        },
                      })}
                      className={`${style.selectClass}`}
                      {...field}
                      isDisabled={disabled}
                      value={defaultValue ?? setDefaultValueInSelectBox(field?.value, options)}
                      onChange={(selectedOption) => {
                        const value =
                          isMulti && _.isArray(selectedOption)
                            ? selectedOption?.map((e) => e.value)
                            : _.isObject(selectedOption) && "value" in selectedOption
                              ? selectedOption?.value
                              : null;

                        field.onChange(value);
                        handleChange && handleChange(value);
                        setTooltip(false);
                      }}
                      placeholder={placeholder}
                      classNamePrefix="your-selector"
                      isSearchable={isSearchable}
                      isClearable={isClearable}
                    />
                    {!isMenuOpen && tooltip && tooltipText ? (
                      <div className={style.tooltip}>
                        <div className={style.tooltipChild}>
                          <p className={style.tooltipText}>{tooltipText}</p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              }}
            ></Controller>
          )}
        </div>
      </div>
      {isMenuOpen && <div className={style.backdropDiv} onClick={() => setIsMenuOpen(false)}></div>}
    </>
  );
};

export default memo(SelectBox);

const setDefaultValueInSelectBox = (value: any, options: OptionsInterface[]) => {
  if (_.isString(value)) return options.find((c) => c.value === value || c?.label === value);
  if (_.isArray(value)) return options.filter((option) => value.includes(option.value));
  if (value) return options.find((c) => c.value === value || c?.label === value);
  // if (_.isObject(value)) return options.find((c) => c.value === value?.barStatus);
  return null;
};
