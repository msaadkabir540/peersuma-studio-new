import moment from "moment";
import Uppy from "@uppy/core";
import React, { useEffect } from "react";
import Transloadit from "@uppy/transloadit";
import { DashboardModal } from "@uppy/react";
import createNotification from "@/common/create-notification";

import { convertHeicToJpeg } from "@/utils/helper";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

import {
  ResultInterface,
  TransloaditModalInterface,
  UseUppyWithTransloaditInterface,
} from "./transloadit-upload-interface";

const useUppyWithTransloadit = ({
  fields,
  customName,
  template_id,
  setMediaList,
  onCloseModal,
  customExtension,
  allowedFileTypes,
  maxNumberOfFiles,
  minNumberOfFiles,
}: UseUppyWithTransloaditInterface) => {
  const uppy = React.useMemo(() => {
    const uppyInstance = new Uppy({
      autoProceed: false,

      onBeforeFileAdded: (currentFile) => {
        if (currentFile.type === "image/heic" || currentFile.type === "image/heif") {
          uppyInstance.info("Please wait file is in processing...", "info");

          convertHeicToJpeg({ file: currentFile.data })
            .then((convertedFile) => {
              if (convertedFile) {
                uppyInstance.removeFile(currentFile.id);
                uppyInstance.addFile({
                  name: convertedFile.name,
                  type: convertedFile.type,
                  data: convertedFile,
                  meta: {
                    relativePath: currentFile.meta.relativePath,
                  },
                });
              }
            })
            .catch((error) => {
              console.error("Error in onBeforeFileAdded:", error);
              createNotification("error", "Failed to convert HEIC to JPEG");
            });

          return false;
        }
        return true;
      },

      ...(customName && {
        onBeforeFileAdded: (currentFile) => {
          const splitted = customName.split("_");
          splitted.pop();
          const modifiedFile = {
            ...currentFile,
            name: splitted.join("_"),
          };
          return modifiedFile;
        },
      }),
    });

    uppyInstance.use(Transloadit, {
      params: {
        auth: { key: import.meta.env.VITE_TRANSLOADIT_AUTH_KEY },
        template_id,
      },
      fields: customName
        ? ({
            prefix: fields?.prefix,
            timeStamp: fields?.timeStamp || moment().format("YYYYMMDD_HHmmss"),
          } as { prefix: string; timeStamp: string } | undefined | any)
        : fields,
      waitForEncoding: true,
      waitForMetadata: true,
    });

    uppyInstance.setOptions({
      restrictions: {
        allowedFileTypes,
        maxNumberOfFiles,
        minNumberOfFiles,
      },
    });

    return uppyInstance;
  }, [customName, template_id, fields, allowedFileTypes, maxNumberOfFiles, minNumberOfFiles]);

  useEffect(() => {
    {
      customExtension &&
        uppy.on("file-added", (file) => {
          if (file.extension !== customExtension) {
            createNotification("error", "Please upload file with same extension");
            uppy.removeFile(file.id);
          }
        });
    }

    uppy.on("complete", (result) => {
      if (!result?.successful?.length) return;
      setMediaList({ result });
    });

    uppy.on("upload-error", (error: any) => {
      console.error("error message:", error);
      createNotification("error", error?.message || " upload-error");
    });

    uppy.on("restriction-failed", (error: any) => {
      console.error("restriction-failed:", error);
      createNotification("error", error?.message);
    });

    return () => {
      uppy.close();
      onCloseModal();
    };
  }, [uppy, customExtension, setMediaList]);

  return uppy;
};

const TransloaditUploadModal: React.FC<TransloaditModalInterface> = ({
  fieldName,
  customName,
  mapUploads,
  setUploads,
  setFieldName,
  customExtension,
  handleCloseModal,
  allowedFileTypes = null,
  maxNumberOfFiles = null,
  minNumberOfFiles = null,
  template_id = import.meta.env.VITE_UPLOAD_TEMPLATE_ID,
  fields = { prefix: "/", timeStamp: moment().format("YYYYMMDD_HHmmss") },
}) => {
  const setMediaList = ({ result }: { result: ResultInterface }) => {
    const resp = { data: result?.transloadit?.[0] };
    const uploads = mapUploads(resp, fields) || result?.transloadit?.[0]?.results?.[":original"];
    result?.transloadit?.[0]?.results?.["convert_to_mp4"] ||
      result?.transloadit?.[0]?.results?.["convert_heic_to_jpg"];

    setUploads({ uploads });
  };

  const onCloseModal = () => {
    handleCloseModal?.();
    setFieldName?.(false);
    const className = document?.getElementsByTagName("body")?.[0];
    className.classList.remove("uppy-Dashboard-isFixed");
  };

  const uppy = useUppyWithTransloadit({
    customName,
    template_id,
    customExtension,
    fields,
    allowedFileTypes,
    maxNumberOfFiles,
    minNumberOfFiles,
    setMediaList,
    onCloseModal,
  } as UseUppyWithTransloaditInterface);

  return (
    <div>
      <DashboardModal
        uppy={uppy}
        open={!!fieldName}
        showProgressDetails
        closeAfterFinish={false}
        onRequestClose={onCloseModal}
        proudlyDisplayPoweredByUppy={false}
        locale={
          {
            strings: { dropHereOr: "Drop here or %{browse}", browse: "browse" },
          } as any
        }
      />
    </div>
  );
};

export default TransloaditUploadModal;
