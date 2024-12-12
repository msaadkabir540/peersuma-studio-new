import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Input from "@/components/input";
import TextArea from "@/components/textarea";
import Button from "@/components/button";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import { createThemes, getThemeById, updateThemeById } from "@/api-services/themes";
import { s3TransloaditCompletionCheck, s3TransloaditUploadMap } from "@/utils/helper";

import { S3TransloaditUploadMapResultInterface } from "@/utils/interface/interface-helper";
import { ThemesFieldsInterface } from "./add-update-themes-interface";

import styles from "./index.module.scss";

const AddEditThemes: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ThemesFieldsInterface>({
    defaultValues: {
      themesDescription: "",
      themes_py: "",
    },
  });

  const [fieldName, setFieldName] = useState<boolean>(false);

  const getThemesById = async ({ id }: { id: string }) => {
    const res = await getThemeById({ id });
    setValue("themeName", res?.themeName);
    setValue("themes_py", res?.themes_py);
    setValue("themesDescription", res?.themesDescription);
  };

  const onSubmit = async (data: any) => {
    let res;
    try {
      id ? (res = await updateThemeById({ id, data })) : (res = await createThemes({ data }));
      if (res.status === 200) {
        navigate("/themes");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => setFieldName(false);

  const handleOnSubmitStyleData = (templateTheme: any) => {
    setValue("sampleVideoUrl", templateTheme?.sampleVideoUrl);
    setValue("sampleVideoS3Key", templateTheme?.sampleVideoS3Key);
    setValue("themeVideoThumbnailUrl", templateTheme?.themeVideoThumbnailUrl);
  };

  useEffect(() => {
    id && getThemesById({ id });
  }, [id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.styleEdit}>
        <h2>{id ? "update Theme" : "Add Theme"}</h2>
        <div className={styles.field}>
          <label htmlFor="Name">Name</label>
          <Input name={"themeName"} register={register} placeholder="Enter Theme Name" />
        </div>
        <div className={styles.field}>
          <label htmlFor="Name">Description</label>
          <TextArea
            rows={4}
            name={`themesDescription`}
            placeholder={"Enter Description"}
            register={register}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`themes_py`}>Themes UI.py</label>
          <TextArea rows={15} name={`themes_py`} register={register} />
        </div>
        <div className={styles.btnDivBottom}>
          <div className={styles.btnDivBottom}>
            <Button
              title={id ? "update" : "Save"}
              type="submit"
              loaderClass={styles.loading}
              disabled={!watch("themeName")}
              isLoading={isSubmitting}
            />
            <Button title="Cancel" type="button" handleClick={() => navigate("/themes")} />
          </div>
          <div>
            <Button
              title="Upload Template Video"
              type="button"
              handleClick={() => setFieldName(true)}
            />
          </div>
        </div>
        {fieldName === true && (
          <TransloaditUploadModal
            {...{
              fieldName,
              handleCloseModal: () => handleClose(),
              minNumberOfFiles: 1,
              maxNumberOfFiles: 1,
              allowedFileTypes: ["video/*"],
              mapUploads: s3TransloaditUploadMap,
              completionCheck: s3TransloaditCompletionCheck,
              template_id: import.meta.env.VITE_TEMPLATE_SAMPLE_VIDEO_TEMPLATE_ID,
              fields: {
                prefix: `/templateSampleVideo/`,
                fileName: `templateSampleVideo/style-${watch("themeName")}`,
              },
              setUploads: ({ uploads }: { uploads: S3TransloaditUploadMapResultInterface[] }) => {
                const templateTheme = {
                  sampleVideoUrl: uploads[0]?.url,
                  sampleVideoS3Key: uploads[0]?.s3Key,
                  themeVideoThumbnailUrl: uploads[0]?.thumbnailUrl,
                };
                handleOnSubmitStyleData(templateTheme);
                uploads && handleClose();
              },
            }}
          />
        )}
      </div>
    </form>
  );
};

export default AddEditThemes;
