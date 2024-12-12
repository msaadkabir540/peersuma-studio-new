/* eslint-disable jsx-a11y/img-redundant-alt */
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import "jsoneditor-react/es/editor.min.css";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

import Info from "./info";
import ExecutiveInfo from "./exc-info";
import Button from "@/components/button";
import Loading from "@/components/loading";
import createNotification from "@/common/create-notification";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import { addClient, updateClientInStore } from "@/reducers/clients";
import {
  createClient,
  demoSchoolLogout,
  getClientById,
  updateClient,
} from "@/api-services/clients";
import { s3TransloaditCompletionCheck, s3TransloaditUploadMap } from "@/utils/helper";

import {
  CreateFormSchemaInterface,
  OnSubmitInterface,
  RouteParamsInterface,
} from "../clients-interface";

import { S3TransloaditUploadMapResultInterface } from "@/utils/interface/interface-helper";

import { usaStateName } from "./states";

import Upload from "@/assets/upload.svg";
import NoImage from "@/assets/noImage.png";

import styles from "./index.module.scss";

const CreateClient: React.FC = () => {
  const {
    watch,
    reset,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormSchemaInterface>({
    defaultValues: {
      url: "",
      name: "",
      state: "",
      S3Key: "",
      district: "",
      website: "",
      excProdName: "",
      thumbnailUrl: "",
      vimeoFolderName: "",
      executiveProducerEmail: "",
      executiveProducerContact: "",
    },
  });
  const { id } = useParams<RouteParamsInterface>();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch();

  const [loader, setLoader] = useState({
    getClient: false,
    isResetLoading: false,
    clientCreateUpdate: false,
  });

  const [schoolData, setSchoolData] = useState<any>();
  const [uploadModal, setUploadModal] = useState({
    isModal: false,
  });
  const [logoData, setLogoData] = useState<{
    S3Key: string | undefined;
    url: string | undefined;
    thumbnailUrl: string | undefined;
  }>({
    S3Key: "",
    url: "",
    thumbnailUrl: "",
  });

  const onSubmit = async (data: OnSubmitInterface) => {
    const updatedData = {
      ...schoolData,
      ...data,
      ...logoData,
      name: data?.name,
      website: data?.website,
      district: data?.district,
      state: data?.state as string,
    };

    setLoader((prev) => ({ ...prev, clientCreateUpdate: true }));

    if (!id) {
      updatedData.vimeoFolderName = data?.name?.replace(/\s+/g, "");
      updatedData.executiveProducerContact = updatedData?.executiveProducerContact
        ?.replace(/[^0-9]/g, "")
        .slice(-10);
    }

    if (updatedData?.vimeoFolderName === "") {
      updatedData.vimeoFolderName = updatedData?.name?.replace(/\s+/g, "");
    }
    const res = id
      ? await updateClient({ id: id, data: updatedData })
      : await createClient({ data: updatedData });
    if (res.status === 200) {
      if (id) {
        createNotification("success", "Client Updated Successfully!");
        dispatch(updateClientInStore({ id, data }));
        res.data?.newClient && reset({ ...res.data.newClient });
      } else {
        navigate(`/clients`);
        dispatch(addClient({ client: res.data.newClient }));
        createNotification("success", "Client Created Successfully!");
      }
    } else {
      createNotification("error", res?.data?.msg || res?.data?.error || "Failed to save.", 5000);
    }
    setLoader((prev) => ({ ...prev, clientCreateUpdate: false }));
  };

  const getClient = async () => {
    setLoader((prev) => ({ ...prev, getClient: true }));
    const res = await getClientById({ clientId: id as string });

    if (res.status === 200) {
      const setStateValue = usaStateName?.find((state) => {
        const stateValueLower = state?.value?.toLowerCase();
        const resStateLower = res?.data?.state?.toLowerCase();
        return stateValueLower === resStateLower;
      });

      setValue("name", res?.data?.name);
      setValue("website", res?.data?.website);
      setValue("state", setStateValue?.label as any);
      setValue("district", res?.data?.district);

      setLogoData(res.data);
      setSchoolData(res.data);
    }
    setLoader((prev) => ({ ...prev, getClient: false }));
  };

  useEffect(() => {
    id && getClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imageUrl = logoData?.url || logoData?.thumbnailUrl || NoImage;
  const nameField = watch("name")?.split(" ")?.join("");

  const handleRestDemoSchool = async () => {
    try {
      setLoader((prev) => ({ ...prev, isResetLoading: true }));
      const res = await demoSchoolLogout();
      if (res.status === 200) {
        createNotification("success", "Demo school data reset successfully!");
      }
    } catch (error) {
      createNotification("error", "Failed to reset demo school data.");
    }
    setLoader((prev) => ({ ...prev, isResetLoading: false }));
  };

  return (
    <>
      {loader?.getClient ? (
        <Loading pageLoader={true} diffHeight={1} />
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
            <div className={styles.header}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  title="< Back to List"
                  type="button"
                  handleClick={() => {
                    navigate("/clients");
                  }}
                />
                <h2>{id ? "Update" : "Create"} School</h2>
              </div>
            </div>
            {id && (
              <div className={styles.infoText}>
                <span>Client: {watch("name")}</span>
              </div>
            )}
            <div className={styles.topButtonDiv}>
              {id === import.meta.env.VITE_DEMO_SCHOOL_ID && (
                <Button
                  title="Reset Data"
                  type="button"
                  isLoading={loader?.isResetLoading}
                  handleClick={handleRestDemoSchool}
                />
              )}
              <Button
                type="submit"
                disabled={!watch("name")}
                className={styles.createButton}
                title={id ? "Update" : "Create"}
                loaderClass={styles.loaderClass}
                isLoading={loader?.clientCreateUpdate}
              />
            </div>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar_wrapper}>
                <img src={imageUrl} alt="Logo image" />
              </div>
              <Button
                icon={Upload}
                handleClick={() => setUploadModal((prev) => ({ ...prev, isModal: true }))}
                tooltip={"Upload Logo"}
                className={styles.createButton}
                loaderClass={styles.loaderClass}
              />
            </div>
            <div className={styles.activeTab}>
              <Info register={register} errors={errors} control={control} />
              {!id && <ExecutiveInfo register={register} errors={errors} />}
            </div>
          </form>
          {uploadModal?.isModal && (
            <TransloaditUploadModal
              {...{
                fieldName: uploadModal?.isModal,
                handleCloseModal: () => setUploadModal((prev) => ({ ...prev, isModal: false })),
                minNumberOfFiles: 1,
                maxNumberOfFiles: 1,
                allowedFileTypes: ["image/*"],
                mapUploads: s3TransloaditUploadMap,
                completionCheck: s3TransloaditCompletionCheck,
                template_id: import.meta.env.VITE_TEMPLATE_SAMPLE_VIDEO_TEMPLATE_ID,
                fields: {
                  prefix: `/clientLogo/`,
                  fileName: `clientLogo/style-${nameField}`,
                },
                setUploads: ({ uploads }: { uploads: S3TransloaditUploadMapResultInterface[] }) => {
                  const templateTheme = {
                    url: uploads[0]?.url,
                    S3Key: uploads[0]?.s3Key,
                    thumbnailUrl: uploads[0]?.thumbnailUrl,
                  };
                  setLogoData(templateTheme);
                },
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default CreateClient;
