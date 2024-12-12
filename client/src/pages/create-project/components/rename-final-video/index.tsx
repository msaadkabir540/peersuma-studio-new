import { useContext } from "react";

import Input from "@/components/input";
import Modal from "@/components/modal";
import Button from "@/components/button";

import { UpdateProjectEnum } from "@/context/create-project/types";
import { CreateProjectContext } from "@/context/create-project/index";

import { RenameFinalFilePropsInterface } from "../interface";

import styles from "../../index.module.scss";

const RenameFinalFile: React.FC = () => {
  const { watch, errors, project, loading, setValue, register, dispatchProject } =
    useContext<RenameFinalFilePropsInterface>(CreateProjectContext as any);

  const handleCloseModal = () => {
    setValue("finalFileName", "");
    dispatchProject({
      type: UpdateProjectEnum.MODAL_RENDERED,
      mergeFileName: false,
    });
  };
  return (
    <Modal
      {...{
        className: styles.rename,
        open: project.mergeFileName,
        handleClose: () => handleCloseModal(),
        showCross: true,
      }}
    >
      <div className={styles.renameModalStyle}>
        <h3>Rename Final File:</h3>
        <div style={{ padding: "15px 0px" }}>
          <Input
            className={styles.renameModalClass}
            name="finalFileName"
            placeholder={"Enter Final file name"}
            register={register}
            errorMessage={errors?.finalFileName?.message}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button
              title={"submit"}
              isLoading={loading?.addUpdate}
              className={styles.createButton}
              loaderClass={styles.loaderClass}
              disabled={!watch("finalFileName")}
              handleClick={() => {
                project?.mergeFileName?.callback(watch("finalFileName"));
                setValue("finalFileName", "");
                dispatchProject({
                  type: UpdateProjectEnum.MODAL_RENDERED,
                  mergeFileName: false,
                });
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RenameFinalFile;
