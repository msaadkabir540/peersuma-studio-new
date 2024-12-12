import { useState } from "react";

import { removeAlbumShotMedia } from "@/api-services/albumshot";

import Button from "@/components/button";
import Modal from "@/components/modal";
import SelectBox from "@/components/multi-select-box";

import { FilterFieldInterface } from "../album-interface";
import {
  RemoveAlbumShotMediaRequestInterface,
  RemoveAlbumShotMediaInterface,
} from "@/interface/album-shot-interface";

import styles from "./index.module.scss";

const FilterField: React.FC<FilterFieldInterface> = ({
  control,
  mediaIds,
  currentShotId,
  FilteredMedia,
  handleClearSelection,
  handleIncrementUpdatePage,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState<boolean>(false);

  const handleDeleteAll = async () => {
    setIsDeleteConfirmation(true);
    const params = {
      albumshotId: currentShotId,
      mediaIdsToDelete: mediaIds,
    } as RemoveAlbumShotMediaInterface;
    const isDeleted = await removeAlbumShotMedia(params as RemoveAlbumShotMediaRequestInterface);
    if (isDeleted) {
      handleIncrementUpdatePage();
    }
    setIsDeleteConfirmation(false);
    setDeleteConfirmation(false);
  };

  return (
    <div>
      {!mediaIds?.length ? (
        <div className={styles.filterContainer}>
          {FilteredMedia && (
            <div style={{ marginBottom: "5px" }}>{`Media (${FilteredMedia?.length})`}</div>
          )}
          <div className={styles.field}>
            <SelectBox
              showSelected
              label={"Filter"}
              name="status"
              control={control}
              placeholder={"Select"}
              options={statusOptions || []}
            />
          </div>
          <div className={styles.field}>
            <SelectBox
              showSelected
              label={"Sort"}
              name="sort"
              control={control}
              placeholder={"Select"}
              options={sortOptions || []}
            />
          </div>
        </div>
      ) : (
        <div className={styles.filterContainer}>
          <div className={styles.buttonBox}>
            <Button
              title={`Clear Selection`}
              type="button"
              handleClick={() => handleClearSelection()}
            />
          </div>
          <div className={styles.buttonBox}>
            <Button
              title={`Delete Selected Media (${mediaIds?.length})`}
              type="button"
              className={styles.cancelBtn}
              styles={{ border: "1px solid #ed1c24" }}
              titleStyles={{ color: "#ed1c24" }}
              handleClick={() => setDeleteConfirmation(true)}
            />
          </div>
        </div>
      )}

      <Modal
        className={styles.modalWidth}
        {...{
          open: deleteConfirmation,
          handleClose: () => setDeleteConfirmation(false),
        }}
      >
        <div className={styles.confirmModalContainer}>
          <div className={styles.modalText}>
            Are you sure you want to delete the selected ({mediaIds?.length}) media?
          </div>
          <div className={styles.modalBUtton}>
            <Button
              title="Yes"
              type="button"
              isLoading={isDeleteConfirmation}
              className={styles.cancelBtn}
              handleClick={() => handleDeleteAll()}
            />
            <Button
              type="button"
              title="No"
              className={styles.cancelBtn}
              handleClick={() => setDeleteConfirmation(false)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FilterField;

const statusOptions = [
  { label: "All Medias", value: "all" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
];

const sortOptions = [
  { label: "Last Modified", value: "Last Modified" },
  { label: "Oldest", value: "Oldest" },
  { label: "Alphabetical ascending", value: "Alphabetical ascending" },
  { label: "Alphabetical descending", value: "Alphabetical descending" },
];
