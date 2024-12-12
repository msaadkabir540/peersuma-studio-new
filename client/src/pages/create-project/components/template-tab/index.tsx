import { useContext, useEffect } from "react";

import Modal from "@/components/modal";
import FieldsPane from "../fields-pane";
import Button from "@/components/button";

import { useTemplateTab } from "./helper";
import { UpdateProjectEnum } from "@/context/create-project/types";
import { CreateProjectContext } from "@/context/create-project/index";

import { TemplateInterface, TemplateTabPropsInterface } from "../interface";

import downloadIcon from "@/assets/download.svg";
import cancelCross from "@/assets/cancelClose.svg";

import styles from "../../index.module.scss";

const TemplateTab: React.FC<TemplateInterface> = ({ handleClipClicks }) => {
  const { watch, project, dispatchProject } = useContext<TemplateTabPropsInterface>(
    CreateProjectContext as unknow,
  );

  const {
    loading,
    isPlaying,
    currentTime,
    mergePlayer,
    setIsPlaying,
    themesOptions,
    currentVideo,
    currentIndex,
    setCurrentTime,
    setMergePlayer,
    setCurrentIndex,
    setCurrentVideo,
    moveMediaToField,
    templeStylesOptions,
  } = useTemplateTab({ watch, project, dispatchProject });

  const { ssJsonModal, mailBox = false } = project;

  const downloadPythonFile = (ssJsonModal: string) => {
    const filePath = ssJsonModal.replace(/\.\//g, "/");
    const downloadFilePath = import.meta.env.VITE_DOWNLOAD_PY;
    const result = downloadFilePath + filePath;
    return result;
  };

  useEffect(() => {
    if (!currentVideo?.url) {
      dispatchProject({ type: UpdateProjectEnum.HANDLE_EMPTY_VIDEOPLAYER_CLICKEVENT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo?.url]);

  return (
    <div>
      <>
        <div className={styles.subContainer}>
          <div className={styles.fieldPane}>
            <FieldsPane
              loading={loading}
              isPlaying={isPlaying}
              currentTime={currentTime}
              mergePlayer={mergePlayer}
              currentVideo={currentVideo}
              currentIndex={currentIndex}
              themesOptions={themesOptions}
              setIsPlaying={setIsPlaying}
              setMergePlayer={setMergePlayer}
              setCurrentTime={setCurrentTime}
              setCurrentIndex={setCurrentIndex}
              setCurrentVideo={setCurrentVideo}
              handleClipClicks={handleClipClicks}
              moveMediaToField={moveMediaToField}
              templeStylesOptions={templeStylesOptions || []}
            />
          </div>
        </div>
      </>

      {mailBox && ssJsonModal && (
        <Modal
          className={styles.modalWidth}
          {...{
            open: mailBox,
            handleClose: () =>
              dispatchProject({ type: UpdateProjectEnum.ERROR_MODAL, mailBox: false }),
          }}
        >
          <div className={styles.confirmModalContainer}>
            <div className={styles.modalText}>
              <img src={cancelCross} alt="cancelCross" />
              Error in Python file, Please click to download file,
            </div>
            <div className={styles.modalBUtton}>
              <a
                href={downloadPythonFile(ssJsonModal)}
                download="Python File"
                rel="noopener noreferrer"
              >
                <Button
                  title="Download File"
                  type="button"
                  icon={downloadIcon}
                  className={styles.downloadBtn}
                  handleClick={() =>
                    dispatchProject({ type: UpdateProjectEnum.ERROR_MODAL, mailBox: false })
                  }
                />
              </a>
              <Button
                title="close"
                type="button"
                className={styles.cancelBtn}
                handleClick={() =>
                  dispatchProject({ type: UpdateProjectEnum.ERROR_MODAL, mailBox: false })
                }
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TemplateTab;
