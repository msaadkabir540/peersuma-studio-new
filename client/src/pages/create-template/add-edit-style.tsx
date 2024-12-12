import { memo } from "react";

import Input from "@/components/input";
import Button from "@/components/button";
import TextArea from "@/components/textarea";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import { s3TransloaditCompletionCheck, s3TransloaditUploadMap } from "@/utils/helper";

import { AddEditStyleInterface } from "./template-interface";
import { S3TransloaditUploadMapResultInterface } from "@/utils/interface/interface-helper";

import styles from "./index.module.scss";

const AddEditStyle: React.FC<AddEditStyleInterface> = ({
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
}) => {
  const templateCurrentStyleName = `templateStyles.[${currentStyleIndex}].name`;
  const watchVlaue = watch(templateCurrentStyleName as any);
  return (
    <div className={styles.styleEdit}>
      <h2>
        {currentStyleIndex === prevTemplate?.templateStyles?.length ? "Add Style" : "Update Style"}
      </h2>
      <div className={styles.field}>
        <label htmlFor={`templateStyles.[${currentStyleIndex}].name`}>Name</label>
        <Input
          name={`templateStyles.[${currentStyleIndex}].name`}
          register={register}
          placeholder="Enter Template Name"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`templateStyles.[${currentStyleIndex}].description`}>Description</label>
        <TextArea
          name={`templateStyles.[${currentStyleIndex}].description`}
          placeholder={"Enter Description"}
          register={register}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`templateStyles.[${currentStyleIndex}].styles_py`}>Style UI.py</label>
        <TextArea
          rows={23}
          name={`templateStyles.[${currentStyleIndex}].styles_py`}
          register={register}
        />
      </div>
      <div className={styles.btnDivBottom}>
        <div>
          <Button
            title="Save"
            type="button"
            loaderClass={styles.loading}
            disabled={!watchVlaue}
            isLoading={isCreateLoading}
            handleClick={() => handleClickSave()}
          />
          <Button title="Cancel" type="button" handleClick={() => handleCloseStyle()} />
        </div>
        <Button
          title="Upload Template Video"
          type="button"
          handleClick={() => handleUploadModalOpen()}
        />
      </div>
      {fieldName === true && (
        <TransloaditUploadModal
          {...{
            fieldName,
            handleCloseModal,
            minNumberOfFiles: 1,
            maxNumberOfFiles: 1,
            allowedFileTypes: ["video/*"],
            mapUploads: s3TransloaditUploadMap,
            completionCheck: s3TransloaditCompletionCheck,
            template_id: import.meta.env.VITE_TEMPLATE_SAMPLE_VIDEO_TEMPLATE_ID,
            fields: {
              prefix: `/templateSampleVideo/`,
              fileName: `templateSampleVideo/style-${watchVlaue}`,
            },
            setUploads: ({ uploads }: { uploads: S3TransloaditUploadMapResultInterface[] }) => {
              const templateStyles = [...(structuredClone(watch())?.templateStyles || [])];
              templateStyles[currentStyleIndex] = {
                ...templateStyles[currentStyleIndex],
                sampleVideoUrl: uploads[0]?.url,
                sampleVideoS3Key: uploads[0]?.s3Key,
              };
              handleOnSubmitStyleData(templateStyles);
            },
          }}
        />
      )}
    </div>
  );
};

export default memo(AddEditStyle);
