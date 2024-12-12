import moment from "moment";

import { axiosApiRequest } from "@/utils/api";

import createNotification from "@/common/create-notification";

import { FileType, MediaUploadFileType } from "@/pages/media-library/media-library-interface";
import { GetAllTemplatesMediaInterface } from "@/interface/template-media-interface";

export const getAllTemplateMedia = async ({ data }: { data: GetAllTemplatesMediaInterface }) => {
  const res = await axiosApiRequest({
    method: "get",
    url: "/template-media",
    params: { ...data },
  });
  if (res.status === 200) {
    return res;
  } else {
    return res.data.msg;
  }
};

export const getTemplateMediaById = async ({ id }: { id: string }) => {
  const res = await axiosApiRequest({
    method: "get",
    url: `/template-media/get-media-library/${id}`,
  });
  if (res.status === 200) {
    return res;
  } else {
    return res.data.msg;
  }
};

export const getAllTypesAndCategories = async () => {
  const res = await axiosApiRequest({
    method: "get",
    url: "/template-media/getAllTypesAndCategories",
  });
  if (res.status === 200) {
    return res;
  }
};

export const addTemplateMedia = async ({ mediaFiles }: { mediaFiles: MediaUploadFileType }) => {
  const res = await axiosApiRequest({
    method: "post",
    url: "/template-media",
    data: { mediaFiles },
  });
  if (res.status === 200) return res;
};

export const updateTemplateMedia = async ({
  url,
  media,
  newFileName,
  categories,
  description,
  handleClear,
}: {
  url: string;
  description: string;
  media: any[];
  newFileName: string;
  categories: FileType[] | undefined;
  handleClear: () => void;
}) => {
  const { _id, name, s3Key } = (media ?? []).find((x) => x?.url === url) ?? {};
  const newName = newFileName + `_${moment().format("YYYYMMDD_HHmmss")}.${name?.split(".").pop()}`;
  const newKey = `templates_media/${newName}`;
  const newUrl = url?.split("templates_media/")[0] + newKey;

  const res = await axiosApiRequest({
    method: "put",
    url: "/template-media",
    data: {
      id: _id,
      description,
      oldKey: s3Key,
      newKey,
      newFileName: newName,
      newUrl,
      ...(categories && { categories }),
    },
  });
  if (res.status === 200) {
    handleClear && handleClear();
    return res;
  }
};

export const updateTemplateMediaFile = async ({
  id,
  key,
  uploads,
}: {
  id: string;
  key: string;
  uploads: MediaUploadFileType;
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: "/template-media/uploadMediaFile",
    data: {
      id: id,
      oldKey: key,
      uploads,
    },
  });
  if (res.status === 200) {
    return res;
  } else {
    createNotification("error", res.status.msg);
  }
};

export const deleteTemplateMedia = async ({ s3Key }: { s3Key: string }) => {
  const res = await axiosApiRequest({
    method: "delete",
    url: `/template-media`,
    params: { s3Key },
  });
  if (res.status === 200) {
    return res;
  }
};
