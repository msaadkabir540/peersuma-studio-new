import React from "react";

import SelectBox from "@/components/multi-select-box";
import Button from "@/components/button";

import { UserPropsInterface } from "../interface";

const User: React.FC<UserPropsInterface> = ({
  value,
  label,
  control,
  styles,
  handleDelete,
  usersList = [],
  deleteStageIcon,
  handleSelectOptions,
}) => {
  return (
    <div className={styles.mainDiv}>
      <div className={deleteStageIcon ? styles.userStyles : styles.fieldsDiv}>
        <SelectBox
          name="users"
          options={usersList}
          control={control}
          label={label}
          mediaOption={true}
          showSelected={true}
          placeholder="Select User"
          defaultValue={value}
          handleChange={(x) => {
            const selectOptions = usersList?.find((users) => users?.value === x);
            handleSelectOptions && handleSelectOptions(selectOptions);
          }}
        />
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
      </div>
    </div>
  );
};

export default User;
