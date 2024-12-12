import { useCallback, useContext, useMemo } from "react";

import Button from "@/components/button";

import { CreateProjectContext } from "@/context/create-project/index";

import { TemplateTabPropsContextInterface } from "../interface";

import cross from "@/assets/cross.svg";
import addTemplate from "@/assets/plus.png";

import styles from "../../index.module.scss";

const TemplateTabCards: React.FC = () => {
  const {
    project,
    deleteSelectedTemplate,
    cancelActiveTemplateId,
    clickOnSelectedTemplate,
    handleSelectTemplateOpen,
    closeAllSelectedTemplate,
  } = useContext<TemplateTabPropsContextInterface>(CreateProjectContext as any);

  const { id, activeTemplateId, activeTemplateUuid, selectedTemplates, templates } = project;

  const selectedTemplateReversed = useMemo(() => {
    return selectedTemplates?.slice()?.reverse() || [];
  }, [project]);

  const selectedTemplateReversedClassNames = useCallback(
    ({ uuid }: { uuid: string }) => {
      return `${styles.tab} ${
        activeTemplateId &&
        !["assembly", false].includes(activeTemplateId) &&
        activeTemplateUuid === uuid &&
        styles.tabActive
      }`;
    },
    [activeTemplateId, activeTemplateUuid],
  );

  return (
    <div className={styles.tabs} key={id}>
      <div className={styles.selectedTemplates}>
        {selectedTemplateReversed?.map(({ label = "", value = "", uuid }, index) => (
          <div
            aria-hidden="true"
            key={uuid || index}
            className={selectedTemplateReversedClassNames({ uuid })}
            onClick={(e) => {
              e.stopPropagation();
              clickOnSelectedTemplate &&
                clickOnSelectedTemplate({
                  uuid,
                  index,
                  value,
                  ssJson: templates?.[index]?.ssJson || false,
                  clickMediaColor: null,
                });
            }}
          >
            <span>{label}</span>
            <img
              aria-hidden="true"
              src={cross}
              alt="cross-icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteSelectedTemplate &&
                  deleteSelectedTemplate({ templates, selectedTemplates, value, uuid });
              }}
            />
          </div>
        ))}
      </div>
      <div className={styles.activeTemplateId}>
        <Button
          tooltip="Select Template"
          icon={addTemplate}
          iconSize={{ width: 15, height: 15 }}
          titleStyles={{ fontSize: "9px" }}
          className={styles.btnClassName}
          handleClick={() => handleSelectTemplateOpen && handleSelectTemplateOpen()}
        />
        <Button
          aria-hidden="true"
          icon={cross}
          disabled={activeTemplateId ? false : true}
          iconSize={{ width: 12, height: 10 }}
          tooltip="Click to close template"
          className={styles.templateCloseButton}
          handleClick={(e) => {
            e.stopPropagation();
            closeAllSelectedTemplate && closeAllSelectedTemplate();
          }}
        />
      </div>

      {id && activeTemplateId && (
        <div className={styles.tabs}>
          <Button icon={cross} handleClick={cancelActiveTemplateId} />
        </div>
      )}
    </div>
  );
};

export default TemplateTabCards;
