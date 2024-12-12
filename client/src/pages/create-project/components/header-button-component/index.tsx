import { memo, useContext } from "react";
import { writeText } from "clipboard-polyfill";
import { JsonEditor as Editor } from "jsoneditor-react";

import Modal from "@/components/modal";
import Switch from "@/components/switch";
import Button from "@/components/button";
import createNotification from "@/common/create-notification";

import { UpdateProjectEnum } from "@/context/create-project/types";
import { CreateProjectContext } from "@/context/create-project/index";

import {
  HeaderButtonComponentInterface,
  HeaderButtonComponentContextInterface,
} from "./header-button-component-interface";

import ssJsonIcons from "@/assets/code.png";
import renderedIcons from "@/assets/render.png";
import updateIcons from "@/assets/update-icon.svg";

import styles from "../../components/media-player-container/index.module.scss";

const HeaderButtonComponent: React.FC<HeaderButtonComponentInterface> = ({
  renderVideo,
  isSSJsonLoading,
  handleCloseMedia,
  isFinalVideoLoading,
  handleGenerateSSJson,
}) => {
  const {
    id,
    watch,
    control,
    project,
    isLoading,
    dispatchProject,
    draftHandleEvent,
    stagingHandleEvent,
    updateAndSaveEvents,
    assemblyHandleEvent,
    templateHandleEvent,
  } = useContext<HeaderButtonComponentContextInterface>(CreateProjectContext as any);

  const HandleDownloadFile = ({ jsonData }: { jsonData: boolean | null }) => {
    const fileName = "ssJosnfile.json";
    const data = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const jsonURL = window.URL.createObjectURL(data);

    const link = document.createElement("a");
    link.href = jsonURL;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.projectButtonContainer}>
      {project?.activeTab !== "assembly" &&
        project?.activeTab !== "stagingTab" &&
        project?.activeTemplateId && (
          <>
            <span className={styles.switchClass}>
              <Switch
                control={control}
                className={styles.switchClassChild}
                name={"mySwitch"}
                defaultValue={false}
                silderClass={styles.silderClass}
                switchContainer={styles.switchContainer}
                title={watch("mySwitch") ? "High resolution" : "Low resolution"}
              />
            </span>
            <Button
              type="button"
              tooltip={"Render"}
              icon={renderedIcons}
              handleClick={() => {
                dispatchProject({
                  type: UpdateProjectEnum.FINAL_VIDEO_RENDERED,
                  mergeFileName: { callback: renderVideo },
                });
              }}
              iconSize={{ width: 27, height: 27 }}
              isLoading={isFinalVideoLoading}
              loaderClass={styles.loaderClass}
              className={`${styles.generateButton} ${styles.createButton}`}
            />
            <Button
              type="button"
              icon={ssJsonIcons}
              isLoading={isSSJsonLoading}
              tooltip={"Generate SS Json"}
              loaderClass={styles.loaderClass}
              iconSize={{ width: 25, height: 25 }}
              handleClick={handleGenerateSSJson}
              className={`${styles.generateButton} ${styles.createButton}`}
            />
          </>
        )}
      <div className={styles.buttonBox}>
        <Button
          type="button"
          title="Staging"
          tooltip={"Staging"}
          handleClick={() => {
            stagingHandleEvent();
            handleCloseMedia();
          }}
          titleClass={styles.titleClass}
          className={`${project?.activeTab === "stagingTab" ? styles.ActiveBtn : ""} ${
            styles.generateButton
          }`}
        />
        <Button
          type="button"
          title="Template"
          tooltip={"Template"}
          handleClick={() => {
            templateHandleEvent();
            handleCloseMedia();
          }}
          titleClass={styles.titleClass}
          className={`${project?.activeTab === "templateTab" ? styles.ActiveBtn : ""} ${
            styles.generateButton
          }`}
        />
        <Button
          type="button"
          title="Assembly"
          tooltip={"Assembly"}
          handleClick={() => {
            assemblyHandleEvent();
            handleCloseMedia();
          }}
          titleClass={styles.titleClass}
          className={`${project?.activeTab === "assembly" ? styles.ActiveBtn : ""} ${
            styles.generateButton
          }`}
        />
        <Button
          type="button"
          title="Drafts"
          tooltip={"Drafts"}
          handleClick={() => {
            draftHandleEvent();
            handleCloseMedia();
          }}
          titleClass={styles.titleClass}
          className={`${project?.activeTab === "drafts" ? styles.ActiveBtn : ""} ${
            styles.generateButton
          }`}
        />
      </div>
      <Button
        tooltip={id ? "Update" : "Save"}
        type="submit"
        isLoading={isLoading}
        icon={updateIcons}
        iconSize={{ width: 20, height: 20 }}
        className={` ${styles.createButton}`}
        loaderClass={styles.loaderClass}
        handleClick={() => updateAndSaveEvents()}
      />
      {project?.ssJsonFinalModal && project?.ssJson && (
        <Modal
          {...{
            showCross: true,
            open: project?.ssJsonFinalModal,
            handleClose: () =>
              dispatchProject({
                type: UpdateProjectEnum.IS_SSJSON_FINAL_MODAL,
                ssJsonFinalModal: false,
              }),
          }}
          className={styles.jsonContainer}
          iconClassName={styles.jsonClass}
        >
          <div className={styles.ssJsonContainer}>
            <div className={styles.ssJsonButton}>
              <label htmlFor="ssJson">SS.json</label>
              <div style={{ display: "flex" }}>
                <Button
                  title={"Copy SSJson"}
                  handleClick={() => {
                    const data = JSON.stringify(project?.ssJson, null, 2);
                    writeText(data);
                    createNotification("success", "File Copy Successfully!");
                  }}
                />
                <Button
                  title={"Download SSJson"}
                  handleClick={() => {
                    HandleDownloadFile({ jsonData: project?.ssJson });
                  }}
                />
              </div>
            </div>
            <Editor value={project?.ssJson} mode={"code"} search={false} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default memo(HeaderButtonComponent);
