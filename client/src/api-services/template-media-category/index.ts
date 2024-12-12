import { axiosApiRequest } from "@/utils/api";

import createNotification from "@/common/create-notification";

export const getAllTemplateMediaCategories = async () => {
  const res = await axiosApiRequest({
    method: "get",
    url: "/template-media-category",
  });
  if (res.status === 200) {
    return res;
  }
};

export const createTemplateMediaCategory = async ({ name }: { name: string }) => {
  const res = await axiosApiRequest({
    method: "post",
    url: "/template-media-category",
    data: { name },
  });
  if (res.status === 200) {
    return res;
  } else {
    createNotification("error", res?.data?.msg || "Category Creation Failed!");
  }
};

export const updateTemplateMediaCategory = async ({ _id, name }: { _id: string; name: string }) => {
  const res = await axiosApiRequest({
    method: "put",
    url: "/template-media-category",
    data: {
      _id,
      name,
    },
  });
  if (res.status === 200) {
    return res;
  }
};

export const deleteTemplateCategory = async ({ _id }: { _id: string }) => {
  const res = await axiosApiRequest({
    method: "delete",
    url: "/template-media-category",
    params: { _id },
  });
  if (res.status === 200) {
    return res;
  }
};
