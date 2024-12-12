import React, { memo, useState } from "react";

import Button from "@/components/button";
import Loading from "@/components/loading";

import AddEditStyle from "./add-edit-style";

import {
  StyleComponentInterface,
  DeleteingInterface,
  TemplatesInterface,
} from "./template-interface";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";
import videoLogo from "@/assets/videoLogo.png";

import styles from "./index.module.scss";

const Styles: React.FC<StyleComponentInterface> = ({
  watch,
  reset,
  register,
  handleStyleSave,
  isCreateLoading,
  handleOnSubmitStyleData,
}) => {
  const [fieldName, setFieldName] = useState<boolean>(false);
  const [prevTemplate, setPrevTemplate] = useState<TemplatesInterface>({} as TemplatesInterface);
  const [currentStyleIndex, setCurrentStyleIndex] = useState<number>(0);
  const [currentStyle, setCurrentStyle] = useState<boolean>(false);
  const [isDeleteStyle, setIsDeleteStyle] = useState<DeleteingInterface>({
    isLoading: false,
    isIndex: 0,
  });

  const handleCloseModal = () => {
    setFieldName(false);
  };

  const handleAddStyle = () => {
    setCurrentStyle(true);
    setCurrentStyleIndex(watch?.("templateStyles")?.length || 0);
    setPrevTemplate(structuredClone({ ...watch() }));
  };

  const handleDeleteStyle: (index: number) => void = async (index) => {
    setIsDeleteStyle((prev) => ({
      ...prev,
      isLoading: true,
      isIndex: index,
    }));
    const newTemplateStyles = watch("templateStyles")?.filter((_, i) => i !== index);

    await handleOnSubmitStyleData(newTemplateStyles);
    setIsDeleteStyle((prev) => ({
      ...prev,
      isLoading: false,
      isIndex: 0,
    }));
  };

  const handleClickSave: () => void = async () => {
    await handleStyleSave();
    setCurrentStyle(false);
    setPrevTemplate({} as TemplatesInterface);
  };

  const handleCloseStyle: () => void = async () => {
    setCurrentStyle(false);
    reset({ ...prevTemplate });
    setPrevTemplate({} as TemplatesInterface);
  };

  const handleClickEdit: (index: number) => void = async (index) => {
    setCurrentStyle(true);
    setCurrentStyleIndex(index);
    setPrevTemplate(structuredClone({ ...watch() }));
  };

  const handleUploadModalOpen: () => void = () => {
    setFieldName(true);
  };

  return (
    <div className={styles.ui}>
      <div className={styles.addBtnDiv}>
        <Button title="+ add style" type="button" handleClick={handleAddStyle} />
      </div>
      {currentStyle === false && (
        <div className={styles.header}>
          <div className={styles.stylesCards}>
            {(prevTemplate?.templateStyles || watch("templateStyles"))?.map?.(
              ({ name, sampleVideoUrl }, index) => (
                <React.Fragment key={index}>
                  <div className={styles.card} key={index}>
                    <div className={styles.upperDiv}>
                      <span>{name}</span>
                      <div className={styles.flexClass}>
                        <img
                          aria-hidden="true"
                          src={editIcon}
                          alt="Edit Icon"
                          onClick={() => handleClickEdit(index)}
                        />
                        {isDeleteStyle?.isIndex === index && isDeleteStyle?.isLoading ? (
                          <Loading loaderClass={styles.loading} />
                        ) : (
                          <img
                            aria-hidden="true"
                            src={delIcon}
                            alt="Delete icon"
                            onClick={() => {
                              handleDeleteStyle(index);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className={styles.lowerDiv}>
                      {sampleVideoUrl ? (
                        <video height={350} width={350} controls autoPlay>
                          <source src={sampleVideoUrl} type="video/mp4" />
                          <track kind="captions" src={sampleVideoUrl} />
                        </video>
                      ) : (
                        <img src={videoLogo} alt="videoLogo" />
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ),
            )}
          </div>
        </div>
      )}
      {currentStyle !== false && currentStyleIndex > -1 && (
        <AddEditStyle
          {...{
            watch,
            register,
            fieldName,
            prevTemplate,
            handleClickSave,
            isCreateLoading,
            handleCloseStyle,
            handleCloseModal,
            currentStyleIndex,
            handleUploadModalOpen,
            handleOnSubmitStyleData,
          }}
        />
      )}
    </div>
  );
};

export default memo(Styles);
