import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";

import TextArea from "@/components/textarea";

import { TextPropsInterface } from "../interface";
import Button from "@/components/button";

type SelectValueType = {
  label: string;
  value: string;
} | null;

const Text: React.FC<TextPropsInterface> = ({
  index,
  label,
  value,
  styles,
  options,
  handleDelete,
  deleteStageIcon,
  handleSelectOption,
  handleTextInputField,
}) => {
  const [selectedValue, setSelectedValue] = useState<SelectValueType>(null);

  useEffect(() => {
    if (value) {
      setSelectedValue({ label: value, value: value });
    }
  }, []);

  return (
    <>
      {options && options?.length > 0 ? (
        <div className={styles.fieldsDiv}>
          <label htmlFor={label}>{label}</label>
          <CreatableSelect
            isClearable={true}
            styles={{
              control: (provided) => ({
                ...provided,
                background: "none",
                minHeight: "20px",
                maxHeight: "26px",
                backgroundColor: "red",
              }),
              singleValue: (provided) => ({
                ...provided,
                fontSize: "12px !important",
              }),
              option: (provided) => ({
                ...provided,
                fontSize: "12px !important",
                marginTop: "-10px",
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                padding: "0px !important",
                marginTop: "-5px",
              }),
              valueContainer: (provided) => ({
                ...provided,
                marginTop: "-10px !important",
              }),
              placeholder: (provided) => ({
                ...provided,
                fontSize: "12px",
                color: "#c0c0c0",
                fontWeight: 400,
                fontFamily: "Poppins",
                marginTop: "3px",
              }),
            }}
            name={`fields.[${index}].value`}
            onChange={(selectedOption) => {
              if (selectedOption && !handleSelectOption) {
                return selectedOption;
              }
              if (selectedOption && handleSelectOption) {
                handleSelectOption && handleSelectOption(selectedOption?.value);
              }
              if (selectedOption) {
                setSelectedValue({ label: selectedOption.label, value: selectedOption.value });
              } else {
                setSelectedValue(null);
                handleSelectOption && handleSelectOption("");
              }
            }}
            options={options?.map((x) => ({ label: x, value: x })) as []}
            value={selectedValue}
          />
        </div>
      ) : (
        <TextArea
          label={label}
          value={value}
          className={styles.className}
          onChange={(e) => {
            handleTextInputField && handleTextInputField(e.target.value);
          }}
          inputClass={styles.inputClass}
          name={`fields.[${index}].value`}
        />
      )}
      {deleteStageIcon && (
        <Button
          icon={deleteStageIcon}
          type="button"
          tooltip={"Click to Delete Field"}
          handleClick={() => {
            handleDelete && handleDelete();
          }}
        />
      )}
    </>
  );
};

export default Text;
