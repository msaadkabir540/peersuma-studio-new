import React, { memo, useContext, useMemo } from "react";

import { SelectedTemplateModalPropsInterface } from "./interface";

import Input from "@/components/input";
import Modal from "@/components/modal";
import crossIcon from "@/assets/cross.svg";
import crossFat from "@/assets/cross-fat.svg";

import styles from "../index.module.scss";
import { CreateProjectContext } from "@/context/create-project/index";

const SelectedTemplateModal: React.FC = () => {
  const {
    watch,
    errors,
    project,
    setValue,
    register,
    templates,
    showSelectTemplate,
    selectTemplateHandler,
    handleSelectTemplateModalClose,
  } = useContext<SelectedTemplateModalPropsInterface>(CreateProjectContext as any);
  const { templateOptions } = project;

  const templateOptionsMap = useMemo(() => {
    return templateOptions
      ?.filter((option) => {
        const regex = new RegExp(watch("searchTemplate"), "i");
        return regex.test(option?.label) || regex.test(option?.description);
      })
      ?.map((y) => {
        const templateLength = templates?.filter((x) => x?.value === y?.value).length;
        return {
          ...y,
          templatesLength: templateLength ? templateLength : "",
        };
      });
  }, [templateOptions, watch("searchTemplate"), templates]);

  return (
    <Modal
      {...{
        open: showSelectTemplate,
        handleClose: () => {
          handleSelectTemplateModalClose && handleSelectTemplateModalClose();
        },
      }}
      className={styles.searchTemplateDiv}
    >
      <div className={styles.searchTemplateDiv}>
        <div>
          <div className={styles.field} style={{ marginBottom: "15px" }}>
            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="searchTemplate">Search</label>
              <img
                aria-hidden="true"
                alt="crossIcon"
                src={crossIcon}
                style={{
                  cursor: "pointer",
                }}
                onClick={handleSelectTemplateModalClose}
              />
            </div>
            <Input
              name="searchTemplate"
              register={register}
              {...{
                ...(watch("searchTemplate") && {
                  icon: crossFat,
                  iconClass: styles.iconClass,
                  onClick: () => {
                    setValue("searchTemplate", "");
                  },
                }),
              }}
              placeholder="Type Name, Description..."
              errorMessage={errors?.searchTemplate?.message}
              className={styles.searchTemplateInput}
            />
            <div className={styles.optionsList}>
              {templateOptionsMap?.map(({ value, label, description, templatesLength }) => (
                <div
                  aria-hidden="true"
                  key={value}
                  className={styles.optionRow}
                  onClick={() => {
                    selectTemplateHandler({ value, label, description });
                  }}
                >
                  <span>{label}</span>
                  <p>{description}</p>
                  {templatesLength ? <sub>{templatesLength}</sub> : ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(SelectedTemplateModal);
