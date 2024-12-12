import { memo, useEffect, useMemo, useState } from "react";

import { types } from "./staging-reducer";

import Button from "@/components/button";
import Input from "@/components/input";
import Modal from "@/components/modal";
import MultiSelectBox from "@/components/multi-select-box";

import { StagingModalInterface } from "./staging-interface";

import styles from "./index.module.scss";

const StagingModal: React.FC<StagingModalInterface> = ({
  control,
  dispatch,
  stageModal,
  stagingFields,
}) => {
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [errorFieldName, setErrorFieldName] = useState("");
  const [selectOptions, setSelectOptions] = useState(fieldOptions[2]?.value);

  const selectionFieldOption = useMemo(() => {
    return fieldOptions.find((fieldOption) => selectOptions === fieldOption?.value);
  }, [selectOptions]);

  useEffect(() => {
    if (stagingFields?.length) {
      stagingFields.length < 9
        ? setText(`cell 00${stagingFields.length + 1}`)
        : setText(`cell 0${stagingFields.length + 1}`);
    } else {
      setText(`cell 001`);
    }
  }, [stagingFields]);

  const handleAddFields = () => {
    const isFieldNameExist = stagingFields?.some((item) => item?.name === text);
    if (isFieldNameExist) {
      setErrorFieldName("Label already exists");
    } else if (text.trim().length === 0 || selectOptions === null) {
      setError("Required Field");
    } else {
      dispatch({
        type: types.Add_Field_Stage,
        text: text,
        fieldType: selectOptions,
        fieldName: text,
      });
      dispatch({ type: types.Close_Modal });
      setText("");
      setError("");
      setErrorFieldName("");
    }
  };

  const handleInputValue = ({ value }: { value: string }) => {
    if (value.trim().length === 0) {
      setError("Required Field");
      setText(value);
    } else {
      setText(value);
      setError("");
    }
  };

  return (
    <Modal
      {...{
        open: stageModal,
        handleClose: () => {
          dispatch({ type: types.Close_Modal });
        },
      }}
      className={styles.modal}
    >
      <>
        <h3>Select Staging Fields</h3>
        <Input
          label={"Label"}
          name="labelName"
          type="text"
          value={text}
          inputClass={styles.inputClass}
          onChange={(e) => {
            handleInputValue({ value: e.target.value });
          }}
          className={`${error !== "" || errorFieldName !== "" ? styles.inputField : ""}`}
          errorMessagefield={error !== "" || errorFieldName !== ""}
          errorMessage={errorFieldName || error || ""}
        />

        <MultiSelectBox
          wrapperClass={`${error !== "" || errorFieldName !== "" ? styles.inputField : ""}`}
          control={control}
          mediaOption={true}
          name="fieldOptions"
          options={fieldOptions}
          defaultValue={selectionFieldOption}
          label={"Select Field Type"}
          placeholder="Select Field Type"
          handleChange={(x) => {
            setSelectOptions(x as string);
          }}
        />
        {selectOptions === null && <span className={styles.SelectError}>{error}</span>}
        <div className={styles.btnContainer}>
          <Button
            title={"Add Field"}
            handleClick={() => {
              handleAddFields();
            }}
          />
          <Button
            title={"Close"}
            handleClick={() => {
              setError("");
              dispatch({ type: types.Close_Modal });
            }}
          />
        </div>
      </>
    </Modal>
  );
};

export default memo(StagingModal);

const fieldOptions = [
  { label: "Image Field", value: "image" },
  { label: "Audio Field", value: "audio" },
  { label: "Video Field", value: "video" },
];
