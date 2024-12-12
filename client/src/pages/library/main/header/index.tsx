import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";
import SelectBox from "@/components/multi-select-box";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";

import { vimeoTransloaditUploadMap } from "@/utils/helper";
import { addMultipleLibraryMedia } from "@/api-services/library";
import { S3TransloaditUploadMapResultInterface } from "@/utils/interface/interface-helper";

import crossFat from "@/assets/cross-fat.svg";

import { ClientsStateInterface, LogginInterface } from "@/interface/user-selector-interface";
import { LibraryHeaderInterface, uploadedTranscriptionMediaInterface } from "./header-interface";

import styles from "./index.module.scss";

const Header: React.FC<LibraryHeaderInterface> = ({
  setValue,
  watch,
  control,
  register,
  setnewLibraryMedia,
}) => {
  const navigate = useNavigate();
  const { selectedClient, clients } = useSelector((state: ClientsStateInterface) => state.clients);
  const { loggedInUser } = useSelector((state: LogginInterface) => state?.users);

  const [upload, setUpload] = useState(false);

  const uploadMediaLibrary = async (uploads: uploadedTranscriptionMediaInterface) => {
    try {
      const res = await addMultipleLibraryMedia({
        data: {
          uploads,
          clientId: selectedClient,
          userId: loggedInUser?._id,
          folderId: clients.find((x: any) => x._id === selectedClient)?.vimeoFolderId || "",
        },
      });
      if (res.status === 200) {
        const newLibraryMedia = res?.data?.newLibraryMedia;
        setnewLibraryMedia(newLibraryMedia);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setValue && setValue("active", 1);
  }, [setValue]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span>Library</span>
        </div>
        <div className={styles.filters}>
          <div className={styles.field}>
            <Input
              name="search"
              label="Search"
              register={register}
              iconClass={styles.cross}
              className={styles.inputContainer}
              {...{
                ...(watch &&
                  watch("search") && {
                    icon: crossFat,
                    onClick: () => {
                      setValue && setValue("search", "");
                    },
                  }),
              }}
            />
          </div>
          <div className={styles.field}>
            <SelectBox
              showSelected
              label="Types"
              name="active"
              control={control}
              placeholder={"Select"}
              options={statusOptions || []}
            />
          </div>
          <div className={styles.btnDiv}>
            <Button handleClick={() => navigate("/create-library")} title="Create" type="button" />
            <Button
              title="upload"
              type="button"
              handleClick={() => {
                setUpload(true);
              }}
            />
          </div>
          {upload && (
            <TransloaditUploadModal
              {...{
                fieldName: upload,
                setFieldName: setUpload,
                allowedFileTypes: ["video/*"],
                mapUploads: vimeoTransloaditUploadMap,
                completionCheck: vimeoTransloaditCompletionCheck,
                template_id: import.meta.env.VITE_TRANSLOADIT_VIMEO_TEMPLATE_ID,
                setUploads: async ({
                  uploads,
                }: {
                  uploads: S3TransloaditUploadMapResultInterface[];
                }) => {
                  await uploadMediaLibrary(uploads as any);
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

const statusOptions = [
  { label: "Active Videos", value: 1 },
  { label: "Archived Videos", value: 2 },
  { label: "All Videos", value: 3 },
];

const vimeoTransloaditCompletionCheck = (res: any) => {
  const results = Object.keys(res?.data.results);
  return (
    results
      ?.map(
        (x) =>
          res?.data?.results?.[x]?.length > 0 &&
          res?.data?.results?.[x]?.filter((x: any) => x?.ssl_url?.indexOf("vimeo") === -1)
            ?.length === 0,
      )
      ?.filter((x) => x === false).length === 0
  );
};
