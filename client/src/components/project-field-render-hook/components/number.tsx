import React from "react";

import Input from "@/components/input";

import { NumberPropsInterface } from "../interface";
import Button from "@/components/button";

const Number: React.FC<NumberPropsInterface> = ({
  index,
  value,
  styles,
  label,
  register,
  handleDelete,
  deleteStageIcon,
  handleNumberField,
}) => {
  return (
    <>
      <Input
        label={label}
        type="number"
        register={register}
        value={value || ""}
        className={styles.className}
        inputClass={styles.inputClass}
        name={`fields.[${index}].value`}
        onChange={(e) => {
          handleNumberField && handleNumberField(+e.target.value);
        }}
      />
      {deleteStageIcon && (
        <Button
          iconSize={{ width: 20, height: 20 }}
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

export default Number;
