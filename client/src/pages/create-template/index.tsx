import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import "jsoneditor-react/es/editor.min.css";
import { useLocation, useNavigate, useParams, Location, NavigateFunction } from "react-router-dom";

import UI from "./ui";
import Info from "./info";
import Json from "./json";
import Styles from "./styles";
import Button from "@/components/button";
import Loading from "@/components/loading";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import { axiosApiRequest } from "@/utils/api";
import { UpdateTemplateById, createTemplates, getTemplateById } from "@/api-services/templates";

import createNotification from "@/common/create-notification";
import { s3TransloaditCompletionCheck, s3TransloaditUploadMap } from "@/utils/helper";

import { TemplateFieldInterface } from "./template-interface";
import { SSJsonObjectInterface } from "@/interface/json-interface";
import { TemplatesInterface } from "@/interface/template-interface";
import {
  FieldRenderers,
  S3TransloaditUploadMapResultInterface,
} from "@/utils/interface/interface-helper";

import styles from "./index.module.scss";

const CreateTemplate: React.FC = () => {
  const {
    watch,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplatesInterface>({
    defaultValues: {
      description: "",
      templateName: "",
      templateStyles: [],
      mediaFiles: [],
      createdAt: "",
      updatedAt: "",
      UIpy: "",
      ssJson: "",
      templateVideoUrl: "",
    },
  });
  const { id } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  const [active, setActive] = useState<number>(0);
  const [fieldName, setFieldName] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<SSJsonObjectInterface>({
    timeline: [],
    output: [],
    merge: [],
  });
  const [isEditInfo, setIsEditInfo] = useState<boolean>(false);
  const [templateFields, setTemplateFields] = useState<TemplateFieldInterface[]>([]);
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);
  const [isFieldLoading, setIsFieldLoading] = useState<boolean>(false);
  const [loader, setLoader] = useState({
    getTemplate: false,
    templateFields: false,
  });

  useEffect(() => {
    id && getTemplate();
  }, []);

  useEffect(() => {
    location?.pathname === "/create-template" && setIsEditInfo(true);
  }, [location?.pathname]);

  const handleTabClick: (index: number) => void = (index) => {
    id && setActive(index);
  };

  const onSubmit = async (data: TemplatesInterface) => {
    let res: any;
    setIsCreateLoading(true);
    if (id) {
      res = await UpdateTemplateById({ data, id });
    } else {
      res = await createTemplates({ data });
    }
    if (res.length != 0) {
      if (!id) {
        navigate(`/template/${res?.newTemplate?._id}`);
      }
      active === 0 && setIsEditInfo(false);
      if (id) {
        if (res?.newTemplate?.ssJson) {
          res.newTemplate.ssJson = JSON.parse(res?.newTemplate?.ssJson);
          setPlaceholder(res.newTemplate.ssJson);
        }
        res?.newTemplate && reset({ ...res.newTemplate });
      }
    } else {
      createNotification("error", res?.msg || "Failed to save template.", 5000);
    }
    setIsCreateLoading(false);
  };

  const getTemplate: () => void = async () => {
    setLoader((prev) => ({ ...prev, getTemplate: true }));
    try {
      // TODO need to discuse
      const res: any = await getTemplateById({ templateId: id });
      if (res && res?.ssJson) {
        res.ssJson = JSON.parse(res?.ssJson);
        setPlaceholder(res?.ssJson);
      }
      const templateData = { ...res };
      reset({ ...templateData });
    } catch (error) {
      console.error(error);
    } finally {
      setLoader((prev) => ({ ...prev, getTemplate: false }));
    }
  };

  const handleCloseModal: () => void = () => setFieldName(false);

  const handleModalOpen: () => void = () => setFieldName(true);

  const hanldeGetTemplateFields: (fieldRenderers: FieldRenderers) => void = async (
    fieldRenderers,
  ) => {
    setIsFieldLoading(true);
    const res = await axiosApiRequest({
      method: "get",
      url: `/project/get-fields`,
      params: { templateId: id, UIpy: watch("UIpy") },
    });
    if (res.status === 200 && Object.values(res.data.fields).length) {
      const keys = Object.keys(res.data.fields);
      const templateFieldsData = Object.values(res?.data?.fields)
        ?.filter((x: any) => Object.keys(fieldRenderers)?.includes(x.type))
        ?.map((x: any, index: number) => {
          return {
            ...x,
            name: keys[index],
            value: "",
            fieldLabel: "",
            render: fieldRenderers[x.type as never],
          };
        });
      setTemplateFields(templateFieldsData);
    } else {
      createNotification("error", res?.data?.msg || "Failed to fetch form fields.", 15000);
      setTemplateFields([]);
      setLoader((prev) => ({ ...prev, templateFields: false }));
    }
    setIsFieldLoading(false);
  };

  const handleOnSubmitStyleData: (newTemplateStyles: string[]) => void = (newTemplateStyles) => {
    const newTemplate: TemplatesInterface = {
      ...watch(),
      templateStyles: newTemplateStyles,
    };
    onSubmit(newTemplate);
    reset({ ...newTemplate });
  };

  const handleStyleSave: () => void = async () => {
    await onSubmit({ ...watch() });
  };

  const handleSubmitUploadMedia = ({
    uploads,
  }: {
    uploads: S3TransloaditUploadMapResultInterface[];
  }) => {
    onSubmit({
      ...watch(),
      templateVideoUrl: uploads[0]?.url,
      templateVideoS3Key: uploads[0]?.s3Key,
      templateVideoThumbnailUrl: uploads[0]?.thumbnailUrl,
      templateVideoThumbnailS3Key: uploads[0]?.thumbnailS3Key,
    });
  };

  const tabList = tabsName?.map((ele, index) => (
    <p
      aria-hidden="true"
      key={index}
      onClick={() => handleTabClick(index)}
      style={{ color: active === index ? "black " : "grey" }}
    >
      <span
        style={{
          color: !id && index == 3 ? "grey" : active === index ? "black" : "grey",
        }}
      >
        {active === index && "> "} {ele.name}
      </span>
    </p>
  ));

  return (
    <>
      {loader.getTemplate ? (
        <Loading pageLoader={true} diffHeight={1} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} id="templateForm">
          <div className={styles.header}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                title="< Back to List"
                type="button"
                handleClick={() => {
                  navigate("/templates");
                }}
              />
              <h2>{id ? "Update" : "Create"} Template</h2>
            </div>
            <div className={styles.tabs}>{tabList}</div>
          </div>
          {id && (
            <div className={styles.infoText}>
              <span>Template: {watch("templateName")}</span>
            </div>
          )}
          <div className={styles.topButtonDiv}>
            {active === 0 && (
              <>
                {id && (
                  <>
                    {!isEditInfo ? (
                      <Button
                        title={"Edit"}
                        type="button"
                        className={styles.createButton}
                        loaderClass={styles.loaderClass}
                        handleClick={() => {
                          setIsEditInfo(true);
                        }}
                      />
                    ) : (
                      <Button
                        title={"Cancel"}
                        type="button"
                        className={styles.createButton}
                        loaderClass={styles.loaderClass}
                        handleClick={() => {
                          setIsEditInfo(false);
                        }}
                      />
                    )}
                  </>
                )}
                <Button
                  title={id ? "Update" : "Create"}
                  type="submit"
                  className={styles.createButton}
                  loaderClass={styles.loaderClass}
                  disabled={!watch("templateName")}
                  isLoading={isCreateLoading}
                />
              </>
            )}
            {/* {active === 2 && (
            
            )} */}
          </div>
          {active === 0 && (
            <Info {...{ id, watch, register, errors, handleModalOpen, isEditInfo }} />
          )}
          {active === 1 && (
            <Json {...{ id, watch, loader, placeholder, isCreateLoading, setValue, errors }} />
          )}
          {active === 2 && (
            <UI
              {...{
                id,
                watch,
                register,
                templateFields,
                isFieldLoading,
                isCreateLoading,
                setTemplateFields,
                hanldeGetTemplateFields,
              }}
            />
          )}
          {active === 3 && (
            <Styles
              {...{
                watch,
                reset,
                register,
                handleStyleSave, // function to save the style
                isCreateLoading,
                handleOnSubmitStyleData, //  function to delete the style data
              }}
            />
          )}
        </form>
      )}
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
            fields: { prefix: `/templateSampleVideo/`, fileName: `templateSampleVideo/${id}` },
            setUploads: ({ uploads }: { uploads: S3TransloaditUploadMapResultInterface[] }) => {
              handleSubmitUploadMedia({ uploads });
            },
          }}
        />
      )}
    </>
  );
};

export default CreateTemplate;

const tabsName = [{ name: "Info" }, { name: "JSON" }, { name: "UI" }, { name: "Styles" }];
