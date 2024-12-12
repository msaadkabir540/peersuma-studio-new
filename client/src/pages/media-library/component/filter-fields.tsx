import React from "react";

import Input from "@/components/input";
import Button from "@/components/button";
import SelectBox from "@/components/multi-select-box";

import { FilterFieldsInterface } from "../media-library-interface";

import crossFat from "@/assets/cross-fat.svg";

import styles from "../index.module.scss";

const FilterFields: React.FC<FilterFieldsInterface> = ({
  watch,
  reset,
  control,
  register,
  setValue,
  fileTypes,
  categories,
  handelSetFileName,
}) => {
  return (
    <>
      <div className={styles.filters}>
        <div className={styles.field} style={{ width: "50%" }}>
          <Input
            label="Search"
            name="file-search"
            register={register}
            className={styles.SearchInput}
            iconClass={styles.searchIconContainer}
            iconEleClass={styles.searchIcon}
            {...{
              ...(watch("file-search") && {
                icon: crossFat,
                onClick: () => {
                  setValue("file-search", "");
                },
              }),
            }}
          />
        </div>
        <div className={styles.field} style={{ width: "50%" }}>
          <SelectBox
            badge
            isMulti
            showSelected
            control={control}
            label="Tags"
            name="file-categories"
            placeholder={"Select"}
            options={categories || []}
            wrapperClass={styles.multiSelect}
            selectBoxClass={styles.selectBox}
          />
        </div>
        <div className={styles.field} style={{ width: "50%" }}>
          <SelectBox
            isMulti
            showSelected
            label="Types"
            name="file-types"
            control={control}
            placeholder={"Select"}
            options={fileTypes || []}
            wrapperClass={styles.multiSelect}
            selectBoxClass={styles.selectBox}
          />
        </div>
        <Button
          title="Reset"
          type="button"
          className={styles.search}
          handleClick={() => {
            reset({
              ...watch(),
              page: 1,
              search: "",
              sortBy: "",
              pageSize: 30,
              sortOrder: "",
              categories: [],
              "file-search": "",
              "file-categories": [],
              "file-types": [],
            });
          }}
        />
      </div>
      <div className={styles.uploadBtn}>
        <Button title="Upload" type="button" handleClick={() => handelSetFileName()} />
      </div>
    </>
  );
};

export default FilterFields;
