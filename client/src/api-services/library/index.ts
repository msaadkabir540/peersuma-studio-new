import createNotification from "@/common/create-notification";

import { axiosApiRequest } from "@/utils/api";

import {
  AddMultipleLibraryMediaInterface,
  CreateUpdateDataInterface,
} from "@/pages/library/create-update-library/create-update-library-interface";
import { SelectedWidgetInterface } from "@/pages/library/main/library-interface";

export const getAllLibrary = async ({
  params,
}: {
  params: { clientId: string; active: string };
}) => {
  const res = await axiosApiRequest({
    method: "get",
    url: "/library",
    params,
  });
  if (res) {
    return res;
  }
};
export const addWidgetMedia = async ({
  id,
  data,
}: {
  id: string;
  data: CreateUpdateDataInterface;
}) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/library-widget/${id}`,
      data,
    });

    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeWidgetMedia = async ({
  params,
}: {
  params: { id: string; mediaId: string };
}) => {
  const res = await axiosApiRequest({
    method: "delete",
    url: `/library-widget/remove-media`,
    params,
  });
  if (res.status === 200) {
    return res;
  }
};

export const updateMediaReOrdering = async ({
  id,
  media,
}: {
  id: string;
  media: SelectedWidgetInterface;
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `library-widget/reorderingMedia/${id}`,
    data: media,
  });
  if (res.status === 200) return res;
  else return res.status;
};

export const updateLibraryMedia = async ({
  id,
  data,
}: {
  id: string;
  data: CreateUpdateDataInterface;
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/library/${id}`,
    data,
  });
  if (res.status === 200) {
    createNotification("success", res.data.msg);
    return res;
  }
};

export const addLibraryMedia = async ({ data }: { data: CreateUpdateDataInterface }) => {
  const res = await axiosApiRequest({
    method: "post",
    url: "/library",
    data,
  });
  if (res.status === 200) {
    createNotification("success", res.data.msg);
    return res;
  } else {
    createNotification("error", res.data.msg);
  }
};

export const getLibraryWidgetById = async ({
  params,
}: {
  params: { id: string | undefined; shortLink?: string | undefined };
}) => {
  const res = await axiosApiRequest({
    method: "get",
    url: `/library/single_library`,
    params,
  });
  if (res.status === 200) {
    return res;
  }
};

export const addMultipleLibraryMedia = async ({
  data,
}: {
  data: AddMultipleLibraryMediaInterface;
}) => {
  const res = await axiosApiRequest({
    method: "post",
    url: `/library/multi`,
    data,
  });
  if (res.status === 200) {
    return res;
  }
};

export const updateShortLink = async ({
  id,
  data,
}: {
  id: string;
  data: { shortLink: string };
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/library/short_link/${id}`,
    data,
  });
  if (res.status === 200) {
    createNotification("success", res?.data?.msg);
    return res?.data;
  } else {
    createNotification("error", res?.data?.msg);
  }
};

export const updateThumbnailFromFrame = async ({
  data,
}: {
  data: {
    id: string | undefined;
    time: number | null;
    assetId: string;
  };
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/library/update_thumbnail`,
    data,
  });
  if (res.status === 200) {
    createNotification("success", res?.data?.msg);
    return res;
  } else {
    createNotification("error", res?.data?.msg);
  }
};
