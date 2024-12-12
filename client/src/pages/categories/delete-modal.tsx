import React from "react";

import Modal from "@/components/modal";
import Button from "@/components/button";

import { DeleteModalInterface } from "./categories-interface";

import delIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";

const DeleteModal: React.FC<DeleteModalInterface> = ({
  del,
  handleSetDelModalClose,
  hanldeCancelClick,
  handleDeleteClick,
  deleteCategoryId,
  _id,
  count,
}) => {
  return (
    <Modal
      {...{
        open: del === _id,
        handleClose: () => handleSetDelModalClose(),
      }}
      className={styles.bodyModal}
      modalWrapper={styles.opacityModal}
    >
      <div className={styles.deleteModal}>
        <img src={delIcon} height={50} alt="delIcon" />
        <h2>Delete Tag?</h2>
        <p>
          This category is being used in{" "}
          <span>
            {count || 0} {count === 1 ? "file" : "files"}
          </span>
          . If you delete this category, it will also be deleted from Media Library Category tags.
        </p>
        <div className={styles.buttonContainer}>
          <Button
            type="button"
            title="Cancel"
            ariaLabel="Cancel"
            handleClick={() => {
              hanldeCancelClick();
            }}
            className={styles.cancelBtn}
          />
          <Button
            type="button"
            title="Delete"
            ariaLabel="Delete"
            className={styles.delBtn}
            loaderClass={styles.loading}
            isLoading={deleteCategoryId === _id}
            handleClick={async () => {
              handleDeleteClick({ _id });
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
