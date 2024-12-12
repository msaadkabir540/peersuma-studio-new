import { useSelector } from "react-redux";

import Input from "@/components/input";
import Button from "@/components/button";
import crossFat from "@/assets/cross-fat.svg";
import SelectBox from "@/components/multi-select-box";
import CreateUpdateAlbum from "../create-update-album";

import { producerOptions } from "@/pages/library/create-update-library";

import { Users as UsersApiInterface } from "@/interface/account-interface";

import styles from "./index.module.scss";
import { useState } from "react";
import { HeaderAlbumInterface } from "../album-interface";

const Header: React.FC<HeaderAlbumInterface> = ({
  control,
  register,
  watch,
  setValue,
  updateAlbums,
}) => {
  const { users = [] as UsersApiInterface[] } = useSelector((state: any) => state.users);

  const [open, setOpen] = useState<boolean>(false);

  const handleModalClose = () => {
    setOpen(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Albums</div>
      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <Input
            name="search"
            label={"Search"}
            iconClass={styles.iconClass}
            placeholder={"Search Here"}
            register={register}
            className={styles.inputContainer}
            {...{
              ...(watch("search") && {
                icon: crossFat,
                onClick: () => {
                  setValue("search", "");
                },
              }),
            }}
          />
        </div>
        <div className={styles.field}>
          <SelectBox
            showSelected
            label={"Status"}
            name="status"
            isClearable
            control={control}
            placeholder={"Select"}
            options={statusOptions || []}
          />
        </div>
        <div className={styles.field}>
          <SelectBox
            showSelected
            label={"Producers"}
            name="producer"
            control={control}
            placeholder={"Select"}
            options={producerOptions(users) || []}
          />
        </div>
        <div className={styles.field}>
          <SelectBox
            showSelected
            label={"Sort"}
            name="sortOrder"
            control={control}
            placeholder={"Select"}
            options={sortOptions}
          />
        </div>
        <div className={styles.btnField}>
          <Button handleClick={() => setOpen(true)} title="Create" type="button" />
        </div>
      </div>
      <CreateUpdateAlbum {...{ open, handleModalClose, updateAlbums }} />
    </div>
  );
};

export default Header;

const statusOptions = [
  { label: "Open", value: "open" },
  { label: "Close", value: "closed" },
  { label: "InActive", value: "inactive" },
];

const sortOptions = [
  { label: "Last Modified", value: "Last Modified" },
  { label: "Oldest", value: "Oldest" },
  { label: "Alphabetical ascending", value: "Alphabetical ascending" },
  { label: "Alphabetical descending", value: "Alphabetical descending" },
];
